import React, {useState} from 'react';
import axios from 'axios';

const GetUserIp = () => {
    const removeDotsFromIp = (ip) => {
        return ip.split('.').join('');
    }

    const getIp = async () => {
        const res = await axios.get('https://geolocation-db.com/json/')
        // console.log(res.data);
        // console.log(res.data.IPv4);
        // console.log(removeDotsFromIp(res.data.IPv4));

        return res.data.IPv4;
    }

    return (
        <>
            {/*<button*/}
            {/*    onClick={() => getData()}*/}
            {/*>*/}
            {/*    Get ip*/}
            {/*</button>*/}
        </>
    );
};

export default GetUserIp;
