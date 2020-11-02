import React from 'react';
import { Link } from 'react-router-dom';
import ShowImage from './ShowImage';
import moment from 'moment';

const Card = ({ product, showViewProductButton = true }) => {

    const showViewButton = (showViewProductButton) => {
        return (
            showViewProductButton && (
                <Link className="mr-2" to={`/product/${product._id}`}>
                    <button className="btn btn-outline-primary mt-2 mb-2">
                        View Product
                    </button>
                </Link>
            )
        )
    }

    const cartButton = () => {
        return (
            <button className="btn btn-outline-warning mt-2 mb-2">
                Add to cart
            </button>
        )
    }

    const showStock = (quantity) => {
        return quantity > 0 ? 
        <span className="badge badge-primary badge-pill">In Stock</span>
         : <span className="badge badge-primary badge-pill">Out Of Stock</span>
    }

    return (
        <div className="card">
            <div className="card-header name">{product.name}</div>
            <div className="card-body">
                <ShowImage item={product} url="product" />
                <p className="lead mt-2">{product.description.substring(0, 30)}</p>
                <p className="black-10">${product.price}</p>
                <p className="black-9">{product.category && product.category.name}</p>
                <p className="black-8">
                    Added {moment(product.createdAt).fromNow()}
                </p>
                {showStock(product.quantity)}
                <br/>
                {showViewButton(showViewProductButton)}
                {cartButton()}
            </div>
        </div >
    )
}

export default Card;