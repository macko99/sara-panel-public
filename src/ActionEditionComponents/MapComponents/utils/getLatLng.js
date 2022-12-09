
const singleLocation = (point) => {
    return {lat: point.latitude, lng: point.longitude}
}

const manyLocations = (locations) => {

    return locations.map(point => {
        return {lat: point.latitude, lng: point.longitude}
    })
}

export default {
    singleLocation,
    manyLocations
};