import React, {useState, useEffect, useRef, useContext} from 'react';
import SimpleBar from "simplebar-react";
import {format} from "date-fns";
import {AppContext} from "../../context/appContext";
import {
    getIpNumbers,
    listenToAccountMessages,
    setContactToRDB
} from "../../utils/helpers";
import UserHead from "../UserHead/UserHead";
import ChatInput from "../ChatInput/ChatInput";
import FileList from "../FileList/FileList";
import ImageList from "../ImageList/ImageList";
import {sessionUserId, userModel} from "../../utils/models";
import {auth} from "../../utils/firebaseConfigAndFunctions";

function ClientChat() {
    //#region Get active contact id
    const {activeChatUserId} = useContext(AppContext);
    //#endregion

    //#region Get user and its setting function from context
    const {user, setUser} = useContext(AppContext);
    //#endregion

    //#region Ref
    const ref = useRef();

    function scrolltoBottom() {
        if (ref.current.el) {
            ref.current.getScrollElement().scrollTop = ref.current.getScrollElement().scrollHeight;
        }
    };
    //#endregion

    //#region Handle setting unauthorized user
    useEffect(() => {
        if (!auth.currentUser) {
            if (sessionStorage.getItem(sessionUserId)) {
                setUser({
                    ...userModel,
                    idPost: sessionStorage.getItem(sessionUserId),
                    fullName: 'Anonym',
                });
            } else {
                let userId = '';

                getIpNumbers().then(res => {
                    userId = res.toString() + Date.now().toString();

                    sessionStorage.setItem(sessionUserId, userId);

                    setUser({
                        ...userModel,
                        idPost: userId,
                        fullName: 'Anonym',
                    });

                    setContactToRDB(true, {
                        ...userModel,
                        idPost: userId,
                        id: userId,
                    }).then(r => console.log(r)).catch(e => console.log(e));

                }).catch(error => console.log(error));
            }
        }
    }, []);
    //#endregion

    //#region Variable for listener unsubscribe
    const [unsubscribe, setUnsubscribe] = useState([]);
    //#endregion

    //#region Launch listener and set chatMessages
    const [chatMessages, setChatMessages] = useState([]);

    const updateChatMessages = (messagesObj) => {
        if (messagesObj) {
            const messagesList = Object.values(messagesObj);
            setChatMessages(messagesList);
        } else {
            setChatMessages([]);
        }
    }

    useEffect(() => {
        if (user?.idPost) {
            try {
                let curRef = listenToAccountMessages(user.idPost, updateChatMessages);

                setUnsubscribe(state => [...state, curRef]);
            } catch (error) {
                console.log(error);
            }
        }

        return () => {
            try {
                unsubscribe.forEach(unsubRef => {
                    unsubRef.off();
                });
            } catch (error) {
                console.log(error);
            }

            setUnsubscribe([]);
        };
    }, [user]);
    //#endregion

    //#region Messages list scroll
    useEffect(() => {
        scrolltoBottom();
    }, [chatMessages]);
    //#endregion

    //#region Check who sent the message
    const checkIsSender = (chat) => {
        return chat?.sender?.toString() !== 'admin';
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
                            currentContact={{
                                photoUrl: './assets/images/admin-avatar.png',
                                fullName: 'Admin',
                            }}
                        />

                        <div className={'ChatContainer'}>
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
                                                                        // <div className="chat-user-img align-self-center me-3">
                                                                        //     <div className="avatar-xs Avatar">
                                                                        //                         <span
                                                                        //                             className="avatar-title rounded-circle bg-soft-primary text-primary Avatar"
                                                                        //                         >
                                                                        //                             {'Admin'.charAt(0).toUpperCase()}
                                                                        //                         </span>
                                                                        //     </div>
                                                                        // </div>

                                                                        <img
                                                                            src={'./assets/images/admin-avatar.png'}
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
                                                                    {/*// <div*/}
                                                                    {/*//     className="chat-user-img align-self-center me-3">*/}
                                                                    {/*//     <div className="avatar-xs Avatar">*/}
                                                                    {/*//                     <span*/}
                                                                    {/*//                         className="avatar-title rounded-circle bg-soft-primary text-primary">*/}
                                                                    {/*//                         {'Admin'.charAt(0).toUpperCase()}*/}
                                                                    {/*//                     </span>*/}
                                                                    {/*//     </div>*/}
                                                                    {/*// </div>*/}
                                                                    <img
                                                                        src={'./assets/images/admin-avatar.png'}
                                                                        alt="Avatar"
                                                                        className={'Avatar'}
                                                                    />
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
                                                                    user?.fullName : 'Admin'}
                                                                </div>
                                                            ) : (
                                                                <div className="conversation-name">{checkIsSender(chat) ?
                                                                    user?.fullName : 'Admin'}
                                                                </div>
                                                            )
                                                    }
                                                </div>
                                            </div>
                                        </li>
                                    )}
                                </ul>
                            </SimpleBar>
                        </div>

                        <ChatInput />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
    //#endregion
};

export default ClientChat;

