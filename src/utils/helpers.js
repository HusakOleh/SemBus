import {
    db, facebookSignIn,
    getCollectionWhereKeyValue, googleSignIn, realTimeDb,
    setDocumentToCollection,
    updateFieldInDocumentInCollection
} from "./firebaseConfigAndFunctions";
import { ref, onValue, child, get, set  } from "firebase/database";
import {
    collectionsInterface, contactDynamicModel,
    lastSeenTripsDate,
    pagesInterface,
    phoneNumberModel,
    userModel
} from "./models";
import firebase from "firebase/compat/app";
import { doc, updateDoc } from 'firebase/firestore';
import {compareAsc, format, isAfter, isEqual} from "date-fns";
import {ukrainianDictionary} from "./dictionaries";
import axios from "axios";

//#region Parse dates
export function getDateWithoutTime (date) {
    if (date === undefined) {
        return 0;
    }

    try {
        const initialDate = new Date(date);

        return  initialDate.getFullYear() + '-' + (initialDate.getMonth() + 1) + '-' + initialDate.getUTCDate();
    } catch (e) {
        return 0;
    }
}
//#endregion

//#region Vehicles, places scheme creation and displaying
// export async function updateUserVehicles(collection, key, value, idVehicle) {
//     const users = await getCollectionWhereKeyValue(collection, key, value);
//     const user = users[0];
//     const userId = user.idPost;
//     const userVehicles = [...user.vehiclesIds, idVehicle];
//     const userRef = doc(db, collectionsInterface.users, userId);
//
//     await updateDoc(userRef, {
//         vehiclesIds: userVehicles,
//     });
// }

export async function updateUserVehicles(collection, key, value, idVehicle) {
    try {
        const users = await getCollectionWhereKeyValue(collection, key, value);
        if (users.length > 0) {
            const user = users[0];
            const userVehicles = [...user.vehiclesIds, idVehicle];

            await updateFieldInDocumentInCollection(collection, user.idPost, 'vehiclesIds', idVehicle);
        } else {

        }
    } catch (error) {
        console.log(error);
    }
}

export const convertSchemeIntoTable = (schemeFromDatabase) => {
    let rows = [];
    for (let i = 0; i < schemeFromDatabase.rows.length; i++) {
        let cols = [];
        for (let j = 0; j < schemeFromDatabase.rows[i].row.length; j++) {
            cols.push(schemeFromDatabase.rows[i].row[j]);
        }
        rows.push(cols);
    }

    return rows;
};

//#endregion

//#region Handle Google Places data
export const getPlaceWithoutIndex = (place) => {
    const numbersInPlaceDescription = '0123456789';
    const isPlaceContainsNumberAtTheEnd = numbersInPlaceDescription.includes(place[place.length - 1]);
    const isPlaceContainsNumberAtTheStart = numbersInPlaceDescription.includes(place[0]);
    let placeWithoutNumbers = place;

    if (isPlaceContainsNumberAtTheEnd) {
        const lastComaIndex = placeWithoutNumbers.lastIndexOf(',');
        placeWithoutNumbers = place.slice(0, lastComaIndex);
    }

    if (isPlaceContainsNumberAtTheStart) {
        const firstSpaceIndex = placeWithoutNumbers.indexOf(' ');
        placeWithoutNumbers = place.slice(firstSpaceIndex + 1);
    }

    return placeWithoutNumbers;
}

export const getCountryFromGoogleResponse = (place) => {
    const placeWithoutNumbers = getPlaceWithoutIndex(place);
    const lastComaIndex = placeWithoutNumbers.lastIndexOf(',');
    return placeWithoutNumbers.slice(lastComaIndex + 2);
}

export const getCityFromGoogleResponse = (place) => {
    const placeWithoutNumbers = getPlaceWithoutIndex(place);
    const firstComaIndex = placeWithoutNumbers.indexOf(' ');
    return placeWithoutNumbers.slice(0, firstComaIndex - 1);
}
//#endregion

//#region Work with trips and trips orders
export const getAllCreatedTrips = async (creatorUid) => {
    const trips = await getCollectionWhereKeyValue(collectionsInterface.trips, 'creatorUid', creatorUid);

    return trips;
}


