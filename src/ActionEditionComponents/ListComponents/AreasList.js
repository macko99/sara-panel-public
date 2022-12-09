import React, {useEffect, useState} from "react";
import {Button, Table} from "react-bootstrap";
import MySpinner from "../../common/MySpinner";
import {SquareFill} from "react-bootstrap-icons"
import getAlmostUniqueColor from "../getAlmostUniqueColor";
import {BsDashCircleFill, BsEnvelopeOpenFill, BsFillEyeFill, BsFillPeopleFill} from "react-icons/bs";
import UserService from "../../services/user.service"
import errorAlert from "../../common/requestRelated/errorAlert";
import getUsersInArea from "../Modals/utils/getUsersInArea";
import {FaMapMarker, FaRegClock} from "react-icons/fa";
import {BiColorFill, BiTrip} from "react-icons/bi";
import Form from 'react-bootstrap/Form'
import DelWarningModal from "../../common/DelWarningModal";
import {t} from "i18next";


const AreasList = (props) => {

    // ----- STATES -----
    const [areas, setAreas] = useState('');
    const [showExtendedRow, setShowExtendedRow] = useState(null);
    const [loading, setLoading] = useState(true);
    const [usersInArea, setUsersInArea] = useState('');

    // delete confirmation modal
    const [showDelModal, setShowDelModal] = useState({show: false, id: null, name: null});
    const [del, setDel] = useState(false);

    // ----- HOOKS -----
    useEffect(() => {
        setAreas(props.actionAreas)
    }, [props])

    // show user list in area
    useEffect(() => {
        if(showExtendedRow){
            setLoading(true);
            UserService.getUsersInArea(showExtendedRow)
                .then(response => {
                        if(response.status >= 200 && response.status <= 299){
                            setUsersInArea(getUsersInArea(response.data.users, props.usersData))
                            setLoading(false);
                        }
                    },
                    (error) => {errorAlert(error, setLoading)}
                )
        } else {
            setUsersInArea('');
        }
    }, [showExtendedRow])

    // delete user decision
    useEffect(() => {
        if(del){
            props.setDelArea({
                areaID: showDelModal.id,
                name: showDelModal.name
            });
            setShowDelModal({show: false, id: null, name: null})
            setDel(false);
        }
    }, [del])


    // ----- FUNCTIONS -----
    function handleAreaUsersModal(area) {
        props.setShowAreaEditionModal({show: true, area: area})
    }

    function handleHideArea(areaID, hide){
        props.setHideSelectedArea({
            area_id: areaID,
            hide: hide
        })
    }

    function handleHidePath(userID, hide){
        props.setHideSelectedPath({
            userID: userID,
            hide: hide
        })
    }

    function handleHideResources(publicUserId, hide) {
        props.setHideSelectedResource({
            userID: publicUserId,
            hide: hide
        })
    }

    function handleDeleteArea(areaID, areaName) {
        setShowDelModal({show: true, id: areaID, name: areaName});
    }

    function handleRowExtension(areaID) {
        setShowExtendedRow(areaID);
    }


    // ----- RENDER -----
    if(!areas)
        return <MySpinner/>

    return ([
        <div key={1.4} className="basic-table-container">
            <Table striped bordered hover size="md" className="basic-table small-font" key={1.1}>
                <thead className="basic-table-header">
                <tr>
                    <th className="actions-table-element col-narrow" >ID</th>
                    <th className="actions-table-element" >{t("Name")}</th>
                    <th className="col-basic" ><BiColorFill fontSize="1.5em"/></th>
                    <th className="col-basic" ><BsFillEyeFill fontSize="1.5em"/></th>
                    <th className="col-basic" />
                    <th className="col-basic" />
                    <th className="col-basic" />
                </tr>
                </thead>
                <tbody>
                {areas.map((area) => {
                    const id = area.area_id;
                    const hideArea = props.areasToHide.includes(id);
                    if (showExtendedRow !== id) {
                        return (
                            <tr key={id}>
                                <td className="basic-table-element" onClick={() => {handleRowExtension(id)}}>{id}</td>
                                <td className="actions-table-element" onClick={() => {handleRowExtension(id)}}>{area.name}</td>
                                <td className="basic-table-element">
                                    <SquareFill
                                        color={getAlmostUniqueColor(id)}
                                    />
                                </td>
                                <td className="basic-table-element">
                                    <Form.Switch
                                        defaultChecked={true}
                                        onClick={() => handleHideArea(area.area_id, !hideArea)} />
                                </td>
                                <td className="basic-table-element">
                                    <Button
                                        size="sm"
                                        variant="outline-warning"
                                        onClick={() =>
                                            props.setNotifyModal({show: true, type: 'area', id: id})
                                        }
                                    >
                                        <BsEnvelopeOpenFill/>
                                    </Button>
                                </td>
                                <td className="basic-table-element">
                                    <Button
                                        size="sm"
                                        variant="outline-primary"
                                        onClick={() => handleAreaUsersModal(area)}
                                    >
                                        <BsFillPeopleFill/>
                                    </Button>
                                </td>
                                <td className="basic-table-element">
                                    <Button
                                        size="sm"
                                        variant="outline-danger"
                                        onClick={() => handleDeleteArea(id, area.name)}
                                    >
                                        <BsDashCircleFill/>
                                    </Button>
                                </td>
                            </tr>)
                    } else {
                        return ([
                                <tr key={id+'xd'} className="table-row">
                                    <td className="basic-table-element" onClick={() => {setShowExtendedRow(null);}}>{id}</td>
                                    <td className="actions-table-element" onClick={() => {setShowExtendedRow(null);}}>{area.name}</td>
                                    <td className="basic-table-element">
                                        <SquareFill
                                            color={getAlmostUniqueColor(id)}
                                        />
                                    </td>
                                    <td className="basic-table-element">
                                        <Form.Switch
                                            defaultChecked={true}
                                            onClick={() => handleHideArea(area.area_id, !hideArea)} />
                                    </td>
                                    <td className="basic-table-element">
                                        <Button
                                            size="sm"
                                            variant="outline-warning"
                                            onClick={() =>
                                                props.setNotifyModal({show: true, type: 'area', id: id})
                                            }
                                        >
                                            <BsEnvelopeOpenFill/>
                                        </Button>
                                    </td>
                                    <td className="basic-table-element">
                                        <Button
                                            className="button-areas-list"
                                            size="sm"
                                            variant="outline-primary"
                                            onClick={() => handleAreaUsersModal(area)}
                                        >
                                            <BsFillPeopleFill/>
                                        </Button>
                                    </td>
                                    <td className="basic-table-element">
                                        <Button
                                            className="button-areas-list"
                                            size="sm"
                                            variant="outline-danger"
                                            onClick={() => handleDeleteArea(id, area.name)}
                                        >
                                            <BsDashCircleFill/>
                                        </Button>
                                    </td>
                                </tr>,
                                <tr key={area.name+'_wait'} hidden={!loading}><td align="center" colSpan="7">{t("Loading...")}</td></tr>,
                                <tr key={area.name}  hidden={loading}>
                                    {usersInArea.length!==0
                                    ? <td colSpan="7" className="inner-table-td">
                                        <Table bordered className="usr-table className inner-table-row">
                                            <thead className="secondary-table-header">
                                            <tr>
                                                <th className="actions-table-element col-narrow">ID</th>
                                                <th className="actions-table-element username-text">Username</th>
                                                <th className="col-basic"><FaRegClock fontSize="1.3em"/></th>
                                                <th className="col-basic"><BiColorFill fontSize="1.3em"/></th>
                                                <th className="col-basic"><BiTrip fontSize="1.3em"/></th>
                                                <th className="col-basic"><FaMapMarker fontSize="1.3em"/></th>
                                                <th className="col-basic"/>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {usersInArea.map(user => {
                                                const hidePath = props.pathsToHide.includes(user.id);
                                                const hideResources = props.resourcesToHide.includes(user.public_id)
                                                return (
                                                    <tr key={user.id} className="usr-in-area-row">
                                                        <td className="basic-table-element">{user.id}</td>
                                                        <td className="usr-in-area-row">{user.username}</td>
                                                        <td className="basic-table-element">{user.interval}</td>
                                                        <td className="basic-table-element"><SquareFill color={user.color}/></td>
                                                        <td className="basic-table-element">
                                                            <Form.Switch
                                                                defaultChecked={!hidePath}
                                                                onClick={() => handleHidePath(user.id, !hidePath)} />
                                                        </td>
                                                        <td className="basic-table-element">
                                                            <Form.Switch
                                                                defaultChecked={!hideResources}
                                                                onClick={() => handleHideResources(user.public_id, !hideResources)} />
                                                        </td>
                                                        <td className="basic-table-element">
                                                            <Button
                                                                size="sm"
                                                                variant="outline-warning"
                                                                onClick={() =>
                                                                    props.setNotifyModal({show: true, type: 'user', id: user.id})
                                                                }
                                                            >
                                                                <BsEnvelopeOpenFill/>
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                            </tbody>
                                        </Table>
                                    </td>
                                    : <td align="center" colSpan="7">{t("No users in area")}</td>}
                                </tr>]
                        )
                    }
                })}
                </tbody>
            </Table>
        </div>,
        <DelWarningModal
            key={2.1}
            show={showDelModal.show}
            setShow={setShowDelModal}
            delName={showDelModal.name}
            setDelete={setDel}
        />

        ]
    );
};

export default AreasList;