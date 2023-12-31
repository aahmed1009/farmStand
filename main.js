const express = require("express");
const app = express();

const path = require("path");
const mongoose = require("mongoose");
const Product = require("./models/product");
const methodOverride = require("method-override");

mongoose
  .connect("mongodb://localhost:27017/farmStand", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MONGO CONNECTION OPEN!!!");
  })
  .catch((err) => {
    console.log("MONGO CONNECTION ERROR!!!!");
    console.log(err);
  });

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

const categories = ["fruit", "vegetable", "dairy", "fungus"];

app.get("/products", async (req, res) => {
  const products = await Product.find({});
  // console.log(products);
  res.render("products/index", { products });
});

app.get("/products/new", (req, res) => {
  res.render("products/newProduct", {
    categories,
  });
});
app.post("/products", async (req, res) => {
  const addNewProduct = new Product(req.body);
  await addNewProduct.save();
  console.log(addNewProduct);
  // res.send("Done You've added your product");
  res.redirect(`/products/${addNewProduct._id}`);
});

app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  console.log(product);
  res.render("products/showID", { product });
});

app.get("/products/:id/edit", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render("products/editProduct", { product, categories });
});

app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  });
  res.redirect(`/products/${product._id}`);
});
app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  const deleteProduct = await Product.findByIdAndDelete(id);
  res.redirect(`/products`);
});

app.listen(3000, () => {
  console.log("Listening on port 3000 !!");
});
