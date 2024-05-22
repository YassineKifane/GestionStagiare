import React from 'react';
import { Link } from 'react-router-dom';
import { TrafficResourcesChart } from './Charts';
import CountUp from 'react-countup';
import { MoveRight, TrendingDown } from 'lucide-react';

const TrafficResources = ({taskStatus, completedTasks, tasksPercentage}:any) => {
    return (
        <React.Fragment>
            <div className="col-span-12 2xl:col-span-4">
                <div className="grid grid-cols-12 gap-x-5">
                    <div className="col-span-12 card lg:col-span-6 2xl:col-span-12">
                        <div className="card-body">
                            <div className="flex items-center mb-3">
                                <h6 className="grow text-15">Tasks Analytics</h6>
                                <div className="relative">
                                    <Link to="#" className="transition-all duration-300 ease-linear text-custom-500 hover:text-custom-700">View Status
                                        <MoveRight className="inline-block size-4 align-middle ltr:ml-2 rtl:mr-2"></MoveRight></Link>
                                </div>
                            </div>
                            <div className="grid grid-cols-12">
                                <div className="col-span-12 md:col-span-6 2xl:col-span-7">
                                    <TrafficResourcesChart chartId="trafficResourcesChart" tasksPercentage={tasksPercentage}/>
                                </div>
                                <div className="col-span-12 md:col-span-6 2xl:col-span-5">
                                    <ul className="flex flex-col gap-3">
                                        <li className="flex items-center gap-2">
                                            <div className="size-3 bg-green-500 shrink-0 clip-triangle"></div>
                                            <p className="text-green-500">Todo ({taskStatus?.todo})</p>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="size-3 bg-purple-500 shrink-0 clip-triangle"></div>
                                            <p className="text-purple-500">In Progress ({taskStatus?.enCours})</p>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="size-3 bg-sky-500 shrink-0 clip-triangle"></div>
                                            <p className="text-sky-500">Completed ({taskStatus?.termine})</p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-12 card lg:col-span-6 2xl:col-span-12">
                        <div className="card-body">
                            <div className="flex items-center mb-2">
                                <h5 className="grow"><CountUp end={completedTasks.toFixed(2)} className="counter-value" />%</h5>
                                <span className="px-2.5 py-0.5 text-xs inline-block font-medium rounded border bg-white border-red-100 text-red-500 dark:bg-zink-700 dark:border-red-900">
                                    <TrendingDown className="inline-block size-3 ltr:mr-1 rtl:ml-1"></TrendingDown> 6.8%</span>
                            </div>
                            <h6 className="mb-0">Targeted Goal (100%)</h6>
                            <div>
                                <div className="flex items-center justify-between mt-5 mb-2">
                                    <p className="text-slate-500 dark:text-zink-200">Completion rate</p>
                                    <h6 className="mb-0 text-custom-500">{completedTasks.toFixed(2)}%</h6>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2.54 dark:bg-zink-600">
                                    <div className="bg-custom-500 h-2.5 rounded-full" style={{ width: `${completedTasks}%` }}>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default TrafficResources;
