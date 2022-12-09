import React, {useEffect, useState} from 'react';
import {Button, Modal} from "react-bootstrap";
import {CirclePicker} from "react-color";

const ChangeUserColorModal = (props) => {

    const show = props.modalState[0].show;
    const userID = props.modalState[0].userID;
    const setShow = props.modalState[1];

    const [color, setColor] = useState('');

    // ----- HOOKS -----
    useEffect(()=> {
        setColor(props.modalState[0].color)
    }, [props])


    // ----- FUNCTIONS -----
    function handleChangeComplete() {
        props.setNewUserColor({
            userID: userID,
            color: color
        })
    }

    return (
        <Modal show={show} size="sm" onHide={() => setShow({show: false, userID: null, color: "#FFFFFF"})}>
            <Modal.Header closeButton>
                <Modal.Title>Kolor: user {userID}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="align-ctr color-picker">
                <CirclePicker
                    width="280px"
                    color={color}
                    onChangeComplete={(newColor) => setColor(newColor.hex) }
                />
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="outline-primary"
                    onClick={() => handleChangeComplete()}
                >
                    Zmień
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ChangeUserColorModal;