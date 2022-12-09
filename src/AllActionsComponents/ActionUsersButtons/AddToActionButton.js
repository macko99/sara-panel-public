import React from 'react';
import {BsFillPersonPlusFill} from "react-icons/bs";
import {Button} from "react-bootstrap";

const AddToActionButton = (props) => {


    return (
        <Button
            className="small-font"
            variant="outline-primary"
            onClick={() => props.setAddUser(props.user)}
        >
            <BsFillPersonPlusFill />
        </Button>
    );
};

export default AddToActionButton;