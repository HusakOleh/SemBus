import React, {useContext, useState} from 'react';
import {Link} from "react-router-dom";
import {AppContext} from "../../context/appContext";
import {getMessageTime} from "../../utils/helpers";

const DisplayContactsWithMessages = ({contactsList, openUserChat}) => {
    //#region Get user from context
    const {user, setUser} = useContext(AppContext);
    //#endregion

    //#region Get active chat user and set function from context
    const {activeChatUserId} = useState('');
    //#enregion

    const serviceMessages = ['Is ready to chat with you!', 'Is exploring your profile right now!', 'Is online! Don\'t miss your chance to communicate!'];

    const sortContactsList = (contactsList) => {
        const contactsCopy = [...contactsList];

        contactsCopy.sort((contact1, contact2) => {
            if (contact1?.messages?.length > 0 && contact2?.messages?.length > 0) {
                let contact1LastMes = contact1?.messages[contact1.messages.length - 1];
                let contact2LastMes = contact2?.messages[contact2.messages.length - 1];
                if (contact1LastMes?.timestamp > contact2LastMes?.timestamp) {
                    return -1;
                }
            }

            return 0;
        });

        return contactsCopy;
    };
    //#endregion

    //#region Check is new message
    const checkIsNewMessage = (contact) => {
        if (contact?.messages?.length > 0) {
            const lastMessage = contact?.messages?.[contact.messages.length - 1];

            if (lastMessage?.sender !== 'admin') {
                return true;
            }
        }

        return false;
    }
    //#endregion

    //#region Render
    return (
        <>
            {contactsList.length === 0 &&
                <ul className="list-unstyled chat-list chat-user-list">
                    <li>
                        <Link to="#" className={'FalseLink'}>
                            <div className="d-flex">
                                <div className={"chat-user-img align-self-center me-3 ms-0"}>
                                    <div className="avatar-xs">
                                    <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                        {'N'}
                                    </span>
                                    </div>
                                </div>
                                <div className="flex-grow-1 overflow-hidden">
                                    <h5 className="text-truncate font-size-15 mb-1">
                                        {'No messages to display'}
                                    </h5>

                                    <p className="chat-user-message text-truncate mb-0">
                                        {'Choose account with messages'}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </li>
                </ul>
            }

            <ul className="list-unstyled chat-list chat-user-list" id="chat-list">
                {sortContactsList(contactsList).map((chat, key) =>
                    <li key={key} id={"conversation" + key} className={key === activeChatUserId ? "Contact active" : "Contact"}>
                        <Link to="#" onClick={(e) => openUserChat(e, chat)}>
                            <div className="d-flex">
                                {!chat.photoUrl ?
                                    <div className={"chat-user-img align-self-center me-3 ms-0"}>
                                        <div className="avatar-xs">
                                                <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                    {chat.fullName.charAt(0).toUpperCase()}
                                                </span>
                                        </div>
                                    </div>
                                    :
                                    <div className={"chat-user-img align-self-center me-3 ms-0"}>
                                        <img src={chat.photoUrl} className="rounded-circle avatar-xs" alt="Dating chat" />
                                    </div>
                                }

                                <div className="flex-grow-1 overflow-hidden">
                                    <h5 className="text-truncate font-size-15 mb-1">{chat.fullName}</h5>
                                    <p className="chat-user-message text-truncate mb-0">
                                        <>
                                            {
                                                chat.messages && (chat.messages.length > 0 && chat.messages[(chat.messages).length - 1].isImageMessage === true) ? <i className="ri-image-fill align-middle me-1"></i> : null
                                            }
                                            {
                                                chat.messages && (chat.messages.length > 0 && chat.messages[(chat.messages).length - 1].isFileMessage === true) ? <i className="ri-file-text-fill align-middle me-1"></i> : null
                                            }
                                            {
                                                chat.messages && chat.messages.length > 0 ? chat.messages[(chat.messages).length - 1].messageText : null
                                            }
                                        </>
                                    </p>
                                </div>

                                <div className="font-size-11 MessageTime">
                                    {chat.messages && chat.messages.length > 0 ? getMessageTime(chat.messages[(chat.messages).length - 1]) : null}
                                </div>
                                <div>
                                    {checkIsNewMessage(chat) ?
                                        <span className={'Contact-WithNewMessage'}>{'new'}</span> : ''
                                    }
                                </div>
                            </div>
                        </Link>
                    </li>
                )}
            </ul>
        </>
    );
    //#endregion
};

export default DisplayContactsWithMessages;
