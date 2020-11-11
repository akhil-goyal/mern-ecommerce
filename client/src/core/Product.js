// Packages
import React, { useState, useEffect } from 'react';

// Components
import Layout from './Layout';
import Card from './Card';

// Methods
import { getProductDetails, listRelatedProducts } from './apiCore';


// Functional Component to return Product
const Product = props => {

    // Using React Hooks to set the states associated
    // to the Product.
    const [product, setProduct] = useState({});
    const [relatedProduct, setRelatedProduct] = useState([]);
    const [error, setError] = useState(false);

    // This will return details related to a single selected product.
    // Also, it will return the list of related products.
    // Takes Product ID as argument.
    const loadSingleProduct = productId => {

        // Making request to getProductDetails API.
        getProductDetails(productId).then(data => {

            // If there's an error while fetching the product info.
            if (data.error) {

                // Updating the error state.
                setError(data.error);

                // If the product details have been fetched successfully.
            } else {

                // Updating the product state.
                setProduct(data);

                // Making request to listRelatedProducts API
                listRelatedProducts(data._id).then(data => {

                    // If there's an error while fetching the related 
                    // products.
                    if (data.error) {

                        // Updating the error state.
                        setError(data.error);

                        // If the related products have been fetched successfully.
                    } else {

                        // Updating the relatedProducts state.
                        setRelatedProduct(data);
                    }
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

        // Fetching Product ID from the paramteres.
        const productId = props.match.params.productId;

        loadSingleProduct(productId);

    }, [props]);

    return (
        <Layout
            title={product && product.name}
            description={product && product.description && product.description}
            className="container-fluid"
        >

            <div className="row">

                <div className="col-8">

                <h4>Product info</h4>

                    {product && product.description && <Card product={product} showViewProductButton={false} />}
                </div>

                <div className="col-4">

                    <h4>Related products</h4>

                    {relatedProduct.map((p, i) => (
                        <div className="mb-3" key={i}>
                            <Card product={p} />
                        </div>
                    ))}

                </div>

            </div>

        </Layout>
    );
};

export default Product;
