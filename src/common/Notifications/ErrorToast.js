import React, {useState} from 'react';
import {Toast} from "react-bootstrap";

const ErrorToast = (props) => {

    const [show, setShow] = useState(true);

    return (
        <Toast
            className="m-1"
            // key={props.key}
            show={show}
            onClose={() => setShow(false)}
            bg="danger"
            delay={3000}
            autohide
        >
            <Toast.Header>
                <strong className="me-auto">Wystąpił błąd</strong>
                <small>{props.id}</small>
            </Toast.Header>
            <Toast.Body>{props.error}</Toast.Body>
        </Toast>
    );
};
//  style={{zIndex:1}}

export default ErrorToast;