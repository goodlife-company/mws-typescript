import _ = require('underscore');
import moment = require('moment');

export class List<T> {
    key: string;
}

export interface Dictionary<T> {
    [key: string]: T
}

export interface Parameter {
    serialize(): Dictionary<string>;
}

export interface Credentials {
    sellerId: string;
    awsAccountId: string;
    secretKey: string;
    host: string;
}

export interface ListOrdersRequest {
    'MarketplaceId.Id': MarketplaceId[];
    CreatedAfter?: moment.Moment;
    CreatedBefore?: moment.Moment;
    LastUpdatedAfter?: moment.Moment;
    LastUpdatedBefore?: moment.Moment;
    'OrderStatus.Status'?: OrderStatus[];
    'FulfillmentChannel.Channel'?: FulfillmentChannel[];
    SellerOrderId?: string;
    BuyerEmail?: string;
    'PaymentMethod.Method'?: PaymentMethod[];
    'TFMShipmentStatus.Status'?: string[]; // could also be typed, but feature is only available in china
    MaxResultsPerPage?: number;
}

export interface ListOrdersByNextTokenRequest {
    NextToken: string
}

export interface Order {
    AmazonOrderId: string,
    SellerOrderId?: string,
    PurchaseDate: moment.Moment,
    LastUpdateDate: moment.Moment,
    OrderStatus: OrderStatus,
    FulfillmentChannel?: FulfillmentChannel,
    SalesChannel?: string,
    OrderChannel?: string,
    ShipServiceLevel?: string,
    ShippingAddress?: Address,
    BillingAddress?: Address,
    OrderTotal?: Money,
    NumberOfItemsShipped?: number,
    NumberOfItemsUnshipped?: number,
    PaymentExecutionDetail?: any,
    PaymentMethod?: PaymentMethod,
    MarketplaceId: MarketplaceId,
    BuyerEmail?: string,
    BuyerName?: string,
    IsBusinessOrder?: boolean
    PurchaseOrderNumber?: string,
    ShipmentServiceLevelCategory?: ShipmentServiceLevelCategory,
    ShippedByAmazonTFM?: boolean,
    TFMShipmentStatus?: string,
    CbaDisplayableShippingLabel?: string,
    OrderType: OrderType,
    EarliestShipDate?: moment.Moment
    LatestShipDate?: moment.Moment,
    EarliestDeliveryDate?: moment.Moment,
    LatestDeliveryDate?: moment.Moment,
    IsPrime?: boolean,
    IsPremiumOrder?: boolean,
}

