import React, {useContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {AppContext} from "../../context/appContext";
import {auth} from "../../utils/firebaseConfigAndFunctions";
import {getTranslation} from "../../utils/helpers";
import ClientChat from "../../components/ClientChat/ClientChat";

const Home = () => {
    //#region Get user from app context
    const {user} = useContext(AppContext);
    //#endregion

    //#region Get navigation
    const navigate = useNavigate();
    //#endregion

    //#region Get dictionaries from context
    const {dictionary, defaultDictionary} = useContext(AppContext);
    //#endregion

    //#region Redirect to profile if user authorized
    useEffect(() => {
        // console.log('We are inside useEffect of Home');
        // console.log(user);
        // console.log(auth.currentUser);

        setTimeout(() => {
            if (auth?.currentUser) {
                navigate('/profile');
            }
        }, 500);
    }, []);
    //#endregion

    //#region Handle chat appearance
    const [shouldChatBeShown, setShouldChatBeShown] = useState(false);
    const [isChatVisible, setIsChatVisible] = useState(false);
    const toggleChat = () => {
        setIsChatVisible(state => !state);
    }
    //#endregion

    //#region Render
    return (
        <>
            <h1>
                {getTranslation('Головна', dictionary, defaultDictionary)}
            </h1>

            {isChatVisible ?
                <div className={'UnauthorizedChat'}>
                    <div
                        className={'CloseChat'}
                        onClick={() => toggleChat()}
                    >
                        X
                    </div>

                    <ClientChat />
                </div>
                :
                <div
                    onClick={() => toggleChat()}
                    className={'OpenChat'}
                >
                    Open
                </div>
            }
        </>
    );
    //#endregion
};

export default Home;
