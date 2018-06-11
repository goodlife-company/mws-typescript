import _ = require('underscore');
import moment = require('moment');
import request = require('request');
var xml2js = require('xml2js');
import crypto = require('crypto');
var utf8 = require('utf8');
import AmazonTypes = require('./types');
import iconv = require('iconv-lite');

export class Request {
    private parameters: AmazonTypes.Parameter[];
    private body: AmazonTypes.BodyData;

    constructor(private endpoint: string, private credentials: AmazonTypes.Credentials) {
        this.parameters = [];
        this.addParam(new AmazonTypes.StringParameter('AWSAccessKeyId', this.credentials.awsAccountId));
        this.addParam(new AmazonTypes.StringParameter('SignatureMethod', 'HmacSHA256'));
        this.addParam(new AmazonTypes.StringParameter('SignatureVersion', '2'));
        this.addParam(new AmazonTypes.TimestampParameter('Timestamp', moment()));
    }

    public addParam(param: AmazonTypes.Parameter) {
        this.parameters.push(param);
    }

    public setBody(body: AmazonTypes.BodyData) {
        this.body = body;
    }

    // send the request to amazon
    public send(callback: AmazonTypes.ResultCallback) {
        var signature: string = this.getSignature();
        this.addParam(new AmazonTypes.StringParameter('Signature', signature));

        var userAgent: string = 'mwsts/1.0 (Language=Javascript)';
        var contentType: string = this.body ? AmazonTypes.FeedContentType[this.body['content-type']] : 'text/xml';

        var queryString: string = this.getQueryString();

        if (process.env["NODE_ENV"] == 'development')
            console.log('MWS QueryString', queryString);

        var requestOptions = {
            headers: {
                'x-amazon-user-agent': userAgent,
                'Content-Type': contentType
            },
            encoding: null
        };

        // Handle body data
        if (this.body) {
            requestOptions['body'] = this.body.data;
            requestOptions.headers['content-md5'] = this.hexStrToBase64(this.hex_md5(this.body.data));
        }


        request.post('https://' + this.credentials.host + this.endpoint + '?' + queryString, requestOptions, (err, httpResponse, body) => {
            if (err)
                return callback({ origin: 'PostRequest', message: err, metadata: httpResponse });
            else {
                // Detect non xml content and return without parsing
                if (_.has(httpResponse.headers, 'content-type') && httpResponse.headers['content-type'][0].match(/^text\/plain/)) {
                    var contentType = httpResponse.headers['content-type'][0];
                    contentType = contentType.substr(contentType.indexOf("=") + 1);

                    if (process.env["NODE_ENV"] == 'development')
                        console.log('contentType of response', contentType);

                    var convertedBody = iconv.decode(body, contentType).toString()
                    if (_.has(httpResponse.headers, 'content-md5')) {
                        // Catch md5 mismatch error
                        var calcResMd5 = this.hexStrToBase64(this.hex_md5(body));
                        if (calcResMd5 !== httpResponse.headers['content-md5'])
                            return callback({ origin: 'MD5-Comparison', message: 'MD5-Mismatch', metadata: { 'computedMd5FromResponse': calcResMd5, 'md5FromResponseHeader': httpResponse.headers['content-md5'] } });

                        // Return raw result
                        return callback(null, convertedBody);
                    }
                }
                else {
                    // Expect content to be xml (content-type is not specified in every case)
                    // Catch uncaught errors from xml parsing lib
                    try {
                        var parser = new xml2js.Parser({ explicitArray: false });
                        parser.parseString(body, function(err, result) {
                            if (err) {
                                // Catch error at XML parsing
                                console.error("mws-typescript#Error at xml parsing in xml2js", err);
                                callback({ origin: 'XMLParsing', message: err });
                            } else if (_.has(result, 'ErrorResponse')) {
                                // Catch error returned from API
                                console.error("mws-typescript#Error from Amazon API", queryString.substr(0, 200), result["ErrorResponse"]);
                                callback({ origin: 'MWS', message: result['ErrorResponse']['Error']['Message'], metadata: result['ErrorResponse']['Error'] });
                            } else {
                                // Return parsed result
                                callback(null, result);
                            }
                        });
                    } catch (e) {
                        console.error("mws-typescript#Uncaught error at xml parsing in", e);
                        callback({ origin: 'XMLParsing#uncaughtException', message: JSON.stringify(e) });
                    }
                }
            }
        });
    }

