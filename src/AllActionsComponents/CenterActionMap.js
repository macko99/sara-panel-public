import React, {useState} from 'react';
import {GoogleMap, LoadScript, Marker} from "@react-google-maps/api";
import {Container, OverlayTrigger, Row, Tooltip} from "react-bootstrap";
import * as PropTypes from "prop-types";

const libraries = ['drawing'];

function Label(props) {
    return null;
}

const CenterActionMap = (props) => {

    const [center, setCenter] = useState({lat: 52.114503,  lng: 19.423561});
    const [zoom, setZoom] = useState(6);
    const [marker, setMarker] = useState({show: false, coords: null});

    function handleNewActionCenter(e) {
        setCenter({lat: e.latLng.lat(), lng: e.latLng.lng()});
        setZoom(11);
        setMarker({
            show: true,
            coords: e.latLng
        })
        props.setActionCenter({
            latitude: e.latLng.lat(),
            longitude: e.latLng.lng()
        })
    }

    return (
        <LoadScript
            googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
            libraries={libraries}
        >
            <GoogleMap
                id='drawing-example'
                mapContainerStyle={{
                    width: '100%',
                    height: '90%'
                }}
                options={{streetViewControl: false}}
                center={center}
                zoom={zoom}
                onRightClick={(e) => {handleNewActionCenter(e)} }
            >
                {marker.show &&
                <Marker position={marker.coords}/>}
            </GoogleMap>
        </LoadScript>
    );
};

export default CenterActionMap;