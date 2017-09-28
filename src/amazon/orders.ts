import _ = require('underscore');
import moment = require('moment');
import AmazonTypes = require('./types');
import Request = require('./request');

export class Orders {
    private endpoint: string = '/Orders/2013-09-01';
    private version: string = '2013-09-01';

    constructor(private credentials: AmazonTypes.Credentials) {

    }

    public listOrders(options: AmazonTypes.ListOrdersRequest, callback: (err?: AmazonTypes.Error, result?: AmazonTypes.ListOrdersResult) => void) {
        var request: Request.Request = new Request.Request(this.endpoint, this.credentials);

        request.addParam(new AmazonTypes.StringParameter('Action', 'ListOrders'));
        request.addParam(new AmazonTypes.StringParameter('SellerId', this.credentials.sellerId));
        request.addParam(new AmazonTypes.StringParameter('Version', this.version));

        // Mandatory parameter
        if (_.has(options, 'MarketplaceId.Id')) {
            request.addParam(new AmazonTypes.ListParameter('MarketplaceId.Id', _.map(options['MarketplaceId.Id'], function(item) {
                return AmazonTypes.MarketplaceId[item];
            })));
        }

        // Optional parameters
        if (_.has(options, 'CreatedAfter'))
            request.addParam(new AmazonTypes.TimestampParameter('CreatedAfter', options.CreatedAfter));

        if (_.has(options, 'CreatedBefore'))
            request.addParam(new AmazonTypes.TimestampParameter('CreatedBefore', options.CreatedBefore));

        if (_.has(options, 'LastUpdatedAfter'))
            request.addParam(new AmazonTypes.TimestampParameter('LastUpdatedAfter', options.LastUpdatedAfter));

        if (_.has(options, 'LastUpdatedBefore'))
            request.addParam(new AmazonTypes.TimestampParameter('LastUpdatedBefore', options.LastUpdatedBefore));

        if (_.has(options, 'OrderStatus.Status')) {
            request.addParam(new AmazonTypes.ListParameter('OrderStatus.Status', _.map(options['OrderStatus.Status'], function(item) {
                return AmazonTypes.OrderStatus[item];
            })));
        }

        if (_.has(options, 'FulfillmentChannel.Channel')) {
            request.addParam(new AmazonTypes.ListParameter('FulfillmentChannel.Channel', _.map(options['FulfillmentChannel.Channel'], function(item) {
                return AmazonTypes.FulfillmentChannel[item];
            })));
        }

        if (_.has(options, 'SellerOrderId'))
            request.addParam(new AmazonTypes.StringParameter('SellerOrderId', options.SellerOrderId));

        if (_.has(options, 'BuyerEmail'))
            request.addParam(new AmazonTypes.StringParameter('BuyerEmail', options.BuyerEmail));

        if (_.has(options, 'PaymentMethod.Method')) {
            request.addParam(new AmazonTypes.ListParameter('PaymentMethod.Method', _.map(options['PaymentMethod.Method'], function(item) {
                return AmazonTypes.PaymentMethod[item];
            })));
        }

        if (_.has(options, 'TFMShipmentStatus.Status'))
            request.addParam(new AmazonTypes.ListParameter('TFMShipmentStatus.Status', options['TFMShipmentStatus.Status']));

        if (_.has(options, 'MaxResultsPerPage'))
            request.addParam(new AmazonTypes.StringParameter('MaxResultsPerPage', options['MaxResultsPerPage'].toString()));

        request.send(function(err, result) {
            if (err) {
                callback(err);
            }
            else {
                callback(null, new AmazonTypes.ListOrdersResult(result));
            }
        });
    }

    public listOrdersByNextToken(options: AmazonTypes.ListOrdersByNextTokenRequest, callback: (err?: AmazonTypes.Error, result?: AmazonTypes.ListOrdersByNextTokenResult) => void) {
        var request: Request.Request = new Request.Request(this.endpoint, this.credentials);

        request.addParam(new AmazonTypes.StringParameter('Action', 'ListOrdersByNextToken'));
        request.addParam(new AmazonTypes.StringParameter('SellerId', this.credentials.sellerId));
        request.addParam(new AmazonTypes.StringParameter('Version', this.version));

        request.addParam(new AmazonTypes.StringParameter('NextToken', options.NextToken));

        request.send(function(err, result) {
            if (err) {
                callback(err);
            }
            else {
                callback(null, new AmazonTypes.ListOrdersByNextTokenResult(result));
            }
        });
    }

    public listOrderItems(options: AmazonTypes.ListOrderItemsRequest, callback: (err?: AmazonTypes.Error, result?: AmazonTypes.ListOrderItemsResult) => void) {
        var request: Request.Request = new Request.Request(this.endpoint, this.credentials);

        request.addParam(new AmazonTypes.StringParameter('Action', 'ListOrderItems'));
        request.addParam(new AmazonTypes.StringParameter('SellerId', this.credentials.sellerId));

        request.addParam(new AmazonTypes.StringParameter('Version', this.version));
        request.addParam(new AmazonTypes.StringParameter('AmazonOrderId', options.AmazonOrderId));

        request.send(function(err, result) {
            if (err) {
                callback(err);
            }
            else {
                callback(null, new AmazonTypes.ListOrderItemsResult(result));
            }
        });
    }

    public getOrder(options: AmazonTypes.GetOrderRequest, callback: (err?: AmazonTypes.Error, result?: AmazonTypes.GetOrderResult) => void) {
        var request: Request.Request = new Request.Request(this.endpoint, this.credentials);

        request.addParam(new AmazonTypes.StringParameter('Action', 'GetOrder'));
        request.addParam(new AmazonTypes.StringParameter('SellerId', this.credentials.sellerId));

        request.addParam(new AmazonTypes.StringParameter('Version', this.version));
        request.addParam(new AmazonTypes.ListParameter('AmazonOrderId.Id', options['AmazonOrderId.Id']));

        request.send(function(err, result) {
            if (err) {
                callback(err);
            }
            else {
                callback(null, new AmazonTypes.GetOrderResult(result));
            }
        });
    }
}
