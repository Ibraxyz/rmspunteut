const currentLoginStatusReducer = (state = "", action) => {
    switch (action.type) {
        case "UPDATE_LOGIN_STATUS":
            state = action.payload;
            return state;
        default:
            return state;
    }
}

export default currentLoginStatusReducer;