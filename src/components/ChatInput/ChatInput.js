import React, {useEffect, useState, useContext} from 'react';
import Picker from 'emoji-picker-react';
import {sendMessage} from "../../utils/helpers";
import {AppContext} from "../../context/appContext";
import {Button, Col, Dropdown, DropdownMenu, DropdownToggle, Form, Row} from "reactstrap";

function ChatInput() {
    //#region Get user from app context
    const {user} = useContext(AppContext);
    //#endregion

    //#region Get user from app context
    const {activeChatUserId} = useContext(AppContext);
    //#endregion

    //#region State with data
    const [textMessage, setTextMessage] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [file, setFile] = useState({
        name: "",
        size: "",
    });
    const [fileImage, setFileImage] = useState({
        name: "",
        size: "",
    });
    //#endregion

    //#region Toggle function for emoji
    const toggle = () => setIsOpen(state => !state);
    //#endregion

    //#region Function for text input value change
    const handleChange = e => {
        setTextMessage(e.target.value)
    }

    const onEmojiClick = (event, emojiObject) => {
        setTextMessage(textMessage + emojiObject.emoji)
    };
    //#endregion

    //#region Function for send message
    const addMessage = async (message, type, accountData, contactId) => {
        let curTime = Date.now();
        const messageObj = {
            messageText: message.messageText || '',
            timestamp: curTime,
            sender: accountData.idPost || '',
            senderLogin: accountData.login || '',
            recipientId: contactId || '',
            fileLink: message?.fileUrl || '',
            imageLink: message?.imageUrl || '',
            isTextMessage: !!message.messageText,
            isFileMessage: !!message.fileUrl,
            isImageMessage: !!message.imageUrl,
        };

        try {
            if (user.role === 'admin') {
                await sendMessage(messageObj, accountData.idPost, contactId, 'messages');
            } else {
                await sendMessage(messageObj, contactId, accountData.idPost, 'messages');
            }
        } catch (error) {
            console.log(error);
        }


    };

    const onaddMessage = async (e, textMessage) => {
        e.preventDefault();
        //if text value is not emptry then call onaddMessage function

        if (textMessage !== "") {
            try {
                // await addMessage(textMessage, "textMessage", getContactById(contactsList, active_user), getContactById(contactsList, active_user).id);
                if (user.role === 'admin') {
                    await addMessage({
                        messageText: textMessage,
                    }, "textMessage", {idPost: 'admin'}, activeChatUserId);
                } else {
                    await addMessage({
                        messageText: textMessage,
                    }, "textMessage", user, 'admin');
                }
            } catch (error) {
                console.log(error);
            }
        }

        clearMessages();
    };
    //#endregion

    //#region Reset message values if contact changes
    const clearMessages = () => {
        setTextMessage('');

        setFile({
            name: "",
            size: ""
        });

        setFileImage({
            name: "",
            size: ""
        });
    };

    // useEffect(() => {
    //     clearMessages();
    // }, [active_user]);
    //#endregion

    //#region Render
    return (
        <React.Fragment>
            <div className="p-3 p-lg-4 border-top mb-0">
                <Form
                    onSubmit={(e) => onaddMessage(e, textMessage)
                } >
                    <Row noGutters>
                        <Col>
                            <div>
                                <input type="text" value={textMessage} onChange={handleChange} className="form-control form-control-lg bg-light border-light" placeholder="Enter Message..." />
                                <span>{file.name}</span>
                                <span>{fileImage.name}</span>
                            </div>
                        </Col>
                        <Col xs="auto">
                            <div className="chat-input-links ms-md-2">
                                <ul className="list-inline mb-0 ms-0">
                                    <li className="list-inline-item">
                                        <Dropdown className="emoji-dropdown" direction="up" isOpen={isOpen} toggle={toggle}>
                                            <DropdownToggle id="emoji" color="link" className="text-decoration-none font-size-16 btn-lg waves-effect">
                                                <i className="ri-emotion-happy-line"></i>
                                            </DropdownToggle>
                                            <DropdownMenu className="dropdown-menu-end">
                                                <Picker onEmojiClick={onEmojiClick}  />
                                            </DropdownMenu>
                                        </Dropdown>
                                    </li>
                                    <li className="list-inline-item">
                                        <Button type="submit" color="primary" className="font-size-16 btn-lg chat-send waves-effect waves-light">
                                            <i className="ri-send-plane-2-fill"></i>
                                        </Button>
                                    </li>
                                </ul>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </div>
        </React.Fragment>
    );
    //#endregion
}

export default ChatInput;
