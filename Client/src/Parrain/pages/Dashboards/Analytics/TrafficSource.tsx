import React from 'react';
import { Link } from 'react-router-dom';

const TrafficSource = ({docsTypes}:any) => {
    return (
        <React.Fragment>
            <div className="col-span-12 lg:col-span-6 order-[15] 2xl:order-1 card 2xl:col-span-3">
                <div className="card-body">
                    <div className="flex items-center gap-4 mb-3">
                        <h6 className="text-15 grow">Files Source</h6>
                        <Link to="#" className="underline transition-all duration-200 ease-linear text-custom-500 hover:text-custom-700">See More</Link>
                    </div>
                    <div className="flex flex-col gap-5">
                        <div>
                            <div className="flex items-center justify-between gap-4 mb-2">
                            <h6>{docsTypes && docsTypes.length > 0 ? docsTypes[0]?.type : 'Loading...'}</h6>
                                <span className="text-slate-500 dark:text-zink-200">{docsTypes && docsTypes.length > 0 ? docsTypes[0]?.count.toFixed(2) : '0'}%</span>
                            </div>
                            <div className="w-full h-3.5 rounded bg-slate-200 dark:bg-zink-600">
                                <div className="h-3.5 rounded bg-custom-500" style={{width: `${docsTypes && docsTypes.length > 0 ? docsTypes[0]?.count.toFixed(2) : '0'}%`}}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between gap-4 mb-2">
                                <h6>{docsTypes && docsTypes.length > 0 ? docsTypes[1]?.type : 'Loading...'}</h6>
                                <span className="text-slate-500 dark:text-zink-200">{docsTypes && docsTypes.length > 0 ? docsTypes[1]?.count.toFixed(2) : '0'}%</span>
                            </div>
                            <div className="w-full h-3.5 rounded bg-slate-200 dark:bg-zink-600">
                                <div className="h-3.5 rounded bg-yellow-500" style={{width: `${docsTypes && docsTypes.length > 0 ? docsTypes[1]?.count : '0'}%`}}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between gap-4 mb-2">
                                <h6>{docsTypes && docsTypes.length > 0 ? docsTypes[2]?.type : 'Loading...'}</h6>
                                <span className="text-slate-500 dark:text-zink-200">{docsTypes && docsTypes.length > 0 ? docsTypes[2]?.count.toFixed(2) : '0'}%</span>
                            </div>
                            <div className="w-full h-3.5 rounded bg-slate-200 dark:bg-zink-600">
                                <div className="h-3.5 rounded bg-green-500" style={{width: `${docsTypes && docsTypes.length > 0 ? docsTypes[2]?.count : '0'}%`}}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between gap-4 mb-2">
                                <h6>Others</h6>
                                <span className="text-slate-500 dark:text-zink-200">3%</span>
                            </div>
                            <div className="w-full h-3.5 rounded bg-slate-200 dark:bg-zink-600">
                                <div className="h-3.5 rounded bg-slate-500 dark:text-zink-500" style={{width: "3%"}}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default TrafficSource;
