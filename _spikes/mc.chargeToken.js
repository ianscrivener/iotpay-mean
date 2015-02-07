var Simplify = require("simplify-commerce"),
    client = Simplify.getClient({
        publicKey: 'sbpb_YzYwOWI1MGUtMDlmZS00NGU1LTk1NjAtZjYwYjA4ZWU2OTFi',
        privateKey: 'VXFtYx3Pk109nTeeSqZM9SNFvo55J4qFM1Ll7w96+sB5YFFQL0ODSXAOkNtXTToq'
    });

client.payment.create({
    amount : "6969",
    token : "aabda4b7-3a29-4733-b2e9-0339226a9e4c",
    description : "token payment",
    reference : "7a6ef6be31",
    currency : "USD"
}, function(errData, data){

    if(errData){
        console.error("Error Message: " + errData.data.error.message);
        // handle the error
        return;
    }

    console.log("Payment Status: " + data);
});
