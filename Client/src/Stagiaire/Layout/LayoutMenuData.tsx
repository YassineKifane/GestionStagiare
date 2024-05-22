import { FileTextIcon,Award, CalendarDays, CircuitBoard, Codesandbox, FileText, LifeBuoy, LocateFixed, Mail, Map, MessageSquare, MonitorDot, PackagePlus, PictureInPicture2, PieChart, RadioTower, ScrollText, Share2, ShoppingBag, Table, Trophy, UserRound , ListTodo} from "lucide-react";

const menuData: any = [
    {
        label: 'menu',
        isTitle: true,
    },
    {
        id: "dashboard",
        label: 'Dashboard',
        link: "/dashboard",
        icon: <MonitorDot />,
        
    },
   
    {
        label: 'Apps',
        isTitle: true,
    },
    {
        id: 'chat',
        label: 'Chat',
        icon: <MessageSquare />,
        link: '/apps-chat',
        parentId: 2
    },

    {
        id: 'calendar',
        label: 'Tasks',
        link: "/apps-tasks",
        icon: <ListTodo />,
    },
   

    {
        id: "hr-management",
        label: 'Documents',
        icon: <FileTextIcon />,
        link: "/apps-documents",
    },
   

];

export { menuData };