import React, {useEffect, useRef, useState} from 'react';
import AreasMap from "./MapComponents/AreasMap";
import AreasList from "./ListComponents/AreasList";
import UserService from "../services/user.service";
import {Col, Container, Row} from "react-bootstrap";
import ActionToggleButtons from "./ActionToggleButtons";
import MySpinner from "../common/MySpinner";
import ActionMapButtons from "./ActionMapButtons";
import NotificationsContainer from "../common/Notifications/NotificationsContainer";
import AreaUsersModal from "./Modals/AreaUsersModal";
import addInfoToast from "../common/Notifications/addInfoToast";
import handleErrorWithNotification from "../common/Notifications/handleErrorWithNotification";
import NewAreaModal from "./Modals/NewAreaModal";
import MapTitle from "./MapTitle";
import DrawAreaButton from "./DrawAreaButton";
import ResourceDetailsModal from "./Modals/ResourceDetailsModal";
import SendNotifyModal from "../common/Notifications/SendNotifyModal";
import {useTranslation} from "react-i18next";


const ActionEditionStates = (props) => {

    const { t } = useTranslation();
    const actionID = props.id;

    // ----- STATES -----
    // action status
    const [isActionActive, setIsActionActive] = useState(false);
    // action areas
    const [actionAreas, setActionAreas] = useState('');
    // new area empty state (to be passed to LC)
    const [newArea, setNewArea] = useState('');
    // deleted area
    const [delArea, setDelArea] = useState('');
    // action details - here mainly action center
    const [actionDetails, setActionDetails] = useState('');
    // users' details
    const [usersData, setUsersData] = useState('');
    // notifications
    const [notificationsList, setNotificationsList] = useState([]);


    // ----- STATES - MODALS -----
    const [showAreaUsersModal, setShowAreaUsersModal] = useState({show: false, area: ''});
    const [showNewAreaModal, setShowNewAreaModal] = useState({show: false, areaName: '', coordinates: []});
    const [showResourceDetailsModal, setShowResourceDetailsModal] = useState({show: false, point: null, user: null});
    const [notifyModal, setNotifyModal] = useState({show: false, type: null, id: null});


    // map layers toggle
    const [showAreas, setShowAreas] = useState(true);
    const [hideSelectedArea, setHideSelectedArea] = useState({area_id: -1, hide: false});
    const [hiddenAreas, setHiddenAreas] = props.hiddenAreasState;
    const [showPaths, setShowPaths] = useState(true);
    const [hiddenPaths, setHiddenPaths] = props.hiddenPathsState;
    const [hideSelectedPath, setHideSelectedPath] = useState({userID: -1, hide: false});
    const [showResources, setShowResources] = useState(true);
    const [hiddenResources, setHiddenResources] = props.hiddenResourcesState;
    const [hideSelectedResource, setHideSelectedResource] = useState({userID: -1, hide: false});

    // drawing tool for areas
    const [showDrawingManager, setShowDrawingManager] = useState(false);

    // ----- REFS -----
    const notificationID = useRef(0);

    // render counter
    const renderCount = useRef(-2);
    useEffect(() => {
        renderCount.current = renderCount.current + 1;
        // console.log("render no:", renderCount.current);
    })

    // ----- HOOKS -----

    // set props once loaded
    useEffect(() => {
        setActionAreas(props.actionAreas.areas);
        setActionDetails(props.actionDetails[actionID]);
        setIsActionActive(props.actionDetails[actionID].is_active)
        setUsersData(props.usersData);
        props.setStartUpdatePathsRequest(props.actionDetails[actionID].is_active)
    }, [props])


    // update shown areas
    useEffect(() => {
        if(renderCount.current > 0){
            if(hideSelectedArea.hide){
                setHiddenAreas(hiddenAreas.concat([hideSelectedArea.area_id]));
            } else {
                setHiddenAreas(hiddenAreas.filter(id => id !== hideSelectedArea.area_id));
            }
        }
    }, [hideSelectedArea])

    // update shown paths
    useEffect(() => {
        if(renderCount.current > 0){
            if(hideSelectedPath.hide){
                setHiddenPaths(hiddenPaths.concat([hideSelectedPath.userID]));
            } else {
                setHiddenPaths(hiddenPaths.filter(id => id !== hideSelectedPath.userID));
            }
        }
    }, [hideSelectedPath])

    // update shown resources
    useEffect(() => {
        if(renderCount.current > 0){
            if(hideSelectedResource.hide){
                setHiddenResources(hiddenResources.concat([hideSelectedResource.userID]));
            } else {
                setHiddenResources(hiddenResources.filter(id => id !== hideSelectedResource.userID));
            }
        }
    }, [hideSelectedResource])

    // POST add new area to action
    useEffect(() => {
        if(renderCount.current > 0 && newArea){
            UserService.postNewArea(newArea, actionID)
                .then((response) => {
                        if(response.status >= 200 && response.status <= 299){
                            // setNewArea to force rerender in HC
                            props.setAreaRequest(newArea);
                            // notify
                            const title = t("Success: area added")
                            const content = t("Area") + newArea.name;
                            addInfoToast(title, content, notificationID.current++, notificationsList, setNotificationsList)
                        }
                },
                (error) => { handleErrorWithNotification(error, notificationID.current++, notificationsList, setNotificationsList)}
            );
        }
    }, [newArea])

    // DEL delete area
    useEffect(() => {
        if(renderCount && delArea){
            UserService.delActionArea(delArea.areaID)
                .then((response) => {
                    if(response.status >= 200 && response.status <= 299){
                        props.setAreaRequest(delArea);
                        setHideSelectedArea({area_id: delArea.areaID, hide: false})

                        const title = t("Success: area deleted") ;
                        const content =  t("Area") + delArea.areaID + ', ' + delArea.name;
                        addInfoToast(title, content, notificationID.current++, notificationsList, setNotificationsList)
                    }
                },
                /// handle error
                (error) => { handleErrorWithNotification(error, notificationID.current++, notificationsList, setNotificationsList)}
            );
        }
    }, [delArea])

    // PATCH toggle action
    useEffect(() => {
        if (renderCount.current > 0)
        {
            const newActionToggle = {
                action: actionID,
                is_active: isActionActive
            }
            UserService.patchActionToggle(newActionToggle)
                .then((response) => {
                        if(response.status >= 200 && response.status <= 299){
                            props.setDetailsRequest(newActionToggle)
                            const title =  t("Success: action status changed");
                            const content = isActionActive ? t("Action started") : t("Action finished");
                            addInfoToast(title, content, notificationID.current++, notificationsList, setNotificationsList)
                        }
                    },
                    (error) => { handleErrorWithNotification(error, notificationID.current++, notificationsList, setNotificationsList)}
                );
        }
    }, [isActionActive])


    // ----- RENDER -----
    // show map only when action details are loaded
    if( !actionDetails )
        return <MySpinner />


    if(actionAreas && actionDetails)
        return (
            [
            <Container key={1} className="action-edition-container">
                <Row style={{height: '100%'}}>
                    <Col className="grid-basic-map" md={8} xxl={9}>
                        {(props.actionPaths && props.actionResources) &&
                            <AreasMap
                                actionAreas={actionAreas}
                                actionPaths={props.actionPaths}
                                actionResources={props.actionResources.resources}
                                usersData={usersData}
                                actionDetails={actionDetails}
                                actionID={actionID}
                                showNewAreaModal={[showNewAreaModal, setShowNewAreaModal]}
                                showAreas={showAreas}
                                showPaths={showPaths}
                                showResources={showResources}
                                renderCount={renderCount}
                                areasToHide={hiddenAreas}
                                pathsToHide={hiddenPaths}
                                resourcesToHide={hiddenResources}
                                showDrawingManager={showDrawingManager}
                                setShowResourceDetailsModal={setShowResourceDetailsModal}
                            />
                        }
                    </Col>
                    <Col className="" md={4} xxl={3} >
                        <Row className="row-box" style={{padding: "10px 2.5% 0"}}>
                            <MapTitle
                                actionDetails={actionDetails}
                                id={actionID}
                            />
                            <DrawAreaButton
                                showDrawingManager={showDrawingManager}
                                setShowDrawingManager={setShowDrawingManager}
                            />
                            <ActionMapButtons
                                className="map-toggle"
                                showAreasState={[showAreas, setShowAreas]}
                                showResourcesState={[showResources, setShowResources]}
                                showPathsState={[showPaths, setShowPaths]}
                            />
                        </Row>
                        <Row className="row-box">
                            <AreasList
                                actionAreas={actionAreas}
                                setShowAreaEditionModal={setShowAreaUsersModal}
                                setDelArea={setDelArea}
                                setHideSelectedArea={setHideSelectedArea}
                                areasToHide={hiddenAreas}
                                setHideSelectedPath={setHideSelectedPath}
                                pathsToHide={hiddenPaths}
                                setHideSelectedResource={setHideSelectedResource}
                                resourcesToHide={hiddenResources}
                                usersData={usersData}
                                setNotifyModal={setNotifyModal}
                            />
                        </Row >
                        <Row className="row-box fixed-bottom" >
                            <Col md={8} xxl={9}/>
                            <Col md={4} xxl={3} style={{padding: "0 2% 15px 6px"}}>
                                <ActionToggleButtons
                                    active={isActionActive}
                                    setIsActionActive={setIsActionActive}
                                    actionID={actionID}
                                    setStartUpdatePathsRequest={props.setStartUpdatePathsRequest}
                                    setNotifyModal={setNotifyModal}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <AreaUsersModal
                    showAreaUsersState={[showAreaUsersModal, setShowAreaUsersModal]}
                    allUsersData={usersData}
                    actionID={actionID}
                />
                <NewAreaModal
                    setNewArea={setNewArea}
                    showNewAreaModalState={[showNewAreaModal, setShowNewAreaModal]}
                />
                <ResourceDetailsModal
                    showResourceDetailsModal={showResourceDetailsModal}
                    setShowResourceDetailsModal={setShowResourceDetailsModal}
                />
                <NotificationsContainer notificationsList={notificationsList}/>
            </Container>,
            <SendNotifyModal
                key={9}
                notifyModal={notifyModal}
                setNotifyModal={setNotifyModal}
            />
            ]
        );
};

export default ActionEditionStates;