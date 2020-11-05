const Category = require('../models/category');
const Product = require('../models/product');
const { errorHandler } = require('../helpers/dbErrorHandler');

// Fetch category using Category ID from Parameters.
exports.categoryById = (req, res, next, id) => {

    // Finding a particular category using Category ID received
    // from the parameters.
    Category.findById(id).exec((err, category) => {

        // In case, there's an error or there's no category 
        // associated to the ID provided.
        if (err || !category) {
            return res.status(400).json({
                error: 'Category does not exist'
            });
        }

        // In case, the category has been found, it is set
        // to req.category
        req.category = category;

        // Callback function.
        next();

    });
};

// To Create a new category.
exports.createCategory = (req, res) => {

    // Creating an instance of the 'Category' model.
    const category = new Category(req.body);

    // Saving the category received from client-side.
    category.save((err, data) => {

        // In case, an error occurs.
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }

        // In case, the category is successfully created,
        // the response is sent back to the client-side.
        res.json({ data });

    });

};

// ************
// To fetch a particular category using Category ID.
exports.fetchCategory = (req, res) => {
    return res.json(req.category);
};

// To update a category using Category ID.
exports.updateCategory = (req, res) => {

    // Setting the category in req.category as category.
    const category = req.category;

    // Setting category name as per received from the
    // client-side.
    category.name = req.body.name;

    // Saving the updated category details.
    category.save((err, data) => {

        // In case, an error occurs while updating 
        // the category.
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }

        // In case, the category was updated successfully,
        // a valid response is returned to the client-side.
        res.json(data);

    });

};

// To delete a category using Category ID.
exports.deleteCategory = (req, res) => {

    // Setting the category in req.category as category.
    const category = req.category;

    // Finding the category based on the category requested.
    Product.find({ category }).exec((err, data) => {

        // In case, a category has products asscoiated to it.
        if (data.length >= 1) {

            return res.status(400).json({
                message: `Sorry. You cant delete ${category.name}. It has ${data.length} associated products.`
            });

        } else {

            // Deleting the category.
            category.remove((err, data) => {

                // In case, an error occurs while deleting 
                // the category.
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }

                // In case, the category was deleted successfully,
                // a valid response is returned to the client-side.
                res.json({
                    message: 'Category deleted'
                });

            });
        }
    });
};

// To get a list of all categories.
exports.listCategories = (req, res) => {

    // Finding all the categories
    Category.find().exec((err, data) => {

        // In case, any error occurs.
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }

        // Sending categories to the client-side.
        res.json(data);

    });

};