    // Compute signature for set parameters
    private getSignature(): string {
        let strToSign: string = this.getStringToSign(this.endpoint);
        let hmac: string = crypto.createHmac('sha256', this.credentials.secretKey).update(strToSign).digest('hex');

        let b64hmac: string = this.hexStrToBase64(hmac);

        //padding to string length multiple of 4
        var j = b64hmac.length % 4;
        for (var i = 0; i < j; i++) {
            b64hmac += '=';
        }

        return b64hmac;
    }

    // Build http query string from parameters
    private getQueryString(): string {
        var input: AmazonTypes.Dictionary<string> = {};

        _.each(this.parameters, function(param: AmazonTypes.Parameter) {
            var serialized: AmazonTypes.Dictionary<string> = param.serialize();
            _.extend(input, serialized);
        });

        var queryArray = [];
        _.each(input, (value, key) => {
            queryArray.push(key + '=' + this.urlEncode(value));
        });

        return queryArray.join('&');
    }

    // Build string to be signed for API call
    private getStringToSign(endpoint: string): string {
        var input = {};

        // Get all values from parameters
        _.each(this.parameters, function(param: AmazonTypes.Parameter) {
            var serialized: AmazonTypes.Dictionary<string> = param.serialize();
            _.extend(input, serialized);
        });

        // Sort list
        var keys = _.keys(input).sort();

        var str = '';
        for (var i = 0; i < keys.length; i++) {
            if (i != 0) {
                str += '&';
            }

            str += keys[i] + '=' + this.urlEncode(input[keys[i]]);
        }

        // Join output string
        return ['POST', this.credentials.host, endpoint, str].join('\n');
    }

    // Custom url encoding taken from scratchpad
    private urlEncode(input: string): string {
        input = encodeURIComponent(input);
        input = input.replace(/\*/g, '%2A');
        input = input.replace(/\(/g, '%28');
        input = input.replace(/\)/g, '%29');
        input = input.replace(/'/g, '%27');
        input = input.replace(/!/g, '%21');
        return input;
    }

    // convert hex string to base64 encoded string (taken from scratchpad)
    private hexStrToBase64(input: string): string {
        let b64pad = '=';

        var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var hex = "0123456789abcdef";
        var output = "";
        var len = input.length;
        for (var i = 0; i < len; i += 6) {
            var c1 = hex.indexOf(input.charAt(i)) << 4;
            c1 += hex.indexOf(input.charAt(i + 1));
            var c2 = (i + 2) < len ? hex.indexOf(input.charAt(i + 2)) << 4 : 0;
            c2 += (i + 3) < len ? hex.indexOf(input.charAt(i + 3)) : 0;
            var c3 = (i + 4) < len ? hex.indexOf(input.charAt(i + 4)) << 4 : 0;
            c3 += (i + 5) < len ? hex.indexOf(input.charAt(i + 5)) : 0;

            var triplet = (c1 << 16)
                | c2 << 8
                | c3;
            for (var j = 0; j < 4; j++) {
                //if(i * 16 + j * 12 > input.length * 16) output += b64pad;
                if ((i / 2) * 8 + j * 6 > (input.length / 2) * 8) output += b64pad;
                else output += tab.charAt((triplet >>> 6 * (3 - j)) & 0x3F);
            }
        }

        return output;
    }

    // Build hex enconded md5 string
    private hex_md5(s) {
        // var utf8String = utf8.encode(s);
        var md5Hash = crypto.createHash('md5');
        md5Hash.update(s);
        return md5Hash.digest('hex');
    }
}
