export const updateCurrentPath = (newPath)=>{
    return(dispatch)=>{
        dispatch({
            "type" : "UPDATE",
            "payload" : newPath
        });
    }
}

export const updateCurrentLoginStatus = (payload)=>{
    return(dispatch)=>{
        dispatch({
            "type" : "UPDATE_LOGIN_STATUS",
            "payload" : payload
        });
    }
}

export const updateCurrentUser = (payload)=>{
    return(dispatch)=>{
        dispatch({
            "type" : "UPDATE_CURRENT_USER",
            "payload" : payload
        });
    }
}