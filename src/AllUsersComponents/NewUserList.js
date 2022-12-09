import React, {useEffect, useRef, useState} from 'react';
import {Button, Col, OverlayTrigger, Row, Tooltip} from "react-bootstrap";
import {IoMdColorFill} from "react-icons/io";
import {SquareFill} from "react-bootstrap-icons";
import {BsDashCircleFill, BsEnvelopeOpenFill} from "react-icons/bs";
import {FaRegClock} from "react-icons/fa";
import DelWarningModal from "../common/DelWarningModal";
import ChangeUserColorModal from "./Modals/ChangeUserColorModal";
import UserService from "../services/user.service";
import errorAlert from "../common/requestRelated/errorAlert";
import ChangeUserIntervalModal from "./Modals/ChangeUserIntervalModal";
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import {useTranslation} from "react-i18next";
import MySearchBar from "../common/MyTableSearch/MySearchBar";
import MyClearButton from "../common/MyTableSearch/MyClearButton";
import UserTypeIcon from "../common/UserTypeIcon";

const NewUsersList = (props) => {

    const { t, i18n } = useTranslation();

    const users = props.users;
    const smsService = process.env.REACT_APP_SMS_SERVICE==='true';
    const setShowNewUserModal = props.setShowNewUserModal;
    const setShowNewAdhocUserModal = props.setShowNewAdhocUserModal;
    const setNotifyModal = props.setNotifyModal;


    // ----- STATES -----
    // delete confirmation modal
    const [showDelModal, setShowDelModal] = useState({show: false, id: null, name: null});
    const [del, setDel] = useState(false);

    const [newUserColor, setNewUserColor] = useState(null);
    const [userColorChangeModal, setUserColorChangeModal]
        = useState({show: false, userID: null, color: "#FFFFFF"});

    const [newUserInterval, setNewUserInterval] = useState(null);
    const [userIntervalChangeModal, setUserIntervalChangeModal] = useState({show: false, userID: null, interval: 5})

    // trigger code generation and sending for user
    const [generateCodeForUser, setGenerateCodeForUser] = useState(null);
    const [sendCodeForUser, setSendCodeForUser] = useState(null);

    // smart trick to set lng in difficult cases of formatters (no other way to pass lng)
    const renderCount = useRef(0);
    useEffect(() => {
        renderCount.current = renderCount.current + 1;
        if(renderCount.current % 2 === 0)
            props.setCodesList({...props.codesList, lng: i18n.language})
        // console.log("render no:", renderCount.current);
    })


    // ----- HOOKS -----
    // delete user decision
    useEffect(() => {
        if(del){
            props.setDelUser({userID: showDelModal.id})
            setShowDelModal({show: false, id: null, name: null})
            setDel(false);
        }
    }, [del])

    // PATCH changed user color
    useEffect(() => {
        if(newUserColor){
            const newColor = {
                user: newUserColor.userID,
                color: newUserColor.color
            }
            UserService.patchNewUserColor(newColor)
                .then((response) => {
                        if(response.status >= 200 && response.status <= 299){
                            props.setAnotherRequest(newColor);
                        }
                    },
                    (error) => {errorAlert(error)}
                );
            setUserColorChangeModal({show: false, userID: null, color: "#FFFFFF"})
        }
    }, [newUserColor])

    // PATCH changed user interval
    useEffect(() => {
        if(newUserInterval){
            const newInterval = {
                user: newUserInterval.userID,
                interval: newUserInterval.interval
            }
            UserService.patchNewUserInterval(newInterval)
                .then((response) => {
                        if(response.status >= 200 && response.status <= 299){
                            props.setAnotherRequest(newInterval);
                        }
                    },
                    (error) => {errorAlert(error)}
                );
            setUserIntervalChangeModal({show: false, userID: null, interval: 5})
        }
    }, [newUserInterval])

    // POST generate new one-time code
    useEffect(() => {
        if(generateCodeForUser){
            const userID = generateCodeForUser.userID;
            UserService.postUserCodeGenerate({user: userID})
                .then((response) => {
                        if(response.status >= 200 && response.status <= 299){
                            const newCode = response.data.invitaion_code;
                            const actualCodes = props.codesList.codes.filter(codeField => codeField.userID !== userID);
                            props.setCodesList({
                                codes:
                                actualCodes.concat([
                                {userID: userID, code: newCode}
                            ]),
                            lng: i18n.language
                            })
                        }
                    },
                    (error) => {errorAlert(error)}
                );
        }
    }, [generateCodeForUser])

    // POST send SMS message with one-time code
    useEffect(() => {
        if(sendCodeForUser){
            const userID = sendCodeForUser.userID;
            const code = sendCodeForUser.code;
            const data = {
                number_with_prefix: sendCodeForUser.phone,
                login_code: code
            }
            UserService.postSMSinvite(data)
                .then((response) => {
                        if(response.status >= 200 && response.status <= 299){
                            props.setCodesList({
                                codes:
                                props.codesList.codes.filter(codeField => codeField.userID !== userID),
                                lng: i18n.language
                            })
                        }
                    },
                    (error) => {errorAlert(error)}
                );
        }
    }, [sendCodeForUser])


    // ----- FUNCTIONS -----
    function handleDeleteUser(id, username) {
        setShowDelModal({show: true, id: id, name: username});
    }


    // ----- RENDER -----
    if (!Array.isArray(users))
        return <div>Błąd</div>


    // ----- FORMATTERS -----
    const generateFormatter = (cell, user, rowIndex, t) => {return (
        <OverlayTrigger
            placement='bottom'
            overlay={<Tooltip>{t("Generate user's one-time login code")}</Tooltip>}
        >
            <Button
                variant="outline-primary"
                onClick={() => {setGenerateCodeForUser({userID: user.id, trigger: Math.random()})}}
            >
                {t("Generate")}
            </Button>
        </OverlayTrigger>
    )}

    const codeFormatter = (cell, user, rowIndex, codesList) => {
        const foundCode = codesList.codes.find(codeField => codeField.userID === user.id)
        return (
            <div>{foundCode ? foundCode.code : '------'}</div>
        )
    }

    const sendFormatter = (cell, user, rowIndex, codesList) => {
        const foundCode = codesList.codes.find(codeField => codeField.userID === user.id);
        const plTooltip = ["Wyślij kod SMSem", "Wygeneruj najpierw kod"]
        const enTooltip = ["Send code by SMS", "Generate code first"]
        const toolTip = codesList.lng === 'en' ? enTooltip : plTooltip;
        return (
            <OverlayTrigger
                placement='bottom'
                overlay={
                    <Tooltip>{foundCode ? toolTip[0] : toolTip[1] }
                    </Tooltip>}
            >
                <span>
                    <Button
                        disabled={!foundCode}
                        variant={!foundCode ? "secondary": "outline-primary"}
                        onClick={() => {
                            setSendCodeForUser({userID: user.id, code: foundCode.code, phone: user.phone})}}
                    >
                        {codesList.lng === "en" ? "Send" : "Wyślij"}
                    </Button>
                </span>
            </OverlayTrigger>
        )
    }

    const userNameFormatter = (username, row) => {return (
        <div>{(username.length > 32 && username.includes('-')) ? '-' : username}</div>
    )}

    const userTypeFormatter = (is_one_time, row, rowIndex, t) => {
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

    const colorHeaderFormatter = () => {return (
        <IoMdColorFill fontSize="1.5em"/>
    )}

    const colorFormatter = (color, row, rowIndex, t) => {
        return (
            <OverlayTrigger
                placement='bottom'
                overlay={<Tooltip>{t("Change color of user's path")}</Tooltip>}>
                <SquareFill
                    fontSize="1.5em"
                    color={color}
                    onClick={() => {
                        setUserColorChangeModal({
                            show: true,
                            userID: row.id,
                            color: color
                        })
                    }}
                />
            </OverlayTrigger>
        )
    }

    const intervalHeaderFormatter = () => {return (
        <FaRegClock fontSize="1.3em"/>
    )}

    const intervalFormatter = (interval, user, rowIndex, t) => {
        return (
            <OverlayTrigger
                placement='bottom'
                overlay={<Tooltip>{t("Change user's data update interval")}</Tooltip>}>
                <Button
                    variant="outline-primary"
                    onClick={() => {
                        setUserIntervalChangeModal({
                            show: true,
                            userID: user.id,
                            interval: user.interval
                        })
                    }}
                >
                    {user.interval}
                </Button>
            </OverlayTrigger>
        )
    }

    const deleteFormatter = (cell, user) => {
        return (
            <Button
            className="button-areas-list"
            size="sm"
            variant="outline-danger"
            onClick={() => handleDeleteUser(user.id, String( user.username))}
        >
            <BsDashCircleFill/>
        </Button>
        )
    }

    const column9 = '9%';
    const column60 = '60px';

    const columns = [{
        dataField: 'id',
        text: 'ID',
        style: {textAlign: 'center'},
        sort: true,
        headerStyle: {width: column60, textAlign: 'center', backgroundColor: 'darkgrey'}
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
        dataField: 'username',
        text: 'Username',
        sort: true,
        headerStyle: {textAlign: 'center', backgroundColor: 'darkgrey'},
        formatter: userNameFormatter
    }, {
        dataField: 'phone',
        text: t("Phone"),
        style: {textAlign: 'center'},
        headerStyle: {width: '12%', textAlign: 'center', backgroundColor: 'darkgrey'}
    }, {
        dataField: 'is_one_time',
        text: t("Regular"),
        style: {textAlign: 'center'},
        sort: true,
        headerStyle: {width: '7%', textAlign: 'center', backgroundColor: 'darkgrey'},
        formatter: userTypeFormatter,
        formatExtraData: t
    }, {
        dataField: 'color',
        text: t("Color"),
        style: {textAlign: 'center'},
        headerStyle: {width: column60, textAlign: 'center', backgroundColor: 'darkgrey'},
        formatter: colorFormatter,
        headerFormatter: colorHeaderFormatter,
        formatExtraData: t
    }, {
        dataField: 'interval',
        text: t("Interval"),
        style: {textAlign: 'center'},
        headerStyle: {width: column60, textAlign: 'center', backgroundColor: 'darkgrey'},
        formatter: intervalFormatter,
        headerFormatter: intervalHeaderFormatter,
        formatExtraData: t
    }, {
        dataField: 'a',
        text: t("Generate"),
        style: {textAlign: 'center'},
        headerStyle: {width: column9, textAlign: 'center', backgroundColor: 'darkgrey'},
        formatter: generateFormatter,
        formatExtraData: t
    }, {
        dataField: 'b',
        text: t("Code"),
        style: {textAlign: 'center'},
        headerStyle: {width: column9, textAlign: 'center', backgroundColor: 'darkgrey'},
        formatter: codeFormatter,
        formatExtraData: props.codesList
    }, {
        dataField: 'c',
        hidden: !smsService,
        text: "SMS",
        style: {textAlign: 'center'},
        headerStyle: {width: column9, textAlign: 'center', backgroundColor: 'darkgrey'},
        formatter: sendFormatter,
        formatExtraData: props.codesList
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

    return (
        [<ToolkitProvider
            bootstrap4
            key={1}
            keyField="id"
            data={ users }
            columns={ columns }
            search
        >
            {
                props => {
                    return (
                    <div>
                        <Row style={{marginTop: '3px'}}>
                            <Col xxl={4} md={5}>
                                <Row
                                    style={{
                                        marginTop: "10px",
                                        marginLeft: "1em",
                                        height: "2.3em"
                                    }}>
                                    <Col className="d-grid gap-2">
                                        <OverlayTrigger
                                            placement='bottom'
                                            overlay={<Tooltip>{t("Add regular user")}</Tooltip>}>
                                            <Button
                                                className="d-grid gap-2"
                                                variant='primary'
                                                onClick={() => setShowNewUserModal(true)}
                                            >
                                                {t("Add user")}
                                            </Button>
                                        </OverlayTrigger>
                                    </Col>
                                    <Col className="d-grid gap-2">
                                        <OverlayTrigger
                                            placement='bottom'
                                            overlay={<Tooltip>{t("Add one-time user")}</Tooltip>}>
                                            <Button
                                                className="d-grid gap-2"
                                                variant='primary'
                                                onClick={() => setShowNewAdhocUserModal(true)}
                                            >
                                                {t("Add ad hoc user")}
                                            </Button>
                                        </OverlayTrigger>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xxl={2} md={3}>
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
                            <Col md={1}>
                                <Row
                                    style={{
                                        marginTop: "10px",
                                        marginRight: "1em",
                                        height: "2.3em"
                                    }}
                                    >
                                    <OverlayTrigger
                                        placement='bottom'
                                        overlay={<Tooltip>{t("Send notification to all registered users")}</Tooltip>}>
                                        <Button
                                            variant="warning"
                                            onClick={() =>
                                                setNotifyModal({show: true, type: 'all', id: null})
                                            }
                                        >
                                            <BsEnvelopeOpenFill fontSize="1.5em"/>
                                        </Button>
                                    </OverlayTrigger>
                                </Row>
                            </Col>
                        </Row>
                        <hr />
                        <BootstrapTable
                            { ...props.baseProps }
                            defaultSorted={defaultSorted}
                            striped
                            hover
                            headerClasses="sticky-header"
                            rowStyle={{ verticalAlign: "middle", height: '60px', padding: '5px 0'}}
                        />
                    </div>
                )}
            }
        </ToolkitProvider>,
        <DelWarningModal
            key={2}
            show={showDelModal.show}
            setShow={setShowDelModal}
            delName={showDelModal.name}
            setDelete={setDel}
        />,
        <ChangeUserColorModal
            key={3}
            setNewUserColor={setNewUserColor}
            modalState={[userColorChangeModal, setUserColorChangeModal]}
        />,
        <ChangeUserIntervalModal
            key={4}
            setNewUserInterval={setNewUserInterval}
            modalState={[userIntervalChangeModal, setUserIntervalChangeModal]}
        />
        ]
    );
};

export default NewUsersList;