export class OrderConverter {
    public static convertFromParsedXML(value: any): Order {
        var newOrder: Order = {
            AmazonOrderId: value['AmazonOrderId'],
            PurchaseDate: moment(value['PurchaseDate']),
            LastUpdateDate: moment(value['LastUpdateDate']),
            OrderStatus: OrderStatus['' + value['OrderStatus']],
            MarketplaceId: MarketplaceId['' + value['MarketplaceId']],
            OrderType: OrderType['' + value['OrderType']],
        };

        if (_.has(value, 'SellerOrderId'))
            newOrder.SellerOrderId = value['SellerOrderId'];

        if (_.has(value, 'FulfillmentChannel'))
            newOrder.FulfillmentChannel = FulfillmentChannel['' + value['FulfillmentChannel']];

        if (_.has(value, 'SalesChannel'))
            newOrder.SalesChannel = value['SalesChannel'];

        if (_.has(value, 'OrderChannel'))
            newOrder.OrderChannel = value['OrderChannel'];

        if (_.has(value, 'ShipServiceLevel'))
            newOrder.ShipServiceLevel = value['ShipServiceLevel'];

        if (_.has(value, 'ShippingAddress')) {
            var shipAddress: Address = {
                Name: value['ShippingAddress']['Name'],
                City: value['ShippingAddress']['City'],
                County: value['ShippingAddress']['County'],
                District: value['ShippingAddress']['District'],
                StateOrRegion: value['ShippingAddress']['StateOrRegion'],
                PostalCode: value['ShippingAddress']['PostalCode'],
                CountryCode: value['ShippingAddress']['CountryCode'],
                Phone: value['ShippingAddress']['Phone']
            }

            if (_.has(value['ShippingAddress'], 'AddressLine1'))
                shipAddress.AddressLine1 = value['ShippingAddress']['AddressLine1'];
            if (_.has(value['ShippingAddress'], 'AddressLine2'))
                shipAddress.AddressLine2 = value['ShippingAddress']['AddressLine2'];
            if (_.has(value['ShippingAddress'], 'AddressLine3'))
                shipAddress.AddressLine3 = value['ShippingAddress']['AddressLine3'];

            newOrder.ShippingAddress = shipAddress;
        }


        if (_.has(value, 'OrderTotal')) {
            var orderTotal: Money = {
                CurrencyCode: value['OrderTotal']['CurrencyCode'],
                Amount: parseFloat(value['OrderTotal']['Amount'])
            }
            newOrder.OrderTotal = orderTotal;
        }

        if (_.has(value, 'NumberOfItemsShipped'))
            newOrder.NumberOfItemsShipped = parseInt(value['NumberOfItemsShipped']);

        if (_.has(value, 'NumberOfItemsUnshipped'))
            newOrder.NumberOfItemsUnshipped = parseInt(value['NumberOfItemsUnshipped']);

        if (_.has(value, 'PaymentExecutionDetail'))
            newOrder.PaymentExecutionDetail = value['PaymentExecutionDetail'];

        if (_.has(value, 'PaymentMethod'))
            newOrder.PaymentMethod = PaymentMethod['' + value['PaymentMethod']];

        if (_.has(value, 'BuyerEmail'))
            newOrder.BuyerEmail = value['BuyerEmail'];

        if (_.has(value, 'BuyerName'))
            newOrder.BuyerName = value['BuyerName'];

        if (_.has(value, 'IsBusinessOrder'))
            newOrder.IsBusinessOrder = value['IsBusinessOrder'] === 'true';

        if (_.has(value, 'PurchaseOrderNumber'))
            newOrder.PurchaseOrderNumber = value['PurchaseOrderNumber'];

        if (_.has(value, 'ShipmentServiceLevelCategory'))
            newOrder.ShipmentServiceLevelCategory = ShipmentServiceLevelCategory['' + value['ShipmentServiceLevelCategory']];

        if (_.has(value, 'ShippedByAmazonTFM'))
            newOrder.ShippedByAmazonTFM = value['ShippedByAmazonTFM'] === 'true';

        if (_.has(value, 'TFMShipmentStatus'))
            newOrder.TFMShipmentStatus = value['TFMShipmentStatus'];

        if (_.has(value, 'CbaDisplayableShippingLabel'))
            newOrder.CbaDisplayableShippingLabel = value['CbaDisplayableShippingLabel'];

        if (_.has(value, 'EarliestShipDate'))
            newOrder.EarliestShipDate = moment(value['EarliestShipDate']);

        if (_.has(value, 'LatestShipDate'))
            newOrder.LatestShipDate = moment(value['LatestShipDate']);

        if (_.has(value, 'EarliestDeliveryDate'))
            newOrder.EarliestDeliveryDate = moment(value['EarliestDeliveryDate']);

        if (_.has(value, 'LatestDeliveryDate'))
            newOrder.LatestDeliveryDate = moment(value['LatestDeliveryDate']);

        if (_.has(value, 'IsPrime'))
            newOrder.IsPrime = value['IsPrime'] === 'true';

        if (_.has(value, 'IsPremiumOrder'))
            newOrder.IsPremiumOrder = value['IsPremiumOrder'] === 'true';

        return newOrder;
    }
}

export class ListOrdersResult {
    public orderList: Order[];
    public nextToken: string;
    constructor(public rawData: any) {
        this.orderList = [];
        this.nextToken = null;

        if (rawData['ListOrdersResponse']['ListOrdersResult']['Orders'] == '')
            return;

        var rawList = rawData['ListOrdersResponse']['ListOrdersResult']['Orders']['Order'];

        var orderList = _.isArray(rawList) ? rawList : [rawList];

        this.orderList = _.map(orderList, OrderConverter.convertFromParsedXML);
        if (rawData['ListOrdersResponse']['ListOrdersResult']['NextToken'])
            this.nextToken = rawData['ListOrdersResponse']['ListOrdersResult']['NextToken'];
    }
}

