import React, {useEffect, useState, useContext} from 'react';
import {Modal} from "react-bootstrap";
import {AppContext} from "../../context/appContext";
import {getTranslation, signInWithGoogleButtonClickHandler} from "../../utils/helpers";
import {Link, useNavigate} from "react-router-dom";
import {
    auth,
    sendCodeToSignInWithPhone,
    signIn,
    updateFieldInDocumentInCollection
} from "../../utils/firebaseConfigAndFunctions";
import {EmailAuthProvider, reauthenticateWithCredential, updateEmail, updatePassword} from "firebase/auth";
import {collectionsInterface} from "../../utils/models";

const ModalReAuth = ({showModal, setShowModal, newEmail, newPassword, addClasses, setUserAccountData = () => {}}) => {
    //#region Get dictionaries from context
    const {dictionary, defaultDictionary} = useContext(AppContext);
    //#endregion

    //#region Get user from context
    const {user, setUser} = useContext(AppContext);
    //#endregion

    //#region Get navigation
    const navigate = useNavigate();
    //#endregion

    //#region Update credentials
    const [credentials, setCredentials] = useState({});

    function updateCredentials(fieldName, newValue) {
        setCredentials(data => ({
            ...data,
            [fieldName]: newValue,
        }));
    }
    //#endregion

    //#region Submit form and reauth user
    async function reAuthUserAndUpdateEmailOrPassword(event, email, password) {
        event.preventDefault();

        try {
            const signedInUser = await signIn(email, password);

            const credential = EmailAuthProvider.credential(
                auth.currentUser.email,
                credentials.password
            );

            await reauthenticateWithCredential(auth.currentUser, credential);

            if (newEmail) {
                await updateEmail(auth.currentUser, newEmail);

                await updateFieldInDocumentInCollection(collectionsInterface.users, user.idPost, 'email', newEmail);

                setUser(prevUser => ({
                    ...prevUser,
                    email: newEmail,
                }));
            }

            if (newPassword) {
                const curUser = auth.currentUser;

                const authUser = await updatePassword(curUser, newPassword);

                navigate('/profile');
            }

            setShowModal(false);
        } catch (error) {
            console.log(error);
        }
    };
    //#endregion

    //#region Render
    return (
        <>
            <Modal show={showModal} fullscreen='true' onHide={() => {
                setShowModal(false);
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {
                            getTranslation('Авторизація', dictionary, defaultDictionary)
                        }
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div>
                        {
                            getTranslation('Авторизуйтесь повторно для виконання дії', dictionary, defaultDictionary)
                        }
                    </div>

                    <div className="d-flex justify-content-center">
                        <div className="form-access my-auto">
                            <form
                                onSubmit={(event) => reAuthUserAndUpdateEmailOrPassword(event, credentials.email, credentials.password)}
                            >
                                <div className="form-group">
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Email Address"
                                        value={credentials.email || ''}
                                        onChange={(event) => updateCredentials('email', event.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Password"
                                        value={credentials.password || ''}
                                        onChange={(event) => updateCredentials('password', event.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">
                                    {
                                        getTranslation('Підтвердити', dictionary, defaultDictionary)
                                    }
                                </button>
                            </form>
                        </div>
                    </div>

                    <button
                        type={'button'}
                        className={'btn ColoredButton'}
                        onClick={() => {
                            setShowModal(false);
                            setUserAccountData(user);
                        }}
                    >
                        {'Go back'}
                    </button>
                </Modal.Body>
            </Modal>
            {/*<div className={`Notification ${addClasses}`}>*/}
            {/*    <button*/}
            {/*        text={'X'}*/}
            {/*        className={'Notification_Button'}*/}
            {/*        onClick={(event) => closeButtonClick(event)}*/}
            {/*    />*/}
            {/*    <h4 className={'Notification_Title'}>*/}
            {/*        {notificationTitle}*/}
            {/*    </h4>*/}
            {/*    <p className={'Notification_Text'}>*/}
            {/*        {notificationText}*/}
            {/*    </p>*/}
            {/*</div>*/}
        </>
    );
    //#endregion
};

export default ModalReAuth;
