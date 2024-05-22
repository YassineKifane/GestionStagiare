import React from "react";


import { SimplePie } from "Parrain/pages/ApexCharts/PieCharts/Charts";


interface TableData { label: string; value?: string; link?: boolean }
interface EarningReport { icon: any; amount: string; description: string }
interface Transaction { date: string; amount: string; status: string; description: string; text: string }
interface CardOverview { id: number; name: string; image: string; cardNumber: string; isPrimary: boolean }




const OverviewTabs = ({ intern , taskStatus}: any) => {

    const formatDueDate = (dueDateStr: string): string => {
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
        const dueDate = new Date(dueDateStr);
        return dueDate.toLocaleDateString('en-GB', options); // Adjust locale as needed

    }
    return (
        <React.Fragment>
            {intern && 
           <div className="flex flex-col lg:flex-row gap-6 h-full">
           <div className="flex-1 ">
               <div className="w-full h-full ">
                   <div className="lg:col-span-9 h-full">
                       <div className="card h-full">
                           <div className="card-body">
                               <h6 className="mb-3 text-15">Tasks Statistics</h6>
                               
                               <SimplePie chartId="dumbbellChart" taskStatus={taskStatus}/>
                             
                           </div>
                       </div>
                   </div>
               </div>
           </div>
       
           <div className="flex-1">
               <div className="2xl:col-span-3 lg:col-span-4 md:col-span-6 h-full">
                   <div className="card h-full w-auto">
                       <div className="card-body">
                           <h6 className="mb-4 text-15">Personal Information</h6>
                           <div className="overflow-x-auto">
                               <table className="w-full ltr:text-left rtl:ext-right">
                                   <tbody>

                                   <tr>
                                                    <th className="py-2 font-semibold ps-0" scope="row">Stage Duration</th>
                                                    <td className="py-2 text-right text-slate-500 dark:text-zink-200">
                                                     {intern.StageDuration}
                                                    </td>
                                                </tr>

                                                
                                   <tr>
                                                    <th className="py-2 font-semibold ps-0" scope="row">Start Date</th>
                                                    <td className="py-2 text-right text-slate-500 dark:text-zink-200">
                                                     {formatDueDate(intern.joinDate)}
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <th className="py-2 font-semibold ps-0" scope="row">End Date</th>
                                                    <td className="py-2 text-right text-slate-500 dark:text-zink-200">
                                                    {formatDueDate(intern.EndDate)}
                                                    </td>
                                                </tr>

                                                

                                                <tr>
                                                    <th className="py-2 font-semibold ps-0" scope="row">Age</th>
                                                    <td className="py-2 text-right text-slate-500 dark:text-zink-200">
                                                     {intern.age}
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <th className="py-2 font-semibold ps-0" scope="row">Etablissement</th>
                                                    <td className="py-2 text-right text-slate-500 dark:text-zink-200">
                                                     {intern.etablissement}
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <th className="py-2 font-semibold ps-0" scope="row">Service</th>
                                                    <td className="py-2 text-right text-slate-500 dark:text-zink-200">
                                                     {intern.service}
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <th className="py-2 font-semibold ps-0" scope="row">Speciality</th>
                                                    <td className="py-2 text-right text-slate-500 dark:text-zink-200">
                                                     {intern.speciality}
                                                    </td>
                                                </tr>


                                               
                                                


                                                <tr>
                                                    <th className="py-2 font-semibold ps-0" scope="row">Phone Number</th>
                                                    <td className="py-2 text-right text-slate-500 dark:text-zink-200">
                                                     {intern.phone}
                                                    </td>
                                                </tr>
                                       
                                                <tr>
                                                    <th className="py-2 font-semibold ps-0" scope="row">Email</th>
                                                    <td className="py-2 text-right text-slate-500 dark:text-zink-200">
                                                      <a href="http://themesdesign.in/" rel="noopener"className="text-custom-500">{intern.email}</a>
                                                    </td>
                                                </tr>

                                   </tbody>
                               </table>
                           </div>
                       </div>
                   </div>
               </div>
           </div>
       </div>
       
        

}
                
                
        </React.Fragment>
    );
}

export default OverviewTabs;