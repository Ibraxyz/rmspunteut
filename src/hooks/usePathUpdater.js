import {useEffect} from 'react';
//redux
import { useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from 'redux';
import { actionCreators } from "../state/index";

const usePathUpdater = (newPath) => {
    //redux 
    const r_currentPathState = useSelector((state) => state.currentPath);
    const dispatch = useDispatch();
    const { updateCurrentPath } = bindActionCreators(actionCreators, dispatch);
    useEffect(() => {
        updateCurrentPath(newPath);
    }, [])
    return [r_currentPathState]
}

export default usePathUpdater;