import React from 'react';
import {Button, Col, Form, Modal, Row} from "react-bootstrap";
import useFormInput from "../../common/useFormInput";

const ChangeUserIntervalModal = (props) => {

    const show = props.modalState[0].show;
    const userID = props.modalState[0].userID;
    const setShow = props.modalState[1];

    const intervalInput = useFormInput('');

    // ----- HOOKS -----


    // ----- FUNCTIONS -----
    function handleSubmit(event) {
        event.preventDefault();

        props.setNewUserInterval({
            userID: userID,
            interval: intervalInput.value
        })
    }


    return (
        <Modal show={show} size="sm" onHide={() => setShow({show: false, userID: null, interval: 5})}>
            <Modal.Header closeButton>
                <Modal.Title>Interwał: user {userID}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="align-ctr">
                    <Form onSubmit={handleSubmit}>
                        <Form.Group as={Row}>
                            <Col md={8}>
                                <Form.Label>Z zakresu 1-300 s</Form.Label>
                            </Col>
                            <Col md={4}>
                                <Form.Control
                                    className="align-ctr"
                                    type={'number'}
                                    step={'1'} min={5} max={300}
                                    {...intervalInput}
                                />
                            </Col>
                        </Form.Group>
                        <Button
                            className="form-button-2"
                            style={{float: 'right'}}
                            type="submit"
                            variant="outline-primary"
                        >
                            Zmień
                        </Button>
                    </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ChangeUserIntervalModal;