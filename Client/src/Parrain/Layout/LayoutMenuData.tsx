import {Globe,  CircuitBoard,  MessageSquare, MonitorDot,FileStack } from "lucide-react";

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
        id: "hr-management",
        label: 'Management',
        icon: <CircuitBoard />,
        parentId: "hrmanagement",
        link: "/apps-hr-employee",
        // subItems: [
        //     {
        //         id: 'employeelist',
        //         label: 'Intern List',
        //         link: '/apps-hr-employee',
        //         parentId: 'hrmanagement'
        //     },
        // ],
    },
    
    // {
    //     id: 'CV-thèque',
    //     label: 'CVthèque',
    //     icon: <FileStack />,
    //     link: '/cv-thèque',
    //     parentId: 3,
    // },
  
    {
        id: 'contact',
        label: 'Contact Us',
        icon: <Globe />,
        link: 'https://www.ocpgroup.ma/',
        parentId: 2,
    },
  

];

export { menuData };