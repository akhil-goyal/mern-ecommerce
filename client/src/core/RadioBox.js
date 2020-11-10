// Packages
import React, { useState } from "react";


// Functional Reusable Radiobox Component
// Receiving prices & handleFilters as props from parent component
const RadioBox = ({ prices, handleFilters }) => {

    // Using React Hooks to set the states associated
    // to the RadioBox.
    const [value, setValue] = useState(0);

    // This method listens for any change in input values.
    // 'event' represents synthetic browser events.
    const handleChange = event => {

        // Returning the selected radiobox value to the
        // parent component.
        handleFilters(event.target.value);

        // Updating the value state.
        setValue(event.target.value);
    };

    return prices.map((p, i) => (

        <div key={i}>

            <input
                onChange={handleChange}
                value={`${p._id}`}
                name={p}
                type="radio"
                className="mr-2 ml-4"
            />

            <label className="form-check-label">{p.name}</label>

        </div>
        
    ));
};

export default RadioBox;
