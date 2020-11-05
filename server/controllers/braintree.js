require('dotenv').config();
const braintree = require('braintree');

// Braintree configuration
const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
    merchantId: process.env.BRAINTREE_MERCHANT_ID
});

// To generate token on the basis of client verification.
exports.generateToken = (req, res) => {
    gateway.clientToken.generate({}, function (err, response) {
        // In case of any error on the basis of client verification.
        if (err) {
            res.status(500).send(err);
            // In case, the client is verified, so a valid response is 
            // returned to the client-side.
        } else {
            res.send(response);
        }
    });
};

// To process the payment when payment info received from the client-side.
exports.processPayment = (req, res) => {

    // Setting payment method received from the client-side.
    let nonceFromTheClient = req.body.paymentMethodNonce;

    // Setting payment amount received from the client-side.
    let amountFromTheClient = req.body.amount;

    // This is where the transaction is taking place.
    let newTransaction = gateway.transaction.sale(
        {
            amount: amountFromTheClient,
            paymentMethodNonce: nonceFromTheClient,
            options: {
                submitForSettlement: true
            }
        },
        (error, result) => {
            // In case, any error occurs regarding the payment failure
            // or payment method.
            if (error) {
                res.status(500).json(error);
                // In case, the transaction is successful, a valid response
                // with transaction details is sent to the client-side.
            } else {
                res.json(result);
            }
        }
    );
};
