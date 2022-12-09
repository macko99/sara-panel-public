import React from 'react';
import {Button, Col, Modal, Row} from "react-bootstrap";
import {useTranslation} from "react-i18next";

const ToggleWarningModal = (props) => {

    const { t } = useTranslation();

    const show = props.show;
    const setShow = props.setShow;
    const toggleName = props.toggleName;
    const setToggle = props.setToggle;


    return (
        <Modal
            show={show} animation={true}
            onHide={() => setShow({show: false, id: null, name: null})}>
            <Modal.Header>
                <Modal.Title>{t("Attention - change in action status")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {t("Are you certain to")} {toggleName ? t("FinishNom") : t("StartNom")} {t("ActionAkk")} {props.actionID}?
            </Modal.Body>
            <Modal.Footer>
                <Row>
                    <Button
                        as={Col}
                        variant="outline-primary"
                        onClick={() => {
                            setShow({show: false, id: null, name: null});
                        }}
                    >
                        {t("Cancel")}
                    </Button>
                    <Button
                        as={Col}
                        variant={toggleName ? "danger" : "success"}
                        onClick={() => {
                            setToggle(true);
                        }}
                    >
                        {toggleName ? t("Finish") : t("Start")}
                    </Button>
                </Row>
            </Modal.Footer>
        </Modal>
    );
};

export default ToggleWarningModal;