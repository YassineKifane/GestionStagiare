// parrain dashboard
import Analytics from "Parrain/pages/Dashboards/Analytics";

// Chat
import Chat from "Parrain/pages/Chat";

// HR Management
import EmployeeList from "Parrain/pages/StagiaireManagement/InternsList";

// auth
import LoginBoxed from "Parrain/pages/AuthenticationInner/Login/LoginBoxed";
// Logout

//CV THEQUE
import cvtheque from "Parrain/pages/cvtheque/cvtheque"


import Login from "Parrain/pages/Authentication/Login";
import Logout from "Parrain/pages/Authentication/LogOut";

import UserProfile from "Parrain/pages/Authentication/UserProfile";
import Settings from "Parrain/pages/Pages/Settings";
import Account from "Parrain/pages/Pages/Account";



interface RouteObject {
  path: string;
  component: React.ComponentType<any>; // Use React.ComponentType to specify the type of the component
  exact?: boolean;
}

const authProtectedRoutes: Array<RouteObject> = [
  // my routes
  { path: "/dashboard", component: Analytics },
  { path: "/apps-chat", component: Chat },
  { path: "/apps-hr-employee", component: EmployeeList },
  { path: "/pages-account", component: Account },
  { path: "/pages-account-settings", component: Settings },
  { path: "/user-profile", component: UserProfile },
  { path: "/cv-thèque", component: cvtheque  },
];

const publicRoutes = [
  // auth
  { path: "/auth-login-boxed", component: LoginBoxed },


  // authentication
  { path: "/login", component: Login },
  { path: "/logout", component: Logout },
];

export { authProtectedRoutes, publicRoutes };
