import React, {useEffect} from 'react';
import {Modal} from "react-bootstrap";

const ModalNotification = ({showModal, notificationTitle, notificationText, addClasses, setShowModal}) => {
    useEffect(() => {
        setTimeout(() => {
            setShowModal(false);
        }, 5000);
    }, []);

    const closeButtonClick = (event) => {
        event.preventDefault();
        setShowModal(false);
    }

    return (
        <>
            <Modal show={showModal} fullscreen='true' onHide={() => {
                setShowModal(false);
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>{notificationTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>{notificationText}</div>
                    <button
                        type={'button'}
                        className={'btn ColoredButton'}
                        onClick={() => {setShowModal(false)}}
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
};

export default ModalNotification;
