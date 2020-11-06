// Packages
import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';

// Components
import Layout from '../core/Layout';

// Methods
import { isAuthenticated } from '../auth';
import { getCategory, updateCategory } from './apiAdmin';


// Functional component to update a category.
// match is being destructured from the props.
// Can also be written as props.match
const UpdateCategory = ({ match }) => {

    // Using React Hooks to set the states associated
    // to Categories Update.
    const [values, setValues] = useState({
        name: '',
        error: '',
        redirectToProfile: false,
        formData: ''
    });

    // Destructuring user object, JWT token from isAuthenticated method.
    const { user, token } = isAuthenticated();

    // Destructuring the states for the sake of simplicity.
    const { name, error, redirectToProfile } = values;

    // Method that will load when the component mounts on DOM.
    // Here, it is loading the category.
    const init = categoryId => {

        // Calling the API getCategory.
        // Takes Category ID & token.
        getCategory(categoryId, token).then(data => {

            // If there's an error while fetching the category.
            if (data.error) {

                // Updating the error state.
                setValues({ ...values, error: data.error });

            // If the category has been fetched successfully.
            } else {
                // Updating the state.
                setValues({
                    ...values,
                    name: data.name
                });
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
        init(match.params.categoryId);
    }, []);


    // This method listens for any change in input values.
    // Using a HIGHER ORDER FUNCTION, ie, a function returning an
    // another function. 'event' represents synthetic browser events.
    const handleChange = name => event => {

        // ...values means that the existing states are being used, 
        // the error is being set to false so that if there was any previous error,
        // it may hide when a user starts typing again. [name] can also be written as
        // event.target.name
        setValues({ ...values, error: false, [name]: event.target.value });
    };


    // This method will work when the form is submitted to be updated.
    const submitCategoryForm = e => {

        // This will prevent the default behaviour of the browser.
        e.preventDefault();


        // Category object that contains the new category name entered
        // by the user.
        const category = {
            name: name
        };

        // Calling API updateCategory.
        // Takes User ID, Category ID, JWT Token & Category object.
        updateCategory(match.params.categoryId, user._id, token, category).then(data => {

            // If an error occurs while updating the category.
            if (data.error) {

                // Updating error state
                setValues({ ...values, error: data.error });

            // If the category has been updated successfully.
            } else {

                // Updating the state
                setValues({
                    ...values,
                    name: data.name,
                    error: false,
                    redirectToProfile: true
                });
            }
        });
    };

    // This will return the form where the category is updated.
    const updateCategoryForm = () => (

        <div className="wrap-login100 p-l-85 p-r-85 p-t-55 p-b-55">

            <form className="mb-5" onSubmit={submitCategoryForm}>

                <span className="login100-form-title p-b-32 m-b-7">Update Category Form</span>

                <span className="txt1 p-b-11">Category Name</span>

                <br />
                <br />

                <div className="wrap-input100 validate-input m-b-36">

                    <input
                        onChange={handleChange('name')}
                        value={name}
                        className="input100"
                        type="text"
                        required
                        name="name"
                    />

                </div>

                <div className="w-size25">
                    <button type="submit" className="flex-c-m size2 bg1 bo-rad-23 hov1 m-text3 trans-0-4">
                        Save Changes
                    </button>
                </div>
                
            </form>

        </div>

    );
    
    // It will return if the error state is not null.
    const showError = () => (
        <div className={'alert alert-danger'} role="alert" style={{ display: error ? '' : 'none' }}>
            <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            {error}
        </div>
    );

    // It will redirect the user upon successful update of the category.
    const redirectUser = () => {
        if (redirectToProfile) {
            if (!error) {
                return <Redirect to="/admin/categories" />;
            }
        }
    };


    // This will return a back button which can help the user in going
    // back to the Categories page.
    const goBackBTN = () => {
        return (
            <div className="mt-5">
                <Link to="/admin/categories" className="text-info">
                    Back To Admin Home
                </Link>
            </div>
        );
    };

    return (
        <Layout
            title={`Hello, ${user.name}`}
            description={`This is Update Product Action Page`}
            className="container-fluid"
        >
            <div className="row">
                <div className="col-md-8 offset-md-2 m-b-250 mb-5">
                    {showError()}
                    {updateCategoryForm()}
                    {goBackBTN()}
                    {redirectUser()}
                </div>
            </div>
        </Layout>
    );
};

export default UpdateCategory;