export class ListOrdersByNextTokenResult {
    public orderList: Order[];
    public nextToken: string;
    constructor(public rawData: any) {
        this.orderList = [];
        this.nextToken = null;

        if (rawData['ListOrdersByNextTokenResponse']['ListOrdersByNextTokenResult']['Orders'] == '')
            return;

        var rawList = rawData['ListOrdersByNextTokenResponse']['ListOrdersByNextTokenResult']['Orders']['Order'];

        var orderList = _.isArray(rawList) ? rawList : [rawList];

        this.orderList = _.map(orderList, OrderConverter.convertFromParsedXML);
        if (rawData['ListOrdersByNextTokenResponse']['ListOrdersByNextTokenResult']['NextToken'])
            this.nextToken = rawData['ListOrdersByNextTokenResponse']['ListOrdersByNextTokenResult']['NextToken'];
    }
}

export interface ListOrderItemsRequest {
    AmazonOrderId: string
}

export interface OrderItem {
    ASIN: string,
    SellerSKU?: string,
    OrderItemId: string,
    Title?: string,
    QuantityOrdered: number,
    QuantityShipped?: number,
    PointsGranted?: any,
    ItemPrice?: Money,
    ShippingPrice?: Money,
    GiftWrapPrice?: Money,
    ItemTax?: Money,
    ShippingTax?: Money,
    GiftWrapTax?: Money,
    ShippingDiscount?: Money,
    PromotionDiscount?: Money,
    PromotionIds?: any,
    CODFee?: Money,
    CODFeeDiscount?: Money,
    GiftMessageText?: string,
    GiftWrapLevel?: string,
    InvoiceData?: any,
    ConditionNote?: string,
    ConditionId?: ConditionId,
    ConditionSubtypeId?: ConditionSubtypeId,
    ScheduledDeliveryStartDate?: moment.Moment,
    ScheduledDeliveryEndDate?: moment.Moment,
    PriceDesignation?: string,
    BuyerCustomizedInfo?: BuyerCustomizedInfo
}