export const findTripPointInTripByPlaceId = (placeId, curTrip) => {
    return curTrip.tripPoints.find(point => point.placeId === placeId);
};

export const findTripPointIndexInTripByPlaceId = (placeId, curTrip) => {
    return curTrip.tripPoints.findIndex(point => point.placeId === placeId);
};

export const getRouteFromTrip = (startPlaceId, endPlaceId, curTrip) => {
    const startIndex = findTripPointIndexInTripByPlaceId(startPlaceId, curTrip);
    const endIndex = findTripPointIndexInTripByPlaceId(endPlaceId, curTrip);

    return curTrip.tripPoints.slice(startIndex, endIndex + 1);
};

export const calculateTripPrice = (curTrip, query) => {
    const startPointIndex = curTrip.tripPoints.findIndex(point => point.placeId === query.start.placeId);
    const endPointIndex = curTrip.tripPoints.findIndex(point => point.placeId === query.end.placeId);

    const route = curTrip.tripPoints.slice(startPointIndex + 1, endPointIndex + 1).map(point => Number(point.PriceFromPrevious));

    // const firstPointPrice = route[0];

    return route.reduce((prevValue, curValue) => prevValue + curValue);
};

export const getTripAddOptionsFromTrip = (currentTrip, addOptionsList) => {
    if (currentTrip.addOptions.length > 0) {
        return currentTrip.addOptions;
    } else {
        return addOptionsList;
    };
};

export const findAllFreeTripsOrders = async () => {
    const allActiveTripsOrders = await getCollectionWhereKeyValue('tripsOrders', 'IsOrderActive', true);
    // console.log('We are inside findAllFreeTripsOrders');
    // console.log(allActiveTripsOrders);

    return allActiveTripsOrders.filter(order => !order.isOrderSubmittedByDriver);
};

export const findAllPassengerTripsOrders = async () => {
    const allFreeTripsOrders = await findAllFreeTripsOrders();
    // console.log('We are inside findAllPassengerTripsOrders');
    // console.log(allFreeTripsOrders);

    return allFreeTripsOrders.filter(trip => trip.isPassengerTrip);
};

export const findAllCargoTripsOrders = async () => {
    const allFreeTripsOrders = await findAllFreeTripsOrders();

    return allFreeTripsOrders.filter(trip => !trip.isPassengerTrip);
};

export const findTripOrdersWithSuitableDeparturePointAndTimeAfterQueryTime = async (startTripPoint, departureTime, isPassengerTrip) => {
    let allFreeTripsOrders = [];

    if (isPassengerTrip) {
        allFreeTripsOrders = await findAllPassengerTripsOrders();
    } else {
        allFreeTripsOrders = await findAllCargoTripsOrders();
    }

    return allFreeTripsOrders.filter(trip => (trip.startPoint.placeId === startTripPoint.placeId) &&
        (compareAsc(new Date(departureTime), new Date(trip.departureTime)) < 0));
};

export const findTripOrdersWithSuitableDeparturePointAndExactDate = async (startTripPoint, departureTime, isPassengerTrip) => {
    let allFreeTripsOrders = [];

    if (isPassengerTrip) {
        allFreeTripsOrders = await findAllPassengerTripsOrders();
    } else {
        allFreeTripsOrders = await findAllCargoTripsOrders();
    }
    // console.log('findTripOrdersWithSuitableDeparturePointAndExactDate');
    // console.log(allFreeTripsOrders);

    const tripOrdersWithSuitableStartPoint = allFreeTripsOrders.filter(trip => (trip.startPoint.placeId === startTripPoint.placeId));

    const departureDate = getDateWithoutTime(new Date(departureTime));

    return tripOrdersWithSuitableStartPoint.filter(trip => isEqual(new Date(departureDate), new Date(getDateWithoutTime(trip.departureTime))));
};

export const findTripOrdersWithSuitableArrivingPoint = async (startTripPoint, endTripPoint, departureTime, isExactDate, isPassengerTrip) => {
    let tripsOrdersWithSuitableDeparturePoint = [];

    if (isExactDate) {
        tripsOrdersWithSuitableDeparturePoint = await findTripOrdersWithSuitableDeparturePointAndExactDate(startTripPoint, departureTime, isPassengerTrip);
    } else {
        tripsOrdersWithSuitableDeparturePoint = await findTripOrdersWithSuitableDeparturePointAndTimeAfterQueryTime(startTripPoint, departureTime, isPassengerTrip);
    }
    // console.log('We are inside findTripOrdersWithSuitableArrivingPoint');
    // console.log(tripsOrdersWithSuitableDeparturePoint);

    return tripsOrdersWithSuitableDeparturePoint.filter(trip => trip.endPoint.placeId === endTripPoint.placeId);
};

