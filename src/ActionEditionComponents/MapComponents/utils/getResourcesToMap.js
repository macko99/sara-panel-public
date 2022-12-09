import React from 'react';
import {Marker} from "@react-google-maps/api";
import bluePin from "../bluePin.png"


const getResourcesToMap = (resources, setSelectedResource, resourcesToHide) => {

    return resources.map(point => {
        // const icon = {
        //     url: blueFlag, // url
        //     scaledSize: new window.google.maps.Size(50, 50), // scaled size
        //     origin: new window.google.maps.Point(point.latitude, point.longitude), // origin
        //     anchor: new window.google.maps.Point(point.latitude, point.longitude) // anchor
        // }

        if(resourcesToHide.includes(point.userID))
            return null;
        else {
            return (
                <Marker
                    key={point.id}
                    // label="P"
                    icon={bluePin}
                    position={{lat: point.latitude, lng: point.longitude}}
                    onClick={() => {
                        setSelectedResource(point);
                    }}
                />
            )
        }
    });
};

export default getResourcesToMap;