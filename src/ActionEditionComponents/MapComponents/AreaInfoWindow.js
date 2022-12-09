import React from 'react';
import {InfoWindow} from "@react-google-maps/api";

const AreaInfoWindow = (props) => {

    const coordinatesCopy = [...props.selectedArea.coordinates];
    const point = coordinatesCopy.sort((a,b) => b.latitude - a.latitude)[0]

    return (
        <InfoWindow className="info-window"
            position={{lat: point.latitude, lng: point.longitude}}
            onCloseClick={() => props.setSelectedArea(null)}
            options={{
                maxWidth: 200,
                minWidth: 100
            }}
        >
            <div>
                <h6>{props.selectedArea.name}</h6>
            </div>
        </InfoWindow>
    );
};

export default AreaInfoWindow;