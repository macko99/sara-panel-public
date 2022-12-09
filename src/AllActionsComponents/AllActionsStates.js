import React, {useEffect, useState} from 'react';
import UserService from "../services/user.service";
// import EventBus from "../common/EventBus";
import {Container, Row} from "react-bootstrap";
import NewActionModal from "./Modals/NewActionModal";
import ActionUsersModal from "./Modals/ActionUsersModal";
import errorAlert from "../common/requestRelated/errorAlert";
import NewActionList from "./NewActionList";

const AllActionsStates = (props) => {

    // ----- STATES -----
    const [actions, setActions] = useState('');
    const [delAction, setDelAction] = useState('');


    // ----- STATES - MODALS -----
    const [showNewActionModal, setShowNewActionModal] = useState(false);
    const [showActionUsersModal, setShowActionUsersModal] = useState({show: false, action: ''});


    // ----- HOOKS -----
    useEffect( () => {
        setActions(props.actionsData.actions)
    }, [props])


    // DEL action
    useEffect(() => {
        if(delAction) {
            UserService.delAction(delAction)
                .then((response) => {
                        if(response.status >= 200 && response.status <= 299){
                            props.setAnotherRequest(delAction);
                        }
                    },
                    (error) => {errorAlert(error)}
                );
        }
    }, [delAction])


    // ----- RENDER -----
    return (
        <Container>
            <Row>
                {actions &&
                    <NewActionList
                        actions={actions}
                        setActionUsersModal={setShowActionUsersModal}
                        setDelAction={setDelAction}
                        setShowNewActionModal={setShowNewActionModal}
                    />
                }
            </Row>
            <NewActionModal
                setAnotherRequest={props.setAnotherRequest}
                showState={[showNewActionModal, setShowNewActionModal]}
            />
            <ActionUsersModal
                showActionUsersModalState={[showActionUsersModal, setShowActionUsersModal]}
            />
        </Container>
    );
};

export default AllActionsStates;