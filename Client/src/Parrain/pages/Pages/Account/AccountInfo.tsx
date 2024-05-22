import React, { ChangeEvent, useEffect, useState } from "react";
import {
  BadgeCheck,
  MapPin,

  UserCircle,
} from "lucide-react";
import { Dropdown } from "Common/Components/Dropdown";

import { storage } from "helpers/firebaseConfig";
import { ref, getDownloadURL } from "firebase/storage";
// IMage
import avatar1 from "assets/images/users/avatar-1.png";

import CountUp from "react-countup";

const AccountInfo = ({ className, internId, intern, taskStatus }: any) => {
  const [image, setImage] = React.useState<string>("");

  const [selectedImage, setSelectedImage] = React.useState<
    string | ArrayBuffer | null
  >(avatar1);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  useEffect(() => {
    if (internId) {
      const storageRef = ref(storage, `image/${internId}`);
      getDownloadURL(storageRef)
        .then((url) => {
          setImage(url);
        })
        .catch((error) => {
          console.log(error.message);
          setImage(""); // Set empty string if image not found
        });
    }
  }, [internId]);

  // function to get an image by userId here:

  return (
    <React.Fragment>
      <div className={className}>
        {intern && taskStatus && (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 2xl:grid-cols-12">
            <div className="lg:col-span-2 2xl:col-span-1">
              <div className="relative inline-block size-20 rounded-full shadow-md bg-slate-100 profile-user xl:size-28">
                <img
                  src={image ?? avatar1}
                  alt=""
                  className="object-cover border-0 rounded-full img-thumbnail user-profile-image"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </div>
            <div className="lg:col-span-10 2xl:col-span-9">
              <h5 className="mb-1">
                {intern.fname + " " + intern.lname}{" "}
                <BadgeCheck className="inline-block size-4 text-sky-500 fill-sky-100 dark:fill-custom-500/20"></BadgeCheck>
              </h5>

              <div className="flex gap-3 mb-4">
                <p className="text-slate-500 dark:text-zink-200">
                  <UserCircle className="inline-block size-4 ltr:mr-1 rtl:ml-1 text-slate-500 dark:text-zink-200 fill-slate-100 dark:fill-zink-500"></UserCircle>{" "}
                  {intern.speciality}
                </p>
                <p className="text-slate-500 dark:text-zink-200">
                  <MapPin className="inline-block size-4 ltr:mr-1 rtl:ml-1 text-slate-500 dark:text-zink-200 fill-slate-100 dark:fill-zink-500"></MapPin>{" "}
                  {intern.etablissement}
                </p>
              </div>
              <ul className="flex flex-wrap gap-3 mt-4 text-center divide-x divide-slate-200 dark:divide-zink-500 rtl:divide-x-reverse">
                <li className="px-5">
                  <h5>
                    <CountUp className="counter-value" end={taskStatus.todo} />
                  </h5>
                  <p className="text-slate-500 dark:text-zink-200">
                    Uncomplished Tasks
                  </p>
                </li>

                <li className="px-5">
                  <h5>
                    <CountUp
                      className="counter-value"
                      end={taskStatus.enCours}
                    />
                  </h5>
                  <p className="text-slate-500 dark:text-zink-200">
                    In Progress Tasks
                  </p>
                </li>
                <li className="px-5">
                  <h5>
                    <CountUp
                      className="counter-value"
                      end={taskStatus.termine}
                    />
                  </h5>
                  <p className="text-slate-500 dark:text-zink-200">
                    Completed Tasks
                  </p>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default AccountInfo;
