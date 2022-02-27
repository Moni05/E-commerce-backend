const express = require("express");
const router = express.Router();
const CryptoJS = require("crypto-js");
const User = require("../models/User");
const {verifyToken, verifyTokenandAuthorisation, verifyTokenandAdmin } = require("./verifyAccessToken");

router.get("/find/:id", verifyTokenandAdmin, async(req, res)=>{
    try{
        const user = await User.findById(req.params.id);
        const {password, ...other} = user._doc;

        res.status(200).send(other);

    }catch(err){
        res.status(500).send(err);
    }
})


router.get("/", verifyTokenandAdmin, async (req, res) => {

  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id", verifyTokenandAuthorisation, async(req, res)=> {

    if(req.body.password){
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString();
    }

    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true });
        res.status(200).send(updatedUser);
    }
    catch(err){
        res.status(500).send(err);
    }
})

router.delete("/:id", verifyTokenandAuthorisation, async(req, res)=>{
    try{
        await User.findByIdAndDelete(req.params.id);
        res.status(200).send("User has been deleted");
    }
    catch(err){
        res.status(500).send(err);
    }
})

router.get("/stats", verifyTokenandAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  
    try {
      const data = await User.aggregate([
        { $match: { createdAt: { $gte: lastYear } } },
        {
          $project: {
            month: { $month: "$createdAt" },
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          },
        },
      ]);
      res.status(200).json(data)
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router;