import React from 'react';
import {Button, Col, Modal, Row} from "react-bootstrap";
import {useTranslation} from "react-i18next";

const DelWarningModal = (props) => {

    const { t } = useTranslation();

    const show = props.show;
    const setShow = props.setShow;
    const delName = props.delName;
    const setDelete = props.setDelete;


    return (
        <Modal
            show={show} animation={true}
            onHide={() => setShow({show: false, id: null, name: null})}>
            <Modal.Header>
                <Modal.Title>{t("Attention - deletion")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {t("Are you certain to remove")} {delName}?
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
                        variant="outline-danger"
                        onClick={() => {
                            setDelete(true);
                        }}
                    >
                        {t("Delete")}
                    </Button>
                </Row>
            </Modal.Footer>
        </Modal>
    );
};

export default DelWarningModal;