export class ListOrderItemsResult {
    public orderItemList: OrderItem[];
    constructor(public rawData: any) {
        this.orderItemList = [];



        if (rawData['ListOrderItemsResponse']['ListOrderItemsResult']['OrderItems'] == '')
            return;

        var rawList = rawData['ListOrderItemsResponse']['ListOrderItemsResult']['OrderItems']['OrderItem'];

        var itemList = _.isArray(rawList) ? rawList : [rawList];

        _.each(itemList, (value: any) => {
            var newOrderItem: OrderItem = {
                ASIN: value['ASIN'],
                OrderItemId: value['OrderItemId'],
                QuantityOrdered: parseInt(value['QuantityOrdered']),
            };

            if (_.has(value, 'SellerSKU'))
                newOrderItem.SellerSKU = value['SellerSKU'];

            if (_.has(value, 'Title'))
                newOrderItem.Title = value['Title'];

            if (_.has(value, 'QuantityShipped'))
                newOrderItem.QuantityShipped = parseInt(value['QuantityShipped']);

            if (_.has(value, 'PointsGranted'))
                newOrderItem.PointsGranted = value['PointsGranted'];

            if (_.has(value, 'ItemPrice')) {
                var ItemPrice: Money = {
                    CurrencyCode: value['ItemPrice']['CurrencyCode'],
                    Amount: parseFloat(value['ItemPrice']['Amount'])
                }
                newOrderItem.ItemPrice = ItemPrice;
            }

            if (_.has(value, 'ShippingPrice')) {
                var ShippingPrice: Money = {
                    CurrencyCode: value['ShippingPrice']['CurrencyCode'],
                    Amount: parseFloat(value['ShippingPrice']['Amount'])
                }
                newOrderItem.ShippingPrice = ShippingPrice;
            }

            if (_.has(value, 'GiftWrapPrice')) {
                var GiftWrapPrice: Money = {
                    CurrencyCode: value['GiftWrapPrice']['CurrencyCode'],
                    Amount: parseFloat(value['GiftWrapPrice']['Amount'])
                }
                newOrderItem.GiftWrapPrice = GiftWrapPrice;
            }

            if (_.has(value, 'ItemTax')) {
                var ItemTax: Money = {
                    CurrencyCode: value['ItemTax']['CurrencyCode'],
                    Amount: parseFloat(value['ItemTax']['Amount'])
                }
                newOrderItem.ItemTax = ItemTax;
            }

            if (_.has(value, 'ShippingTax')) {
                var ShippingTax: Money = {
                    CurrencyCode: value['ShippingTax']['CurrencyCode'],
                    Amount: parseFloat(value['ShippingTax']['Amount'])
                }
                newOrderItem.ShippingTax = ShippingTax;
            }

            if (_.has(value, 'GiftWrapTax')) {
                var GiftWrapTax: Money = {
                    CurrencyCode: value['GiftWrapTax']['CurrencyCode'],
                    Amount: parseFloat(value['GiftWrapTax']['Amount'])
                }
                newOrderItem.GiftWrapTax = GiftWrapTax;
            }

            if (_.has(value, 'ShippingDiscount')) {
                var ShippingDiscount: Money = {
                    CurrencyCode: value['ShippingDiscount']['CurrencyCode'],
                    Amount: parseFloat(value['ShippingDiscount']['Amount'])
                }
                newOrderItem.ShippingDiscount = ShippingDiscount;
            }

            if (_.has(value, 'PromotionDiscount')) {
                var PromotionDiscount: Money = {
                    CurrencyCode: value['PromotionDiscount']['CurrencyCode'],
                    Amount: parseFloat(value['PromotionDiscount']['Amount'])
                }
                newOrderItem.PromotionDiscount = PromotionDiscount;
            }

            if (_.has(value, 'PromotionIds'))
                newOrderItem.PromotionIds = value['PromotionIds'];

            if (_.has(value, 'CODFee')) {
                var CODFee: Money = {
                    CurrencyCode: value['CODFee']['CurrencyCode'],
                    Amount: parseFloat(value['CODFee']['Amount'])
                }
                newOrderItem.CODFee = CODFee;
            }

            if (_.has(value, 'CODFeeDiscount')) {
                var CODFeeDiscount: Money = {
                    CurrencyCode: value['CODFeeDiscount']['CurrencyCode'],
                    Amount: parseFloat(value['CODFeeDiscount']['Amount'])
                }
                newOrderItem.CODFeeDiscount = CODFeeDiscount;
            }

            if (_.has(value, 'GiftMessageText'))
                newOrderItem.GiftMessageText = value['GiftMessageText'];

            if (_.has(value, 'GiftWrapLevel'))
                newOrderItem.GiftWrapLevel = value['GiftWrapLevel'];

            if (_.has(value, 'ConditionNote'))
                newOrderItem.ConditionNote = value['ConditionNote'];

            if (_.has(value, 'ConditionId'))
                newOrderItem.ConditionId = ConditionId['' + value['ConditionId']];

            if (_.has(value, 'ConditionSubtypeId'))
                newOrderItem.ConditionSubtypeId = ConditionSubtypeId['' + value['ConditionSubtypeId']];

            if (_.has(value, 'ScheduledDeliveryStartDate'))
                newOrderItem.ScheduledDeliveryStartDate = moment(value['ScheduledDeliveryStartDate']);

            if (_.has(value, 'ScheduledDeliveryEndDate'))
                newOrderItem.ScheduledDeliveryEndDate = moment(value['ScheduledDeliveryEndDate']);

            if (_.has(value, 'PriceDesignation'))
                newOrderItem.PriceDesignation = value['PriceDesignation'];

            if (_.has(value, 'BuyerCustomizedInfo') && _.has(value['BuyerCustomizedInfo'], 'CustomizedURL')) {
                newOrderItem.BuyerCustomizedInfo = {
                    CustomizedURL: value['BuyerCustomizedInfo']['CustomizedURL']
                }
            }

            this.orderItemList.push(newOrderItem);
        });
    }
}

export interface GetOrderRequest {
    'AmazonOrderId.Id': string[]
}

export class GetOrderResult {
    public order: Order;
    constructor(public rawData: any) {
        if (rawData['GetOrderResponse']['GetOrderResult']['Orders'] == '')
            return;

        var rawItem = rawData['GetOrderResponse']['GetOrderResult']['Orders']['Order'];

        this.order = OrderConverter.convertFromParsedXML(rawItem);
    }
}

export class StringParameter implements Parameter {
    constructor(private key: string, private value: string) {
    }

