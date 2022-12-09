import React from 'react';
import getAlmostUniqueColor from "../../getAlmostUniqueColor";
import {Polygon} from "@react-google-maps/api";
import getPolygonOptions from "./getPolygonOptions";

const getAreasToMap = (areas, setSelectedArea, areasToHide) => {

    return areas.map(area => {

        const areaColor = getAlmostUniqueColor(area.area_id);
        const show = !areasToHide.includes(area.area_id);

        return (
            <Polygon
                key={area.area_id}
                paths={
                    area.coordinates.map(point => {
                        return {lat: point.latitude, lng: point.longitude}
                    })
                }
                options={getPolygonOptions(areaColor, show)}
                onClick={() => setSelectedArea(area)}
                onMouseOut={() => setSelectedArea(null)}
            />
        )
    });
};

export default getAreasToMap;