var Simplify = require("simplify-commerce"),
    client = Simplify.getClient({
        publicKey: 'sbpb_YzYwOWI1MGUtMDlmZS00NGU1LTk1NjAtZjYwYjA4ZWU2OTFi',
        privateKey: 'VXFtYx3Pk109nTeeSqZM9SNFvo55J4qFM1Ll7w96+sB5YFFQL0ODSXAOkNtXTToq'
    });

client.payment.create({
    amount : "123123",
    description : "payment description",
    card : {
        expMonth : "11",
        expYear : "19",
        cvc : "123",
        number : "5555555555554444"
    },
    currency : "USD"
}, function(errData, data){
    if(errData){
        console.error("Error Message: " + errData.data.error.message);
        // handle the error
        return;
    }
});
