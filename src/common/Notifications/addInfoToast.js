import React from 'react';
import SuccessToast from "./SuccessToast";

function addInfoToast(title, content, id, notList, setNotList) {

    setNotList(notList.concat([
        <SuccessToast
            key={id}
            title={title}
            content={content}
            id={id}
        />
    ]))

};

export default addInfoToast;