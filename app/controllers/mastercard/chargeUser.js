'use strict';

var async           = require('async');

var accountSid      = 'ACa29ed645fd04299440653ee8ee1ae093';
var authToken       = 'bd6a3712187f754f0ace1e95b0485706';
var twilioClient    = require('twilio')(accountSid, authToken);



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

            },

            // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
            // #4 - send SMS
            function(payload, callback){
                //console.log('4');
                //callback(null, payload);
                twilioClient.messages.create(
                    {
                        body:       'IoTPay: The device ' + data.description + ' has just exceeded the threshold. You have been billed $' + payload.data.amount/100,
                        to:         payload.user.mobile,
                        from:       '+1 928 379 7585'

                    },
                    function(error, message) {
                        if (!error) {
                            // The second argument to the callback will contain the information
                            // sent back by Twilio for the request. In this case, it is the
                            // information about the text messsage you just sent:
                            console.log('TWILIO Success! The SID for this SMS message is:', message.sid);
                            //console.log('Message sent on:');
                            //console.log(message.dateCreated);
                            callback(null, payload);
                        }
                        else {
                            console.log('Oops! There was a TWILIO error.');
                            callback(error, null);

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
