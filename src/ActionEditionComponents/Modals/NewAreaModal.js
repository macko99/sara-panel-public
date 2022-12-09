import React from 'react';
import {Button, Container, Form, Modal, Row} from "react-bootstrap";
import useFormInput from "../../common/useFormInput";
import {useTranslation} from "react-i18next";

const NewAreaModal = (props) => {
    const { t } = useTranslation();

    const show = props.showNewAreaModalState[0].show;
    const coordinates = props.showNewAreaModalState[0].coordinates;
    const areaNameInput = useFormInput("");

    // ----- FUNCTIONS -----
    function handleSubmit(event) {
        event.preventDefault();
        const newArea = {
            name: areaNameInput.value,
            coordinates: coordinates
        }
        props.setNewArea(newArea);
        props.showNewAreaModalState[1]({show: false, areaName: null, coordinates: []})
        areaNameInput.onChange(null);
    }

    // ----- RENDER -----
    return (
        <Modal show={show}  onHide={() => {
            props.showNewAreaModalState[1]({show: false, areaName: null, coordinates: []})
        }}>
            <Modal.Header closeButton>
                <Modal.Title>{t("New area")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Row>
                        <Form onSubmit={handleSubmit} >
                            <Form.Label>{t("Area's name")}</Form.Label>
                            <Form.Control
                                type="text"
                                required
                                maxLength={32}
                                {...areaNameInput}
                            />
                            <div className="d-grid gap-2">
                                <Button variant="primary" type="submit" className="form-button">
                                    {t("Add area")}
                                </Button>
                            </div>
                        </Form>
                    </Row>
                </Container>
            </Modal.Body>
        </Modal>
    );
};

export default NewAreaModal;