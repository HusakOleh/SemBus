import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/compat/database';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    FacebookAuthProvider,
    sendPasswordResetEmail,
    signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber,
} from "firebase/auth";
import {userModel} from "./models";
import {createOrGetUser} from "./helpers";
import { getDatabase } from "firebase/database";

//#region Firebase creds and main variables
const firebaseConfig = {
    apiKey: "AIzaSyBMXfUxuSYNLoqFTE0aj6kCmEPc9-vOHVI",
    authDomain: "sem-bus.firebaseapp.com",
    projectId: "sem-bus",
    storageBucket: "sem-bus.appspot.com",
    messagingSenderId: "1097123408773",
    appId: "1:1097123408773:web:ff1846a6a66ee72e6732ec",
    measurementId: "G-SVXFEKPMZY"
};

export const fire = firebase.initializeApp(firebaseConfig);
export const db = fire.firestore();
export const auth = getAuth();
export const realTimeDb = getDatabase(fire,'https://sem-bus-default-rtdb.europe-west1.firebasedatabase.app');
//#endregion

//#region Auth
export function signUp (email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
};

export function signIn(email, password, setUser){
    return signInWithEmailAndPassword(auth, email, password);
};

export async function googleSignIn (setUser = () => {}) {
    const provider = new GoogleAuthProvider();

    try {
        const googleSignInResult = await signInWithPopup(auth, provider);
        console.log('We are inside google sign in');
        console.log(googleSignInResult);

        const fullName = googleSignInResult.user.displayName;

        const names = fullName.split(' ');

        let firstName = '';
        let lastName = '';

        if (names.length > 1) {
            firstName = names[0];
            lastName = names[names.length - 1];
        }

        const newUser = {
            ...userModel,
            uid: googleSignInResult.user.uid,
            email: googleSignInResult.user.email || '',
            photoUrl: googleSignInResult.user.photoURL || '',
            phoneNumbers: [googleSignInResult.user.phoneNumber || ''],
            firstName: firstName,
            lastName: lastName,
            fullName: fullName,
            isEmailVerified: googleSignInResult.user.emailVerified,
        }

        const user = await createOrGetUser(newUser);
        console.log(user);
        setUser(user);
    } catch (error) {
        console.log(error);
    }
};

export async function facebookSignIn (setUser) {
    const provider = new FacebookAuthProvider();

    provider.addScope('user_birthday');

    try {
        const facebookSignInResult = await signInWithPopup(auth, provider);
        console.log('We are inside facebook sign in');
        console.log(facebookSignInResult);

        const fullName = facebookSignInResult.user.displayName;

        const names = fullName.split(' ');

        let firstName = '';
        let lastName = '';

        if (names.length > 1) {
            firstName = names[0];
            lastName = names[names.length - 1];
        }

        const newUser = {
            ...userModel,
            uid: facebookSignInResult.user.uid,
            email: facebookSignInResult.user.email || '',
            photoUrl: facebookSignInResult.user.photoURL || '',
            phoneNumbers: [facebookSignInResult.user.phoneNumber || ''],
            firstName: firstName,
            lastName: lastName,
            fullName: fullName,
            isEmailVerified: facebookSignInResult.user.emailVerified,
        }

        console.log(newUser);

        const user = await createOrGetUser(newUser);
        console.log(user);
        setUser(user);
    } catch (error) {
        console.log(error);
    }
};

export const generateRecaptcha = () => {
    firebase.auth().useDeviceLanguage();

    window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
    }, auth);
};

export const sendCodeToSignInWithPhone = async (auth, phoneNumber, setFormExpand = () => {}, setConfirmationResult = () => {}) => {
    try {
        setFormExpand(true);

        if (!window.recaptchaVerifier) {
            generateRecaptcha();
        }
        const appVerifier = window.recaptchaVerifier;

        const confirmationResult = await  signInWithPhoneNumber(auth, phoneNumber, appVerifier);

        setConfirmationResult(confirmationResult);
    } catch (error) {
        console.log(error);
    }
};

