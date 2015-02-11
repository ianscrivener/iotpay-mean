'use strict';

var async           = require('async');

var Simplify        = require('simplify-commerce');
var simplifyClient  = Simplify.getClient(
                        {
                        publicKey: 'sbpb_YzYwOWI1MGUtMDlmZS00NGU1LTk1NjAtZjYwYjA4ZWU2OTFi',
                        privateKey: 'VXFtYx3Pk109nTeeSqZM9SNFvo55J4qFM1Ll7w96+sB5YFFQL0ODSXAOkNtXTToq'
                        }
                    );

module.exports = function(data, user, callback) {

    //console.log('data',data);

    //console.log('user',user);


    var getArgs = function(){
        return {data:data, user:user};
    };

    async.waterfall([

            //set up funct
            function(callback){
                callback(null, getArgs());
            },

            // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
            // #1 - make sure all req'd data args are there
            function(payload, callback){
                //console.log('1');

                if(payload.data.amount && payload.data.description){
                    callback(null, payload);
                }
                else{
                    callback('amount, description are required parameters', null);
                }
            },

            // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
            // #2 - make sure all user fields are there
            function(payload, callback){
                //console.log('2');
                //console.log(payload.user);

                if(payload.user.cardNumber && payload.user.expMonth && payload.user.expYear && payload.user.cvc && payload.user.mobile){
                    //console.log('2.1');
                    callback(null, payload);
                }
                else{
                    //console.log('2.2');
                    callback('user.cardNumber, user.expMonth, user.expYear, user.cvc are required parameters', null);
                }
            },



            // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
            // #3 - do Simplify transactiob
            function(payload, callback){
                //console.log('3');

                simplifyClient.payment.create({
                        amount :            payload.data.amount,
                        description :       payload.data.description,
                        card : {
                            number :        payload.user.cardNumber,
                            expMonth :      payload.user.expMonth,
                            expYear :       payload.user.expYear,
                            cvc :           payload.user.cvc
                        },
                        currency :          'USD'
                    },
                    function(errData, retData){
                        if(errData){
                            console.error('Error Message: ' + errData.data.error.message);
                            // handle the error
                            callback(errData,null);
                        }
                        else{
                            payload.retData = retData;
                            callback(null, payload);
                        }
                    }
                );

            }
        ],

        //final funct
        function (err, payload) {
            if(err){
                //console.log('Final funct error');
                callback(err,null);
            }
            else{
                //console.log('Final funct OK');
                callback(null, 'OK');
            }
        });

};
