import React from 'react';
import {Loader, CheckCircle2Icon,StickyNote, MessageCircleIcon, PackageX, Truck, Wallet2 } from 'lucide-react';
import CountUp from 'react-countup';
import withRouter from 'Common/withRouter';

//i18n
import { withTranslation } from "react-i18next";
const Widgets = ({taskStatus, receivedMessagesCount}:any) => {
    return (
        <React.Fragment>
            <div className="col-span-12 card md:col-span-6 lg:col-span-3 2xl:col-span-2">
                <div className="text-center card-body">
                    <div className="flex items-center justify-center mx-auto rounded-full size-14 bg-custom-100 text-custom-500 dark:bg-custom-500/20">
                        <StickyNote />
                    </div>
                    <h5 className="mt-4 mb-2">
                        <CountUp end={taskStatus?.todo || 0}  className="counter-value"  />
                        </h5>
                    <p className="text-slate-500 dark:text-zink-200">Todo Tasks</p>
                </div>
            </div>
            <div className="col-span-12 card md:col-span-6 lg:col-span-3 2xl:col-span-2">
                <div className="text-center card-body">
                    <div className="flex items-center justify-center mx-auto text-purple-500 bg-purple-100 rounded-full size-14 dark:bg-purple-500/20">
                        <Loader />
                    </div>
                    <h5 className="mt-4 mb-2"><CountUp end={taskStatus?.enCours || 0} className="counter-value" /></h5>
                    <p className="text-slate-500 dark:text-zink-200">In Progress Tasks</p>
                </div>
            </div>
            <div className="col-span-12 card md:col-span-6 lg:col-span-3 2xl:col-span-2">
                <div className="text-center card-body">
                    <div className="flex items-center justify-center mx-auto text-green-500 bg-green-100 rounded-full size-14 dark:bg-green-500/20">
                        <CheckCircle2Icon />
                    </div>
                    <h5 className="mt-4 mb-2"><CountUp end={taskStatus?.termine || 0} className="counter-value" /></h5>
                    <p className="text-slate-500 dark:text-zink-200">Completed Tasks</p>
                </div>
            </div>
            <div className="col-span-12 card md:col-span-6 lg:col-span-3 2xl:col-span-2">
                <div className="text-center card-body">
                    <div className="flex items-center justify-center mx-auto text-red-500 bg-red-100 rounded-full size-14 dark:bg-red-500/20">
                        <MessageCircleIcon />
                    </div>
                    <h5 className="mt-4 mb-2"><CountUp end={receivedMessagesCount || 0} className="counter-value" /></h5>
                    <p className="text-slate-500 dark:text-zink-200">Received Messages</p>
                </div>
            </div>
        </React.Fragment>
    );
};

export default withRouter(withTranslation()(Widgets));
