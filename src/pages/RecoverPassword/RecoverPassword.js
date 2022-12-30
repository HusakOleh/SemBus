import React, {useState} from 'react';
import LoginForm from "../../components/LoginForm/LoginForm";
import ModalNotification from "../../modals/ModalNotification/ModalNotification";
import {Link} from "react-router-dom";
import {sendPasswordResetEmail} from "firebase/auth";
import {auth} from "../../utils/firebaseConfigAndFunctions";

const RecoverPassword = () => {
    //#region Notification
    const [isNotification, setIsNotification] = useState(false);
    const [notificationTitle, setNotificationTitle] = useState('');
    const [notificationText, setNotificationText] = useState('');
    //#endregion

    //#region Data and handlers for password recover
    const [userEmail, setUserEmail] = useState('');

    function updateEmail(newValue) {
        setUserEmail(newValue);
    };

    async function recoverPasswordFormSubmitHandler(event) {
        event.preventDefault();

        try {
            await sendPasswordResetEmail(auth, userEmail);

            setIsNotification(true);
            setNotificationTitle('Notification');
            setNotificationText('Link for password recover was sent. Visit your email');
            console.log('Recover link was sent');
        } catch(error) {
            console.log(error.message);
            if (error.message.slice(22, -2) === 'invalid-email') {
                setNotificationTitle('Notification');
                setIsNotification(true);
                setNotificationText('You have entered wrong email, try again');
            } else {
                setNotificationTitle('Notification');
                setIsNotification(true);
                setNotificationText('Something went wrong, try again');
            }
        }
    };
    //#endregion

    //#region Render
    return (
        <>
            <div className="vh-100 d-flex justify-content-center">
                <div className="form-access my-auto">
                    <form>
                        <span>Reset password</span>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter Your Email Address"
                            onChange={(event) => updateEmail(event.target.value)}
                            value={userEmail}
                        />
                        <button
                            type="submit"
                            className="btn btn-primary"
                            onClick={(event) => recoverPasswordFormSubmitHandler(event)}
                        >
                            Reset
                        </button>
                        <h2>
                            Remember Password?
                            <Link to="/login"> Sign in here</Link>
                        </h2>
                    </form>
                </div>
            </div>

            {isNotification &&
                <ModalNotification
                    showModal={isNotification}
                    setShowModal={setIsNotification}
                    notificationTitle={notificationTitle}
                    notificationText={notificationText}
                />
            }
        </>
    );
    //#endregion
};

export default RecoverPassword;
