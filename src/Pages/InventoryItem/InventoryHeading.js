import React from 'react';

const fields = [
    "Name",
    "Description",
    "Price",
    "Stock",
    "Category",
    "Picture"
]

const InventoryHeading  = (props) => {
    return(
        <tr>
            {fields.map((ele, index) => {
                if(index === 4){
                    return <td key = {index}>
                        <form >
                            {"Category: "}
                            <select className = "categoryDropdown" onChange = {props.categoryHandler}>
                                <option value = "All">All</option>
                                <option value = "Snack">Snack</option>
                                <option value = "Electronics">Electronics</option>
                            </select>
                        </form>
                    </td>
                }else {
                    return (
                        <th key={index}>{ele}</th>
                    )
                }
            })
            }
        </tr>
    )
}

export default InventoryHeading;
