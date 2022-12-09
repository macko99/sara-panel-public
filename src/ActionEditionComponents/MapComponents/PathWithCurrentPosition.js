import React from 'react';
import getPathOptions from "./utils/getPathOptions";
import {Marker, Polyline} from "@react-google-maps/api";
import getLatLng from "./utils/getLatLng";
import getPeriodPaths from "./utils/getPeriodPaths";

const PathWithCurrentPosition = (props) => {

    const userPath = props.userPath;
    const locations = userPath.locations;
    const lastLocation = locations[userPath.locations.length-1];


    // ----- FUNCTIONS -----
    const periodPaths = getPeriodPaths(locations, 300);


    const lastUserPosition = {
        userID: userPath.userID,
        time: lastLocation ? lastLocation.time : Date.now(),
        location: getLatLng.singleLocation(lastLocation),
        userData: props.userData
    }

    // ----- RENDER -----
    return (
        <div>
            {
                periodPaths.map(path => {
                    return (
                        <Polyline key={path[0].id}
                        path={getLatLng.manyLocations(path)}
                        options={getPathOptions(props.userData.color)}
                        />
                    )
                })
            }

            <Marker
                position={getLatLng.singleLocation(lastLocation)}
                label={String(userPath.userID)}
                onClick={() => props.setSelectedUser(lastUserPosition)}
            />
        </div>
    )
};

export default PathWithCurrentPosition;