import React, {useState} from 'react';
import {Alert, Button, Col, Form, Modal, ModalBody, OverlayTrigger, Row, Tooltip} from "react-bootstrap";
import CenterActionMap from "../CenterActionMap";
import {DateTimePickerComponent} from "@syncfusion/ej2-react-calendars";
import useFormInput from "../../common/useFormInput";
import UserService from "../../services/user.service";
import getErrorMessage from "../../common/requestRelated/getErrorMessage";
import {useTranslation} from "react-i18next";

const NewActionModal = (props) => {

    const {t} = useTranslation();

    // ----- STATES -----
    const [show, setShow] = props.showState;
    const [loading, setLoading] = useState(false);
    const [alertMsg, setAlertMsg] = useState({variant: '', msg: ''});

    const [actionCenter, setActionCenter] = useState(null);

    const nameInput = useFormInput("");
    const descriptionInput = useFormInput("");
    const radiusInput = useFormInput("");

    const [dateTime, setDateTime] = useState(new Date());


    // ----- FUNCTIONS -----
    const handleDateTimeChange = (newDateTime) => {
        setDateTime(newDateTime);
    }

    // POST add new action
    function handleSubmit(event) {
        event.preventDefault();

        const action = {
            name: nameInput.value,
            description: descriptionInput.value,
            radius: radiusInput.value,
            start_time: Date.parse(String(dateTime))/1000,
            ...actionCenter
        }

        setLoading(true);
        UserService.postNewAction(action)
            .then((response) => {
                    if(response.status >= 200 && response.status <= 299){
                        handleConfirmation(t("Action added"));
                        props.setAnotherRequest(action);
                    }
                },
                (error) => {handleError(getErrorMessage(error))}
            );
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
        setActionCenter(null);
        nameInput.onChange(null);
        descriptionInput.onChange(null);
        radiusInput.onChange(null);
        setShow(false);
    }


    return (
        <Modal show={show} animation={true} size="xl" onHide={() => setShow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>{t("New action")}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit} >
            <ModalBody>
                <Row>
                    <Col>
                            <Form.Label>{t("Name")}</Form.Label>
                            <Form.Control
                                type="text"
                                required
                                maxLength={64}
                                {...nameInput}
                            />
                            <Form.Label>{t("Description")}</Form.Label>
                            <Form.Control
                                as="textarea"
                                style={{height: "140px"}}
                                required
                                maxLength={256}
                                {...descriptionInput}
                            />
                            <Row>
                                <Col md={9}>
                                    <Form.Label>{t("Start time and date")}</Form.Label>
                                    <DateTimePickerComponent
                                        id="datetimepicker"
                                        value={dateTime}
                                        onChange={(e) => handleDateTimeChange(e.target.value)}
                                    />
                                </Col>
                                <Col md={3}>
                                    <OverlayTrigger
                                        placement='bottom'
                                        overlay={<Tooltip>{t("Action radius")} <br/> {t("from 100m to 20 000m")}</Tooltip>}>
                                        <Form.Label>{t("Radius [m]")}</Form.Label>
                                    </OverlayTrigger>
                                    <Form.Control
                                        type={'number'}
                                        step={'10'} min={100} max={20000}
                                        required
                                        {...radiusInput}
                                    />
                                </Col>
                            </Row>
                    </Col>
                    <Col>
                        <Form.Label>{t("Select action center with right mouse click")}</Form.Label>
                        <CenterActionMap
                            setActionCenter={setActionCenter}
                        />
                    </Col>
                </Row>
            </ModalBody>
            <Modal.Footer>
                <Row className="d-flex justify-content-center">
                    <OverlayTrigger
                        placement='bottom'
                        overlay={<Tooltip>{t("Insert data and choose action centre")}</Tooltip>}>
                        <span>
                        <Button
                            style={{width: "1080px"}}
                            type="submit"
                            variant= {actionCenter ? "primary" : "outline-secondary"}
                            disabled={!actionCenter}
                        >
                            {loading ? t("Loading...") : t("Add action")}
                        </Button>
                        </span>
                    </OverlayTrigger>

                </Row>
            </Modal.Footer>
            </Form>
            <Alert
                style={{margin: "1em 12px 1em"}}
                variant={alertMsg.variant}
                show={!!alertMsg.msg}
            >
                {alertMsg.msg}
            </Alert>
        </Modal>
    );
};

export default NewActionModal;