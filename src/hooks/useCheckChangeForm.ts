import { useState } from "react"
import _ from "lodash"
function useCheckChangeForm(): [boolean, any] {
    const [isChange, setIsChange] = useState<boolean>(false);
    const checkChange = (objectOrigin:{},objectChange:{}) => {
        for (const key in objectChange) {
            if (!_.isEqual(objectChange?.[key], objectOrigin?.[key])) {
                return setIsChange(true);
            }
        }
        if (isChange) {
        return  setIsChange(false);
            
        }

    }

    return [isChange,checkChange]

}

export default useCheckChangeForm