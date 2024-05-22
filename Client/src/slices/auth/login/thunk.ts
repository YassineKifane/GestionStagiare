
import { loginError, loginSuccess, logoutSuccess } from "./reducer";
import { ThunkAction } from "redux-thunk";
import { Action, Dispatch } from "redux";
import { RootState } from "slices";

interface User {
    email: string;
    password: string;
}

export const loginUser = (
    user: User,
    history: any
): ThunkAction<void, RootState, unknown, Action<string>> => async (dispatch: Dispatch) => {
    try {
        let response: any;
       
        if (response) {
            dispatch(loginSuccess(response));
            history("/dashboard");
        }
    } catch (error) {

        dispatch(loginError(error));
    }
};

export const logoutUser = () => async (dispatch: Dispatch) => {
    try {
        localStorage.removeItem("authUser");
        localStorage.removeItem("isAdmin");
        localStorage.removeItem("userImage");
        localStorage.removeItem("parrainImage");
         // remove token cookie
         document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
        dispatch(logoutSuccess(true));
        
    } catch (error) {
        dispatch(loginError(error));
    }
}


export const socialLogin = (type: any, history: any) => async (dispatch: any) => {
    try {
        
    } catch (error) {
        dispatch(loginError(error));
    }
}