export const searchTripsOrders = async (startTripPoint, endTripPoint, departureTime, isPassengerTrip, isExactDate) => {
    const tripsWithSuitableArrivingPoint = await findTripOrdersWithSuitableArrivingPoint(startTripPoint, endTripPoint, departureTime, isExactDate, isPassengerTrip);
    // console.log('We are inside searchTripsOrders');
    // console.log(tripsWithSuitableArrivingPoint);

    return tripsWithSuitableArrivingPoint;
};

export const findAllActiveTrips = async () => {
    const activeTrips = await getCollectionWhereKeyValue('trips', 'status', 'active');

    return activeTrips.filter(trip => !trip.isTripDraft);
};

export const findAllPassengerTrips = async (areMyTrips, user) => {
    // console.log('We are inside findAllPassengerTrips');
    // console.log(user);

    const allFreeTrips = await findAllActiveTrips();

    let resultTrips = [];

    if (areMyTrips) {
        resultTrips = allFreeTrips.filter(trip => trip.isPassengerTrip && trip.creatorUid === user.uid)
    } else {
        resultTrips = allFreeTrips.filter(trip => trip.isPassengerTrip && trip.creatorUid !== user.uid)
    }

    return resultTrips;
};

export const findAllCargoTrips = async (areMyTrips, user) => {
    const allFreeTrips = await findAllActiveTrips();

    let resultTrips = [];

    if (areMyTrips) {
        resultTrips = allFreeTrips.filter(trip => !trip.isPassengerTrip && trip.creatorUid === user.uid)
    } else {
        resultTrips = allFreeTrips.filter(trip => !trip.isPassengerTrip && trip.creatorUid !== user.uid)
    }

    return resultTrips;
};

export const findTripsWithSuitableDeparturePointAndTimeAfterQueryTime = async (startTripPoint, departureTime, isPassengerTrip, areMyTrips, user) => {
    let allFreeTrips = [];

    if (isPassengerTrip) {
        allFreeTrips = await findAllPassengerTrips(areMyTrips, user);
    } else {
        allFreeTrips = await findAllCargoTrips(areMyTrips, user);
    }

    const allTripsWithDeparturePoint = await allFreeTrips.filter(trip => trip.tripPoints
        .find((point, index, array) => (point.placeId === startTripPoint.placeId) && (index < array.length - 1) &&
            compareAsc(new Date(departureTime), new Date(point.departureTime)) < 0));
    // console.log('We are inside time and departure point');
    // console.log(allTripsWithDeparturePoint);

    return allTripsWithDeparturePoint;
};

export const findTripsWithSuitableDeparturePointAndAndExactDate = async (startTripPoint, departureTime, isPassengerTrip, areMyTrips, user) => {
    let allFreeTrips = [];

    if (isPassengerTrip) {
        allFreeTrips = await findAllPassengerTrips(areMyTrips, user);
    } else {
        allFreeTrips = await findAllCargoTrips(areMyTrips, user);
    }

    const departureDate = getDateWithoutTime(new Date(departureTime));

    const tripOrdersWithSuitableStartPoint = allFreeTrips.filter(trip => trip.tripPoints
        .find((point, index, array) => (point.placeId === startTripPoint.placeId) && (index < array.length - 1) &&
            isEqual(new Date(departureDate), new Date(getDateWithoutTime(point.departureTime)))));

    return tripOrdersWithSuitableStartPoint;
};

