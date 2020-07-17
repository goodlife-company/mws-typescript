import moment = require('moment');
import CSV = require('../csv/CSVExport');
export interface FlatFileOrderFulfillmentFeedRecord {
    // https://images-na.ssl-images-amazon.com/images/G/01/rainier/help/ff/release_1_9/Flat.File.ShippingConfirm.de.xls
    // _POST_FLAT_FILE_FULFILLMENT_DATA_
    'order-id': string,
    'order-item-id'?: string,
    quantity?: string,
    'ship-date'?: moment.Moment, //format for export: YYYY-MM-TT
    'carrier-code'?: string, // valid values in enum "Carrier"
    'carrier-name'?: string,
    'tracking-number'?: string,
    'ship-method'?: string
}

export var FlatFileOrderFulfillmentFeedOptions: CSV.Options = {
    columns: ['order-id', 'ship-date', 'carrier-code', 'carrier-name', 'tracking-number', 'ship-method'],
    defaults: {
        'ship-date': moment().format('YYYY-MM-DD'),
        'carrier-code': 'DHL',
        'ship-method': 'DHL Paket'
    },
    firstLine: null,
    columnDelim: "\t",
    lineDelim: "\r\n",
    decSep: '.',
    outputEncoding: CSV.Encoding['ISO-8859-1']
}

export enum Carrier { "USPS", "UPS", "FedEx", "DHL", "Fastway", "GLS", "GO!", "Hermes Logistik Gruppe", "Royal Mail", "Parcelforce", "City Link", "TNT", "Target", "Other" };

export interface FlatFilePriceandQuantityUpdateFeedRecord {
    // https://s3.amazonaws.com/seller-templates/ff/eu/de/Flat.File.PriceInventory.de.xls
    // 	_POST_FLAT_FILE_PRICEANDQUANTITYONLY_UPDATE_DATA_
    sku: string,
    price?: number, // must probably be set in export file in any case with an empty string
    'minimum-seller-allowed-price'?: number,
    'maximum-seller-allowed-price'?: number,
    'quantity': number,
    'fulfillment-channel'?: string,
    'leadtime-to-ship'?: number
}

export var FlatFilePriceandQuantityUpdateFeedOptions: CSV.Options = {
    columns: ['sku', 'price', 'quantity'],
    defaults: {},
    firstLine: null,
    columnDelim: "\t",
    lineDelim: "\r\n",
    decSep: ',',
    outputEncoding: CSV.Encoding['ISO-8859-1']
}
