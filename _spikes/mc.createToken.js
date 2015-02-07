var Simplify = require("simplify-commerce"),
    client = Simplify.getClient({
        publicKey: 'sbpb_YzYwOWI1MGUtMDlmZS00NGU1LTk1NjAtZjYwYjA4ZWU2OTFi',
        privateKey: 'VXFtYx3Pk109nTeeSqZM9SNFvo55J4qFM1Ll7w96+sB5YFFQL0ODSXAOkNtXTToq'
    });

client.cardtoken.create(
    {
    card : {
        addressState : "MO",
        expMonth : "11",
        expYear : "19",
        addressCity : "OFallon",
        cvc : "123",
        number : "5105105105105100"
        }
    },
    function(errData, data){
        if(errData){
            console.error("Error Message: " + errData.data.error.message);
            // handle the error
            return;
        }
        console.log("Success Response: " + JSON.stringify(data));
    }
);


