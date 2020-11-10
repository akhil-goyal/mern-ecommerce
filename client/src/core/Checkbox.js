// Packages
import React, { useState } from "react";

// Reusable functional Checkbox component.
// Receiving categories & handleFilters as props from
// the parent component.
const Checkbox = ({ categories, handleFilters }) => {

    // Using React Hooks to set the states associated
    // to the Checkbox.
    const [checked, setChecked] = useState([]);

    // This method listens for any change in input values.
    // Using a HIGHER ORDER FUNCTION, ie, a function returning an
    // another function.
    const handleToggle = c => () => {

        // It will return the first index or -1
        const currentCategoryId = checked.indexOf(c);
        const newCheckedCategoryId = [...checked];

        // if currently checked was not already in checked state > push
        // else pull/take off
        if (currentCategoryId === -1) {
            newCheckedCategoryId.push(c);
        } else {
            newCheckedCategoryId.splice(currentCategoryId, 1);
        }

        // Updating the setChecked state.
        setChecked(newCheckedCategoryId);
        handleFilters(newCheckedCategoryId);

    };

    return categories.map((c, i) => (

        <li key={i} className="list-unstyled">

            <input
                onChange={handleToggle(c._id)}
                value={checked.indexOf(c._id === -1)}
                type="checkbox"
                className="form-check-input"
            />

            <label className="form-check-label">{c.name}</label>

        </li>
    ));
};

export default Checkbox;
