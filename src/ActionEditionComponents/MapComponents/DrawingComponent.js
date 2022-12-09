/* global google */
import React from "react";
import { DrawingManager } from "@react-google-maps/api";

const DrawingComponent = (props) => {


    // ----- FUNCTIONS -----
    const onPolygonComplete = (polygon) => {


        const newPolygonCoordinates = [];
        const polygonCoords = polygon.getPath().getArray();

        for (let i = 0; i < polygonCoords.length; i++) {
            const newPolCoord = {
                id: i,
                latitude: polygonCoords[i].lat(),
                longitude: polygonCoords[i].lng(),
                order: i+1
            }
            newPolygonCoordinates.push(newPolCoord);
        }
        props.setNewAreaModal({show: true, areaName: '', coordinates: newPolygonCoordinates})

        setTimeout(() => {
            polygon.setMap(null);
        }, 10000)
    };

    // ----- RENDER -----
    return (
        <DrawingManager
            onPolygonComplete={onPolygonComplete}
            options={{
                drawingControl: false,
                drawingMode: google.maps.drawing.OverlayType.POLYGON,
                polygonOptions: {editable: false}
            }}
        />
    );
};

export default DrawingComponent;