export const finTripsWithArrivingPoint = async (startTripPoint, endTripPoint, departureTime, isExactDate, isPassengerTrip, areMyTrips, user) => {
    let tripsWithSuitableDeparturePoint = [];

    if (isExactDate) {
        tripsWithSuitableDeparturePoint = await findTripsWithSuitableDeparturePointAndAndExactDate(startTripPoint, departureTime, isPassengerTrip, areMyTrips, user);
    } else {
        tripsWithSuitableDeparturePoint = await findTripsWithSuitableDeparturePointAndTimeAfterQueryTime(startTripPoint, departureTime, isPassengerTrip, areMyTrips, user);
    };

    const tripsWithArrivingPoint = tripsWithSuitableDeparturePoint.filter((trip =>
        trip.tripPoints.find((point, index) => (point.placeId === endTripPoint.placeId) && (index > 0))));
    // console.log('We are inside arriving point');
    // console.log(tripsWithArrivingPoint);

    return tripsWithArrivingPoint;
}

export const findTripsWithSuitableArrivingPoint = async (startTripPoint, endTripPoint, departureTime, isExactDate, isPassengerTrip, areMyTrips, user) => {
    const tripsWithArrivingPoint =  await finTripsWithArrivingPoint(startTripPoint, endTripPoint, departureTime, isExactDate, isPassengerTrip, areMyTrips, user);

    const tripsWithSuitableArrivingPoint = tripsWithArrivingPoint.filter((trip) => {
        let startPointIndex = 0;
        let endPointIndex = 0;
        trip.tripPoints.forEach((point, index, array) => {
            if (point.placeId === startTripPoint.placeId) {
                startPointIndex = index;
                endPointIndex = array.findIndex(suitableTrip => suitableTrip.placeId === endTripPoint.placeId);
            }
        });

        if (endPointIndex > startPointIndex) {
            return true;
        }

        return false;
    });
    // console.log('We are inside suitable arriving point');
    // console.log(tripsWithSuitableArrivingPoint);

    return tripsWithSuitableArrivingPoint;
};

export const searchTrips = async (startTripPoint, endTripPoint, departureTime, isPassengerTrip, isExactDate, areMyTrips, user) => {
    const suitableTrips = await findTripsWithSuitableArrivingPoint(startTripPoint, endTripPoint, departureTime, isExactDate, isPassengerTrip, areMyTrips, user);

    return suitableTrips;
};

export const searchSuitableTrips = async (startTripPoint, endTripPoint, departureTime, isPassengerTrip, isOrderSearch = false, isExactDate, areMyTrips = false, user) => {
    let result = [];

    // console.log('We are inside searchSuitableTrips');
    // console.log(user);

    if (isOrderSearch) {
        result = await searchTripsOrders(startTripPoint, endTripPoint, departureTime, isPassengerTrip, isExactDate);
    } else {
        result = await searchTrips(startTripPoint, endTripPoint, departureTime, isPassengerTrip, isExactDate, areMyTrips, user);
    }

    return result;
};

export const searchSuitableTripsWithExactDate = async (startTripPoint, endTripPoint, departureTime, isPassengerTrip, isOrderSearch = false) => {
    let result = [];

    if (isOrderSearch) {
        result = await searchTripsOrders(startTripPoint, endTripPoint, departureTime, isPassengerTrip, true);
    } else {
        result = await searchTrips(startTripPoint, endTripPoint, departureTime, isPassengerTrip, true);
    }

    return result;
};

export const compareStandardTripAddOptions = (trip, order) => {
    if (trip.isByFoot === true && order.isByFoot === false) {
        return false;
    };

    if (trip.isTripWithPets === false && order.isTripWithPets === true) {
        return false;
    };

    if (trip.isSeparatePlaceForLuggage === false && order.isSeparatePlaceForLuggage === true) {
        return false;
    };

    if (trip.isPassengerAddress === false && order.isPassengerAddress === true) {
        return false;
    }

    return true;
};

export const compareCustomTripAddOptions = (trip, order) => {
    if (order.addOptions.length === 0) {
        return true;
    }

    let res = true;

    order.addOptions.forEach(option => {
        const appropriateOption = trip.addOptions
            .find(tripOption => tripOption.optionContent === option.optionContent);

        if (!appropriateOption) {
            res = false;
        } else {
            res = appropriateOption.checked;
        }
    });

    return res;
};

export const compareAllAddOptions = (trip, order) => {
    if (!compareStandardTripAddOptions(trip, order)) {
        return false;
    };

    if (!compareCustomTripAddOptions(trip, order)) {
        return false;
    };

    return true;
};