    serialize(): Dictionary<string> {
        var result: Dictionary<string> = {};
        result[this.key] = this.value;
        return result;
    }
}

export class BooleanParameter implements Parameter {
    constructor(private key: string, private value: boolean) {
    }

    serialize(): Dictionary<string> {
        var result: Dictionary<string> = {};
        result[this.key] = this.value.toString();
        return result;
    }
}

export class TimestampParameter implements Parameter {
    constructor(private key: string, private value: moment.Moment) {
    }

    serialize(): Dictionary<string> {
        var result: Dictionary<string> = {};
        result[this.key] = this.value.toISOString();
        return result;
    }
}

export class ListParameter implements Parameter {
    private values: string[];
    constructor(private key: string, values?: string[]) {
        this.values = values || [];
    }

    public push(value: string) {
        this.values.push(value);
    }

    public serialize(): Dictionary<string> {
        var result: Dictionary<string> = {};

        var count = 0;
        _.each(this.values, (value: string) => {
            result[this.key + '.' + ++count] = value;
        });

        return result;
    }
}

export interface ResultCallback {
    (err: Error, result?: any): void;
}

export interface RequestReportRequest {
    ReportType: string,
    StartDate?: moment.Moment,
    EndDate?: moment.Moment,
    ReportOptions?: string,
    'MarketplaceIdList.Id'?: MarketplaceId[]
}

export interface ReportRequestInfo {
    ReportRequestId: string,
    ReportType: ReportType,
    StartDate: moment.Moment,
    EndDate: moment.Moment,
    Scheduled: boolean,
    SubmittedDate: moment.Moment,
    ReportProcessingStatus: ReportProcessingStatus,
    GeneratedReportId?: string,
    StartedProcessingDate?: moment.Moment,
    CompletedDate?: moment.Moment
}

export class RequestReportResult {
    public reportRequestInfo: ReportRequestInfo;
    constructor(public rawData: any) {
        var resultNode = rawData['RequestReportResponse']['RequestReportResult']['ReportRequestInfo'];
        this.reportRequestInfo = {
            ReportRequestId: resultNode['ReportRequestId'],
            ReportType: ReportType['' + resultNode['ReportType']],
            StartDate: moment(resultNode['StartDate']),
            EndDate: moment(resultNode['EndDate']),
            Scheduled: resultNode['Scheduled'] === 'true',
            SubmittedDate: moment(resultNode['SubmittedDate']),
            ReportProcessingStatus: ReportProcessingStatus['' + resultNode['ReportProcessingStatus']],
        }

        if (_.has(resultNode, 'GeneratedReportId'))
            this.reportRequestInfo['GeneratedReportId'] = resultNode['GeneratedReportId'];

        if (_.has(resultNode, 'StartedProcessingDate'))
            this.reportRequestInfo['StartedProcessingDate'] = moment(resultNode['StartedProcessingDate']);

        if (_.has(resultNode, 'CompletedDate'))
            this.reportRequestInfo['CompletedDate'] = moment(resultNode['CompletedDate']);
    }
}


export interface GetReportRequestListRequest {
    'ReportRequestIdList.Id'?: string[],
    'ReportTypeList.Type'?: ReportType[],
    'ReportProcessingStatusList.Status'?: ReportProcessingStatus[],
    MaxCount?: number,
    RequestedFromDate?: moment.Moment,
    RequestedToDate?: moment.Moment
}

export class GetReportRequestListResult {
    public reportRequestInfoList: ReportRequestInfo[];
    constructor(public rawData: any) {
        this.reportRequestInfoList = [];

        var rawList = rawData['GetReportRequestListResponse']['GetReportRequestListResult']['ReportRequestInfo'];
        rawList = _.isArray(rawList) ? rawList : [rawList];
        _.each(rawList, (item: any) => {
            var newReportRequestInfo: ReportRequestInfo = {
                ReportRequestId: item['ReportRequestId'],
                ReportType: ReportType['' + item['ReportType']],
                StartDate: moment(item['StartDate']),
                EndDate: moment(item['EndDate']),
                Scheduled: item['Scheduled'] === 'true',
                SubmittedDate: moment(item['SubmittedDate']),
                ReportProcessingStatus: ReportProcessingStatus['' + item['ReportProcessingStatus']],
            }

            if (_.has(item, 'GeneratedReportId'))
                newReportRequestInfo['GeneratedReportId'] = item['GeneratedReportId'];

            if (_.has(item, 'StartedProcessingDate'))
                newReportRequestInfo['StartedProcessingDate'] = moment(item['StartedProcessingDate']);

            if (_.has(item, 'CompletedDate'))
                newReportRequestInfo['CompletedDate'] = moment(item['CompletedDate']);

            this.reportRequestInfoList.push(newReportRequestInfo);
        });
    }
}

