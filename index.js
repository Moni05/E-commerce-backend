const express = require("express");
const app = express();
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const orderRoute = require("./routes/order");
const cartRoute = require("./routes/cart");
const stripeRoute = require("./routes/stripe");
const db = require("./mongoose");
const cors = require('cors')

app.use(cors())

app.use(express.json());

app.use("/users", userRoute);
app.use("/auth", authRoute);
app.use("/products", productRoute);
app.use("/orders", orderRoute);
app.use("/carts", cartRoute);
app.use("/payment", stripeRoute);

app.listen(process.env.PORT || 3001,()=>console.log("server running at port 3001"));