export const searchTripOrdersFromDateWithGivenTripArray = (tripOrders, startDate) => {
    return tripOrders.filter(order => isAfter(new Date(order.departureTime), new Date(startDate)));
};

export const searchTripOrdersWithExactDateWithGivenTripArray = (tripOrders, startDate) => {
    return tripOrders.filter(order => isEqual(new Date(getDateWithoutTime(order.departureTime)), new Date(getDateWithoutTime(startDate))));
};

export const getArrayWithRoutes = (tripsOrders) => {
    let sortedTripsOrders = [];

    tripsOrders.forEach((order, oIndex) => {
        let sortedTripsElem = {};
        let sortedTripForChangeIndex = -1;

        if (sortedTripsOrders.find(route => (route.startPoint.placeId === order.startPoint.placeId) &&
            (route.endPoint.placeId === order.endPoint.placeId))) {

            sortedTripsElem = sortedTripsOrders
                .find((sortedOrder, oIndex) => {
                    if((sortedOrder.startPoint.placeId === order.startPoint.placeId) && (
                        sortedOrder.endPoint.placeId === order.endPoint.placeId)) {
                        sortedTripForChangeIndex = oIndex;
                        return true;
                    }});

            let newSortedTripsElem = {
                ...sortedTripsElem,
                departureDateFrom: getDateWithoutTime(order.departureTime),
                ordersNumber: sortedTripsElem.ordersNumber + 1,
                placesNumber: sortedTripsElem.placesNumber + Number(order.requiredNumberOfPlaces),
                tripsOrdersList: [...sortedTripsElem.tripsOrdersList, order],
            };

            sortedTripsOrders = sortedTripsOrders.map((sOrder, sIndex) => sIndex === sortedTripForChangeIndex ?
                newSortedTripsElem : sOrder);
        } else {
            let sortedTripsElem = {
                startPoint: order.startPoint,
                endPoint: order.endPoint,
                ordersNumber: 1,
                placesNumber: Number(order.requiredNumberOfPlaces),
                departureDateFrom:  getDateWithoutTime(order.departureTime),
                tripsOrdersList: [order],
            };

            sortedTripsOrders = [...sortedTripsOrders, sortedTripsElem];
        }
    });

    return sortedTripsOrders;
};
//#endregion

//#region Data validation
export const checkUserDataCompleteness = (user) => {
    // console.log('We are inside checkUserDataCompleteness');
    // console.log(user);

    const userData = Object.keys(user);
    // console.log(userData);
    const hasEmptyDataFields = userData.some(field => {
        switch (field) {
            // case ('idPost'):
            case ('place'):
            case ('photoUrl'):
            case ('promoCode'):
            case ('vehiclesIds'):
            case ('tripsIds'):
            case ('role'):
            case ('transactions'):
            case ('debitors'):
            case ('creditors'):
            case ('balance'):
            case ('alertsSettings'):
            case ('lastSeenTripsDate'):
            case ('lastSeenTripsChangesDate'):
                return false;
            default:
                if(user[field]?.length === 0) {
                    return true;
                }
        }
    });

    if (user.phoneNumbers.some(phone => phone.phoneNumber.length === 0)) {
        return false;
    };

    return !hasEmptyDataFields;
};

export const checkVehicleDataCompleteness = (vehicle) => {
    const vehicleData = Object.keys(vehicle);
    const hasEmptyDataFields = vehicleData.some(field => {
        switch (field) {
            case ('placesSchemeId'):
            case ('placesScheme'):
                return false;
            default:
                if(vehicle[field].length === 0) {
                    return true;
                }
        }
    });

    return !hasEmptyDataFields;
};
//#endregion

//#region Process user data
export const getNewPhoneObj = (oldPhone, newValue, type) => {
    switch (type) {
        case 'number':
            return {
                ...oldPhone,
                phoneNumber: newValue,
            };
        case 'viber':
            return {
                ...oldPhone,
                hasViber: newValue,
            };
        case 'whatsapp':
            return {
                ...oldPhone,
                hasWhatsApp: newValue,
            };
        case 'telegram':
            return {
                ...oldPhone,
                hasTelegram: newValue,
            };
    }
};

export const findPhoneInArray = (phones, query) => {
    return phones.some(phone => phone.phoneNumber.includes(query));
};
//#endregion

