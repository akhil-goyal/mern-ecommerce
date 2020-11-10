// Packages
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Components
import Layout from './Layout';
import Card from './Card';
import Checkout from './Checkout';

// Methods
import { getCart } from './cartHelpers';


// Functional Component to return the Cart.
const Cart = () => {

    // Using React Hooks to set the states associated
    // to the Cart.
    const [items, setItems] = useState([]);
    const [run, setRun] = useState(false);

    // UseEffect runs whenever a React Component is mounted to the DOM
    // or whenever there is a change in state. It is a replacement of
    // Component lifecycle methods that were being used in earlier versions
    // of React. It takes a callback function as the first argument & an empty 
    // array as a second argument. The second argument may contain a state, 
    // upon a change in which, the useEffect can be run again.
    useEffect(() => {
        setItems(getCart());
    }, [run]);

    // Function to retunr cart items.
    const showItems = items => {
        return (
            <div>

                <h2>Your cart has {`${items.length}`} items</h2>

                <hr />

                {/* Mapping through the cart item and sending the items
                as props to the Card Component. */}

                {items.map((product, i) => (
                    <Card
                        key={i}
                        product={product}
                        showAddToCartButton={false}
                        cartUpdate={true}
                        showRemoveProductButton={true}
                        setRun={setRun}
                        run={run}
                    />
                ))}
            </div>
        );
    };

    // It will retunr Empty Cart if there are no products
    // in the cart.
    const noItemsMessage = () => (
        <h2>
            Your cart is empty. <br /> <Link to="/shop">Continue shopping</Link>
        </h2>
    );

    return (
        <Layout
            title="Shopping Cart"
            description="Manage your cart items. Add remove checkout or continue shopping."
            className="container-fluid"
        >
            <div className="row">

                <div className="col-6">{items.length > 0 ? showItems(items) : noItemsMessage()}</div>

                <div className="col-6">

                    <h2 className="mb-4">Your cart summary</h2>

                    <hr />

                    <Checkout products={items} setRun={setRun} run={run} />

                </div>
            </div>
        </Layout>
    );
};

export default Cart;
