import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { getCart, removeItem } from './cartHelpers';
import Card from './Card';
import Checkout from './Checkout';
import { Link } from 'react-router-dom';

const Cart = () => {

    const [items, setItems] = useState([])

    useEffect(() => {
        setItems(getCart())
    }, [items])

    const showItems = items => {
        return (
            <div>
                <h2>Your cart has {`${items.length}`} items.</h2>
                <hr />
                {
                    items.map((item, index) => (
                        <Card
                            key={index}
                            product={item}
                            showAddToCartButton={false}
                            cartUpdate={true}
                            showRemoveProductButton={true}
                        />
                    ))
                }
            </div>
        )
    }

    const noItemsMessage = () => (
        <h2>Your cart  is empty. <br /><Link to="/shop">Continue Shopping</Link></h2>
    )

    return (
        <Layout className="container-fluid" title="Shopping Cart" description="Manage your cart items.">
            <div className="row">
                <div className="col-6">
                    {
                        items.length > 0 ? showItems(items) : noItemsMessage()
                    }
                </div>

                <div className="col-6">
                    <h2 className="mb-4">Your cart summary</h2>
                    <hr />
                    <Checkout products={items} />
                </div>
            </div>
        </Layout>
    )

}

export default Cart;