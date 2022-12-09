import React from 'react';
import {BsCheckSquareFill, BsFillSquareFill} from "react-icons/bs";

const UserTypeIcon = (props) => {

    if(props.isOneTime){
        return (<BsFillSquareFill opacity="0" fontSize='2.5em'/>)
    }
    else {
        return (<BsCheckSquareFill fontSize='1.5em'/>)
    }
};

export default UserTypeIcon;