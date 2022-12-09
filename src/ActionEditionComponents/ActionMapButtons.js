import React from 'react';
import {Button, ButtonGroup, Row, Table} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import {useTranslation} from "react-i18next";

const ActionMapButtons = (props) => {

    const { t } = useTranslation();
    // ----- STATES -----
    const [showAreas, setShowAreas] = props.showAreasState;
    const [showResources, setShowResources] = props.showResourcesState;
    const [showPaths, setShowPaths] = props.showPathsState;

    // ----- FUNCTIONS -----
    function handleAreaToggle() {
        setShowAreas(!showAreas);
    }

    function handleResourcesToggle(){
        setShowResources(!showResources);
    }

    function handlePathsToggle() {
        setShowPaths(!showPaths);
    }


    // ----- RENDER -----
    return ([
        <Table borderless key={2}>
            <thead className="basic-table-header">
            <tr>
                <th className="align-ctr">{t("Areas")}</th>
                <th className="align-ctr" style={{'borderRight': "1px solid lightgrey"}}>
                    <Form.Switch
                        defaultChecked={true}
                        onClick={handleAreaToggle} />
                </th>
                <th className="align-ctr">{t("Paths")}</th>
                <th className="align-ctr" style={{'borderRight': "1px solid lightgrey"}}>
                    <Form.Switch
                    defaultChecked={true}
                    onClick={handlePathsToggle} />
                </th>
                <th className="align-ctr">{t("Resources")}</th>
                <th className="align-ctr">
                    <Form.Switch
                        defaultChecked={true}
                        onClick={handleResourcesToggle} />
                </th>
            </tr>
            </thead>
        </Table>
        ]);
};

export default ActionMapButtons;