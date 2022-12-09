import React, {useEffect, useState} from 'react';
import {Alert, Button, Col, Container, Form, Modal, Row} from "react-bootstrap";
import useFormInput from "../useFormInput";
import UserService from "../../services/user.service"
import getErrorMessage from "../requestRelated/getErrorMessage";
import {useTranslation} from "react-i18next";


const SendNotifyModal = (props) => {

    const { t } = useTranslation();

    const show = props.notifyModal.show;
    const type = props.notifyModal.type;
    const id = props.notifyModal.id;

    const maxMsgLen = 128;

    // ----- STATES -----
    const messageInput = useFormInput("");
    const [title, setTitle] = useState('');

    const [loading, setLoading] = useState(false);
    const [alertMsg, setAlertMsg] = useState({variant: '', msg: ''});

    // ----- HOOKS -----
    useEffect(() => {
        if(show){
            if(type === "all")
                setTitle(t("all registered users"));
            if(type === "user")
                setTitle(t("User") + ' ' +id);
            if(type === "action")
                setTitle(t("every user in action") + ' ' + id)
            if(type === 'area')
                setTitle(t("every user in area") + ' '+ id)
        }
    }, [props])


    // ----- FUNCTIONS -----
    function handleSubmit(event) {
        event.preventDefault();
        const urlEnd = id ? type+'/'+id : type;
        UserService.postSendNotify({msg: messageInput.value}, urlEnd)
            .then((response) => {
                    if(response.status >= 200 && response.status <= 299){
                        handleConfirmation(t("Sent successfully"));
                    }
                },
                (error) => {handleError(getErrorMessage(error))}
            );
    }

    function handleConfirmation(msg){
        setAlertMsg({variant: 'success', msg: msg});
        setLoading(false);
        setTimeout(() => {
            handleClose();
            setAlertMsg({variant: '', msg: ''});
        }, 2000);
    }

    function handleError(errorMsg){
        setAlertMsg({variant: 'danger', msg: errorMsg});
        setLoading(false);
        setTimeout(() => {
            setAlertMsg({variant: '', msg: ''});
        }, 20000);
    }

    function handleClose() {
        props.setNotifyModal({show: false, type: null, id: null})
        messageInput.onChange(null);
    }

    // ----- RENDER -----
    return (
        <Modal show={show}  onHide={() => {handleClose()}}>
            <Modal.Header closeButton>
                <Modal.Title>{t("To")} {title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Row>
                        <Form onSubmit={handleSubmit} >
                                <Row>
                                    <Col>
                                        <Form.Label>{t("Message")}</Form.Label>
                                    </Col>
                                    <Col style={{textAlign: 'right'}}>
                                        <Form.Label>{messageInput.value.length}/{maxMsgLen}</Form.Label>
                                    </Col>
                                </Row>
                                <Form.Control
                                    as="textarea"
                                    type="text"
                                    required
                                    style={{height: "88px"}}
                                    maxLength={maxMsgLen}
                                    {...messageInput}
                                />
                            <div className="d-grid gap-2">
                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="form-button"
                                    style={{margin: "2em 0 1em"}}
                                >
                                    {loading ? t("Sending...") : t("Send")}
                                </Button>
                            </div>
                        </Form>
                    </Row>
                    <Alert
                        style={{margin: "1em 0 1em"}}
                        variant={alertMsg.variant}
                        show={!!alertMsg.msg}
                    >
                        {alertMsg.msg}
                    </Alert>
                </Container>
            </Modal.Body>
        </Modal>
    );
};

export default SendNotifyModal;