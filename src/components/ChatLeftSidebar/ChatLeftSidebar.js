import React, {useEffect, useState, useContext} from 'react';
import {AppContext} from "../../context/appContext";
import Chats from "../Chats/Chats";

function ChatLeftSidebar({contactsList}) {
    //#region Get dictionaries from context
    const {dictionary, defaultDictionary} = useContext(AppContext);
    //#endregion

    //#region Get user from context
    const {user, setUser} = useContext(AppContext);
    //#endregion

    //#region Render
    return (
        <React.Fragment>
            <div className={"chat-leftsideba me-lg-1"}>
                <Chats
                    contactsList={contactsList}
                    setContactsList={() => {}}
                />
            </div>
        </React.Fragment>
    );
    //#endregion
}

export default ChatLeftSidebar;