export interface GetReportRequest {
    ReportId: string
}

export interface BodyData {
    data: string,
    'content-type': FeedContentType,
}

export interface SubmitFeedRequest {
    FeedType: FeedType,
    'MarketplaceIdList.Id'?: MarketplaceId[],
    PurgeAndReplace?: boolean
}

export interface FeedSubmissionInfo {
    FeedSubmissionId: string,
    FeedType: FeedType,
    SubmittedDate: moment.Moment,
    FeedProcessingStatus: FeedProcessingStatus,
    StartedProcessingDate: moment.Moment,
    CompletedProcessingDate: moment.Moment
}

export class FeedSubmissionResult {
    public feedSubmissionData: FeedSubmissionInfo;
    constructor(public rawData: any) {
        var resultNode = rawData['SubmitFeedResponse']['SubmitFeedResult']['FeedSubmissionInfo'];

        this.feedSubmissionData = {
            FeedSubmissionId: resultNode['FeedSubmissionId'],
            FeedType: FeedType['' + resultNode['FeedType']],
            SubmittedDate: moment(resultNode['SubmittedDate']),
            FeedProcessingStatus: FeedProcessingStatus['' + resultNode['FeedProcessingStatus']],
            StartedProcessingDate: moment(resultNode['SubmittedDate']),
            CompletedProcessingDate: moment(resultNode['CompletedProcessingDate'])
        };
    }
}

export class GetFeedSubmissionListResult {
    public feedSubmissionList: FeedSubmissionInfo[];
    constructor(public rawData: any) {
        this.feedSubmissionList = [];
        _.each(rawData['GetFeedSubmissionListResponse']['GetFeedSubmissionListResult']['FeedSubmissionInfo'], (item: any) => {
            var newSubmissionInfo: FeedSubmissionInfo = {
                FeedSubmissionId: item['FeedSubmissionId'],
                FeedType: FeedType['' + item['FeedType']],
                SubmittedDate: moment(item['SubmittedDate']),
                FeedProcessingStatus: FeedProcessingStatus['' + item['FeedProcessingStatus']],
                StartedProcessingDate: moment(item['SubmittedDate']),
                CompletedProcessingDate: moment(item['CompletedProcessingDate'])
            };

            this.feedSubmissionList.push(newSubmissionInfo);
        });
    }
}

export interface GetFeedSubmissionListRequest {
    'FeedSubmissionIdList.Id'?: string[],
    MaxCount?: number,
    'FeedTypeList.Type'?: FeedType[],
    'FeedProcessingStatusList.Status'?: FeedProcessingStatus[],
    SubmittedFromDate?: moment.Moment,
    SubmittedToDate?: moment.Moment
}

export interface GetFeedSubmissionResultRequest {
    FeedSubmissionId: string
}

export interface UpdateReportAcknowledgementsRequest {
    'ReportIdList.Id': string[],
    Acknowledged: boolean
}

export class UpdateReportAcknowledgementsResult {
    public reportInfoList: ReportInfo[];
    constructor(public rawData: any) {
        this.reportInfoList = [];
        var rawList = rawData['UpdateReportAcknowledgementsResponse']['UpdateReportAcknowledgementsResult']['ReportInfo'];
        rawList = _.isArray(rawList) ? rawList : [rawList];
        this.reportInfoList = _.map(rawList, (value, key, list) => {
            var newReportInfo: ReportInfo = {
                ReportId: value['ReportId'],
                ReportType: ReportType['' + value['ReportType']],
                ReportRequestId: value['ReportRequestId'],
                AvailableDate: moment(value['AvailableDate']),
                Acknowledged: value['Acknowledged'] === 'true',
                AcknowledgedDate: moment(value['AcknowledgedDate'])
            };
            return newReportInfo;
        });
    }
}