//#region Work with user after auth
export const createUserModelFromAuthServices = (resultFromFirebase) => {
    const curDate = new Date().toString();
    return {
        ...userModel,
        photoUrl: resultFromFirebase.photoURL || '',
        fullName: resultFromFirebase.displayName || '',
        phoneNumbers: resultFromFirebase.phoneNumber
            ? [].push(resultFromFirebase.phoneNumber)
            : [phoneNumberModel],
        email: resultFromFirebase.email || '',
        login: resultFromFirebase.email || '',
        uid: resultFromFirebase.uid || '',
        lastSeenTripsChangesDate: curDate,
        lastSeenTripsDate: curDate,
    }
};

export function createOrGetUser(regInfo, actionFunction = () => {}) {
    // console.log('We are inside createNewUser');
    // console.log(regInfo);

    return new Promise(function (resolve, reject) {
        getCollectionWhereKeyValue('users', 'uid', regInfo.uid).then(r => {
            if (r.length === 0) {
                let user_to_firebase_start = {
                    ...userModel,
                    uid: regInfo?.uid || '',
                    email: regInfo?.email || '',
                    //password: regInfo.password,
                    // gender: regInfo?.gender,
                    // firstName: regInfo?.firstName,
                    // lastName: regInfo?.lastName,
                    fullName: regInfo?.fullName || '',
                    phoneNumber: regInfo?.phoneNumber || [],
                    photoUrl: regInfo?.photoUrl || '',
                    isEmailVerified: regInfo?.isEmailVerified || false,
                    dateCreating: format(new Date(), "dd-MM-yyyy HH:mm"),
                    role: 'user',
                };

                setDocumentToCollection('users', user_to_firebase_start).then(r => {
                    console.log('user saved in DB');
                    localStorage.setItem('international-driver-eu', JSON.stringify(user_to_firebase_start));
                    getCollectionWhereKeyValue(collectionsInterface.users, 'uid', regInfo.uid).then(res => {
                        actionFunction(res[0]);
                        setContactToRDB(false, res[0]).then(result => console.log(result))
                            .catch(error => console.log(error));
                    }).catch(error => console.log(error));
                    resolve(r);
                }).catch(e => {
                    reject(e)
                });
            } else {
                // console.log('We are inside returning user from DB');
                // console.log(r[0]);
                resolve(r[0]);
            }
        }).catch(e => {
            reject('')
        })
    })
};

export const chooseActionAfterAuth = async (resultFromFirebase) => {
    // console.log('We are inside chooseActionAfterAuth');
    // console.log(localStorage.getItem('currentPage'));
    const users = await getCollectionWhereKeyValue('users', 'Uid', resultFromFirebase.uid);

    if (users.length === 0) {
        const modelForSave = createUserModelFromAuthServices(resultFromFirebase);
        // console.log(modelForSave);
        await setDocumentToCollection('users', modelForSave);
        localStorage.setItem(lastSeenTripsDate, JSON.stringify(new Date()));
        //addUserToFirebase(db, modelForSave).then(r => console.log(r)).catch(e => console.log(e));

        return {
            page: pagesInterface.profile,
            isEdit: true,
        };
    };

    const userDataCheckingResult = checkUserDataCompleteness(users[0]);

    if (userDataCheckingResult) {
        const currentPage = localStorage.getItem('currentPage');
        return {
            page: (currentPage === pagesInterface.start || currentPage === '') ? pagesInterface.profile : currentPage,
            isEdit: false,
        }
    }

    return {
        page: pagesInterface.profile,
        isEdit: true,
    };
};

export const registerUser = (username, email, password, actionFunction = () => {}) => {
    // console.log('We are inside registerUser');
    return new Promise((resolve, reject) => {
        firebase.auth().createUserWithEmailAndPassword(email, password).then((user) => {
            console.log(firebase.auth().currentUser);
            const curUser = firebase.auth().currentUser;
            const regInfo = {
                ...userModel,
                uid: curUser.uid || '',
                email: curUser.email || '',
                fullName: username || '',
                isEmailVerified: curUser.emailVerified || false,
                phoneNumber: curUser.phoneNumber || '',
                photoURL: curUser.photoURL || '',
                role: 'user',
            };
            console.log(regInfo);
            createOrGetUser(regInfo, actionFunction).then(result => {
                console.log(result);
            }).catch(e => console.log(e));
            resolve(firebase.auth().currentUser);
        }, (error) => {
            console.log('Error occured in registerUser');
            reject(error);
        });
    });
};

