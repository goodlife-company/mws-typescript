import CSV = require('../csv/CSVExport');
import Schemas = require('../amazon/schemas');
import fs = require('fs');
import moment = require('moment');

describe('Schemas', function() {
    // it('are right for OrderFulfillmentFeed', function(done) {
    //     var outputToExpect = "order-id\tship-date\tcarrier-code\tcarrier-name\ttracking-number\tship-method\r\n";
    //     outputToExpect += "123-1234567-1234567\t" + moment().format("YYYY-MM-DD") + "\tDHL\tDHL\t1234568345345345345\tDHL Paket\r\n";
    //     outputToExpect += "321-7654321-7654321\t" + moment().format("YYYY-MM-DD") + "\tDHL\tDHL\t325343453458099999998723\tDHL Paket\r\n";
    //     var csvOptions = Schemas.FlatFileOrderFulfillmentFeedOptions;
    //     var rec1: Schemas.FlatFileOrderFulfillmentFeedRecord = {
    //         'order-id': '123-1234567-1234567',
    //         'tracking-number': '1234568345345345345'
    //     };
    //
    //     var rec2: Schemas.FlatFileOrderFulfillmentFeedRecord = {
    //         'order-id': '321-7654321-7654321',
    //         'tracking-number': '325343453458099999998723'
    //     };
    //
    //     var exportFile = new CSV.CSVExport(__dirname + '/../../fullfillmenttest.txt', csvOptions);
    //     exportFile.start(function() {
    //         exportFile.record(rec1, function() {
    //             exportFile.record(rec2, function() {
    //                 exportFile.close(function(filePath) {
    //                     var generatedFileContent = fs.readFileSync(filePath, 'utf-8');
    //                     expect(generatedFileContent).toEqual(outputToExpect);
    //                     done();
    //                 });
    //             });
    //         });
    //     });
    //
    //
    // });
    //
    // it('are right for FlatFilePriceandQuantityUpdateFeed', function(done) {
    //     var outputToExpect = "sku\tprice\tquantity\r\n";
    //     outputToExpect += "1234\t\t42\r\n";
    //     outputToExpect += "5678\t23,42\t4711\r\n";
    //     var csvOptions: CSV.Options = Schemas.FlatFilePriceandQuantityUpdateFeedOptions;
    //     var rec1: Schemas.FlatFilePriceandQuantityUpdateFeedRecord = {
    //         sku: '1234',
    //         quantity: 42
    //     };
    //
    //     var rec2: Schemas.FlatFilePriceandQuantityUpdateFeedRecord = {
    //         sku: '5678',
    //         price: 23.42,
    //         quantity: 4711
    //     };
    //
    //     var exportFile = new CSV.CSVExport(__dirname + '/../../qtyupdatetest.txt', csvOptions);
    //     exportFile.start(function() {
    //         exportFile.record(rec1, function() {
    //             exportFile.record(rec2, function() {
    //                 exportFile.close(function(filePath) {
    //                     var generatedFileContent = fs.readFileSync(filePath, 'utf-8');
    //                     expect(generatedFileContent).toEqual(outputToExpect);
    //                     done();
    //                 });
    //             });
    //         });
    //     });
    //
    //
    // });
});
