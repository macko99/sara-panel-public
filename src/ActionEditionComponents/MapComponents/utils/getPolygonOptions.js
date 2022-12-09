const getPolygonOptions = (areaColor, show) => {
    return {
        strokeColor: areaColor,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: areaColor,
        fillOpacity: 0.35,
        clickable: true,
        draggable: false,
        editable: false,
        visible: show,
        zIndex: 1
    }
}

export default getPolygonOptions;