export const registerUserForInternationalDriver = (userData) => {

};

export const signInWithGoogleButtonClickHandler = async (event, setUser, navigate) => {
    event.preventDefault()

    try {
        await googleSignIn(setUser);

        navigate('/profile');
    } catch(error) {
        console.log(error);
    }
};

export const signInWithFacebookButtonClickHandler = async (event, setUser, navigate) => {
    event.preventDefault()

    try {
        await facebookSignIn(setUser);

        navigate('/profile');
    } catch(error) {
        console.log(error);
    }
}
//#endregion

//#region Lang
export const getTranslation = (key, dictionary, defaultDictionary) => {
    if (!dictionary) {
        return ukrainianDictionary.dictionary[key];
    }
    if (!dictionary.dictionary.hasOwnProperty(key)) {
        return defaultDictionary.dictionary[key];
    }
    if (!dictionary.dictionary[key]) {
        return defaultDictionary.dictionary[key];
    }

    return dictionary.dictionary[key];
}
//#endregion

//#region Alerts (trips orders)
export const applyTripOrdersFilters = (tripOrders, alertsSettings) => {
    let resultOrders = tripOrders.filter(order => order.isPassengerTrip === alertsSettings.isPassengerTrip);

    if (alertsSettings.showAlertsOnlyFrom.placeId) {
        resultOrders = resultOrders.filter(order => alertsSettings.showAlertsOnlyFrom.placeId === order.startPoint.placeId);
    };

    if (alertsSettings.showAlertsOnlyTo.placeId) {
        resultOrders = resultOrders.filter(order => alertsSettings.showAlertsOnlyTo.placeId === order.endPoint.placeId);
    };

    if (alertsSettings.departureDateFrom) {
        if (alertsSettings.onlyThisDate) {
            resultOrders = searchTripOrdersWithExactDateWithGivenTripArray(resultOrders, alertsSettings.departureDateFrom);
        } else {
            resultOrders = searchTripOrdersFromDateWithGivenTripArray(resultOrders, alertsSettings.departureDateFrom);
        }
    };

    return resultOrders;
};
//#endregion

//#region Get message time
export const getMessageTime = (timeFromDb) => {
    let timestamp = Number(timeFromDb.timestamp);

    try {
        const timeToDisplay = format(new Date(timestamp), 'dd.MM.yy HH:mm');

        return timeToDisplay;
    } catch (error) {
        console.log(error);
        return '00:00';
    }
};
//#endregion

//#region Manage contacts list
export const getContactById = (contactsList, contactId) => {
    const contact = contactsList.find(cont => cont.id === contactId);

    if (contact) {
        return contact;
    } else {
        return contactDynamicModel;
    }
};

export const getAccountContactsList = async (accountId) => {
    // console.log('We are inside get account contact list');
    const dbRef = ref(realTimeDb);
    let allContacts = {};
    let contactsIds = [];
    let accountContacts = [];

    try {
        const snapshot = await get(child(dbRef, `contacts/`));
        if (snapshot.exists()) {
            allContacts = snapshot.val();
            // console.log(allContacts);
        } else {
            console.log("No data available");
        }
    } catch (error) {
        console.log(error);
    }

    try {
        const currentMessages = await getAccountMessages(accountId);

        if (currentMessages) {
            contactsIds = Object.keys(currentMessages);
        }

        contactsIds.forEach(id => {
            if (allContacts.hasOwnProperty(id)) {
                accountContacts.push({
                    ...allContacts[id],
                    id: id,
                    messages: Object.values(currentMessages[id]),
                });
            }
        });
    } catch (error) {
        console.log(error);
    }

    return accountContacts.filter(contact => contact.hasOwnProperty('fullName'));
};
//#endregion

//#region Work with realtime database
export const listenToAccountMessages = (accountId, actionFunction = () => {}, ...args) => {
    const messagesRef = ref(realTimeDb, `messages/admin/${accountId}`);

    onValue(messagesRef, (snapshot) => {
        console.log('onValue triggered');
        console.log(snapshot);

        const data = snapshot.val();

        console.log(data);
        actionFunction(data, accountId, ...args);
    });

    return messagesRef;
};

