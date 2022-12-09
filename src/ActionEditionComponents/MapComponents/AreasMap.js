/* global google */
import React, {useEffect, useRef, useState} from 'react';
import {GoogleMap, LoadScript} from '@react-google-maps/api';
import DrawingComponent from "./DrawingComponent";
import MySpinner from "../../common/MySpinner";
import getAreasToMap from "./utils/getAreasToMap";
import getResourcesToMap from "./utils/getResourcesToMap";
import ResourceInfoWindow from "./ResourceInfoWindow";
import AreaInfoWindow from "./AreaInfoWindow";
import UserPositionWindow from "./UserPositionWindow";
import getPathsToMap from "./utils/getPathsToMap";


// change to ENV or HC static prop
const libraries = ['drawing'];


const AreasMap = (props) => {

    // ----- STATES -----
    const [areas, setAreas] = useState('');
    const [actionDetails, setActionDetails] = useState('');
    const [actionResources, setActionResources] = useState('')
    const [actionPaths, setActionPaths] = useState('')

    // to use with map's properties (center, zoom)
    const [mapRef, setMapRef] = useState(null);
    const [mapLoad, setMapLoad] = useState(false);

    // infoWindows
    const [selectedResource, setSelectedResource] = useState(null);
    const [selectedArea, setSelectedArea] = useState(null);
    const [selectedLastUserPosition, setSelectedLastUserPosition] = useState(null);

    // ----- REFS -----
    const mapFocusRef = useRef('');


    // ----- HOOKS -----
    // set props once loaded
    useEffect(() => {
        setAreas(props.actionAreas);
        setActionDetails(props.actionDetails)
        setActionResources(props.actionResources)
        setActionPaths(props.actionPaths);
    }, [props])

    // check in case actionDetails not loaded (no action center)
    if (!actionDetails)
        return <MySpinner />

    // ----- FUNCTIONS -----
    const getCenter = () => {
        const center = (props.renderCount.current > 0 && mapFocusRef.current)
            ? (mapFocusRef.current)
            : {lat: +actionDetails.latitude, lng: +actionDetails.longitude};
        return center
    }

    // convert resources from server data to Marker components
    const resourcesToMap = getResourcesToMap(actionResources, setSelectedResource, props.resourcesToHide);

    // convert areas from server data to Polygon components
    const areasToMap = getAreasToMap(areas, setSelectedArea, props.areasToHide);

    // convert paths from server data to Polyline with Marker at most current position
    const pathsToMap = getPathsToMap(actionPaths, setSelectedLastUserPosition, props.usersData, props.pathsToHide);


    // ----- RENDER -----
    return (
        <LoadScript
            googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
            libraries={libraries}
        >
            <GoogleMap
                id='drawing-example'
                onLoad={map => {
                    setMapLoad(true);
                    setMapRef(map);
                }}
                mapContainerStyle={{
                    width: '100%',
                    height: '100%'
                }}
                center={getCenter()}
                zoom={13}
                onCenterChanged={() => {if(mapLoad) mapFocusRef.current = mapRef.getCenter().toJSON()}}
            >

                {/*  areas  */}
                {props.showAreas &&
                    areasToMap}
                {selectedArea &&
                    <AreaInfoWindow
                        selectedArea={selectedArea}
                        setSelectedArea={setSelectedArea}
                    />}

                {/*  paths  */}
                {props.showPaths &&
                    pathsToMap}
                {selectedLastUserPosition &&
                    <UserPositionWindow
                        selectedLastUserPosition={selectedLastUserPosition}
                        setSelectedLastUserPosition={setSelectedLastUserPosition}
                    /> }

                {/*  resources  */}
                {props.showResources &&
                    resourcesToMap}
                {selectedResource &&
                    <ResourceInfoWindow
                        selectedResource={selectedResource}
                        setSelectedResource={setSelectedResource}
                        usersData={props.usersData}
                        setShowResourceDetailsModal={props.setShowResourceDetailsModal}
                    />}

                {/*  drawing manager (tool to to mark new area)  */}
                {(props.showAreas && props.showDrawingManager) &&
                    <DrawingComponent
                        setNewAreaModal={props.showNewAreaModal[1]}
                    />
                }
            </GoogleMap>
        </LoadScript>
    )
};

export default AreasMap;