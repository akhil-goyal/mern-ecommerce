// Packages
import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import moment from 'moment';

// Components
import ShowImage from './ShowImage';

// Methods
import { addItem, updateItem, removeItem } from './cartHelpers';


// Reusable card component.
const Card = ({
  product,
  showViewProductButton = true,
  showAddToCartButton = true,
  cartUpdate = false,
  showRemoveProductButton = false,
  setRun = f => f,
  run = undefined
}) => {

  // Using React Hooks to set the states associated
  // to the Card.
  const [redirect, setRedirect] = useState(false);
  const [count, setCount] = useState(product.count);

  // This will return the view button depending upon the props
  // received from its parent component.
  const showViewButton = showViewProductButton => {
    return (
      showViewProductButton && (
        <Link to={`/product/${product._id}`} className="mr-2">
          <button className="btn btn-outline-primary mt-2 mb-2 card-btn-1">View Product</button>
        </Link>
      )
    );
  };

  // Function to add an item to the cart.
  const addToCart = () => {

    // Calling API addItem to add product to the cart.
    // Setting redirect to true so that redirection 
    // takes place once an item has been added.
    addItem(product, setRedirect(true));
  };

  // Function to redirect on the basis of redirect state.
  const shouldRedirect = redirect => {
    if (redirect) {
      return <Redirect to="/cart" />;
    }
  };

  // This will return the "Add to cart" button depending 
  // upon the props received from its parent component.
  const showAddToCartBtn = showAddToCartButton => {
    return (
      showAddToCartButton && (
        <button onClick={addToCart} className="btn btn-outline-warning mt-2 mb-2 card-btn-1  ">
          Add to cart
        </button>
      )
    );
  };

  // Function to return the number of products available.
  // If available, it will return the quantity, else, it
  // will display Out of Stock.
  const showStock = quantity => {
    return quantity > 0 ? (
      <span className="badge badge-primary badge-pill">In Stock </span>
    ) : (
        <span className="badge badge-primary badge-pill">Out of Stock </span>
      );
  };

  // This method listens for any change in input values.
  // Using a HIGHER ORDER FUNCTION, ie, a function returning an
  // another function. 'event' represents synthetic browser events.
  const handleChange = productId => event => {

    // It will ensure that useEffect runs in its parent component, Cart in this case.
    setRun(!run); // run useEffect in parent Cart

    // Ensuring that the value entered by user is not 0.
    setCount(event.target.value < 1 ? 1 : event.target.value);

    // Updating the product count.
    if (event.target.value >= 1) {
      updateItem(productId, event.target.value);
    }

  };

  // This will return the "Update Cart" option depending 
  // upon the props received from its parent component.
  const showCartUpdateOptions = cartUpdate => {
    return (
      cartUpdate && (
        <div>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">Adjust Quantity</span>
            </div>
            <input type="number" className="form-control" value={count} onChange={handleChange(product._id)} />
          </div>
        </div>
      )
    );
  };

  // This will return the "Remove" button depending 
  // upon the props received from its parent component.
  const showRemoveButton = showRemoveProductButton => {
    return (
      showRemoveProductButton && (
        <button
          onClick={() => {

            removeItem(product._id);

            // It will ensure that useEffect runs in its parent component, Cart in this case.
            setRun(!run);

          }}
          className="btn btn-outline-danger mt-2 mb-2"
        >
          Remove Product
        </button>
      )
    );
  };
  return (
    <div className="card ">
      <div className="card-header card-header-1 ">{product.name}</div>
      <div className="card-body">
        {shouldRedirect(redirect)}
        <ShowImage item={product} url="product" />
        <p className="card-p  mt-2">{product.description.substring(0, 100)} </p>
        <p className="card-p black-10">$ {product.price}</p>
        <p className="black-9">Category: {product.category && product.category.name}</p>
        <p className="black-8">Added on {moment(product.createdAt).fromNow()}</p>
        {showStock(product.quantity)}
        <br />

        {showViewButton(showViewProductButton)}

        {showAddToCartBtn(showAddToCartButton)}

        {showRemoveButton(showRemoveProductButton)}

        {showCartUpdateOptions(cartUpdate)}
      </div>
    </div>
  );
};

export default Card;
