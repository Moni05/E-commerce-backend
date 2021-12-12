const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const { verifyToken, verifyTokenandAuthorisation, verifyTokenandAdmin } = require("./verifyAccessToken");

router.get("/find/:userId", verifyTokenandAuthorisation, async(req, res)=>{
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        res.status(200).json(cart);
    } 
    catch (err) {
        res.status(500).json(err);
    }
})

router.get("/", verifyTokenandAdmin, async (req, res) => {

    try {
      const carts = await Cart.find();
      res.status(200).json(carts);
    } catch (err) {
      res.status(500).json(err);
    }
});

router.post("/", verifyToken, async(req, res)=>{
   
    const newCart = new Cart(req.body);

    try{
        const savedCart = await newCart.save();
        res.status(200).send(savedCart);
    }catch(err){
        res.status(500).send(err);
    }
})

router.put("/:id", verifyTokenandAuthorisation, async(req, res)=>{

    try{
        const updateCart = await Cart.findByIdAndUpdate(req.params.id,{ $set: req.body}, {new: true});
        res.status(200).send(updatedCart);
    }catch(err){
        res.status(500).send(err);
    }
})

router.delete("/:id", verifyTokenandAuthorisation, async(req, res)=>{

    try{
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).send("Cart item is now deleted");
    }catch(err){
        res.status(500).send(err);
    }
})

module.exports = router;