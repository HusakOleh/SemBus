import React, {useContext, useEffect, useState} from 'react';
import {AppContext} from "../../context/appContext";
import ChatLeftSidebar from "../ChatLeftSidebar/ChatLeftSidebar";
import UserChat from "../UserChat/UserChat";
import {getAccountContactsList, listenToAllMessagesForAdmin} from "../../utils/helpers";
import {getCollection} from "../../utils/firebaseConfigAndFunctions";
import {Col, Row} from "reactstrap";

const AdminChat = () => {
    //#region Get user from app context
    const {user} = useContext(AppContext);
    //#endregion

    //#region Get dictionaries from context
    const {dictionary, defaultDictionary} = useContext(AppContext);
    //#endregion

    //#region Variable for listener unsubscribe
    const [unsubscribe, setUnsubscribe] = useState([]);
    //#endregion

    //#region Make sound
    const makeSound = () => {
        const soundeffect = new Audio("message-signal.mp3");
        try {
            soundeffect.cloneNode().play();
        } catch (error) {
            console.log(error);
        }
    }
    //#endregion

    //#region Contacts list and sound processing
    const [contactsList, setContactsList] = useState([]);

    const [countUpdates, setCountUpdates] = useState(0);

    const [lastUpdatedDataChunk, setLastUpdatedDataChunk] = useState({});

    function changeCountAndCurrentAccountMessages (data, accountId) {
        // console.log('changeCountAndCurrentAccountMessages launched');
        // console.log(data);
        // console.log(accountId);

        if (data) {
            const newData = {
                [accountId]: data,
            }
            setLastUpdatedDataChunk(newData);
            setCountUpdates(count => count + 1);
        }
    };

    //#region Find if there are any new income messages
    const compareMessagesOfAccountWithExactContact = (contactId, newMessagesObj, prevMessagesList) => {
        // console.log('We are inside compareMessagesOfAccountWithExactContact');
        // console.log(contactId);
        // console.log(newMessagesObj);
        // console.log(prevMessagesList);

        try {
            const newMessagesList = Object.values(newMessagesObj[contactId]);

            // console.log(prevMessagesList);
            // console.log(newMessagesList);

            if (prevMessagesList?.length < newMessagesList?.length) {
                //Simple check of last message (should be most complicated most of all)

                // console.log('Check if the message is incoming');
                // console.log(newMessagesList[newMessagesList.length - 1].sender);
                // console.log(contactId);
                // console.log(typeof(newMessagesList[newMessagesList.length - 1].sender));
                // console.log(typeof(contactId));
                if (Number(newMessagesList[newMessagesList.length - 1].sender) === Number(contactId)) {
                    // console.log('makeSound triggered');
                    // makeSound();
                }
            };

        } catch (error) {
            console.log(error);
        }
    };
    //#endregion

    async function changeContactsList(data) {
        if (data) {
            let contacts = [];

            // console.log('We are inside changeContactsList');

            try {
                contacts = await getAccountContactsList('admin');

                // console.log(contacts);

                // const updatedAccountId = Object.keys(lastUpdatedDataChunk)[0];
                // console.log(updatedAccountId);
                //
                // contacts.forEach(contact => {
                //     const contactInPrevList = contactsList.find(prevContact => prevContact.id === contact.id);
                //
                //     if (contactInPrevList) {
                //         compareMessagesOfAccountWithExactContact(contact.id, lastUpdatedDataChunk[updatedAccountId], contactInPrevList.messages);
                //     } else {
                //         if (Number(contact?.id) === Number(contact?.messages[0]?.sender)) {
                //             makeSound();
                //         }
                //     }
                // });

                // console.log('-----------------------------------');
                setContactsList(contacts);

            } catch (error) {
                console.log(error);
            }
        }
    };

    useEffect(() => {
        console.log('useEffect launched after count update');

        changeContactsList(true).then(r => console.log('Contacts list changed successfully')).catch(e => console.log(e));
    }, [countUpdates]);
    //#endregion

    //#region Launch listener
    useEffect(() => {
        let curRef = listenToAllMessagesForAdmin(changeCountAndCurrentAccountMessages, 'admin');

        setUnsubscribe(state => [...state, curRef]);

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
    }, []);
    //#endregion

    //#region Render
    return (
        <>
            <div className="layout-wrapper d-lg-flex">
                {/*<button*/}
                {/*    onClick={() => console.log(contactsList)}*/}
                {/*>*/}
                {/*    Check contacts list in AdminChat*/}
                {/*</button>*/}
                {/*<Row>*/}
                {/*    <Col md={4}>*/}
                <ChatLeftSidebar
                    contactsList={contactsList}
                />
                {/*</Col>*/}
                {/*<Col md={8}>*/}
                <UserChat
                    contactsList={contactsList}
                    // setContactsList={setContactsList}
                />
                {/*</Col>*/}
                {/*</Row>*/}
            </div>
        </>
    );
    //#endregion
};

export default AdminChat;
