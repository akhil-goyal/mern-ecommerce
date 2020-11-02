import React from 'react';
import { API } from '../config';

const ShowImage = ({ item, url }) => {

    return (
        <div className="product-image">

        <img
            style={{ maxHeight: '100%', maxWidth: '100%' }}
            className="mb-3"
            alt={item.name}
            src={`${API}/${url}/photo/${item._id}`}
        />

    </div>
    )

}

export default ShowImage;