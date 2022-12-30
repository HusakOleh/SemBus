import React, {useState} from 'react';
import {dictionaryModel, userModel} from "../utils/models";

export const AppContext = React.createContext({
    user: userModel,
    isUserDataComplete: false,
    lang: 'ua',
    dictionary: dictionaryModel,
    dictionaries: [],
    defaultDictionary: dictionaryModel,
    activeChatUserId: '',
    setUser: () => {},
    setIsUserDataComplete: () => {},
    setLang: () => {},
    setDictionary:  () => {},
    setDictionaries: () => {},
    setDefaultDictionary: () => {},
    setActiveChatUserId: () => {},
});

export const AppProvider = ({ children }) => {
    const [user,setUser] = useState(userModel);
    const [isUserDataComplete, setIsUserDataComplete] = useState(false);
    const [lang, setLang] = useState('ru');
    const [dictionary, setDictionary] = useState(dictionaryModel);
    const [defaultDictionary, setDefaultDictionary] = useState(dictionaryModel);
    const [dictionaries, setDictionaries] = useState([]);
    const [activeChatUserId, setActiveChatUserId] = useState('');

    const contextValue = {
        user,
        setUser,
        isUserDataComplete,
        setIsUserDataComplete,
        lang,
        setLang,
        dictionary,
        setDictionary,
        dictionaries,
        setDictionaries,
        defaultDictionary,
        setDefaultDictionary,
        activeChatUserId,
        setActiveChatUserId,
    }
    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    )
};
