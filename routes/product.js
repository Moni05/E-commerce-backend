const express = require("express");
const router = express.Router();
const Product = require("../models/Product")
const { verifyTokenandAdmin } = require("./verifyAccessToken")

router.post("/", verifyTokenandAdmin, async(req, res)=>{

    const newProduct = new Product(req.body);
    try{
        const savedProduct = await newProduct.save();
        res.status(200).send(savedProduct);
    }catch(err){
        res.status(500).send(err);
    }
})

router.put("/:id", verifyTokenandAdmin, async(req, res)=>{

    try{
        const updateProduct = await Product.findByIdAndUpdate(req.params.id,{$set: req.body}, {new: true});
        res.status(200).send(updateProduct);
    }catch(err){
        res.status(500).send(err);
    }
})

router.delete("/:id", verifyTokenandAdmin, async(req, res)=>{
    try{
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).send("Product is deleted...");
    }catch(err){
        res.status(500).send(err);
    }
})

router.get("/", async (req, res) => {
    
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
      let products;
  
      if (qNew) {
        products = await Product.find().sort({ createdAt: -1 }).limit(1);
      } else if (qCategory) {
        products = await Product.find({
          categories: {
            $in: [qCategory],
          },
        });
      } else {
        products = await Product.find();
      }
  
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json(err);
    }
})

router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;