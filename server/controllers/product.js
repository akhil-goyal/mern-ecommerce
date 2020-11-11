const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Product = require('../models/product');
const { errorHandler } = require('../helpers/dbErrorHandler');

// Controller to fetch a product using Product ID.
exports.productById = (req, res, next, id) => {

    Product.findById(id)

        // Populating the query with product category.
        .populate('category')

        .exec((err, product) => {

            // If there's an error or no product with the
            // requested Product ID.
            if (err || !product) {
                return res.status(400).json({
                    error: 'Product not found'
                });
            }

            // If the requested product has been found.
            req.product = product;

            // Callback function.
            next();
        });
};

// To get the current product.
exports.getProduct = (req, res) => {

    // Setting photo as undefined so that it may not return
    // in the response.
    req.product.photo = undefined;

    return res.json(req.product);
};


// Controller to create a new product.
exports.createProduct = (req, res) => {

    // Using npm package formidable to parse the files
    // coming from the client-side.
    let form = new formidable.IncomingForm();

    // Sotring the file extensions as is.
    form.keepExtensions = true;

    // Parsing the form.
    form.parse(req, (err, fields, files) => {

        // If there's an error while uploading the image.
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }

        // Destructuring the form data.
        const { name, description, price, category, quantity, shipping } = fields;

        // Checking for all the fields.
        if (!name || !description || !price || !category || !quantity || !shipping) {

            // If any field is missing.
            return res.status(400).json({
                error: 'All fields are required'
            });
        }

        // Creating instance of the Product schema.
        let product = new Product(fields);

        // 1kb = 1000
        // 1mb = 1000000
        // 10 mb = 10000000
        // 100 mb = 100000000

        if (files.photo) {

            // Checking for the file size.
            if (files.photo.size > 100000000) {

                // If the file is greater than the set size.
                return res.status(400).json({
                    error: 'Image should be less than 100mb in size'
                });
            }

            // Storing image data in product.
            product.photo.data = fs.readFileSync(files.photo.path);

            // Storing the image type.
            product.photo.contentType = files.photo.type;
        }

        // Saving the finalized product.
        product.save((err, result) => {

            // If there's an error while saving the product.
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }

            // If the product has been saved successfully.
            res.json(result);
        });
    });
};


// Controller to delete a product.
exports.deleteProduct = (req, res) => {

    // Setting product in request as product variable.
    let product = req.product;

    // Using mongoose .remove() method to delete the product.
    product.remove((err, deletedProduct) => {

        // If there's an error while deleting the product.
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }

        // If the product has been deleted successfully.
        res.json({
            message: 'Product deleted successfully'
        });
    });
};


// Controller to update an already existing product.
exports.updateProduct = (req, res) => {

    // Using npm package formidable to parse the files
    // coming from the client-side.
    let form = new formidable.IncomingForm();

    // Sotring the file extensions as is.
    form.keepExtensions = true;

    // Parsing the form.
    form.parse(req, (err, fields, files) => {

        // If there's an error while uploading the image.
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }

        // Setting product in request as product variable.
        let product = req.product;

        // Using lodash extend to combine fields object to the product.
        product = _.extend(product, fields);

        // 1kb = 1000
        // 1mb = 1000000
        // 10 mb = 10000000
        // 100 mb = 100000000

        if (files.photo) {
            // Checking for the file size.
            if (files.photo.size > 100000000) {

                // If the file is greater than the set size.
                return res.status(400).json({
                    error: 'Image should be less than 100mb in size'
                });
            }

            // Storing image data in product.
            product.photo.data = fs.readFileSync(files.photo.path);

            // Storing the image type.
            product.photo.contentType = files.photo.type;
        }

        // Saving the finalized product.
        product.save((err, result) => {

            // If there's an error while saving the product.
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }

            // If the product has been saved successfully.
            res.json(result);
        });
    });
};


// Controller to list products on the basis order, sort & limit.
exports.listProducts = (req, res) => {

    // Fetching order, limit & sort from request body.
    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Product.find()
        // -photo means excluding photo
        .select('-photo')

        // Returning the category as well.
        .populate('category')
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, products) => {

            // If there's an error while listing the products.
            if (err) {
                return res.status(400).json({
                    error: 'Products not found'
                });
            }

            // If the products have been listed successfully.
            res.json(products);
        });
};


// Controller to list related products to the product selected.
// Using Product ID of the selected Product.
exports.listRelatedProducts = (req, res) => {

    // Fetching limit from the request paramters.
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    // Using .find() method to search from products.
    Product.find({ _id: { $ne: req.product }, category: req.product.category })
        .limit(limit)
        .populate('category', '_id name')
        .exec((err, products) => {

            // If there's an error while listing the products.
            if (err) {
                return res.status(400).json({
                    error: 'Products not found'
                });
            }

            // If the products have been listed successfully.
            res.json(products);
        });
};


// Controller to fetch the list of categories.
exports.listCategories = (req, res) => {

    Product.distinct('category', {}, (err, categories) => {

        // If there's an error while fetching the categories.
        if (err) {
            return res.status(400).json({
                error: 'Categories not found'
            });
        }

        // If the categories have been fetched successfully.
        res.json(categories);
    });
};


// Controller to dislay products according to the category & 
// price filters as set by user on the client-side. Included
// other filters like sort, limit & skip.
exports.listFilteredProducts = (req, res) => {

    let order = req.body.order ? req.body.order : 'desc';
    let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};

    for (let key in req.body.filters) {

        if (req.body.filters[key].length > 0) {

            // If sorting is occuring as per price.
            if (key === 'price') {

                // gte -  Greater than
                // lte - Less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };

                // If sorting ic occuring as per the category.
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    Product.find(findArgs)
        .select('-photo')
        .populate('category')
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {

            // If there's an error while finding the products.
            if (err) {
                return res.status(400).json({
                    error: 'Products not found'
                });
            }

            // If the products have been found successfully.
            res.json({
                size: data.length,
                data
            });
        });
};


// Controller to fetch a product's image.
exports.productImage = (req, res, next) => {

    // Checking for image.
    if (req.product.photo.data) {

        // Setting content type.
        res.set('Content-Type', req.product.photo.contentType);

        // Returning the product image data.
        return res.send(req.product.photo.data);
    }

    // Callback function.
    next();
};


// Controller to search for a product using a search query.
exports.searchProduct = (req, res) => {

    // Creating query object to hold search & category value
    const query = {};

    // Assigning search value to query.name
    if (req.query.search) {

        query.name = { $regex: req.query.search, $options: 'i' };

        // Assigning category value to query.category
        if (req.query.category && req.query.category != 'All') {
            query.category = req.query.category;
        }

        // Finding the product based on 'query' object with 2 properties
        // search and category.
        Product.find(query, (err, products) => {

            // If there's an error while searching the products.
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }

            // If the products have been searched through successfully.
            res.json(products);
        }).select('-photo');
    }
};


// Controller to reduce the product quantity whenever an order is placed.
exports.decreaseQuantity = (req, res, next) => {

    let bulkOps = req.body.order.products.map(item => {
        return {

            // Updating the sold & quantity.
            updateOne: {
                filter: { _id: item._id },
                update: { $inc: { quantity: -item.count, sold: +item.count } }
            }
        };
    });

    Product.bulkWrite(bulkOps, {}, (error, products) => {

        // If there's an error while updating the quantity.
        if (error) {
            return res.status(400).json({
                error: 'Could not update product'
            });
        }

        // If the quantity has been updated successfully.
        // Callback function.
        next();
    });
};
