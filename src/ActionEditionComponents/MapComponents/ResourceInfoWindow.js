import React from 'react';
import {InfoWindow} from "@react-google-maps/api";
import getTimeFromTimestamp from "./utils/getTimeFromTimestamp";
import {Button, Row} from "react-bootstrap";
import {useTranslation} from "react-i18next";

const ResourceInfoWindow = (props) => {

    const { t } = useTranslation();

    const point = props.selectedResource;

    const user = props.usersData.find(user => user.public_id === point.userID)


    // ----- RENDER -----
    return (
        <InfoWindow className="info-window"
            position={{lat: point.latitude, lng: point.longitude}}
            onCloseClick={() => props.setSelectedResource(null)}
            options={{
                maxWidth: 200,
                minWidth: 200
            }}
        >
            <div>
                <Row>
                    <h4>{point.name}</h4>
                </Row>
                <Row>
                    <p><strong>{t("Time")}:</strong> {getTimeFromTimestamp(point.time)}</p>
                </Row>
                <Row>
                    <p><strong>{t("User")}:</strong> {user.first_name === '-'
                        ? user.username
                        : user.first_name + ' ' + user.last_name }</p>
                    <p>
                        <strong>{t("Phone")}: </strong>
                        <span className="phone-number">{user.phone.slice(3,6)+' '+user.phone.slice(6,9)+' '+user.phone.slice(9,12)}</span>
                    </p>
                </Row>
                <Row className="d-grid gap-2">
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => props.setShowResourceDetailsModal({
                            show: true,
                            point: point,
                            user: user
                        })}
                    >
                        {t("More details")}
                    </Button>
                </Row>
            </div>
        </InfoWindow>
    );
};

export default ResourceInfoWindow;