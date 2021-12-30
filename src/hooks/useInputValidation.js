import { useState } from 'react';

const useInputValidation = () => {

    const [isAlertShown, setIsAlertShown] = useState(false);

    const validateInput = (inputValues) => {
        let isNotFilledIn = 0;
        for(let i=0;i<inputValues.length;i++){
            if(inputValues[i].length == 0){
                isNotFilledIn++;
            }
        }
        setIsAlertShown(isNotFilledIn > 0 ? true : false);
        return isNotFilledIn > 0 ? false : true;
    }

    return [isAlertShown, setIsAlertShown, validateInput];

}

export default useInputValidation;