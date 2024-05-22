// dashboard

import Ecommerce from "../pages/Dashboards/Dashboard";



// Chat
import Chat from "../pages/Chat";



// Calendar
import DefaultCalendar from "../pages/Tasks/Default";




// HR Management
import Holidays from "../pages/Documents/Documents";





import Logout from "../pages/Authentication/LogOut";


import UserProfile from "../pages/Authentication/UserProfile";






interface RouteObject {
  path: string;
  component: React.ComponentType<any>; // Use React.ComponentType to specify the type of the component
  exact?: boolean;
}

const StagiaireauthProtectedRoutes: Array<RouteObject> = [
  // stagiaire routes 
  { path: "/", component: Ecommerce },
  { path: "/dashboard", component: Ecommerce },
  { path: "/apps-chat", component: Chat },
  { path: "/apps-tasks", component: DefaultCalendar },
  { path: "/apps-documents", component: Holidays },




  // pages




  // profile
  { path: "/user-profile", component: UserProfile },
];

const StagiairepublicRoutes = [

  // authentication
  { path: "/logout", component: Logout },


]

export { StagiaireauthProtectedRoutes, StagiairepublicRoutes };
