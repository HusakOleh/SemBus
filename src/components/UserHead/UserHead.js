import React, { useState, useContext } from 'react';
import { Link } from "react-router-dom";
import {Button, Col, Row} from "reactstrap";
import {AppContext} from "../../context/appContext";

function UserHead({currentContact}) {
    //#region Get setting active contact from context
    const {setActiveChatUserId} = useContext(AppContext);
    //#endregion

    //#region Get user from context
    const {user, setUser} = useContext(AppContext);
    //#endregion

    //#region Panel buttons clicks handling
    function closeUserChat(e) {
        e.preventDefault();
        let userChat = document.getElementsByClassName("user-chat");
        if (userChat) {
            userChat[0].classList.remove("user-chat-show");
        }
    };
    //#endregion

    //#region Close chat
    const handleCloseChat = () => {
        setActiveChatUserId('');

        let activeChatInSidebar = document.querySelector('li.active');

        activeChatInSidebar.className = '';
    };
    //#endregion

    //#region Render
    return (
        <React.Fragment>
            <div className="p-3 p-lg-4 border-bottom">
                <Row className="align-items-center">
                    <Col sm={8} xs={12}>
                        <div className="d-flex align-items-center">
                            {/*<div className="d-block d-lg-none me-2 ms-0">*/}
                            {/*    <Link*/}
                            {/*        to="#"*/}
                            {/*        onClick={(e) => closeUserChat(e)}*/}
                            {/*        className="user-chat-remove text-muted font-size-16 p-2"*/}
                            {/*    >*/}
                            {/*        <i className="ri-arrow-left-s-line"></i></Link>*/}
                            {/*</div>*/}

                            {currentContact?.photoUrl ?
                                <div
                                    className="me-2 ms-0"
                                >
                                    <img
                                        src={currentContact?.photoUrl}
                                        className="rounded-circle avatar-xs AvatarLink Avatar" alt="Avatar"
                                    />
                                </div>
                                : <div
                                    className="chat-user-img align-self-center me-2"
                                >
                                    <div className="avatar-xs AvatarLink">
                                        <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                            {currentContact?.fullName.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            }

                            <div className="flex-grow-1 overflow-hidden">
                                <h5 className="font-size-16 mb-0 text-truncate">
                                    <Link
                                        to="#"
                                        className="text-reset user-profile-show"
                                    >
                                        {currentContact?.fullName}
                                    </Link>
                                </h5>
                            </div>
                        </div>
                    </Col>

                    <Col sm={4} xs={0} >
                        {/*<ul className="list-inline user-chat-nav text-end mb-0">*/}
                        {/*    <li className="list-inline-item d-none d-lg-inline-block">*/}
                        {/*        <Button*/}
                        {/*            type="button"*/}
                        {/*            color="none"*/}
                        {/*            className="nav-btn user-profile-show"*/}
                        {/*        >*/}
                        {/*            <i className="ri-user-2-line"></i>*/}
                        {/*        </Button>*/}
                        {/*    </li>*/}

                        {/*    <li className="list-inline-item d-none d-lg-inline-block">*/}
                        {/*        <Button*/}
                        {/*            type="button"*/}
                        {/*            color="none"*/}
                        {/*            onClick={(e) => handleCloseChat()}*/}
                        {/*            className="nav-btn user-profile-show"*/}
                        {/*        >*/}
                        {/*            <i className="ri-close-line"></i>*/}
                        {/*        </Button>*/}
                        {/*    </li>*/}
                        {/*</ul>*/}
                    </Col>
                </Row>
            </div>
        </React.Fragment>
    );
    //#endregion
}

export default UserHead;
