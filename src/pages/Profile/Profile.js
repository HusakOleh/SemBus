import React, {useContext} from 'react';
import {AppContext} from "../../context/appContext";
import {Link} from "react-router-dom";
import ChangePasswordForm from "../../components/ChangePasswordForm/ChangePasswordForm";
import {Row, Tab, Col, Nav} from "react-bootstrap";
import {getTranslation} from "../../utils/helpers";
import ProfileInfo from "../../components/ProfileInfo/ProfileInfo";
import ChatInput from "../../components/ChatInput/ChatInput";
import AdminChat from "../../components/AdminChat/AdminChat";
import UserChat from "../../components/UserChat/UserChat";
import ClientChat from "../../components/ClientChat/ClientChat";

const Profile = () => {
    //#region Get user from app context
    const {user} = useContext(AppContext);
    //#endregion

    //#region Get dictionaries from context
    const {dictionary, defaultDictionary} = useContext(AppContext);
    //#endregion

    //#region Render
    return (
        <>
            <Tab.Container id="left-tabs-example" defaultActiveKey="profile">
                <Row>
                    <Col sm={3}>
                        <img src={user?.photoUrl} alt={'Avatar'} />

                        <p>
                            {user?.fullName}
                        </p>
                        {getTranslation('ID number')}
                        <p>
                            {user?.uid}
                        </p>

                        <Nav variant="pills" className="flex-column">
                            <Nav.Item>
                                <Nav.Link eventKey="profile">
                                    {getTranslation('Мій профіль', dictionary, defaultDictionary)}
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="chat">
                                    {getTranslation('Чат', dictionary, defaultDictionary)}
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col sm={9}>
                        <Tab.Content>
                            <Tab.Pane eventKey="profile">
                                <ProfileInfo />
                            </Tab.Pane>
                            <Tab.Pane eventKey="chat">
                                {user?.role === 'admin' ?
                                    <AdminChat />
                                    :
                                    <ClientChat />
                                }
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </>
    );
    //#endregion
};

export default Profile;
