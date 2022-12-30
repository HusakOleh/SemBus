import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {registerUser} from "../../utils/helpers";
import {auth} from "../../utils/firebaseConfigAndFunctions";
import { updatePassword } from "firebase/auth";
import ModalNotification from "../../modals/ModalNotification/ModalNotification";
import ModalReAuth from "../../modals/ModalReAuth/ModalReAuth";

const ChangePasswordForm = () => {
    //#region Get navigation
    const navigate = useNavigate();
    //#endregion

    //#region Modal for reAuth
    const [showReAuthModal, setShowReAuthModal] = useState(false);
    //#endregion

    //#region Notification
    const [notification, setNotification] = useState(false);
    const [notificationTitle, setNotificationTitle] = useState('');
    const [notificationMessage, setNotificationMessage] = useState('');
    //#endregion

    //#region New password data
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    //#endregion

    //#region Change password function
    const changePasswordSubmit = async (event) => {
        event.preventDefault();

        if (newPassword !== confirmNewPassword) {
            setNotification(true);
            setNotificationTitle('Error in form filling');
            setNotificationMessage('Passwords don\'t match');

            return;
        }

        setShowReAuthModal(true);
        // try {
        //     const curUser = auth.currentUser;
        //
        //     const authUser = await updatePassword(curUser, newPassword);
        //
        //     navigate('/profile');
        // } catch (error) {
        //     console.log(error);
        // }
    };
    //#endregion

    //#region Render
    return (
        <>
            <h2>
                {'Change password'}
            </h2>

            <div className="d-flex justify-content-center">
                <div className="form-access my-auto">
                <form
                    onSubmit={(event) => changePasswordSubmit(event)}
                >
                    <div className="form-group">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            value={newPassword || ''}
                            onChange={(event) => setNewPassword(event.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Confirm Password"
                            value={confirmNewPassword || ''}
                            onChange={(event) => setConfirmNewPassword(event.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary">
                        Reset password
                    </button>
                </form>
            </div>
            </div>


            {showReAuthModal &&
                <ModalReAuth
                    setShowModal={setShowReAuthModal}
                    showModal={showReAuthModal}
                    newPassword={newPassword}
                />
            }

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

export default ChangePasswordForm;
