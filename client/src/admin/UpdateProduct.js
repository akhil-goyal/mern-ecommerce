// Packages
import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';

// Components
import Layout from '../core/Layout';

// Methods
import { isAuthenticated } from '../auth';
import { getProduct, getCategories, updateProduct } from './apiAdmin';


// Functional component to update a product.
// match is being destructured from the props.
// Can also be written as props.match
const UpdateProduct = ({ match }) => {

    // Using React Hooks to set the states associated
    // to Product Update.
    const [values, setValues] = useState({
        name: '',
        description: '',
        price: '',
        categories: [],
        category: '',
        shipping: '',
        quantity: '',
        photo: '',
        loading: false,
        error: false,
        createdProduct: '',
        redirectToProfile: false,
        formData: ''
    });

    // Hooks related to Categories.
    const [categories, setCategories] = useState([]);

    // Destructuring user object, JWT token from isAuthenticated method.
    const { user, token } = isAuthenticated();

    // Destructuring the states for the sake of simplicity.
    const {
        name,
        description,
        price,
        category,
        shipping,
        quantity,
        loading,
        error,
        createdProduct,
        redirectToProfile,
        formData
    } = values;


    // Method that will load when the component mounts on DOM.
    // Here, it is loading the product.
    const init = productId => {

        // Calling the API getProduct.
        // Takes Product ID.
        getProduct(productId).then(data => {

            // If there's an error while fetching the product.
            if (data.error) {

                // Updating the error state.
                setValues({ ...values, error: data.error });

            // If the product has been fetched successfully.
            } else {

                // Updating the state.
                setValues({
                    ...values,
                    name: data.name,
                    description: data.description,
                    price: data.price,
                    category: data.category._id,
                    shipping: data.shipping,
                    quantity: data.quantity,
                    formData: new FormData()
                });

                // Calling function to load the categories.
                initCategories();
            }
        });
    };

    // Method that will load when the component mounts on DOM.
    // Here, it is loading the categories.
    const initCategories = () => {

        // Calling the API getCategories.
        getCategories().then(data => {

            // If there's an error while fetching the categories.
            if (data.error) {

                // Updating the error state.
                setValues({ ...values, error: data.error });

            // If the categories have been fetched successfully.
            } else {

                // Updating the state.
                setCategories(data);
            }
        });
    };


    // UseEffect runs whenever a React Component is mounted to the DOM
    // or whenever there is a change in state. It is a replacement of
    // Component lifecycle methods that were being used in earlier versions
    // of React. It takes a callback function as the first argument & an empty 
    // array as a second argument. The second argument may contain a state, 
    // upon a change in which, the useEffect can be run again.
    useEffect(() => {
        init(match.params.productId);
    }, []);


    // This method listens for any change in input values.
    // Using a HIGHER ORDER FUNCTION, ie, a function returning an
    // another function. 'event' represents synthetic browser events.
    const handleChange = name => event => {

        // Here, the input boxes' name is being checked. If the input name is photo,
        // then the image is being targeted through event.target.files[0], otherwise,
        // other input fields are being targeted through event.target.value.
        const value = name === 'photo' ? event.target.files[0] : event.target.value;

        // Setting the form data when there's change in any input field.
        formData.set(name, value);

        // Updating the states.
        setValues({ ...values, [name]: value });

    };


    // This method will work when the form is submitted to be updated.
    const clickSubmit = event => {

        // This will prevent the default behaviour of the browser.
        event.preventDefault();

        // the error is being set to "" so that if there was any previous error,
        // it may get cleared when a new request is submitted. Loading is being set
        // to true so that a loader may appear while the request is in progress.
        setValues({ ...values, error: '', loading: true });

        // Making request to the API updateProduct. Sending User ID, JWT token,
        // Product ID & form data in arguments.
        updateProduct(match.params.productId, user._id, token, formData).then(data => {

            // If an error occurs while updating the product.
            if (data.error) {

                // Updating error state
                setValues({ ...values, error: data.error });

            // If the product has been updated successfully.
            } else {

                // Updating the state
                setValues({
                    ...values,
                    name: '',
                    description: '',
                    photo: '',
                    price: '',
                    quantity: '',
                    loading: false,
                    error: false,
                    redirectToProfile: true,
                    createdProduct: data.name
                });
            }
        });
    };

    // This will return the form where the product is updated.
    const newPostForm = () => (

        <form className="mb-3" onSubmit={clickSubmit}>

            <h4>Post Photo</h4>

            <div className="form-group">
                <label className="btn btn-secondary">
                    <input onChange={handleChange('photo')} type="file" name="photo" accept="image/*" />
                </label>
            </div>

            <div className="form-group">
                <label className="text-muted">Name</label>
                <input onChange={handleChange('name')} type="text" className="form-control" value={name} />
            </div>

            <div className="form-group">
                <label className="text-muted">Description</label>
                <textarea onChange={handleChange('description')} className="form-control" value={description} />
            </div>

            <div className="form-group">
                <label className="text-muted">Price</label>
                <input onChange={handleChange('price')} type="number" className="form-control" value={price} />
            </div>

            <div className="form-group">

                <label className="text-muted">Category</label>

                <select onChange={handleChange('category')} className="form-control">

                    <option>Please select</option>

                    {/* Loading the categories dynamically. */}

                    {categories &&
                        categories.map((c, i) => (
                            <option key={i} value={c._id}>
                                {c.name}
                            </option>
                        ))}

                </select>

            </div>

            <div className="form-group">

                <label className="text-muted">Shipping</label>

                <select onChange={handleChange('shipping')} className="form-control">
                    <option>Please select</option>
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                </select>

            </div>

            <div className="form-group">

                <label className="text-muted">Quantity</label>
                <input onChange={handleChange('quantity')} type="number" className="form-control" value={quantity} />
                
            </div>

            <button className="btn btn-outline-primary">Update Product</button>

        </form>
    );
     
    // It will return the error message.
    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    );
    
    // It will return the success message.
    const showSuccess = () => (
        <div className="alert alert-info" style={{ display: createdProduct ? '' : 'none' }}>
            <h2>{`${createdProduct}`} is updated!</h2>
        </div>
    );
    
    // It will the loader until the loading state is set to false again.
    const showLoading = () =>
        loading && (
            <div className="alert alert-success">
                <h2>Loading...</h2>
            </div>
        );
        
    // It will redirect the user after the product is updated successfully.
    const redirectUser = () => {
        if (redirectToProfile) {
            if (!error) {
                return <Redirect to="/" />;
            }
        }
    };

    return (
        <Layout title="Add a new product" description={`G'day ${user.name}, ready to add a new product?`}>
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    {showLoading()}
                    {showSuccess()}
                    {showError()}
                    {newPostForm()}
                    {redirectUser()}
                </div>
            </div>
        </Layout>
    );
};

export default UpdateProduct;
