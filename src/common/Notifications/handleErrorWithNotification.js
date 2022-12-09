// import React from 'react';
import addErrorToast from "./addErrorToast";

const handleErrorWithNotification = (error, notID, notList, setNotList, errorIsString=false) => {

    const resMessage = errorIsString
        ? error
        : (error.response && error.response.data && error.response.data.message) ||
        error.message || error.toString();


        // const resMessage =
        //     (error.response && error.response.data && error.response.data.message) ||
        //     error.message || error.toString();


    console.log(resMessage);
    addErrorToast(resMessage, notID, notList, setNotList);
};

export default handleErrorWithNotification;