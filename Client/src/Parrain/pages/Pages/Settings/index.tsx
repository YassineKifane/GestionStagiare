import React from "react";
import BreadCrumb from "Common/BreadCrumb";
import Tab from "Common/Components/Tab/Tab";
import PersonalTabs from "./PersonalTabs";


const Settings = () => {
    
    return (
        <React.Fragment>
            <BreadCrumb title='Account Settings' pageTitle='Pages' />
            <Tab.Container defaultActiveKey="personalTabs">
               
               
                    <Tab.Pane eventKey="personalTabs" >
                        <PersonalTabs />
                    </Tab.Pane>
            

            </Tab.Container>
        </React.Fragment>
    );
}

export default Settings;