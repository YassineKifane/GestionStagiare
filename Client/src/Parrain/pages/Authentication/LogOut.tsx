import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Navigate } from "react-router-dom";
import { RootState } from "slices";
import { createSelector } from 'reselect';
import { logoutUser } from "slices/thunk";

interface selectLogoutState {
    isUserLogout: boolean;
}

const Logout: React.FC = () => {

    const isAdmin = localStorage.getItem("isAdmin");
   

    const dispatch = useDispatch<any>();

    const selectLogout = createSelector(
        (state: RootState) => state.Login as selectLogoutState,
        (login) => ({
            isUserLogout: login.isUserLogout
        })
    );

    const { isUserLogout } = useSelector(selectLogout);

    React.useEffect(() => {
        dispatch(logoutUser());
        console.log(isAdmin);
    }, [dispatch]);

    // check if user is admin or not and redirect to login page
    if (isAdmin=='true') {
        console.log("navigate to /login");
        return <Navigate to="/login" /> ;
    }else {
        console.log("navigate to /auth-login-boxed");
        return <Navigate to="/auth-login-boxed" />;
    }
    
}

export default Logout;
