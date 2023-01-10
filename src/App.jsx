import React from "react";
import './utils/_reset.scss';
import './App.scss';

import {Header} from "./components/Header/Header";
import {Footer} from "./components/Footer/Footer";

import {Button, Checkbox, defaultTheme, Provider, TextField} from '@adobe/react-spectrum';
import {Form, Route, Routes} from "react-router-dom";
import Page404 from "./pages/Page404/Page404";
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-datepicker/dist/react-datepicker.css";
import 'react-chat-widget/lib/styles.css';
import routes from "./utils/routes";
import {useContext, useEffect} from "react";
import {AppContext} from "./context/appContext";
import {getIpNumbers, getTranslation, setContactToRDB} from "./utils/helpers";
import {appDictionaries} from "./utils/dictionaries";
import {auth, fire, getCollectionWhereKeyValue} from "./utils/firebaseConfigAndFunctions";
import {sessionUserId, userModel} from "./utils/models";
import {addResponseMessage, Widget} from 'react-chat-widget';
import './index.scss';
import 'remixicon/fonts/remixicon.css';
import ClientChat from "./components/ClientChat/ClientChat";

function App() {
    //#region Get lang, dictionaries and functions from context
    const {lang, dictionary, dictionaries, setDictionary, setDictionaries, setDefaultDictionary, defaultDictionary} = useContext(AppContext);
    //#endregion

    //#region Get user from context
    const {user, setUser} = useContext(AppContext);
    //#endregion

    //#region Set user to context after auth change
    useEffect(() => {
        fire.auth().onAuthStateChanged((result) => {
            // console.log('We are inside authstate changed');

            try {
                if (result) {
                    getCollectionWhereKeyValue('users', 'uid', result.uid)
                        .then(users => {
                            if (users.length > 0) {
                                setUser(users[0]);
                                sessionStorage.clear();
                            }
                        }).catch(error => console.log(error));
                } else {
                    // if (sessionStorage.getItem(sessionUserId)) {
                    //     setUser({
                    //         ...userModel,
                    //         idPost: sessionStorage.getItem(sessionUserId),
                    //         fullName: 'Anonym',
                    //     });
                    // } else {
                    //     let userId = '';
                    //
                    //     getIpNumbers().then(res => {
                    //         userId = res.toString() + Date.now().toString();
                    //
                    //         sessionStorage.setItem(sessionUserId, userId);
                    //
                    //         setUser({
                    //             ...userModel,
                    //             idPost: userId,
                    //             fullName: 'Anonym',
                    //         });
                    //
                    //         setContactToRDB(true, {
                    //             ...userModel,
                    //             idPost: userId,
                    //             id: userId,
                    //         }).then(r => console.log(r)).catch(e => console.log(e));
                    //
                    //     }).catch(error => console.log(error));
                    // }
                };
            } catch (error) {
                console.log(error);
            }
        });
    }, []);
    //#endregion

    //#region Set initial dictionaries
    useEffect(() => {
        setDictionaries(appDictionaries);
        const currentDictionary = appDictionaries.find(dict => dict.name === lang);
        setDictionary(currentDictionary);
        // console.log(dictionaries[0].dictionaries);
        setDefaultDictionary(appDictionaries.find(dict => dict.name === 'ua'));
    }, [lang]);
    //#endregion

    //#region Chat widget
    useEffect(() => {
        // addResponseMessage('Welcome to this awesome chat!');
    }, []);

    const handleNewUserMessage = (newMessage) => {
        console.log(`New message outcoming! ${newMessage}`);
        // Now send the message throught the backend API
        // addResponseMessage(newMessage);
    };
    //#endregion

    //#region Render
    return (
        <div className="App">
            <div className="wrap">
              <Header />
            </div>

            {/*<h1>*/}
            {/*    {getTranslation('SemBus', dictionary, defaultDictionary)}*/}
            {/*</h1>*/}

            {/*<Widget*/}
            {/*    handleNewUserMessage={handleNewUserMessage}*/}
            {/*    title="SEM BUS chat"*/}
            {/*    subtitle="Напишіть оператору"*/}
            {/*    fullScreenMode={false}*/}
            {/*/>*/}

            <Routes>
                {
                    routes.map((data,idx) => (
                        <Route
                          key={idx}
                          path={data.path}
                          element={data.component}
                          exact
                        />
                    ))
                }

                <Route path='*' element={<Page404 />} />
            </Routes>
            <Footer />
        </div>
    );
    //#endregion
    }

export default App;
