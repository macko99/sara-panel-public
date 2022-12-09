import React, {useEffect, useState} from 'react';
import {Container, Row} from "react-bootstrap";
import NewUserModal from "./Modals/NewUserModal";
import UserService from "../services/user.service";
import errorAlert from "../common/requestRelated/errorAlert";
import NewAdhocUserModal from "./Modals/NewAdhocUserModal";
import NewUserList from "./NewUserList";
import SendNotifyModal from "../common/Notifications/SendNotifyModal";
import i18n from "i18next";

const AllUsersStates = (props) => {

    // ----- STATES -----
    // users data
    const [users, setUsers] = useState('');

    // delete user
    const [delUser, setDelUser] = useState('');

    // codes for users in usersList
    const [codesList, setCodesList] =  useState({codes: [], lng: i18n.language });

    // ----- STATES - MODALS -----
    const [showNewUserModal, setShowNewUserModal] = useState(false);
    const [showNewAdhocUserModal, setShowNewAdhocUserModal] = useState(false);
    const [notifyModal, setNotifyModal] = useState({show: false, type: null, id: null});
    

    // ----- HOOKS -----
    useEffect(() => {
        setUsers(props.users);
    },[props])

    // DEL user
    useEffect(() => {
        if(delUser){
            UserService.delUser(delUser.userID)
                .then((response) => {
                        if(response.status >= 200 && response.status <= 299){
                            props.setUsersDataRequest(delUser);
                        }
                    },
                    (error) => {errorAlert(error)}
                );
        }
    }, [delUser])

    return (
        [
            <Container key={1}>
                <Row>
                    <NewUserList
                        users={users}
                        setDelUser={setDelUser}
                        setAnotherRequest={props.setUsersDataRequest}
                        setShowNewUserModal={setShowNewUserModal}
                        setShowNewAdhocUserModal={setShowNewAdhocUserModal}
                        codesList={codesList}
                        setCodesList={setCodesList}
                        setNotifyModal={setNotifyModal}
                    />
                </Row>
                <NewUserModal
                    setAnotherRequest={props.setUsersDataRequest}
                    showState={[showNewUserModal, setShowNewUserModal]}
                />
                <NewAdhocUserModal
                    setAnotherRequest={props.setUsersDataRequest}
                    showState={[showNewAdhocUserModal, setShowNewAdhocUserModal]}
                />
            </Container>,
            <SendNotifyModal
                key={9}
                notifyModal={notifyModal}
                setNotifyModal={setNotifyModal}
            />
        ]
    );
};

export default AllUsersStates;