export const confirmCodeAndSignInWithPhone = async (confirmationResult, code, setUser) => {
    try {
        const phoneSignInResult = await confirmationResult.confirm(code);

        const newUser = {
            ...userModel,
            uid: phoneSignInResult.user.uid,
            email: phoneSignInResult.user.email || '',
            photoUrl: phoneSignInResult.user.photoURL || '',
            phoneNumbers: [phoneSignInResult.user.phoneNumber || ''],
            firstName: '',
            lastName: '',
            fullName: '',
            isEmailVerified: phoneSignInResult.user.emailVerified,
        }

        const user = await createOrGetUser(newUser);
        console.log(user);
        setUser(user);
    } catch (error) {
        console.log(error);
    }
}

export function forgotPasswordUserFireBase(email){
    return sendPasswordResetEmail(auth, email);
};

const handlerForgotPassword = (e) => {
    e.preventDefault();
    //forgotPasswordUserFireBase(forgotPasswordEmailRef?.current?.value);
};

// export function logOut(){
//     return signOut(auth);
// };

export const logOut = () => {
    return new Promise((resolve, reject) => {
        firebase.auth().signOut().then(() => {
            resolve(true);
        }).catch((error) => {
            reject(this._handleError(error));
        })
    });
};
//#endregion

//#region Work with DB
export async function  getCollection (collection)    {
    return new  Promise(await function (resolve, reject) {
        fire.firestore().collection(collection).get().then(res => {
            const data = [];
            res.forEach(doc => {
                data.push({
                    idPost: doc.id,
                    ...doc.data()
                })
            });
            resolve(data)
        }).catch(err => {
            reject(err);
        });
    });
};

export function getDocInCollection(collection, id) {
    return new Promise(function (resolve, reject) {
        try {
            fire.firestore().collection(collection).doc(id)
                .get()
                .then(querySnapshot => {
                    resolve(querySnapshot.data());
                });
        } catch (e) {
            reject(e);
        }
    })
};

export function getCollectionWhereKeyValue(collection, key, value) {
    return new Promise(function (resolve, reject) {
        fire.firestore().collection(collection).where(key, "==", value).get().then(res => {
            const data = [];
            res.forEach(doc => {
                data.push({
                    idPost: doc.id,
                    ...doc.data()
                })
            });
            resolve(data)
        }).catch(err => {
            reject(err);
        });
    });
};

export function setDocumentToCollection(collection, document) {
    return new Promise(function (resolve, reject) {
        try {
            fire.firestore().collection(collection).add(document)
                .then(r => {
                    updateDocumentInCollection(collection, {...document, idPost: r.id}, r.id)
                        .then(res => console.log(res)).catch(e => console.log(e));
                    resolve({result: r});
                }).catch(e => {
                reject(e);
            })
        } catch (e) {
            reject(e);
        }
    })
};

export function updateDocumentInCollection(collection, document, idDocumnent) {
    return new Promise(function (resolve, reject) {
        try {
            fire.firestore().collection(collection).doc(idDocumnent).update(document).then(r => {
                resolve({result: r})
            }).catch(e => {
                reject(e);
            })
        } catch (e) {
            reject(e);
        }
    })
};

export function updateDocumentFromCollectionWhereKeyValue(collection, key, value, document) {
    return new Promise(function (resolve, reject) {
        try {
            getCollectionWhereKeyValue(collection, key, value).then( r1 => {
                const idDocumnent = r1[0].idPost
                fire.firestore().collection(collection).doc(idDocumnent).update(document).then(r => {
                    resolve({result: r})
                }).catch(e => {
                    reject(e);
                })
            }).catch( e => {
                reject(e);
            })
        } catch (e) {
            reject(e);
        }
    })
};

export function deleteDocumentFromCollectionWithID(collection, idPost) {
    return new Promise(function (resolve, reject) {
        try {
            fire.firestore().collection(collection).doc(idPost).delete()
                .then(result => {
                    resolve(result)
                }).catch(function (error) {
                reject(error)
            });
        } catch (e) {
            reject(e)
        }
    })
};

export async function updateFieldInDocumentInCollection (collection, docId, fieldName, newValue) {
    // console.log(collection);
    // console.log(newValue);

    let result;

    try {
        const docRef = fire.firestore().collection(collection).doc(docId);
        result = await docRef.update({[fieldName]: newValue});
    } catch (error) {
        console.log(error);
    }

    return result;
};
//#endregion
