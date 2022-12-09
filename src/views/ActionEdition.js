import React, {useEffect, useState} from 'react';
import UserService from "../services/user.service";
import ActionEditionStates from "../ActionEditionComponents/ActionEditionStates";
import MySpinner from "../common/MySpinner";
import ServerResponseErrorModal from "../ActionEditionComponents/Modals/ServerResponseErrorModal";
import requestBasicGet from "../services/getRequestBasic";
import {useIndexedDB} from "react-indexed-db";
import errorAlert from "../common/requestRelated/errorAlert";

const PATHS_FROM_SERVER_INTERVAL = 60


const ActionEdition = ({match}) => {

    const actionID = match.params.id;

    // indexedDB.open('ResourcesDB');
    // access the IndexedDB
    const {add, update, getByIndex} = useIndexedDB("actionLocations")


    // ----- STATES -----
    // fetch handling
    const [loading, setLoading] = useState(true);

    // fetched data: areas, details, paths, resources
    const [actionAreas, setActionAreas] = useState("");
    const [actionDetails, setActionDetails] = useState("");
    const [actionPaths, setActionPaths] = useState("");
    const [newActionPaths, setNewActionPaths] = useState("");
    const [actionResources, setActionResources] = useState("");
    const [usersData, setUsersData] = useState("");

    // states used to request new data from server
    const [areaRequest, setAreaRequest] = useState('');
    const [newPathsRequest, setNewPathsRequest] = useState(0);
    const [resourcesRequest, setResourcesRequest] = useState(0);
    const [detailsRequest, setDetailsRequest] = useState('');

    // states for interval update path request
    const [intervalID, setIntervalID] = useState(0);
    const [startUpdatePathsRequests, setStartUpdatePathsRequests] = useState(false);

    // states used to display particular elements hidden or shown
    const [hiddenAreas, setHiddenAreas] = useState([]);
    const [hiddenPaths, setHiddenPaths] = useState([]);
    const [hiddenResources, setHiddenResources] = useState([]);

    // ----- STATES - MODALS -----
    // error from server
    // currently not used
    const [serverErrorModal, setServerErrorModal] = useState({show: false, errorLabel: '', error: ''});

    // ----- REFS -----

    // ----- HOOKS -----
    // get AREAS data
    useEffect(() => {
        requestBasicGet(UserService.getAreas, setActionAreas, actionID)
    }, [areaRequest])

    // get PATHS data (only at the launch of the page)
    // IF first visit to this action in this session - from SERVER
    // IF already visited - from INDEXED DB (browser DB cache)
    useEffect(() => {
        getByIndex('actionID', actionID)
            .then(locationsFromDB => {
                if(locationsFromDB){
                    setActionPaths(locationsFromDB.locations)
                    setTimeout(()=>{
                        setNewPathsRequest(-1);
                    }, 100);
                }
                else {
                    UserService.getPaths(actionID)
                    .then((response) => {
                            if (response.status >= 200 && response.status <= 299) {
                                setActionPaths(response.data.locations);
                                add({actionID: actionID, locations: response.data.locations}).then(
                                    () => {/* console.log('photo added to DB', event);*/},
                                    () => {/* console.log(error); */}
                                );
                            }
                        },
                        (error) => {
                            errorAlert(error)
                        }
                    )
                };
            })
    }, [])

    // get RESOURCES data
    useEffect(() => {
        requestBasicGet(UserService.getResources, setActionResources, actionID);
    }, [resourcesRequest])

    // get DETAILS data
    useEffect(() => {
        requestBasicGet(UserService.getActionDetails, setActionDetails, actionID);
    }, [detailsRequest])

    // get USERS data
    useEffect(() => {
        requestBasicGet(UserService.getAllUsers, setUsersData, actionID, 'users');
    }, [])

    // call every PATHS_FROM_SERVER_INTERVAL seconds for new paths
    useEffect(() => {
        if (!startUpdatePathsRequests) {
            clearInterval(intervalID);
            setIntervalID(0);
            return;
        }
        const newIntervalId = setInterval(() => {

            // new paths api call
            setNewPathsRequest(newPathsRequest => (newPathsRequest + 1))

        }, PATHS_FROM_SERVER_INTERVAL * 1000);

        setIntervalID(newIntervalId);
    }, [startUpdatePathsRequests]);

    // get NEW PATHS and RESOURCES from server
    useEffect(() => {
        if(actionPaths && actionPaths.length > 0){
            console.log("new request")
            // request by last location ID
            const lastLocationID = actionPaths[actionPaths.length-1].id;
            const urlEnd = actionID + '?id='+ lastLocationID;

            // request by last location timestamp (uncomment below and comment above)
            // const lastLocationTimeStamp = actionPaths.locations[actionPaths.locations.length-1].time;
            // const urlEnd = actionID + '?timestamp='+ lastLocationTimeStamp;

            // resources api call every 3rd paths request
            if(newPathsRequest %3 === 0){
                setResourcesRequest(newPathsRequest)}

            requestBasicGet(UserService.getPaths, setNewActionPaths, urlEnd, 'paths');
        }
    }, [newPathsRequest])

    // update actionPaths with new paths from server
    useEffect(() => {
        if(actionPaths && newActionPaths.length > 0){
            const updatedPaths = actionPaths.concat(newActionPaths);
            setActionPaths(updatedPaths);
            update({actionID: actionID, locations: updatedPaths}).then(
                () => {/* console.log('photo added to DB', event);*/},
                () => {/* console.log(error); */}
            );
        }
    }, [newActionPaths])


    // stop loading once data is loaded
    useEffect(() => {
        const actionData = [usersData, actionAreas, actionPaths, actionResources, actionDetails]

        setLoading(actionData.map(data => {return !!data}).includes(false));
    },[usersData, actionAreas, actionPaths, actionResources, actionDetails])


// ----- RENDER -----
    if(loading) return <MySpinner />

    return (
        <div>
            {actionDetails &&
                <ActionEditionStates
                    actionAreas={actionAreas}
                    setAreaRequest={setAreaRequest}
                    actionDetails={actionDetails}
                    setDetailsRequest={setDetailsRequest}
                    actionPaths={actionPaths}
                    setNewPathsRequest={setNewPathsRequest}
                    actionResources={actionResources}
                    setResourcesRequest={setResourcesRequest}
                    usersData={usersData}
                    id={actionID}
                    hiddenAreasState={[hiddenAreas, setHiddenAreas]}
                    hiddenPathsState={[hiddenPaths, setHiddenPaths]}
                    hiddenResourcesState={[hiddenResources, setHiddenResources]}
                    newPathsRequest={newPathsRequest}
                    setStartUpdatePathsRequest={setStartUpdatePathsRequests}
                />
            }
            <ServerResponseErrorModal
                serverErrorState={[serverErrorModal, setServerErrorModal]}
                show={serverErrorModal}
                setShow={setServerErrorModal}
            />
        </div>
    );
};
export default ActionEdition;