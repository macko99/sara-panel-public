import React, { useState, useEffect } from "react";
import {Route, Switch} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import AuthService from "./services/auth.service";
import Login from "./views/Login";
import Home from "./views/Home";
import EventBus from "./common/Auth/EventBus";
import AllActions from "./views/AllActions";
import ActionEdition from "./views/ActionEdition";
import AllUsers from "./views/AllUsers";
import GuardedRoute from "./common/Auth/GuardedRoute";
import {Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import LoginRoute from "./common/Auth/LoginRoute";
import BadUrlRoute from "./common/Auth/BadUrlRoute";
import {withTranslation} from "react-i18next";
import { DBConfig } from './common/DBConfig';
import { initDB } from 'react-indexed-db';
import About from "./views/About";
import Policy from "./views/Policy"

initDB(DBConfig);


const App = (props) => {

  const { t } = props;

  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentUsername, setCurrentUsername] = useState('');

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    const username = AuthService.getCurrentUsername()

    if (user) {
      setCurrentUser(user);
    }

    if(username)
      setCurrentUsername(username);

    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, []);

  const logOut = () => {
    setCurrentUsername('');
    AuthService.logout();
    setCurrentUser(undefined);
  };


  const handleLanguageChange = (lng) => {
    props.i18n.changeLanguage(lng);
  };

  return (
        <div>
          <Navbar
              sticky="top"
              variant="dark"
              bg="dark"
          >
            <Container>
              <Navbar.Brand href="/home">
                SARA Panel
              </Navbar.Brand>
              <Navbar.Toggle />
              {currentUser &&
              <Nav className="me-auto">
                <Nav.Link href="/all-actions">{t('Actions')}</Nav.Link>
                <Nav.Link href="/all-users">{t('Users')}</Nav.Link>
              </Nav>
              }
              <Navbar.Collapse className="justify-content-end">
                <Nav>
                  <Nav.Item className="nav-link">
                    {currentUsername}
                  </Nav.Item>
                </Nav>
                <Nav>
                  {currentUser ? (
                      <Nav.Link href="/login" className="nav-link" onClick={logOut}>
                        {t('Logout')}
                      </Nav.Link>
                  ) : (
                      <Nav.Link href="/login" className="nav-link">
                        {t('Login')}
                      </Nav.Link>
                  )}
                  <NavDropdown
                      title={props.i18n.language.toUpperCase().slice(0,2)} >
                    <NavDropdown.Item
                        onClick={() => handleLanguageChange('en')}
                    >EN</NavDropdown.Item>
                    <NavDropdown.Item
                        onClick={() => handleLanguageChange('pl')}
                    >PL</NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>

          <div>
            <Switch>
              <LoginRoute exact path="/login" component={Login} auth={!!AuthService.getCurrentUser()}/>
              <GuardedRoute exact path={["/home", "/"]} component={Home} auth={!!AuthService.getCurrentUser()} />
              <GuardedRoute exact path="/all-users" component={AllUsers} auth={!!AuthService.getCurrentUser()}/>
              <GuardedRoute exact path="/all-actions" component={AllActions} auth={!!AuthService.getCurrentUser()} />
              <GuardedRoute exact path={"/action-edition/:id"} component={ActionEdition} auth={!!AuthService.getCurrentUser()}/>
              <Route exact path={"/about"} component={About} />
              <Route exact path={"/policy"} component={Policy} />
              <BadUrlRoute auth={!!AuthService.getCurrentUser()}/>
            </Switch>
          </div>
        </div>
  );
};

export default withTranslation()(App);
