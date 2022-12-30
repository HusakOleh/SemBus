//#region User
export const phoneNumberModel = {
    phoneNumber: '',
    hasViber: false,
    hasWhatsApp: false,
    hasTelegram: false
};

export const alertsSettingsModel = {
    showAlerts: true,
    showAlertsOnlyFrom: {fullAddress: '', placeId: ''},
    showAlertsOnlyTo: {fullAddress: '', placeId: ''},
    departureDateFrom: '',
    onlyThisDate: false,
    isPassengerTrip: true,
}

export const userModel = {
    photoUrl: '',
    fullName: '',
    birthDay: '',
    phoneNumber: '',
    email: '',
    country: '',
    city: '',
    login: '',
    promoCode: '',
    role: '',
    uid: '',
    vehiclesIds: [],
    tripsIds: [],
    tripsAsDispatcher: [],
    tripsAsDriver: [],
    transactions: [],
    debitors: [],
    creditors: [],
    balance: '',
    alertsSettings: alertsSettingsModel,
    lastSeenTripsDate: '',
    lastSeenTripsChangesDate: '',
    companyName: '',
    companyDrivers: [],
};
//#endregion

//#region Trip
export const tripModel = {
    isPassengerTrip: true,
    creatorUid: '',
    drivers: [
        {
            fullName: '',
            phoneNumbers: [],
            idPost: ''
        },
        {
            fullName: '',
            phoneNumbers: [],
            idPost: ''
        }
    ],
    startDate: '',
    vehicleId: '',
    totalPlaces: '',
    freePlaces: '',
    passengers: [],
    status: '',
    tripPoints: [],
    tripPointsNames: [],
    isFreeSeating: true,
    vehiclePlacesScheme: [],
    tripPlacesScheme: [],
    dispatcherFee: '',
    isByFoot: false,
    isTripWithPets: false,
    isSeparatePlaceForLuggage: false,
    isPassengerAddress: false,
    addOptions: [],
    isTripDraft: true,
    isTripInProgress: false,
    isTripCompleted: false,
};

export const tripPointModel = {
    city: '',
    country: '',
    placeId: '',
    fullAddress: '',
    arrivingTime: '',
    departureTime: '',
    priceFromPrevious: 0,
    priceFromStart: 0,
    isPassengerAddress: true,
    boardingPlacesFromPassenger: [],
    boardingPlacesFromDriver: [],
    boardingPlacesNames: []
};

export const passengerInTripModel = {
    price: '',
    startPoint: tripPointModel,
    endPoint: tripPointModel,
    countPlacesOccupied: 0,
    numbersOfPlacesOccupied: [],
};

export const addOptionModel = {
    optionContent: '',
    checked: false,
};
//#endregion

//#region Vehicle
export const vehicleModel = {
    registrationCountry: '',
    licensePlate: '',
    brand: '',
    model: '',
    bodyType: '',
    color: '',
    productionDate: '',
    placesNumber: '',
    permissionType: '',
    permissionNumber: '',
    ownerUid: '',
    placesSchemeId: '',
    placesScheme: ''
};

export const placesSchemeModel = {
    vehicleBrand: '',
    vehicleModel: '',
    name: '',
    description: '',
    rows: [],
    idPost: '',
    creatorUid: ''
};

export const placesSchemeRowModel = {
    row: [],
};

export const placesSchemeItemModel = {
    name: '',
    description: '',
    placeNumber: 0,
    row: '',
    col: '',
    isPassengerPlace: true,
    isFreeSpace: true,
    status: false,
    isDriverPlace: false,
};

export const placesSchemeForBookingModel = {
    vehicleBrand: '',
    vehicleModel: '',
    name: '',
    description: '',
    rows: [],
    idPost: '',
    creatorUid: '',
    tripId: '',
};

export const placesSchemeItemForBookingModel = {
    name: '',
    description: '',
    placeNumber: 0,
    row: '',
    col: '',
    isFreeSpace: true,
    status: false,
    temporaryStatus: false,
    bookings: [],
};

export const bookingItemModel = {
    dispatcherId: '',
    passengerData: '',
    startPlaceId: '',
    endPlaceId: '',
};
//#endregion

//#region Passengers
export const passengerModel = {
    idPost: '',
    fullName: '',
    phoneNumbers: [],
    email: '',
    passengerQueries: [],
    passengerTrips: [],
};

export const passengerQueryModel = {
    startPoint: '',
    endPoint: '',
    departureTime: '',
    isPassengerTrip: true,
    isTripWithPets: false,
    isByFoot: false,
    requiredNumberOfPlaces: 0,
    isSeparatePlaceForLuggage: false,
    cargoDescription: '',
    isPassengerAddress: false,
    departureAddress: '',
    additionalQueries: '',
    isActive: true,
    isFulfilled: false,
    isRejected: false,
};

