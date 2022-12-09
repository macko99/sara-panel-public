import {useState} from "react";

const useFormInput = initialValue => {
    const [value, setValue] = useState(initialValue);

    const onChange = e => {
        if(e)
            setValue(e.target.value);
        else
            setValue('');
    };

    return {
        value,
        onChange
    };
};

export default useFormInput;