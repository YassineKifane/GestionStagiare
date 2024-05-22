import React, { useState, useEffect } from "react";

//redux
import { useSelector, useDispatch } from "react-redux";

import { createSelector } from "reselect";
import BreadCrumb from "Common/BreadCrumb";
import withRouter from "Common/withRouter";
import { Link } from "react-router-dom";

const UserProfile = () => {
  //meta title
  document.title = "Profile | OCP";

  const [email, setEmail] = useState<string>("admin@gmail.com");
  const [name, setName] = useState<string>("");
  const [idx, setIdx] = useState<number>(1);
  const [userImage, setUserImage] = useState("");

  const selectProperties = createSelector(
    (state: any) => state.Profile,
    (profile) => ({
      user: profile.user,
      error: profile.error,
      success: profile.success,
    })
  );

  const { error, success, user } = useSelector(selectProperties);

  useEffect(() => {
    const userImage = localStorage.getItem("userImage");
    const authUser = localStorage.getItem("authUser");
    // Check if authUser is not null or undefined
    if (authUser && userImage) {
      // Parse the JSON string to convert it back to an object
      const authUserData = JSON.parse(authUser);
      console.log(authUserData); // Log the authUser data
      setEmail(authUserData.email);
      setName(authUserData.fname);
      setIdx(authUserData.parrainId);
      setUserImage(userImage);
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
            <div className="card">
              <div className="card-body">
                <div className="flex gap-3">
                  <div>
                    <img
                      src={userImage}
                      alt=""
                      width={90}
                      className="avatar-md rounded-circle img-thumbnail"
                    />
                  </div>
                  <div className="text-slate-500 dark:text-zink-200">
                    <h5 className="text-slate-500">{name || "admin"}</h5>
                    <p className="mb-1">{email || "admin@gmail.com"}</p>
                    <p className="mb-0">CIN: {idx || 1}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          <button
            type="button"
            className="px-2 py-1.5 text-xs text-white btn bg-red-500 hover:text-white hover:bg-red-600 focus:text-white focus:bg-red-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:ring active:ring-custom-100 dark:bg-red-500/20 dark:text-red-500 dark:hover:bg-red-500 dark:hover:text-white dark:focus:bg-red-500 dark:focus:text-white dark:active:bg-red-500 dark:active:text-white dark:ring-red-400/20"
          >
            <Link to="/pages-account-settings">Update Account info</Link>
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default withRouter(UserProfile);