export interface ReportInfo {
    ReportId: string,
    ReportType: ReportType,
    ReportRequestId: string,
    AvailableDate: moment.Moment,
    Acknowledged?: boolean,
    AcknowledgedDate?: moment.Moment
}

export interface GetReportListRequest {
    MaxCount?: number,
    'ReportTypeList.Type'?: ReportType[],
    Acknowledged?: boolean,
    AvailableFromDate?: moment.Moment,
    AvailableToDate?: moment.Moment,
    'ReportRequestIdList.Id'?: string[]
}

export class GetReportListResult {
    public reportInfoList: ReportInfo[];
    constructor(public rawData: any) {
        this.reportInfoList = [];
        var rawList = rawData['GetReportListResponse']['GetReportListResult']['ReportInfo'];
        if (_.isUndefined(rawList))
            return;
        rawList = _.isArray(rawList) ? rawList : [rawList];
        this.reportInfoList = _.map(rawList, (value, key, list) => {
            var newReportInfo: ReportInfo = {
                ReportId: value['ReportId'],
                ReportType: ReportType['' + value['ReportType']],
                ReportRequestId: value['ReportRequestId'],
                AvailableDate: moment(value['AvailableDate']),
                Acknowledged: value['Acknowledged'] === 'true',
                AcknowledgedDate: moment(value['AcknowledgedDate'])
            };
            return newReportInfo;
        });
    }
}


export enum FeedProcessingStatus { _AWAITING_ASYNCHRONOUS_REPLY_, _CANCELLED_, _DONE_, _IN_PROGRESS_, _IN_SAFETY_NET_, _SUBMITTED_, _UNCONFIRMED_ };
export enum FeedContentType { 'text/tab-separated-values; charset=iso-8859-1', 'text/xml' };

export enum FeedType { _POST_FLAT_FILE_PRICEANDQUANTITYONLY_UPDATE_DATA_, _POST_ORDER_FULFILLMENT_DATA_, _POST_FLAT_FILE_FULFILLMENT_DATA_ };
export var MarketplaceIdDic: Dictionary<string> = {
    'A1PA6795UKMFR9': 'DE',
    'A1RKKUPIHCS9HS': 'ES',
    'A13V1IB3VIYZZH': 'FR',
    'A21TJRUUN4KGV': 'IN',
    'APJ6JRA9NG5V4': 'IT',
    'A1F83G8C2ARO7P': 'UK'
};

export enum ReportType { _GET_FLAT_FILE_OPEN_LISTINGS_DATA_, _GET_FLAT_FILE_ORDERS_DATA_, _GET_ORDERS_DATA_, _GET_CONVERGED_FLAT_FILE_ORDER_REPORT_DATA_ };

export enum ReportProcessingStatus { _SUBMITTED_, _IN_PROGRESS_, _CANCELLED_, _DONE_, _DONE_NO_DATA_ };

export enum ConditionId { New, Used, Collectible, Refurbished, Preorder, Club };

export enum ConditionSubtypeId { New, Mint, 'Very Good', Good, Acceptable, Poor, Club, OEM, Warranty, 'Refurbished Warranty', Refurbished, 'Open Box', Any, Other }

export interface BuyerCustomizedInfo {
    CustomizedURL: string
}

export enum OrderStatus { Pending, Unshipped, PartiallyShipped, Shipped, Canceled };

export enum FulfillmentChannel { AFN, MFN };

export enum PaymentMethod { COD, CVS, Other };

export enum MarketplaceId { A1PA6795UKMFR9, A1RKKUPIHCS9HS, A13V1IB3VIYZZH, A21TJRUUN4KGV, APJ6JRA9NG5V4, A1F83G8C2ARO7P }

export enum ShipmentServiceLevelCategory { Expedited, FreeEconomy, NextDay, SameDay, SecondDay, Scheduled, Standard };

export enum OrderType { StandardOrder, Preorder };

export interface Address {
    Name: string,
    AddressLine1?: string,
    AddressLine2?: string,
    AddressLine3?: string,
    City: string,
    County: string,
    District: string,
    StateOrRegion: string,
    PostalCode: string,
    CountryCode: string,
    Phone: string
};

export interface Money {
    CurrencyCode: string,
    Amount: number
};

export interface Error {
    origin: string;
    message: string;
    metadata?: any;
}
