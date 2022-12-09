import React from 'react';
import {InfoWindow} from "@react-google-maps/api";
import getTimeFromTimestamp from "./utils/getTimeFromTimestamp";
import {useTranslation} from "react-i18next";

const UserPositionWindow = (props) => {

    const { t } = useTranslation();

    const point = props.selectedLastUserPosition.location;
    const user = props.selectedLastUserPosition.userData;

    // ----- RENDER -----
    return (
        <InfoWindow className="info-window"
                    position={{lat: point.lat, lng: point.lng}}
                    onCloseClick={() => props.setSelectedLastUserPosition(null)}
                    options={{
                        maxWidth: 200,
                        minWidth: 100
                    }}
        >
            <div>
                <h6><strong>{t("User")}: </strong>{user.username}</h6>
                <p>{getTimeFromTimestamp(props.selectedLastUserPosition.time)}</p>
                <div>ID: {props.selectedLastUserPosition.userID}<br></br>
                    {user.first_name} {user.last_name}<br></br>
                    <div className="phone-number">
                        {user.phone.slice(3,6)+' '+user.phone.slice(6,9)+' '+user.phone.slice(9,12)}
                    </div></div>
            </div>
        </InfoWindow>
    );
};

export default UserPositionWindow;