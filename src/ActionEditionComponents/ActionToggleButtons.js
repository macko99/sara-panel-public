import React, {useEffect, useState} from 'react';
import {Button, Col, OverlayTrigger, Row, Tooltip} from "react-bootstrap";
import ToggleWarningModal from "./Modals/ToggleWarningModal";
import {BsEnvelopeOpenFill} from "react-icons/bs";
import {useTranslation} from "react-i18next";

const ActionToggleButtons = (props) => {


    const { t } = useTranslation();
    const active = props.active;
    const actionID = props.actionID;

    const [showToggleModal, setShowToggleModal] = useState({show: false, id: null, name: null});
    const [toggle, setToggle] = useState(null);


    // ----- HOOKS -----
    // toggle action decision
    useEffect(() => {
        if(toggle){
            props.setIsActionActive( !showToggleModal.name) // here it's true or false
            props.setStartUpdatePathsRequest(!showToggleModal.name);
            setShowToggleModal({show: false, id: null, name: null})
            setToggle(false);
        }
    }, [toggle])

    // ----- FUNCTIONS -----
    const handleActiveToggle = () => {
        setShowToggleModal({show: true, id: actionID, name: active})
    }


    // ----- RENDER -----
    return (
        [<Row key={3}
            className="action-toggle-row"
        >
            <Col md={8} key={1.1} >
                <div  className="d-grid gap-2 button-toggle">
                    {!active
                        ?
                        <OverlayTrigger
                            placement='top'
                            overlay={<Tooltip>{t("Start action")}</Tooltip>}>
                            <Button size="sm" variant="success" onClick={handleActiveToggle}>
                                {t("Start")}
                            </Button>
                        </OverlayTrigger>
                        :
                        <OverlayTrigger
                            placement='top'
                            overlay={<Tooltip>{t("Finish action")}</Tooltip>}>
                            <Button size="sm" variant="danger" onClick={handleActiveToggle}>
                                {t("Finish")}
                            </Button>
                        </OverlayTrigger>
                    }
                </div>
            </Col>
            <Col md={4} className="d-grid gap-2" key={1.3}>
                <OverlayTrigger
                    placement='top'
                    overlay={<Tooltip>{t("Send push notification to all users in this action")}</Tooltip>}>
                    <Button
                        variant="warning"
                        size="sm"
                        onClick={() =>
                            props.setNotifyModal({show: true, type: 'action', id: actionID})
                        }
                    >
                        <BsEnvelopeOpenFill fontSize="1.2em"/>
                    </Button>
                </OverlayTrigger>
            </Col>
        </Row>
            ,
            <ToggleWarningModal
                key={2}
                show={showToggleModal.show}
                setShow={setShowToggleModal}
                toggleName={showToggleModal.name}
                actionID={showToggleModal.id}
                setToggle={setToggle}
            />
        ]
    );
};

export default ActionToggleButtons;