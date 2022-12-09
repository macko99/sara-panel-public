import React from 'react';
import ErrorToast from "./ErrorToast";

function addErrorToast(errorMsg, id, notList, setNotList) {
    setNotList(notList.concat([
        <ErrorToast
            key={id}
            error={errorMsg}
            id={id}
        />
    ]))

};

export default addErrorToast;