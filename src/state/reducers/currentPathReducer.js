const currentPathReducer = (state = "" , action) => {
    switch(action.type){
        case "UPDATE":
            state = action.payload;
            return state;
        default:
            return state;
    }
}

export default currentPathReducer;