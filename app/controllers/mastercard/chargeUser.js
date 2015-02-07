'use strict';

module.exports = function(data, user, callback) {

    if(user && data.amount && data.description && data.reference){

        var Simplify        = require('simplify-commerce'),
            client          = Simplify.getClient(
                                {
                                publicKey: 'sbpb_YzYwOWI1MGUtMDlmZS00NGU1LTk1NjAtZjYwYjA4ZWU2OTFi',
                                privateKey: 'VXFtYx3Pk109nTeeSqZM9SNFvo55J4qFM1Ll7w96+sB5YFFQL0ODSXAOkNtXTToq'
                                }
                            );

        client.payment.create({
                amount :            data.amount,
                description :       data.description,
                card : {
                    number :        user.cardNumber,
                    expMonth :      user.expMonth,
                    expYear :       user.expYear,
                    cvc :           user.ss
                },
                currency :          'USD'
            },
            function(errData, data){
                if(errData){
                    console.error('Error Message: ' + errData.data.error.message);
                    // handle the error
                    callback(errData,null);
                }
                else{
                    callback(data,null);
                }
            }
        );


    }
    else{
        callback('user, amount, description and reference are required parameters', null);
    }
};
