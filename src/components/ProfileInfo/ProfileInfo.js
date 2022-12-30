import React, {useEffect, useContext, useState} from 'react';
import {AppContext} from "../../context/appContext";
import {Link, useNavigate} from "react-router-dom";
import {collectionsInterface, userModel} from "../../utils/models";
import {getTranslation} from "../../utils/helpers";
import DatePicker from "react-datepicker";
import {auth, updateFieldInDocumentInCollection} from "../../utils/firebaseConfigAndFunctions";
import { updateEmail } from "firebase/auth";
import ModalReAuth from "../../modals/ModalReAuth/ModalReAuth";
import GetUserIp from "../GetUserIp/GetUserIp";

const ProfileInfo = () => {
    //#region Get dictionaries from context
    const {dictionary, defaultDictionary} = useContext(AppContext);
    //#endregion

    //#region Get navigation
    const navigate = useNavigate();
    //#endregion

    //#region Get user from context
    const {user, setUser} = useContext(AppContext);
    //#endregion

    //#region Manage edit modes
    const [isFullNameEditMode, setIsFullNameEditMode] = useState(false);
    const [isEmailEditMode, setIsEmailEditMode] = useState(false);
    const [isPhoneEditMode, setIsPhoneEditMode] = useState(false);
    const [isBirthdayEditMode, setIsBirthdayEditMode] = useState(false);
    const [isPasswordEditMode, setIsPasswordEditMode] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    //#endregion

    //#region Set and update userAccount data
    const [userAccountData, setUserAccountData] = useState(userModel);

    useEffect(() => {
        setUserAccountData(user);
    }, [user]);

    function updateAccountData(fieldName, newValue) {
        setUserAccountData(data => ({
            ...data,
            [fieldName]: newValue,
        }));
    }
    //#endregion

    //#region Update profile in DB
    const confirmProfileFieldEditing = async (fieldName) => {
        try {
            if (fieldName === 'email' && auth?.currentUser?.providerData[0].providerId === 'password') {
                setShowReAuthModal(true);

                return;
            };

            const updateResult = await updateFieldInDocumentInCollection(collectionsInterface.users, user.idPost, fieldName, userAccountData[fieldName]);

            console.log(updateResult);
            console.log(auth);
            console.log(auth.currentUser.providerData[0].providerId);

            setUser(prevUser => ({
                ...prevUser,
                [fieldName]: userAccountData[fieldName],
            }));
        } catch (error) {
            console.log(error);
        }
    };
    //#endregion

    //#region Modal for reAuth
    const [showReAuthModal, setShowReAuthModal] = useState(false);
    //#endregion

    //#region Render
    return (
        <>
            <GetUserIp />

            <img src={user?.photoUrl} alt={'Avatar'} />

            <p>
                {user?.fullName}
            </p>
            {getTranslation('ID number')}
            <p>
                {user?.uid}
            </p>

            <div className="form-group">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Full Name"
                    value={userAccountData?.fullName || ''}
                    onChange={(event) => updateAccountData('fullName', event.target.value)}
                    disabled={!isFullNameEditMode}
                />

                {isFullNameEditMode ?
                    <button
                        onClick={() => {
                            confirmProfileFieldEditing('fullName').then(r => setIsFullNameEditMode(false))
                                .catch(e => console.log(e));
                        }}
                    >
                        Save
                    </button>
                    :
                    <button
                        onClick={() => setIsFullNameEditMode(true)}
                    >
                        <img src={'/assets/images/edit.svg'} alt={'edit'}/>
                    </button>
                }
            </div>

            <div className="form-group">
                <input
                    type="email"
                    className="form-control"
                    placeholder="Email Address"
                    value={userAccountData?.email || ''}
                    onChange={(event) => updateAccountData('email', event.target.value)}
                    disabled={!isEmailEditMode}
                />

                {isEmailEditMode ?
                    <button
                        onClick={() => {
                            confirmProfileFieldEditing('email').then(r => setIsEmailEditMode(false))
                                .catch(e => console.log(e));
                        }}
                    >
                        Save
                    </button>
                    :
                    <button
                        onClick={() => setIsEmailEditMode(true)}
                    >
                        <img src={'/assets/images/edit.svg'} alt={'edit'}/>
                    </button>
                }
            </div>

            <div className="form-group">
                <input
                    type="text"
                    className="form-control"
                    placeholder="+380680000000"
                    value={userAccountData?.phoneNumber || ''}
                    onChange={(event) => updateAccountData('phoneNumber', event.target.value)}
                    disabled={!isPhoneEditMode}
                />

                {isPhoneEditMode ?
                    <button
                        onClick={() => {
                            confirmProfileFieldEditing('phoneNumber').then(r => setIsPhoneEditMode(false))
                                .catch(e => console.log(e));
                        }}
                    >
                        Save
                    </button>
                    :
                    <button
                        onClick={() => setIsPhoneEditMode(true)}
                        disabled={auth?.currentUser?.providerData[0]?.providerId === 'phone'}
                        title={auth?.currentUser?.providerData[0]?.providerId === 'phone' ?
                            getTranslation('Не можна редагувати номер, що використовується для авторизації', dictionary, defaultDictionary)
                            :
                            ''
                    }
                    >
                        <img src={'/assets/images/edit.svg'} alt={'edit'}/>
                    </button>
                }
            </div>

            <div className="form-group">
                <DatePicker
                    selected={userAccountData?.birthDay || new Date()}
                    onChange={(date) => updateAccountData('birthDay', date)}
                    dateFormat={'dd.MM.yyyy'}
                    disabled={!isBirthdayEditMode}
                />

                {isBirthdayEditMode ?
                    <>

                        <button
                            onClick={() => {
                            confirmProfileFieldEditing('birthDay').then(r => setIsBirthdayEditMode(false))
                                .catch(e => console.log(e));
                        }}
                        >
                            Save
                        </button>
                    </>
                    :
                    <>
                        {/*<input*/}
                        {/*    type="text"*/}
                        {/*    className="form-control"*/}
                        {/*    placeholder="Birthday"*/}
                        {/*    value={userAccountData?.birthDay}*/}
                        {/*    onChange={(event) => updateAccountData('phoneNumber', event.target.value)}*/}
                        {/*    disabled={!isBirthdayEditMode}*/}
                        {/*/>*/}

                        <button
                            onClick={() => setIsBirthdayEditMode(true)}
                        >
                            <img src={'/assets/images/edit.svg'} alt={'edit'}/>
                        </button>
                    </>
                }

                <Link to={'/changepassword'}>
                    {getTranslation('Змінити пароль', dictionary, defaultDictionary)}
                </Link>
            </div>

            {showReAuthModal &&
                <ModalReAuth
                    setShowModal={setShowReAuthModal}
                    showModal={showReAuthModal}
                    newEmail={userAccountData.email}
                    setUserAccountData={setUserAccountData}
                />
            }

            {/*<div className="form-group">*/}
            {/*    <input*/}
            {/*        type={isPasswordVisible ? 'text' : 'password'}*/}
            {/*        className="form-control"*/}
            {/*        placeholder="password"*/}
            {/*        value={userAccountData?.password}*/}
            {/*        onChange={(event) => updateAccountData('phoneNumber', event.target.value)}*/}
            {/*        disabled={isPasswordEditMode}*/}
            {/*    />*/}
            {/*</div>*/}
        </>
    );
    //#endregion
};

export default ProfileInfo;
