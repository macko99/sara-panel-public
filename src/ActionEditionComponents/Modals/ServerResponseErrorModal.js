import React from 'react';
import {Button, Modal} from "react-bootstrap";
import { Link } from "react-router-dom";


const ServerResponseErrorModal = (props) => {

    const [serverError, setServerError] = props.serverErrorState;

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
            keyboard={false}
            show={serverError.show}
        >
            <Modal.Header className="error-font">
                <Modal.Title id="contained-modal-title-vcenter">
                    Błąd danych z serwera
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    Wystąpił błąd podczas pobierania danych z serwera.<br/>
                    Request: {serverError.errorLabel} <br/>
                    {serverError.error}
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-warning" onClick={() => setServerError({show: false, errorLabel: '', error: ''})}>
                    <Link  to={"/home"} className="nav-link">
                        Strona główna
                    </Link>
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ServerResponseErrorModal;