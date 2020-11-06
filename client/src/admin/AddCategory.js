// Packages
import React, { useState } from "react";
import { Link } from "react-router-dom";

// Components
import Layout from "../core/Layout";

// Methods
import { isAuthenticated } from "./../auth";
import { createCategory } from "./apiAdmin";

// Functional Component to add a new Category.
const AddCategory = () => {

    // Using React Hooks to set the states associated
    // to Add Category.
    const [name, setName] = useState("");
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    // Destructuring user object, JWT token from isAuthenticated method.
    const { user, token } = isAuthenticated();


    // This method listens for any change in input values.
    // 'e' represents synthetic browser events.
    const handleChange = e => {

        // the error is being set to "" so that if there was any previous error,
        // it may hide when a user starts typing again.
        setError("");
        setName(e.target.value);
    };

    // This method will work when the form is submitted to be updated.
    const clickSubmit = e => {

        // This will prevent the default behaviour of the browser.
        e.preventDefault();

        // the error is being set to "" so that if there was any previous error,
        // it may get cleared when a new request is submitted.
        setError("");

        // Success is being set to false to clear any previous success state which
        // might be true due to earlier submissions.
        setSuccess(false);

        // Making request to the api createCategory
        // It takes User ID, JWT token & Category Name as arguments.
        createCategory(user._id, token, { name }).then(data => {

            // If there is an error while creating a new category.
            if (data.error) {
                setError(data.error);

                // If the category has been created successfully.
            } else {

                // Nullyfying the error.
                setError("");

                // Setting success state to true to show
                // a confirmation message.
                setSuccess(true);
            }
        });
    };

    // This will return the form to add a new category.
    const newCategoryFom = () => (

        <form onSubmit={clickSubmit}>

            <div className="form-group">

                <label className="text-muted">Name</label>

                <input
                    type="text"
                    className="form-control"
                    onChange={handleChange}
                    value={name}
                    autoFocus
                    required
                />

            </div>

            <button className="btn btn-outline-primary">Create Category</button>

        </form>
    );

    // It will return whenever the success state is true.
    const showSuccess = () => {
        if (success) {
            return <h3 className="text-success">{name} is created</h3>;
        }
    };

    // It will return whenever the error state is not null.
    const showError = () => {
        if (error) {
            return <h3 className="text-danger">Category should be unique</h3>;
        }
    };

    // It will return a link that can help the user to go back 
    // to the dashboard.
    const goBack = () => (
        <div className="mt-5">
            <Link to="/admin/dashboard" className="text-warning">
                Back to Dashboard
            </Link>
        </div>
    );

    return (
        <Layout
            title="Add a new category"
            description={`Hello, ${user.name}, let's create a new category!`}
        >
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    {showSuccess()}
                    {showError()}
                    {newCategoryFom()}
                    {goBack()}
                </div>
            </div>
        </Layout>
    );
};

export default AddCategory;
