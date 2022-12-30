import React, {useContext, useEffect, useState} from 'react';
import {TextField} from "@adobe/react-spectrum";
import {Button, FormGroup, InputGroup} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import {
    auth,
    confirmCodeAndSignInWithPhone, getCollectionWhereKeyValue, sendCodeToSignInWithPhone,
    signIn,
} from "../../utils/firebaseConfigAndFunctions";
import {signInWithGoogleButtonClickHandler} from "../../utils/helpers";
import {AppContext} from "../../context/appContext";
import firebase from "firebase/compat/app";
import {getAuth, PhoneAuthProvider, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import {collectionsInterface} from "../../utils/models";

const LoginForm = () => {
    //#region Get setUser function from context
    const {setUser} = useContext(AppContext);
    //#endregion

    //#region Handle errors
        const [error, setError] = useState('');

        const clearError = () => {
            setError('');
        }

        useEffect(() => {
            if (error) {
                setTimeout(() => {
                    clearError();
                }, 5000);
            }
        }, [error]);

        const chooseErrorText = (errorMessage) => {
            if (errorMessage.includes('auth/user-not-found')) {
                return 'You entered wrong username (email). Please check and try again. Or maybe you are not registered.';
            }

            if (errorMessage.includes('auth/wrong-password')) {
                return 'You entered wrong password. Please try again.'
            }

            return (
                <>
                    <p>{'Unidentified error occurred. Inform your developer. Error message is:\n'}</p>
                    <p>{errorMessage}</p>
                </>);
        };
    //#endregion

    //#region Get history object
    const navigate = useNavigate();
    //#endregion

    //#region Phone auth
    const [phoneToAuth, setPhoneToAuth] = useState('');
    const [isFieldForCodeVisible, setIsFieldForCodeVisible] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [confirmationResult, setConfirmationResult] = useState({});

    const signInViaPhoneNumber = async () => {
        try {
            await confirmCodeAndSignInWithPhone(confirmationResult, verificationCode, setUser);

            navigate('/profile');
        } catch (error) {
            console.log(error);
        }
    }

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

    //#region Submit form and login user
    async function signInToApp(event, email, password) {
        event.preventDefault();

        try {
            const signedInUser = await signIn(email, password);

            // const userFromDb = await getCollectionWhereKeyValue(collectionsInterface.users, 'uid', signedInUser.user.uid);
            //
            // console.log(userFromDb);
            //
            // setUser(userFromDb);

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
                        onSubmit={(event) => signInToApp(event, credentials.email, credentials.password)}
                    >
                        <span>Sign In</span>
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
                        <div className="text-right">
                            <Link to="/recoverpassword">Forgot Password?</Link>
                        </div>

                        <button type="submit" className="btn btn-primary">
                            Sign In
                        </button>
                    </form>

                    <button
                        onClick={(event) => signInWithGoogleButtonClickHandler(event, setUser, navigate)}
                    >
                        Google
                    </button>

                    <div>
                        <input
                            type={'tel'}
                            placeholder={'+380990000000'}
                            onChange={(event => setPhoneToAuth(event.target.value))}
                        />

                        <button
                            onClick={() => sendCodeToSignInWithPhone(auth, phoneToAuth, setIsFieldForCodeVisible, setConfirmationResult)}
                        >
                            Send code
                        </button>

                        <div id={'recaptcha-container'}></div>

                        {isFieldForCodeVisible &&
                            <input
                                type={'text'}
                                onChange={(event) => setVerificationCode(event.target.value)}
                            />
                        }

                        <button
                            onClick={() => signInViaPhoneNumber()}
                        >
                            Confirm code
                        </button>
                    </div>

                    <h2>
                        Don't have an account? <Link to="/register">Sign up here</Link>
                    </h2>
                </div>
            </div>
        </>
    );
    //#endregion
};

export default LoginForm;
