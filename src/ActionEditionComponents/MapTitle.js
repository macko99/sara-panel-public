import React from 'react';
import {Table} from "react-bootstrap";
import {useTranslation} from "react-i18next";

const MapTitle = (props) => {

    const { t } = useTranslation();
    const id = props.id;
    const name = props.actionDetails.name;
    // const description = props.actionDetails.description;

    return (
        <Table borderless>
            <thead className="basic-table-header">
            <tr>
                <th
                    className="col-min-165"
                    style={{'borderRight': "1px solid lightgrey", fontSize: "x-large"}}
                >
                    {t("Action")} {id}
                </th>
                <th style={{'textAlign': 'center'}}>{name}</th>
            </tr>
            </thead>
        </Table>
    );
};

export default MapTitle;