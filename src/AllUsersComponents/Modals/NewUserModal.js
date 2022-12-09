import React, { useState} from 'react';
import {Alert, Button, Col, Container, Form, Modal, Row} from "react-bootstrap";
import useFormInput from "../../common/useFormInput";
import UserService from "../../services/user.service";
import getErrorMessage from "../../common/requestRelated/getErrorMessage";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/bootstrap.css'
import {useTranslation} from "react-i18next";


const NewUserModal = (props) => {

    const { t } =useTranslation();

    // ----- STATES -----
    const [show, setShow] = props.showState;
    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alertMsg, setAlertMsg] = useState({variant: '', msg: ''});

    const [phone, setPhone] = useState('');
    const [passwordValid, setPasswordValid] = useState(true);

    const [userNameValid, setUserNameValid] = useState(true);
    const [userNameFree, setUserNameFree] = useState(true);
    const [userNameErrMsg, setUserNameErrMsg] = useState('');


    const firstNameInput = useFormInput('');
    const lastNameInput = useFormInput('');
    const userNameInput = useFormInput('');
    const passwordInput = useFormInput('');


    // ----- FUNCTIONS -----
    // send request with new user data and process all possibilities
    function handleSubmit(event) {
        event.preventDefault();

        // setPhoneValid(true);
        setPasswordValid(true);
        setUserNameValid(true);
        setUserNameFree(true);

        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            handleError(t("Invalid form"), true)
            event.stopPropagation();
        }
        else {

            setAlertMsg({variant: '', msg: ''});

            if( !validatePhoneNumber(phone)
                || !validateUsername(userNameInput.value)
                || !validatePassword(passwordInput.value)){
                if( !validatePhoneNumber(phone) )
                    handleError(t("Invalid form"))
                if( !validatePassword(passwordInput.value) )
                    setPasswordValid(false);
                if( !validateUsername(userNameInput.value) ){
                    setUserNameErrMsg(t("Too short username"))
                    setUserNameValid(false);
                }
            }

            else {
                setValidated(true);

                const newUser = {
                    username: userNameInput.value,
                    password: passwordInput.value,
                    first_name: firstNameInput.value,
                    last_name: lastNameInput.value,
                    phone: '+' + phone,
                    sms: false
                }
                setLoading(true);
                UserService.postNewUser(newUser)
                    .then((response) => {
                            if(response.status >= 200 && response.status <= 299){
                                if(response.data.msg === "username taken"){
                                    handleTakenUsername();
                                }
                                else {
                                    handleConfirmation(t("User added"));
                                }
                            }
                        },
                        (error) => {
                            handleError(getErrorMessage(error));
                        }
                    );
            }
            }

    }

    function handleTakenUsername(){
        setValidated(false);
        setUserNameErrMsg(t("Username taken"))
        setUserNameFree(false);
        setLoading(false);
    }

    function handleConfirmation(msg){
        setUserNameErrMsg('');
        setAlertMsg({variant: 'success', msg: msg});
        setLoading(false);
        setTimeout(() => {
            handleCloseModal();
            setAlertMsg({variant: '', msg: ''});
        }, 2000);
    }

    function handleError(errorMsg, noTimout=false){
        setAlertMsg({variant: 'danger', msg: errorMsg});
        setLoading(false);
        if(!noTimout){
            setTimeout(() => {
                setAlertMsg({variant: '', msg: ''});
            }, 20000);
        }
    }

    function handleCloseModal(){
        firstNameInput.onChange(null);
        lastNameInput.onChange(null);
        userNameInput.onChange(null);
        passwordInput.onChange(null);
        setPhone('');
        setPasswordValid(true);
        setUserNameValid(true);
        setUserNameFree(true);
        setUserNameErrMsg('');
        setValidated(false);
        setShow(false);
        props.setAnotherRequest(firstNameInput);
    }

    function validateUsername(text){
        return text.length >= 5;
    }

    function validatePassword(text){
        return text.length >= 8;
    }

    function validatePhoneNumber(number) {
        return number.length === 11;
    }

    // ----- RENDER -----
    return (
        <Modal show={show} animation={true} onHide={() => {handleCloseModal()}}
            >
            <Modal.Header closeButton>
                <Modal.Title>{t("New user")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Row>
                        <Form noValidate validated={validated} onSubmit={handleSubmit} >
                            <Form.Label>{t("First name")}</Form.Label>
                            <Form.Control
                                type="text"
                                required
                                maxLength={32}
                                {...firstNameInput}
                            />
                            <Form.Label>{t("Last name")}</Form.Label>
                            <Form.Control
                                type="text"
                                required
                                maxLength={32}
                                {...lastNameInput}
                            />
                            <Row>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control
                                            type="text"
                                            required
                                            maxLength={32}
                                            {...userNameInput}
                                            isInvalid={ !(userNameFree && userNameValid) }
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {userNameErrMsg}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>{t("Password")}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            required
                                            maxLength={128}
                                            {...passwordInput}
                                            isInvalid={!passwordValid}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {t("Too short password")}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
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

                            <div className="d-grid gap-2">
                                <Button variant="primary" type="submit" className="form-button">
                                    {loading ? t("Adding...") : t("Add user")}
                                </Button>
                            </div>
                        </Form>
                    </Row>
                    <Alert
                        style={{margin: "2em 0 1em"}}
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

export default NewUserModal;