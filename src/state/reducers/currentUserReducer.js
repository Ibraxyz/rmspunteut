const currentUserReducer = (state = null , action) => {
    switch(action.type){
        case "UPDATE_CURRENT_USER":
            state = action.payload;
            return state;
        default:
            return state;
    }
}

export default currentUserReducer;