export const listenToAllMessagesForAdmin = (actionFunction = () => {}, ...args) => {
    const messagesRef = ref(realTimeDb, `messages/admin`);

    onValue(messagesRef, (snapshot) => {
        console.log('onValue triggered for admin');
        console.log(snapshot);

        const data = snapshot.val();

        console.log(data);
        actionFunction(data, ...args);
    });

    return messagesRef;
}

export const getAccountMessages = async (accountId) => {
    const dbRef = ref(realTimeDb);
    let messages = {};

    try {
        let snapshot = await get(child(dbRef, `messages/${accountId}`));

        if (snapshot.exists()) {
            messages = snapshot.val();
        } else {
            console.log("No data available");
        }
    } catch (error) {
        console.log(error);
    }

    return messages;
};

export const getAccountMessagesAsArray = async (accountId) => {
    let messages;

    try {
        messages = await getAccountMessages(accountId);
    } catch (error) {
        console.log(error);
    }

    return messages ? Object.values(messages) : [];
};

export const getAccountMessagesWithExactContact = async (accountId, contactId) => {
    const dbRef = ref(realTimeDb);
    let messages = {};

    try {
        let snapshot = await get(child(dbRef, `messages/${accountId}/${contactId}`));
        if (snapshot.exists()) {
            messages = snapshot.val();
        } else {
            console.log("No data available");
        }
    } catch (error) {
        console.log(error);
    }

    return messages;
};

export const getAccountMessagesWithExactContactAsArray = async (accountId, contactId) => {
    let messages;

    try {
        messages = await getAccountMessagesWithExactContact(accountId, contactId);
    } catch (error) {
        console.log(error);
    }

    return messages ? Object.values(messages) : [];
};

export const getAdminContactsList = async (accountId) => {
    // console.log('We are inside get account contact list');
    const dbRef = ref(realTimeDb);
    let allContacts = {};
    let contactsIds = [];
    let accountContacts = [];

    try {
        const snapshot = await get(child(dbRef, `contacts/`));
        if (snapshot.exists()) {
            allContacts = snapshot.val();
            // console.log(allContacts);
        } else {
            console.log("No data available");
        }
    } catch (error) {
        console.log(error);
    }

    try {
        const currentMessages = await getAccountMessages(accountId);

        if (currentMessages) {
            contactsIds = Object.keys(currentMessages);
        }

        contactsIds.forEach(id => {
            if (allContacts.hasOwnProperty(id)) {
                accountContacts.push({
                    ...allContacts[id],
                    messages: Object.values(currentMessages[id]),
                });
            }
        });
    } catch (error) {
        console.log(error);
    }

    return accountContacts.filter(contact => contact.hasOwnProperty('fullName'));
};

export const setContactToRDB = async (isAnonym, user) => {
    console.log('We are inside setContactToRDB');
    console.log(realTimeDb);
    console.log(user.idPost);

    let contactData = {};

    if (isAnonym) {
        contactData = {
            fullName: 'Anonym',
            id: user.id,
            photoUrl: '',
        }
    } else {
        contactData = {
            fullName: user.fullName,
            photoUrl: user.photoUrl,
            id: user.idPost,
        }
    }

    try {
        const rdbRes = await set(ref(realTimeDb, `contacts/${user.idPost}`), contactData);
        console.log(rdbRes);
    } catch(error) {
        console.log(error);
    }
}
//#endregion

//#region Send message via RDB
export const sendMessage = async (messageData, accountId, contactId, path = 'messages') => {
    // console.log('Send message');
    // console.log(realTimeDb);

    try {
        await set(ref(realTimeDb, `${path}/${accountId}/${contactId}/m${messageData?.timestamp}`), messageData);
    } catch(error) {
        console.log(error);
    }
};
//#endregion

//#region Get user ip address
export const removeDotsFromIp = (ip) => {
    return ip.split('.').join('');
}

export const getIpNumbers = async () => {
    const res = await axios.get('https://geolocation-db.com/json/')
    // console.log(res.data);
    // console.log(res.data.IPv4);
    // console.log(removeDotsFromIp(res.data.IPv4));

    return removeDotsFromIp(res.data.IPv4);
};
//#endregion
