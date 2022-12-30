import React, {useContext, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import ModalNotification from "../../modals/ModalNotification/ModalNotification";
import {userModel} from "../../utils/models";
import {AppContext} from "../../context/appContext";
import {registerUser, signInWithGoogleButtonClickHandler} from "../../utils/helpers";

const RegistrationForm = () => {
    //#region Get navigation
    const navigate = useNavigate();
    //#endregion

    //#region Get user from context
    const {user, setUser} = useContext(AppContext);
    //#endregion

    //#region Update userAccount data
    const [userAccountData, setUserAccountData] = useState(userModel);

    function updateAccountData(fieldName, newValue) {
        setUserAccountData(data => ({
            ...data,
            [fieldName]: newValue,
        }))
    }
    //#endregion

    //#region Notification
    const [notification, setNotification] = useState(false);
    const [notificationTitle, setNotificationTitle] = useState('');
    const [notificationMessage, setNotificationMessage] = useState('');
    //#endregion

    //#region Submit form and register new user
    function setUserAfterReg (userData) {
        // console.log('setUserAfterReg launched');
        // console.log(userData);
        setUser(userData);
    };

    async function registerNewUser(event, accountData) {
        event.preventDefault();

        if (accountData.password !== accountData.repeatPassword) {
            setNotification(true);
            setNotificationTitle('Error in form filling');
            setNotificationMessage('Passwords don\'t match');

            return;
        }

        try {
            const authUser = await registerUser(accountData.fullName, accountData.email, accountData.password, setUserAfterReg);
            // console.log('We are inside registerNewUser');
            // console.log(authUser.uid);
            // const userFromDB = await getCollectionWhereKeyValue(collectionsNames.users, 'uid', authUser.uid);
            // console.log(userFromDB);
            // setUser(userFromDB[0]);

            navigate('/profile');
        } catch (error) {
            console.log(error);
        }
    }
    //#endregion

    //#region Render
    return (
        <>
            <div className="vh-100 d-flex justify-content-center">
                <div className="form-access my-auto">
                    <form
                        onSubmit={(event) => registerNewUser(event, userAccountData)}
                    >
                        <span>Create Account</span>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Full Name"
                                value={userAccountData.fullName}
                                onChange={(event) => updateAccountData('fullName', event.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Email Address"
                                value={userAccountData.email}
                                onChange={(event) => updateAccountData('email', event.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Password"
                                value={userAccountData.password || ''}
                                onChange={(event) => updateAccountData('password', event.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Confirm Password"
                                value={userAccountData.repeatPassword || ''}
                                onChange={(event) => updateAccountData('repeatPassword', event.target.value)}
                                required
                            />
                        </div>
                        <div className="custom-control custom-checkbox">
                            <input
                                type="checkbox"
                                className="custom-control-input"
                                id="form-checkbox"
                                required
                            />
                            <label className="custom-control-label" htmlFor="form-checkbox">
                                I agree to the{' '}
                                <Link to="/terms-and-conditions">Terms & Conditions</Link>
                            </label>
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Create Account
                        </button>
                    </form>

                    <button
                        onClick={(event) => signInWithGoogleButtonClickHandler(event, setUser, navigate)}
                    >
                        Google
                    </button>
                    <h2>
                        Already have an account?
                        <
                            Link to="/login"> Sign in here</Link>
                    </h2>
                </div>
            </div>

            {notification &&
                <ModalNotification
                    showModal={notification}
                    setShowModal={setNotification}
                    notificationTitle={notificationTitle}
                    notificationText={notificationMessage}
                />
            }
        </>
    );
    //#endregion
};

export default RegistrationForm;
