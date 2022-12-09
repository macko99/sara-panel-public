import React from 'react';
import {Table} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import {useTranslation} from "react-i18next";


const DrawAreaButton = (props) => {

    const { t } = useTranslation();

    return (
        <Table>
            <thead className="basic-table-header">
            <tr>
                <th colSpan="2"
                    style={{'borderRight': "1px solid lightgrey", 'textAlign': "center"}}
                >
                    {t("Area drawing mode")}
                </th>
                <th >
                    <Form.Switch
                        defaultChecked={false}
                        onClick={() => props.setShowDrawingManager(!props.showDrawingManager)}
                    />
                </th>
            </tr>
            </thead>
        </Table>
    );
};

export default DrawAreaButton;