import React from 'react';
import {Col, OverlayTrigger, Row, Tooltip} from "react-bootstrap";
import AddToAreaButton from "../AreasUsersButtons/AddToAreaButton";
import DelFromAreaButton from "../AreasUsersButtons/DelFromAreaButton";
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import MySearchBar from "../../common/MyTableSearch/MySearchBar";
import getUsername from "../../common/getUsername";
import MyClearButton from "../../common/MyTableSearch/MyClearButton";
import {useTranslation} from "react-i18next";
import UserTypeIcon from "../../common/UserTypeIcon";

const NewAreaChooseUsersList = (props) => {

    const inArea = props.inArea;
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
            {props.inArea
                ? <DelFromAreaButton
                    user={user}
                    setDelUser={props.setUserChange} />
                : <AddToAreaButton
                    user={user}
                    setAddUser={props.setUserChange} />
            }
        </div>
    )}

    // ----- RENDER -----

    const column9 = '9%';
    const column60 = '55px';

    const columns = [{
        dataField: 'id',
        text: 'ID',
        style: {textAlign: 'center'},
        sort: true,
        headerStyle: {width: column60, textAlign: 'center', backgroundColor: 'darkgrey'}
    }, {
        dataField: 'username',
        text: 'Username',
        sort: true,
        headerStyle: {width: '25%', textAlign: 'center', backgroundColor: 'darkgrey'},
        formatter: userNameFormatter,
        filterValue: (cell, row) => userNameFilterFormatter(cell, row)

    }, {
        dataField: 'first_name',
        text: t("First name"),
        sort: true,
        headerStyle: { textAlign: 'center', backgroundColor: 'darkgrey'}
    }, {
        dataField: 'last_name',
        text: t("Last name"),
        sort: true,
        headerStyle: {textAlign: 'center', backgroundColor: 'darkgrey'}
    }, {
        dataField: 'is_one_time',
        text: t("Regular")+'\n ',
        style: {textAlign: 'center'},
        sort: true,
        headerStyle: {width: "11%", textAlign: 'center', backgroundColor: 'darkgrey'},
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
                                {inArea
                                    ? t("Users in area")
                                    : t("Users not in area")
                                }
                            </h5>
                        </Row>
                        <Row>
                            <Col xxl={9} md={8}>
                                <MySearchBar { ...props.searchProps } />
                            </Col>
                            <Col md={2}>
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

export default NewAreaChooseUsersList;