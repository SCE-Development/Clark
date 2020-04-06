import React from 'react';

const Item = (props) =>{
    return(
        <tr>
        {
            [
                props.name,
                props.des || '-',
                props.price,
                props.stock || '-',
                props.cat,
                props.pic || '-'
            ].map((ele,index)=>{
                    if(index === 5 && ele !== '-'){
                       return <td key = {index}>
                           <div>
                               <img src = {ele} width ={100} height = {100}></img>
                           </div>
                       </td>
                    }else{
                        return <td key = {index}>{ele}</td>
                    }
                
            })
        }
    </tr>
    )
}

export default Item;