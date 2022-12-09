import React from 'react';
import PropTypes from 'prop-types';
import {useTranslation} from "react-i18next";

const MyClearButton = ({
                         onClear,
                         text,
                         className
                     }) => {
    const {t} = useTranslation();
    return (
        <button
            className={`btn btn-default ${className}`}
            onClick={onClear}
            style={{
                color: 'grey',
                border: "1px lightgrey solid",
                borderRadius: "5px",
                maxWidth: '100px',
                minWidth: '80px'
            }}
        >{t(text)}</button>
    );
}
MyClearButton.propTypes = {
    onClear: PropTypes.func.isRequired,
    className: PropTypes.string,
    text: PropTypes.string
};

MyClearButton.defaultProps = {
    text: "Clear",
    className: ''
};

export default MyClearButton;