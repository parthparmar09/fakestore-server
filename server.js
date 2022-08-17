//requiring express module
const express = require("express");
//starting express app
const app = express();
app.get('/' , (req,res) => {
  res.send('<h1>Fakestore-server</h1><h3><a href="https://documenter.getpostman.com/view/19497049/VUqmuySE">click here</a> to read docs</h3>')
})

//for security
const cors = require("cors");
const helmet = require("helmet");
app.use(cors());
app.use(helmet());

//body parser for form data
const bodyParser = require("body-parser");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//dotenv file for environment variables
require("dotenv").config();

//for async await error handling
require("express-async-errors");

//parser for json data
app.use(express.json());

//serving static files
app.use("/images", express.static("files"));

//bringing routes
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");



//function to authenticate all requests
const authorization = require("./middleware/authorization");
//setting routes
app.use("/user", userRoute);
app.use("/product",productRoute);
app.use("/cart", authorization, cartRoute);
app.use("/order" , authorization , orderRoute)
app.use((err, req, res, next) => {
  res.status(400).json({ success: false, msg: err.message });
});


app.use((req,res) => {
  res.send(`<h4>page not found</h4>`)
})
const port = process.env.PORT || 5000;

//function for database connection
const connectDb = require("./db/connect");


//function to start the server
const start = async () => {
  try {
    await connectDb(process.env.DB_CONNECT);
    app.listen(port, () => {
      console.log("server online...");
    });
  } catch (error) {
    console.log(error);
  }
};
//calling the function to start the servere
start();
