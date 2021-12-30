import { combineReducers } from "redux";
import currentLoginStatusReducer from "./currentLoginStatusReducer";
import currentPathReducer from "./currentPathReducer";
import currentUserReducer from "./currentUserReducer";

const reducers = combineReducers({
    currentPath: currentPathReducer,
    currentLoginStatus: currentLoginStatusReducer,
    currentUser: currentUserReducer
});

export default reducers;
