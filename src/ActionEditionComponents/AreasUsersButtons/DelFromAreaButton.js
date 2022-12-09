import React from 'react';
import {BsFillPersonXFill} from "react-icons/bs";
import {Button, Col, OverlayTrigger, Popover, Row} from "react-bootstrap";
import {t} from "i18next";

const DelFromActionButton = (props) => {


    return (
        <OverlayTrigger
            trigger="focus"
            placement="left"
            overlay={
                <Popover  placement="right">
                    <Popover.Header as="h5">{t("Delete user from area")}?</Popover.Header>
                    <Popover.Body>
                        <Row>
                            <Col className="align-ctr">
                                <Button
                                    variant="outline-secondary"
                                    className="small-font"
                                >
                                    {t("Cancel")}
                                </Button>
                            </Col>
                            <Col className="align-ctr">
                                <Button
                                    variant="outline-danger"
                                    className="small-font"
                                    onClick={() => props.setDelUser(props.user)}
                                >
                                    {t("Delete")}
                                </Button>
                            </Col>
                        </Row>
                    </Popover.Body>
                </Popover>
            }
        >
            <Button
                className="small-font"
                variant="outline-danger"
            >
                <BsFillPersonXFill />
            </Button>
        </OverlayTrigger>

    );
};

export default DelFromActionButton;