export const passengerTripModel = {
    tripId: '',
    startPoint: '',
    endPoint: '',
    departureTime: '',
    isPassengerTrip: true,
    isTripWithPets: false,
    isByFoot: false,
    requiredNumberOfPlaces: 0,
    isSeparatePlaceForLuggage: false,
    cargoDescription: '',
    isPassengerAddress: false,
    departureAddress: '',
    orderedAdditionalOptions: [],
    price: '',
};
//#endregion

//#region Trip orders
export const tripOrderModel = {
    idPost: '',
    creatorIdPost: '',
    passengerName: '',
    passengerPhones: [phoneNumberModel],
    startPoint: {},
    endPoint: {},
    departureTime: '',
    isPassengerTrip: true,
    isByFoot: false,
    isTripWithPets: false,
    isSeparatePlaceForPets: false,
    isPassengerAddress: false,
    isSeparatePlaceForLuggage: false,
    addOptions: [],
    cargoDescription: '',
    departureAddress: '',
    totalPrice: 0,
    dispatcherFee: 0,
    driverFee: 0,
    proposedTotalPrice: 0,
    proposedDispatcherFee: 0,
    proposedDriverFee: 0,
    isOrderDraft: true,
    isOrderActive: false,
    isOrderSubmittedByDriver: false,
    isOrderSubmittedByDispatcher: false,
    driverSubmittedIdPost: '',
    isOrderFulfilled: false,
    isFeePaid: false,
    isForChange: false,
    dateCreating: '',
    requiredNumberOfPlaces: 0,
    tripId: '',
    dateEditing: '',
    lastEditedFieldName: '',
    wasSubmittedByDriver: '',
    isOrderInProgress: '',
    tripOrderComment: '',
};

export const tripOrdersTypes = {
    allActive: 'allActive',
    allArchived: 'allArchived',
    activeSubmitted: 'activeSubmitted',
    activeUnSubmitted: 'activeUnSubmitted',
    archivedAndCompleted: 'completed',
    archivedAndUncompleted: 'uncompleted',
    completedAndPaid: 'completedAndPaid',
    completedAndUnpaid: 'completedAndUnpaid',
};

export const tripOrdersFilters = {
    startPoint: 'startPoint',
    endPoint: 'endPoint',
    departureTime: 'departureTime',
    isPassenger: 'isPassenger',
};

export const tripOrderFilterOptions = {
    byStartPoint: {
        isActivated: false,
        fullAddress: '',
        placeId: '',
    },
    byEndPoint: {
        isActivated: false,
        placeId: '',
        fullAddress: '',
    },
    byDepartureTime: {
        isActivated: false,
        departureTime: '',
    },
    byTripType: {
        isActivated: false,
        isPassenger: true,
    },
};

export const aggregatedTripsOrders = {
    startPoint: {},
    endPoint: {},
    departureDateFrom: '',
    ordersNumber: 0,
    placesNumber: 0,
    tripsOrdersList: [],
};

export const editedTripsOrdersModel = {
    myTripsOrdersTakenByDrivers: [],
    myTripsOrdersSubmittedByDrivers: [],
    myTripsOrdersRejectedByDrivers: [],
    myTripsOrdersDiscussingByDrivers: [],
    otherTripsOrdersTakenByDispatchers: [],
    otherTripsOrdersSubmittedByDispatchers: [],
    otherTripsOrdersRejectedByDispatchers: [],
}
//#endregion

//#region Chats
export const contactDynamicModel = {
    id: '',
    photoUrl: '',
    fullName: '',
    country: '',
    newMessagesReceivedAmount: '',
    messages: [],
}
//#endregion

//#region Lang
export const dictionaryModel = {
    name: '',
    description: '',
    dictionary: {},
};

//#endregion

//#region Interfaces
export const pagesInterface = {
    start: 'start',
    profile: 'profile',
}

export const collectionsInterface = {
    balanceAccounts: 'balanceAccounts',
    dictionaries: 'dictionaries',
    placesSchemes: 'placesSchemes',
    tripAddOptionsList: 'tripAddOptionsList',
    trips: 'trips',
    tripsOrders: 'tripsOrders',
    users: 'users',
    vehicles: 'vehicles',
}
//#endregion

//#region Other
export const sessionUserId = 'sessionUserId';

export const lastSeenTripsDate = 'lastSeenTripsDate';

export const addOptionsListId = '2pxp98K6up3ZTSUyaLeg';
//#endregion
