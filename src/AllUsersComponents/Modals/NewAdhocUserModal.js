import React, {useState} from 'react';
import {Alert, Button, Col, Container, Form, Modal, Row} from "react-bootstrap";
import UserService from "../../services/user.service";
import getErrorMessage from "../../common/requestRelated/getErrorMessage";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/bootstrap.css'
import {t} from "i18next";

const NewAdhocUserModal = (props) => {

    const smsService = process.env.REACT_APP_SMS_SERVICE==='true';

    // ----- STATES -----
    const [show, setShow] = props.showState;
    const [loading, setLoading] = useState(false);
    const [alertMsg, setAlertMsg] = useState({variant: '', msg: ''});
    const [validated, setValidated] = useState(false);

    // const phoneInput = useFormInput('');
    const [phone, setPhone] = useState('');

    const [sendSMS, setSendSMS] = useState(false);

    // ----- FUNCTIONS -----
    function handleSubmit(event) {
        event.preventDefault();

        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            handleError(t("Invalid form"));
            event.stopPropagation();
        }
        else {
            setAlertMsg({variant: '', msg: ''});

            if (!validatePhoneNumber(phone)) {
                    handleError(t("Invalid form"))
            }
            else {
                setValidated(true);
                setLoading(true);

                const phoneNumber = '+' + phone;
                UserService.postNewAdhocUser({phone: phoneNumber})
                    .then((response) => {
                            if (response.status >= 200 && response.status <= 299) {
                                const code = response.data.invitaion_code;
                                const smsData = {
                                    number_with_prefix: phoneNumber,
                                    login_code: code
                                }
                                if ((code && sendSMS) && smsService) {
                                    setLoading(true);
                                    UserService.postSMSinvite(smsData)
                                        .then((response) => {
                                                if (response.status >= 200 && response.status <= 299) {
                                                    handleConfirmation(t("Sent successfully"));
                                                }
                                            },
                                            (error) => {
                                                handleError(getErrorMessage(error))
                                            }
                                        );
                                    setSendSMS(false);
                                } else {
                                    handleConfirmation(t("One-time user added"))
                                }
                            }
                        },
                        (error) => {
                            handleError(getErrorMessage(error))
                        }
                    );
            }
        }
    }


    function handleConfirmation(msg){
        setAlertMsg({variant: 'success', msg: msg});
        setLoading(false);
        setTimeout(() => {
            handleCloseModal();
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

    function handleCloseModal(){
        setValidated(false);
        setShow(false);
        setPhone('');
        props.setAnotherRequest(phone);
    }

    function validatePhoneNumber(number) {
        return number.length === 11;
    }

    return (
        <Modal show={show} animation={true} onHide={() => {handleCloseModal()}}>
            <Modal.Header closeButton>
                <Modal.Title>{t("New one-time user")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Row>
                        <Form noValidate validated={validated} onSubmit={handleSubmit} >
                            <Form.Label>{t("Phone")}</Form.Label>
                            <Row>
                                <PhoneInput
                                    containerStyle={{height: '2rem', width: '100%'}}
                                    inputStyle={{height: '2rem', width: '100%'}}
                                    buttonStyle={{height: '2.4rem'}}
                                    country={'pl'}
                                    value={phone}
                                    defaultErrorMessage={t("Too short phone number")}
                                    isValid={(value, country) => { return value.length === 11}}
                                    onChange={phone => { setPhone(phone)}}
                                />
                            </Row>
                            <Row style={{margin: "2em -14px 1em"}}>
                                <Col>
                                    <div className="d-grid gap-2">
                                        <Button variant="info" type="submit">
                                            {t("Add user")}
                                        </Button>
                                    </div>
                                </Col>
                                <Col>
                                    <div className="d-grid gap-2">
                                        <Button
                                            variant={smsService ? "primary" : "secondary"}
                                            disabled={!smsService}
                                            type="submit"
                                            onClick={() => setSendSMS(true)}
                                        >
                                            {loading ? t("Sending...") : t("Add user and send code")}
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
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

export default NewAdhocUserModal;