import React, {useState, useEffect, useRef, useContext} from 'react';
import SimpleBar from "simplebar-react";
import {format} from "date-fns";
import {AppContext} from "../../context/appContext";
import {getContactById, sendMessage} from "../../utils/helpers";
import UserHead from "../UserHead/UserHead";
import ChatInput from "../ChatInput/ChatInput";
import FileList from "../FileList/FileList";
import ImageList from "../ImageList/ImageList";

function UserChat({contactsList}) {
    //#region Get active contact id
    const {activeChatUserId} = useContext(AppContext);
    //#endregion

    //#region Get user
    const {user} = useContext(AppContext);
    //#endregion

    //#region Ref
    const ref = useRef();

    function scrolltoBottom() {
        if (ref.current.el) {
            ref.current.getScrollElement().scrollTop = ref.current.getScrollElement().scrollHeight;
        }
    };
    //#endregion

    //#region Messages and list of messages change
    const [chatMessages, setChatMessages] = useState([]);

    useEffect(() => {
        if (getContactById(contactsList, activeChatUserId)) {
            setChatMessages(getContactById(contactsList, activeChatUserId).messages || []);
        } else {
            setChatMessages([]);
        }

        ref.current.recalculate();
        if (ref.current.el) {
            ref.current.getScrollElement().scrollTop = ref.current.getScrollElement().scrollHeight;
        }
    }, [activeChatUserId, contactsList]);

    useEffect(() => {
        scrolltoBottom();
    }, [chatMessages]);
    //#endregion

    //#region Check who sent the message
    const checkIsSender = (chat) => {
        return chat?.sender?.toString() === 'admin';
    };
    //#endregion

    //#region Render
    return (
        <React.Fragment>
            <div className="user-chat w-100">
                <div className="d-lg-flex">
                    <div className={"w-100"}>
                        {/* render user head */}
                        <UserHead
                            currentContact={getContactById(contactsList, activeChatUserId)}
                        />

                        <SimpleBar
                            style={{ maxHeight: "100%" }}
                            ref={ref}
                            className="chat-conversation p-3 p-lg-4"
                            id="messages">

                            <ul className="list-unstyled mb-0">
                                {chatMessages?.map((chat, key) =>
                                            <li key={key} className={checkIsSender(chat) ? "right" : ""}>
                                                <div className="conversation-list">
                                                    {
                                                        //logic for display user name and profile only once, if current and last messaged sent by same receiver
                                                        chatMessages[key + 1] ? checkIsSender(chatMessages[key]) === checkIsSender(chatMessages[key + 1]) ?
                                                                <div className="chat-avatar">
                                                                    <div className="blank-div"></div>
                                                                </div>
                                                                :
                                                                <div className="chat-avatar">
                                                                    {checkIsSender(chat) ?
                                                                        (user?.photoUrl ?
                                                                                <img
                                                                                    src={user?.photoUrl}
                                                                                    alt="Avatar"
                                                                                    className={'Avatar'}
                                                                                />
                                                                                :
                                                                                <div className="chat-user-img align-self-center me-3">
                                                                                    <div className="avatar-xs Avatar">
                                                                                                <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                                                    {user?.fullName && user?.fullName.charAt(0).toUpperCase()}
                                                                                                </span>
                                                                                    </div>
                                                                                </div>
                                                                        ) : (
                                                                            !getContactById(contactsList, activeChatUserId)?.photoUrl ?
                                                                                <div className="chat-user-img align-self-center me-3">
                                                                                    <div className="avatar-xs Avatar">
                                                                                                <span
                                                                                                    className="avatar-title rounded-circle bg-soft-primary text-primary Avatar"
                                                                                                >
                                                                                                    {getContactById(contactsList, activeChatUserId)?.fullName.charAt(0).toUpperCase()}
                                                                                                </span>
                                                                                    </div>
                                                                                </div>
                                                                                :
                                                                                <img
                                                                                    src={getContactById(contactsList, activeChatUserId)?.photoUrl}
                                                                                    alt="Avatar"
                                                                                    className={'Avatar'}
                                                                                />
                                                                        )
                                                                    }
                                                                </div>
                                                            : <div className="chat-avatar">
                                                                {checkIsSender(chat) ? (
                                                                        user?.photoUrl ?
                                                                            <img
                                                                                src={user?.photoUrl}
                                                                                alt="Avatar"
                                                                                className={'Avatar'}
                                                                            />
                                                                            :
                                                                            <div
                                                                                className="chat-user-img align-self-center me-3"
                                                                            >
                                                                                <div className="avatar-xs Avatar">
                                                                                            <span
                                                                                                className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                                                {user?.fullName.charAt(0).toUpperCase()}
                                                                                            </span>
                                                                                </div>
                                                                            </div>
                                                                    )
                                                                    :
                                                                    <>
                                                                        {
                                                                            !getContactById(contactsList, activeChatUserId)?.photoUrl ?
                                                                                <div
                                                                                    className="chat-user-img align-self-center me-3">
                                                                                    <div className="avatar-xs Avatar">
                                                                                            <span
                                                                                                className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                                                {getContactById(contactsList, activeChatUserId)?.fullName.charAt(0).toUpperCase()}
                                                                                            </span>
                                                                                    </div>
                                                                                </div>
                                                                                : <img
                                                                                    src={getContactById(contactsList, activeChatUserId)?.photoUrl}
                                                                                    alt="Avatar"/>
                                                                        }
                                                                    </>
                                                                }
                                                            </div>
                                                    }

                                                    <div className="user-chat-content">
                                                        <div className="ctext-wrap">
                                                            <div className="ctext-wrap-content">
                                                                {
                                                                    chat?.messageText &&
                                                                    <p className="mb-0">
                                                                        {chat?.messageText}
                                                                    </p>
                                                                }

                                                                {
                                                                    chat?.imageMessage &&
                                                                    // image list component
                                                                    <ImageList images={chat.imageMessage} />
                                                                }

                                                                {
                                                                    chat?.fileMessage &&
                                                                    //file input component
                                                                    <FileList fileName={chat.fileMessage} fileSize={chat.size} />
                                                                }

                                                                {
                                                                    <p className="chat-time mb-0">
                                                                        {chat?.timestamp &&
                                                                            <span
                                                                                className="align-middle">{format(new Date(Number(chat.timestamp)), 'dd.MM.yy HH:mm')}</span>
                                                                        }
                                                                    </p>
                                                                }
                                                            </div>
                                                        </div>

                                                        {
                                                            chatMessages[key + 1] ?
                                                                checkIsSender(chatMessages[key]) === checkIsSender(chatMessages[key + 1]) ? null : (
                                                                    <div className="conversation-name">{checkIsSender(chat) ?
                                                                        user?.fullName : getContactById(contactsList, activeChatUserId)?.fullName}
                                                                    </div>
                                                                ) : (
                                                                    <div className="conversation-name">{checkIsSender(chat) ?
                                                                        user?.fullName : getContactById(contactsList, activeChatUserId)?.fullName}
                                                                    </div>
                                                                )
                                                        }
                                                    </div>
                                                </div>
                                            </li>
                                )}
                            </ul>
                        </SimpleBar>

                        <ChatInput
                            contactsList={contactsList}
                            contactId={getContactById(contactsList, activeChatUserId)}
                        />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
    //#endregion
};

export default UserChat;

