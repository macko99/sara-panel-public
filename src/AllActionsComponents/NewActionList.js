import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {Button, Col, OverlayTrigger, Row, Tooltip} from "react-bootstrap"
import {BsCheckSquareFill, BsDashCircleFill, BsFillXSquareFill} from "react-icons/bs";
import DelWarningModal from "../common/DelWarningModal";
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import MySearchBar from "../common/MyTableSearch/MySearchBar";
import {useTranslation} from "react-i18next";
import MyClearButton from "../common/MyTableSearch/MyClearButton";


const NewActionList = (props) => {

    const { t } = useTranslation();
    const actions = props.actions;
    const setShowNewActionModal = props.setShowNewActionModal;

    // ----- STATES -----
    // delete confirmation modal
    const [showDelModal, setShowDelModal] = useState({show: false, id: null, name: null});
    const [del, setDel] = useState(false);

    // ----- HOOKS -----
    // delete action with confirmation
    useEffect(() => {
        if(del){
            props.setDelAction(showDelModal.id)
            setShowDelModal({show: false, id: null, name: null})
            setDel(false);
        }
    }, [del])


    // ----- FUNCTIONS -----
    function handleDeleteAction(id, actionName) {
        setShowDelModal({show: true, id: id, name: actionName});
    }

    // ----- RENDER -----
    if (!Array.isArray(actions))
        return <div>Błąd</div>

    // ----- FORMATTERS -----

    const actionStatusFormatter = (is_active, row) => (
        <OverlayTrigger
            placement='bottom'
            overlay={<Tooltip>
                {is_active ? t('Action is active') : t('Action is not active')}
            </Tooltip>}
        >
            <div>
            {is_active
                ? <BsCheckSquareFill fontSize="2.2em" color="#2a8754"/>
                : <BsFillXSquareFill fontSize="2.2em" color="grey"/>
            }
            </div>
        </OverlayTrigger>
    )

    const usersModFormatter = (cell, row) => (
        <OverlayTrigger placement='bottom'
                        overlay={<Tooltip>{t("Add and remove users from action")}</Tooltip>}
        >
            <Button
                variant="outline-primary"
                onClick={() => props.setActionUsersModal({show: true, action: row})}
            >
                {t("Users' list")}
            </Button>
        </OverlayTrigger>
    )

    const goToActionFormatter = (cell, row) => (
        <Link to={`/action-edition/${row.id}`}>
            <OverlayTrigger
                placement='bottom'
                overlay={<Tooltip>{t("Go to action edition and supervision")}
                </Tooltip>}
            >
                <Button
                    variant="outline-success"
                >
                    {t("Go to action")}
                </Button>
            </OverlayTrigger>
        </Link>
    )

    const deleteFormatter = (cell, row) => (
        <Button
            variant="outline-danger"
            onClick={() => handleDeleteAction(row.id,  row.name)}
        >
            <BsDashCircleFill/>
        </Button>
    )

    const column60 = '60px';
    const column120 = '120px';

    const columns = [{
        dataField: 'id',
        text: 'ID',
        style: {textAlign: 'center'},
        sort: true,
        headerStyle: {width: '60px', textAlign: 'center', backgroundColor: 'darkgrey'}
    }, {
        dataField: 'name',
        text: t("Name"),
        sort: true,
        headerStyle: {width: '15%', textAlign: 'center', backgroundColor: 'darkgrey'}
    }, {
        dataField: 'description',
        text: t("Description"),
        headerStyle: {textAlign: 'center', backgroundColor: 'darkgrey'},
    }, {
        dataField: 'start_time',
        text: t("Start time"),
        sort: true,
        style: {textAlign: 'center'},
        headerStyle: {width: '9%', textAlign: 'center', backgroundColor: 'darkgrey'},
        formatter: timestamp => (new Date(timestamp*1000)).toLocaleDateString()+"\n"+
            (new Date(timestamp*1000)).toLocaleTimeString()
    }, {
        dataField: 'is_active',
        text: t("Active")+'\n',
        sort: true,
        style: {textAlign: 'center'},
        headerStyle: {width: '7%', textAlign: 'center', backgroundColor: 'darkgrey'},
        formatter: actionStatusFormatter
    }, {
        dataField: 'd',
        text: t("Manage"),
        style: {textAlign: 'center'},
        headerStyle: {width: '11%', textAlign: 'center', backgroundColor: 'darkgrey'},
        formatter: usersModFormatter
    }, {
        dataField: 'c',
        text: t("Go to action"),
        style: {textAlign: 'center'},
        headerStyle: {width: '9%', textAlign: 'center', backgroundColor: 'darkgrey'},
        formatter: goToActionFormatter
    }, {
        dataField: '',
        text: t("Delete"),
        style: {textAlign: 'center'},
        headerStyle: {width: '70px', textAlign: 'center', backgroundColor: 'darkgrey'},
        formatter: deleteFormatter
    }
    ].map(col => {return{...col,
            headerClasses: "header-row",
    }});


    const defaultSorted = [{
        dataField: 'id',
        order: 'asc'
    }];

    const { SearchBar, ClearSearchButton } = Search;

    return ([
        <ToolkitProvider
            bootstrap4
            key={1}
            keyField="id"
            data={ actions }
            columns={ columns }
            search
        >
            {
                props => (
                    <div>
                        <Row style={{marginTop: '4px'}}>
                            <Col md={2} >
                                <Row
                                    className="d-grid gap-2"
                                    style={{
                                    marginTop: "10px",
                                    marginLeft: "1em",
                                    height: "2.3em"
                                }}>
                                    <Button
                                        variant='primary'
                                        onClick={() => setShowNewActionModal(true)}
                                    >
                                        {t("Add action")}
                                    </Button>
                                </Row>

                            </Col>
                            <Col md={2}>
                                <MySearchBar { ...props.searchProps } />
                            </Col>
                            <Col md={2}>
                                <Row style={{
                                    marginTop: "10px",
                                    height: "2.4em"
                                }}>
                                    <MyClearButton { ...props.searchProps } />
                                </Row>
                            </Col>
                            <Col/>
                        </Row>


                        <hr />
                        <BootstrapTable
                            { ...props.baseProps }
                            defaultSorted={defaultSorted}
                            striped
                            hover
                            headerClasses="sticky-header"
                            rowStyle={{ verticalAlign: "middle", height: '80px', padding: '5px 0'}}
                        />
                    </div>
                )
            }
        </ToolkitProvider>,
        <DelWarningModal
            key={2}
            show={showDelModal.show}
            setShow={setShowDelModal}
            delName={showDelModal.name}
            setDelete={setDel}
        />
        ]
    );
};

export default NewActionList;