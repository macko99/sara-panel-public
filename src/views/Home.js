import React, {useState} from "react";
import {Button, Col, Container, Row, Table} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {FaMountain, FaUserFriends} from "react-icons/fa";
import {BsFillCaretDownFill, BsInfoCircle} from "react-icons/bs";
import {Link} from "react-router-dom";

const Home = () => {

    const { t } = useTranslation();
    const iconSize = '150px'
    const sideMargin = '3%';
    const [showList, setShowList] = useState(false);

    const userFunctionalities = [
        t("Adding regular user"),
        t("Add one-time user and send his code by SMS (Quick Add)"),
        t("Delete user"),
        t("Modify parameters: path's color, data send interval"),
        t("Generate one-time login code"),
        t("Send code by SMS (if service active)"),
        t("Searching"),
        t("Send push notification to all registered users")
    ]
    const actionFunctionalities = [
        t("Adding action"),
        t("Delete action"),
        t("Searching"),
        t("Add and delete users taking part in action")
    ]
    const actionEditionFunctionalities = [
        t("Live action view on map"),
        t("Create area"),
        t("Delete area"),
        t("Add and delete users from area"),
        t("Change visibility of all areas/paths/resources"),
        t("Change visibility of certain area/user's path/user's resources"),
        t("Start and finish action"),
        t("Send push notification to all users in action/all users in area"),
        t("Send push notification do user")
    ]

    const getRows = (list) => {
        return list.map(functionality =>
        { return (
                <tr key={functionality}>
                    <td>{functionality}</td>
                </tr>)}
        )
    }

    const getTitle =(title) => {
        return (
            <tr style={{background: "#f2f2f2"}} ><td><strong>{title}</strong></td></tr>
        )
    }

  return (
    <Container >
        <Row >
            <Col md={2}/>
            <Col className="card card-container home-card align-ctr card-margins"
                style={{marginLeft: sideMargin}}
            >
                <div className="home-big-icon">
                    <FaMountain size={iconSize}/>
                </div>
                <h3>{t("Actions")}</h3>
                <div className="text-box">
                    <p>
                        {t("actions-text")}
                    </p>
                </div>
                <Button
                    href="/all-actions"
                    variant="outline-primary"
                    className="home-button"
                >
                    {t("Go to actions")}
                </Button>
            </Col>
            <Col  className="card card-container home-card align-ctr card-margins"
                  style={{marginRight: sideMargin}}
            >
                <div className="home-big-icon">
                    <FaUserFriends size={iconSize}/>
                </div>
                <h3>{t("Users")}</h3>
                <div className="text-box justify-content-start">
                    <p>
                        {t("users-text")}
                    </p>
                </div>
                <Button
                    variant="outline-primary"
                    href="/all-users"
                    className="home-button"
                >
                    {t("Go to users")}
                </Button>
            </Col>
            <Col md={2}/>
        </Row>
        <Row>
            <Col md={2}/>
            <Col className="card card-container home-card dropdown-list">
                <Button
                    variant="light"
                    onClick={() => setShowList(!showList)}
                >
                    {t("List of functionalities")}  <BsFillCaretDownFill fontSize="1.5em"/>
                </Button>
                {showList &&
                <Table>
                    <tbody>
                    {getTitle(t("Manage users"))}
                    {getRows(userFunctionalities)}
                    {getTitle(t("Manage actions"))}
                    {getRows(actionFunctionalities)}
                    {getTitle(t("Coordinate action"))}
                    {getRows(actionEditionFunctionalities)}
                    </tbody>
                </Table>
                }



            </Col>
            <Col md={2}/>

        </Row>
        <Row className="fixed-bottom" >
            <Col
                className="info-label"
            >
                <Link to="/about">
                    <BsInfoCircle style={{margin: '10px'}} color="darkgrey"/>
                </Link>
            </Col>
        </Row>
    </Container>
  );
};

export default Home;
