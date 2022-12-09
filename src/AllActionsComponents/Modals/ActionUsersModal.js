import React, {useEffect, useState} from 'react';
import {Button, Col, Container, Modal, Row} from "react-bootstrap";
import UserService from "../../services/user.service";
import ChooseActionUsersList from "../ChooseActionUsersList";
import MySpinner from "../../common/MySpinner";
import getUsersInAction from "../utils/getUsersInAction";
import errorAlert from "../../common/requestRelated/errorAlert";
import {Link} from "react-router-dom";
import requestBasicGet from "../../services/getRequestBasic";
import {useTranslation} from "react-i18next";


const ActionUsersModal = (props) => {

    const {t} = useTranslation();
    const action = props.showActionUsersModalState[0].action;

    // ----- STATES -----
    const [loading, setLoading] = useState(true);
    const [anotherRequest, setAnotherRequest] = useState('');

    const [showActionUsersModal, setShowActionUsersModal] = props.showActionUsersModalState;

    // lists of users in this action and other
    const [usersData, setUsersData] = useState([]);
    const [usersInAction, setUsersInAction] = useState([]);
    const [usersNotInAction, setUsersNotInAction] = useState([]);

    // user to be added to this action
    const [addedUser, setAddedUser] = useState('');
    // user to be removed from this action
    const [removedUser, setRemovedUser] = useState('');

    // ----- HOOKS -----

    // GET users data
    useEffect(() => {
        requestBasicGet(UserService.getAllUsers, setUsersData, '', 'users');
    }, [])

    // GET users in this action
    useEffect(() => {
        if(showActionUsersModal.show){
            UserService.getUsersInOneAction(action.id)
                .then(response => {
                        if(response.status >= 200 && response.status <= 299){
                            setUsersInAction(getUsersInAction(response.data.users, usersData, true));
                            setUsersNotInAction(getUsersInAction(response.data.users, usersData, false))
                            setLoading(false);
                        }
                    },
                    (error) => {errorAlert(error)}
                )
        }
    },[props, anotherRequest])


    // POST add user to action
    useEffect(() => {
        if (addedUser) {
            const addedUserData = {
                user: addedUser.id,
                action: action.id
            }
            UserService.postAddUserToAction(addedUserData)
                .then((response) => {
                    if(response.status >= 200 && response.status <= 299){
                        setAnotherRequest(addedUserData);
                        setAddedUser('');
                    }},
                    (error) => {errorAlert(error)}
                );
        }
    }, [addedUser])

    // DEL remove user from action
    useEffect(() => {
        if (removedUser) {
            const removedUserData = {
                user: removedUser.id,
                action: action.id
            }
            UserService.delUserFromAction(removedUserData)
                .then((response) => {
                        if(response.status >= 200 && response.status <= 299){
                            setAnotherRequest(removedUserData);
                            setRemovedUser('');
                        }},
                    (error) => {errorAlert(error)}
                );
        }
    }, [removedUser])


    // stop loading once data is loaded
    useEffect(() => {
        const actionData = [usersData, usersInAction, usersNotInAction]
        setLoading(actionData.map(data => {return !!data}).includes(false));

    },[usersData, usersInAction, usersNotInAction])

    // ----- RENDER -----
    return (
        <Modal show={showActionUsersModal.show} size="xl"
               onHide={() => {setShowActionUsersModal({...showActionUsersModal, show: false})}}>
            <Modal.Header closeButton>
                <Modal.Title>{t("Action")} {action.id} - {action.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    {loading && <MySpinner />}
                    {!loading &&
                    <Row>
                        <Col md={6}>
                            <ChooseActionUsersList
                                users={usersNotInAction}
                                inAction={false}
                                setUserChange={setAddedUser}
                            />
                        </Col>
                        <Col md={6}>
                            <ChooseActionUsersList
                                users={usersInAction}
                                inAction={true}
                                setUserChange={setRemovedUser}
                            />
                        </Col>
                    </Row>}
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Link to={`/action-edition/${action.id}`}>
                    <Button variant="outline-primary">
                        {t("Go to action")}
                    </Button>
                </Link>
            </Modal.Footer>
        </Modal>
    );
};

export default ActionUsersModal;