// Packages
import React from "react";

// Methods
import { API } from "../config";


// Functional Reusable Component to Show Image
// Receiving item, url as props from its parent
// component. It can also be written as props.item,
// props.url
const ShowImage = ({ item, url }) => (

    <div className="product-img">

        <img
            src={`${API}/${url}/photo/${item._id}`}
            alt={item.name}
            className="mb-3"
            style={{ maxHeight: "100%", maxWidth: "100%" }}
        />

    </div>

);

export default ShowImage;
