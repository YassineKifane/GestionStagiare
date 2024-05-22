import React, { useState, useEffect } from "react";

// Formik Validation
import * as Yup from "yup";
import { useFormik as useFormic } from "formik";

//redux
import { useSelector, useDispatch } from "react-redux";

import userProfile from "assets/images/users/user-profile.png";

import { createSelector } from 'reselect';
import BreadCrumb from "Common/BreadCrumb";
import withRouter from "Common/withRouter";


const UserProfile = () => {

  //meta title
  document.title = "Profile | OCP";

  const dispatch = useDispatch<any>();

    const [info, setInfo]= useState<any>();
    const [userImage,setUserImage] = useState('');

  const selectProperties = createSelector(
    (state: any) => state.Profile,
    (profile) => ({
      user: profile.user,
      error: profile.error,
      success: profile.success
    })
  );

  const { error, success, user } = useSelector(selectProperties);

  useEffect(() => {
          
          const authUser = localStorage.getItem("authUser");
            // Check if authUser is not null or undefined
            if (authUser) {
                // Parse the JSON string to convert it back to an object
                const authUserData = JSON.parse(authUser);
                console.log(authUserData); // Log the authUser data
                setInfo(authUserData);
              
            } else {
                console.log("authUser not found in localStorage");
            }
      
    
  }, [user]);

 

  return (
    <React.Fragment>
      <div className="container-fluid group-data-[content=boxed]:max-w-boxed mx-auto">
        {/* Render Breadcrumb */}
        <BreadCrumb title="Admin Profile" pageTitle="Profile" />

        <div className="row">
          <div className="grid grid-cols-1 gap-x-5 xl:grid-cols-1">
           
{info &&

            <div className="card">
              <div className="card-body">
                <div className="flex gap-3">
                  <div>
                    <img
                      src={info.img}
                      alt=""
                      width={90}
                      className="avatar-md rounded-circle img-thumbnail"
                    />
                  </div>
                  <div className="text-slate-500 dark:text-zink-200">
                    <h5 className="text-slate-500">{info.fname || "admin"}</h5>
                    <p className="mb-1">{info.email || "admin@gmail.com"}</p>
                    <p className="mb-0">CIN: {info.internId || 1}</p>
                  </div>
                </div>
                <p className="mt-3 text-slate-500 text-15">Durée du stage : {info.StageDuration || "0"}</p>
                <p className="mt-2 text-slate-500 text-15">Spécialité : {info.speciality || "Specialité"}</p>
                <p className="mt-2 text-slate-500 text-15">Service : {info.service || "OIJ"}</p>
                <p className="mt-2 text-slate-500 text-15">Tél : {info.phone || "00000000"}</p>
                <p className="mt-2 text-slate-500 text-15">Age : {info.age || "00"}</p>
              </div>
              
            </div>
          }


          </div>
        </div>

 

        
      </div>
    </React.Fragment >
  );
};

export default withRouter(UserProfile);