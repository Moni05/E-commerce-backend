const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");

dotenv.config();

const KEY = process.env.STRIPE_KEY
const stripe = require("stripe")(KEY);

router.post("/", (req, res) =>{
    stripe.charges.create({
        source: req.body.tokenId,
        amount: req.body.amount,
        currency: "inr",
    }, (stripeErr, stripeRes)=>{
        if(stripeErr) {
            res.status(500).json(stripeErr);
        } else{
            res.status(200).json(stripeRes);
        }
    });
})

module.exports = router;