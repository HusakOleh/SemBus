import React, {useContext, useEffect, useState} from 'react';
import SimpleBar from "simplebar-react";
import DisplayContactsWithMessages from "../DisplayContactsWithMessages/DisplayContactsWithMessages";
import {AppContext} from "../../context/appContext";


function Chats ({contactsList}) {
    //#region Get active chat user and set function from context
    const {activeChatUserId, setActiveChatUserId} = useContext(AppContext);
    //#enregion

    //#region Set active css class for active chat
    useEffect(() => {
        const li = document.getElementById("conversation" + activeChatUserId);
        if (li) {
            li.classList.add("active");
        }
    }, []);
    //#endregion

    //#region Open chat with user
    function openUserChat(e, chat) {
        e.preventDefault();

        // let index = contactsList.indexOf(chat);
        let id = chat.id;

        // set activeUser
        // props.activeUser(index);
        setActiveChatUserId(id);

        let chatList = document.getElementById("chat-list");
        let clickedItem = e.target;
        let currentli = null;

        if (chatList) {
            let li = chatList.getElementsByTagName("li");
            //remove coversation user
            for (let i = 0; i < li.length; ++i) {
                if (li[i].classList.contains('active')) {
                    li[i].classList.remove('active');
                }
            }
            //find clicked coversation user
            for (let k = 0; k < li.length; ++k) {
                if (li[k].contains(clickedItem)) {
                    currentli = li[k];
                    break;
                }
            }
        }

        //activation of clicked coversation user
        if (currentli) {
            currentli.classList.add('active');
        }

        let userChat = document.getElementsByClassName("user-chat");

        if (userChat[0]) {
            userChat[0].classList.add("user-chat-show");
        }

        //removes unread badge if user clicks
        let unread = document.getElementById("unRead" + chat.id);
        if (unread) {
            unread.style.display = "none";
        }
    };
    //#endregion

    //#region Render
    return (
        <React.Fragment>
            {/*<div>*/}
                <div className="px-4 pt-4">
                    <h4 className="mb-4 LeftSideBarHeader">Chats</h4>
                    {/*<button*/}
                    {/*    onClick={() => console.log(contactsList)}*/}
                    {/*>*/}
                    {/*    Check contacts list in chats*/}
                    {/*</button>*/}
                    {/*<div className="search-box chat-search-box SearchBoxEmpty">*/}
                    {/*    <h5 className={'pt-4 font-size-16'}>Accounts list</h5>*/}
                    {/*</div>*/}
                </div>

                <div className="px-2">
                    <SimpleBar style={{ maxHeight: "100%" }} className="chat-message-list">
                        <DisplayContactsWithMessages
                            contactsList={contactsList}
                            openUserChat={openUserChat}
                        />
                    </SimpleBar>
                </div>
        </React.Fragment>
    );
    //#endregion
}

export default Chats;
