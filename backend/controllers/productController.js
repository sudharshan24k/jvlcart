const Product = require('../models/productModel');
const ErrorHandler = require("../utils/errorHandler")

const express = require("express");
const app = express();
app.use(express.json());


// Get all products ---> /api/v1/products
exports.getProducts = async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json({
        success: true,
        count: products.length,
        products
    });
};


// Create a new product ---> /api/v1/products/new
exports.newProduct = async (req, res, next) => {
    console.log("Incoming request body:", req.body);

    try {
        const product = await Product.create(req.body);
        res.status(201).json({
            success: true,
            product
        });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};


//get single product ---> /api/v1/products/:id    [GET] request

exports.getSingleProduct = async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("product not found",400));
    }

    res.status(201).json({
        success: true,
        product
    });
};


//update product ---> /api/v1/products/:id  [PUT] request

exports.updateProduct = async(req,res,next)=>{
    let product = await Product.findById(req.params.id);
    if(!product){
        return res.status(404).json({
            success:false,
            message:"product not found"
        })
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators:true
    })
    res.status(200).json({
        success:true,
        product
    })

}


//deleteProduct ---> /api/v1/products/:id

exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        await product.deleteOne();

        res.status(200).json({
            success: true,
            message: "The product has been successfully deleted",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while deleting the product",
            error: error.message,
        });
    }
};
