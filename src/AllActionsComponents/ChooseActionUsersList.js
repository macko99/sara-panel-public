import React from 'react';
import {Col, OverlayTrigger, Row, Tooltip} from "react-bootstrap";
import AddToActionButton from "./ActionUsersButtons/AddToActionButton";
import DelFromActionButton from "./ActionUsersButtons/DelFromActionButton";
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import {MdCheckBox, MdOutlineCheckBoxOutlineBlank} from "react-icons/all";
import MySearchBar from "../common/MyTableSearch/MySearchBar";
import getUsername from "../common/getUsername";
import MyClearButton from "../common/MyTableSearch/MyClearButton";
import {useTranslation} from "react-i18next";
import UserTypeIcon from "../common/UserTypeIcon";

const ChooseActionUsersList = (props) => {

    const inAction = props.inAction;
    const { t } = useTranslation();

    // ----- FORMATTERS -----
    const userTypeFormatter = (is_one_time, row) => {
        return (
            <OverlayTrigger
                placement='bottom'
                overlay={
                    <Tooltip>{is_one_time ? t("One-time user") : t("Regular user")}
                    </Tooltip>}
            >
                <span>
                <UserTypeIcon isOneTime={is_one_time}/>
                </span>
            </OverlayTrigger>
        )
    }

    const userNameFormatter = (username, user) => {
        if(username.length > 32 && username.includes('-')){
            return user.phone.slice(3,6)+' '+user.phone.slice(6,9)+' '+user.phone.slice(9,12)
        } else {
            return username;
        }}

    const userNameFilterFormatter = (username, user) => {
        return getUsername(username, user)}

    const buttonFormatter = (cell, user) => {return (
        <div>
            {props.inAction
                ? <DelFromActionButton
                    user={user}
                    setDelUser={props.setUserChange} />
                : <AddToActionButton
                    user={user}
                    setAddUser={props.setUserChange} />
            }
        </div>
    )}


    // ----- RENDER -----
    const column9 = '9%';
    const column50 = '50px';

    const columns = [{
        dataField: 'id',
        text: 'ID\n',
        style: {textAlign: 'center'},
        sort: true,
        headerStyle: {width: '40px', textAlign: 'center', backgroundColor: 'darkgrey'}
    }, {
        dataField: 'username',
        text: 'Username   \n',
        sort: true,
        headerStyle: {width: '25%', textAlign: 'center', backgroundColor: 'darkgrey'},
        formatter: userNameFormatter,
        filterValue: (cell, row) => userNameFilterFormatter(cell, row)
    }, {
        dataField: 'first_name',
        text: t("First name")+'\n',
        sort: true,
        headerStyle: { textAlign: 'center', backgroundColor: 'darkgrey'}
    }, {
        dataField: 'last_name',
        text: t("Last name")+'\n',
        sort: true,
        headerStyle: {textAlign: 'center', backgroundColor: 'darkgrey'}
    }, {
        dataField: 'is_one_time',
        text: t("Regular")+'\n',
        style: {textAlign: 'center'},
        sort: true,
        headerStyle: {width: '10%', textAlign: 'center', backgroundColor: 'darkgrey'},
        formatter: userTypeFormatter
    },  {
        dataField: '',
        text: '',
        style: {textAlign: 'center'},
        headerStyle: {width: '55px', textAlign: 'center', backgroundColor: 'darkgrey'},
        formatter: buttonFormatter
    }
    ].map(col => {return{...col,
        headerClasses: "header-row",
    }});

    const defaultSorted = [{
        dataField: 'id',
        order: 'asc'
    }];

    const { SearchBar, ClearSearchButton } = Search;

    return (
        <ToolkitProvider
            bootstrap4
            key={1}
            keyField="id"
            data={ props.users }
            columns={ columns }
            search
        >
            {
                props => (
                    <div>
                        <Row>
                            <h5>
                                {inAction
                                    ? t("Users in action")
                                    : t("Other users")
                                }
                            </h5>
                        </Row>
                        <Row>
                            <Col xxl={9} md={8}>
                                <MySearchBar { ...props.searchProps } />
                            </Col>
                            <Col md={3}>
                                <Row style={{
                                    marginTop: "10px",
                                    height: "2.4em"
                                }}>
                                    <Col style={{
                                        height: "2.4em"
                                    }}>
                                        <MyClearButton
                                            { ...props.searchProps } />
                                    </Col>
                                    <Col/>
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
                            headerClasses="sticky-header-2"
                            rowStyle={{ verticalAlign: "middle", height: '30px', padding: '2px 0'}}
                        />
                    </div>
                )
            }
        </ToolkitProvider>
    )
};

export default ChooseActionUsersList;