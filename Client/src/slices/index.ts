import { combineReducers } from "redux";

// Front
import LayoutReducer from "./layouts/reducer";

// login
import LoginReducer from "./auth/login/reducer";

// register
import RegisterReducer from "./auth/register/reducer";

// userProfile
import ProfileReducer from "./auth/profile/reducer";

// Chat
import ChatReducer from "./chat/reducer";



// Calendar
import CalendarReducer from "./calendar/reducer";



// HR Managment
import HRManagmentReducer from "./hrManagement/reducer";



// Invoice
import InvoiceReducer from "./invoice/reducer"

// Users
import UsersReducer from "./users/reducer";

const rootReducer = combineReducers({
    Layout: LayoutReducer,
    Login: LoginReducer,
    Register: RegisterReducer,
    Profile: ProfileReducer,
    Chat: ChatReducer,
    Calendar: CalendarReducer,
    HRManagment: HRManagmentReducer,
    Invoice: InvoiceReducer,
    Users: UsersReducer,
});


export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;