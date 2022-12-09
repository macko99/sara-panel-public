import React, {useEffect, useState} from 'react';
import {Col, Container, Modal, Row} from "react-bootstrap";
import UserService from "../../services/user.service";
import errorAlert from "../../common/requestRelated/errorAlert";
import getUsersInArea from "./utils/getUsersInArea";
import getUsersNotInArea from "./utils/getUsersNotInArea";
import MySpinner from "../../common/MySpinner";
import requestBasicGet from "../../services/getRequestBasic";
import NewAreaChooseUsersList from "../ListComponents/NewAreaChooseUsersList";
import {useTranslation} from "react-i18next";

const AreaUsersModal = (props) => {

    const area = props.showAreaUsersState[0].area;
    const { t } = useTranslation();

    // ----- STATES -----
    const [showAreaUsersModal, setShowActionUsersModal] = props.showAreaUsersState;

    const [loading, setLoading] = useState(true);
    const [updateListRequest, setUpdateListRequest] = useState('');


    // all users
    const [allUsersData, setAllUsersData] = useState([]);
    // users fetched from server before filtering
    const [usersInAction, setUsersInAction] = useState([]);
    const [usersInAreaTemp, setUsersInAreaTemp] = useState([]);
    // lists of users in this area and others in action
    const [usersInThisArea, setUsersInThisArea] = useState([]);
    const [usersNotInThisArea, setUsersNotInThisArea] = useState([]);

    // user to be added to this area
    const [addedUser, setAddedUser] = useState('');
    // user to be removed from this area
    const [removedUser, setRemovedUser] = useState('');


    // ----- HOOKS -----
    // set props once loaded
    useEffect(() => {
        setAllUsersData(props.allUsersData);
    }, [props])

    // get USERS IN AREA data
    useEffect(() => {
        if(showAreaUsersModal.show && area.area_id)
            requestBasicGet(UserService.getUsersInArea, setUsersInAreaTemp, area.area_id, 'users');
    }, [props, updateListRequest])

    // get USERS IN ACTION data
    useEffect(() => {
        if(showAreaUsersModal.show)
            requestBasicGet(UserService.getUsersInOneAction, setUsersInAction, props.actionID, 'users');
    }, [props, updateListRequest])


    // update the lists after fetch from server and stop loading
    useEffect(() => {

            setUsersInThisArea(getUsersInArea(usersInAreaTemp, allUsersData));
            setUsersNotInThisArea(getUsersNotInArea(usersInAreaTemp, allUsersData, usersInAction))
            setLoading(false);
    }, [usersInAreaTemp, usersInAction])

    // POST add user to area
    useEffect(() => {
        if (addedUser) {
            const addedUserData = {
                user: addedUser.id,
                area: area.area_id
            }
            UserService.postAddUserToArea(addedUserData)
                .then((response) => {
                        if(response.status >= 200 && response.status <= 299){
                            setUpdateListRequest(addedUserData);
                            setAddedUser('');
                        }},
                    (error) => {errorAlert(error)}
                );
        }
    }, [addedUser])

    // DEL remove user from area
    useEffect(() => {
        if (removedUser) {
            const removedUserData = {
                user: removedUser.id,
                area: area.area_id
            }
            UserService.delUserFromArea(removedUserData)
                .then((response) => {
                        if(response.status >= 200 && response.status <= 299){
                            setUpdateListRequest(removedUserData);
                            setRemovedUser('');
                        }},
                    (error) => {errorAlert(error)}
                );
        }
    }, [removedUser])


    // ----- RENDER -----
    return (
        <Modal show={showAreaUsersModal.show} size="xl"
               onHide={() => {setShowActionUsersModal({ ...showAreaUsersModal, show: false})}}>
            <Modal.Header closeButton>
                <Modal.Title>{t("Area")} {area.area_id} - {area.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    {loading && <MySpinner />}
                    {!loading &&
                    <Row>
                        <Col md={6}>
                            <NewAreaChooseUsersList
                                users={usersNotInThisArea}
                                title={t("Other users in action")}
                                inArea={false}
                                setUserChange={setAddedUser}
                            />
                        </Col>
                        <Col md={6}>
                            <NewAreaChooseUsersList
                                users={usersInThisArea}
                                title={t("Users in area")}
                                inArea={true}
                                setUserChange={setRemovedUser}
                            />
                        </Col>
                    </Row>
                    }
                </Container>
            </Modal.Body>
        </Modal>
    );
};

export default AreaUsersModal;