import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {storage} from "helpers/firebaseConfig";
import { ref, getDownloadURL, uploadBytesResumable, deleteObject } from "firebase/storage";
import dummyImg from "assets/images/users/user-dummy-img.jpg";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";
import { ImagePlus } from "lucide-react";
import {UPDATE_PARRAIN} from "services/parrainsAPIs/parrainsAPIs";

interface Option { label: string; value: string; isDisabled?: boolean };




const PersonalTabs = () => {
     // Image
     const [selectedImage, setSelectedImage] = useState<any>();
     const [imageFile,setImageFile] = useState<File>();
     const [imageChanged,setImageChanged] = useState<boolean>(false);
     const [eventData, setEventData] = useState<any>();
     const [isEdit, setIsEdit] = useState<boolean>(false);
    

     const [parrainInfo,setParrainInfo] = useState<any>();

     const handleImageChange = (event: any) => {
        setImageChanged(true);
         console.log("image changed");
         console.log(imageChanged);
         const fileInput = event.target;
         if (fileInput.files && fileInput.files.length > 0) {
             const file = fileInput.files[0];
             const reader = new FileReader();
             
             reader.onload = (e: any) => {
                 validation.setFieldValue('photo', "image added");
                 setSelectedImage(e.target.result);
                 console.log(e.target.result);
                 setImageFile(file);
             };
             
             reader.readAsDataURL(file);
            
         }
     };
     

     useEffect(() => {
        const userImage = localStorage.getItem("userImage");
        const authUser = localStorage.getItem("authUser");
          // Check if authUser is not null or undefined
          if (authUser && userImage) {
              // Parse the JSON string to convert it back to an object
              const authUserData = JSON.parse(authUser);
              console.log(authUserData); // Log the authUser data
              setParrainInfo(authUserData);
              const updateData = {
                photo:userImage,
                ...authUserData,

            };
              setEventData(updateData);
           
          } else {
              console.log("authUser not found in localStorage");
          }
    
  
},[]);







     // validation
    const validation: any = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
          
            fname: (eventData && eventData.fname) || '' ,
            lname: (eventData && eventData.lname) || '',
            photo: (eventData && eventData.photo) || '',
            email: (eventData && eventData.email) || '',
            speciality : (eventData && eventData.speciality) || '',
            service : (eventData && eventData.service),
            password: (eventData && eventData.password) || '',
            phone: (eventData && eventData.phone) || '',
        
        },
        validationSchema: Yup.object({
            
            fname: Yup.string().required("Please Enter Fisrt Name"),
            lname: Yup.string().required("Please Enter Last Name"),
            photo: Yup.string().required("Please Add Image"),
            email: Yup.string().required("Please Enter Email"),
            password: Yup.string().required("Please Enter Password"),
            phone: Yup.string().required("Please Enter Phone"),
            speciality: Yup.string().required("Please Enter Speciality"),
            service: Yup.string().required("Please Enter Service"),
        }),

        onSubmit: async(values) => {
            // console.log(values);
            // setEventData({ ...values });
            setIsEdit(true);

                // handleUploadFile(values.parrainId);
                console.log("adding data...");
                console.log(values);
               
                // save new intern

                updateParrainById(parrainInfo.parrainId,values);

               
            
            
          
        },
    });



    const updateParrainById = (parrainId: String, values:any): Promise<any> => {
        return fetch(`${UPDATE_PARRAIN+parrainId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            })
            .then(response => {
                if (!response.ok) {
                
                    toast.error("Error updating your informations", { autoClose: 2000 });
                }
                toast.success("your informations updated successfully", { autoClose: 2000 });
                console.log("imageChanged")
                console.log(imageChanged)
                if(imageChanged){
                     updateImageByUserId(parrainInfo.parrainId);
                }else{
                    setInterval(async () => {
                    window.location.href='/logout';
                  }, 1000);
                }

               
    
            })
            .catch(error => {
                throw new Error(error.message);
            });
    }
  


    const updateImageByUserId = async (userId: string): Promise<void> => {
        setImageChanged(false);
        try {
            console.log("inside updateImageByUserId");
            // Check if the image exists
            const image = await getImageByUserId(userId);
            console.log("call getImageByUserId");
            console.log(image);
    
            // If the image doesn't exist, call handleUploadFile directly
            if (!image) {
                console.log("image not found");
                await handleUploadFile(userId);
                setInterval(async () => {
                    window.location.href='/logout';
                  }, 4000);
                
               
            } else {
                // If the image exists, delete it and then upload a new one
                await deleteImageByUserId(userId);
                await handleUploadFile(userId);
                setInterval(async () => {
                    window.location.href='/logout';
                  }, 4000);
                
            }
        } catch (error) {
            throw new Error("error");
        }
    }
    


    const deleteImageByUserId = (userId: string): Promise<void> => {
        const storageRef = ref(storage, `image/parrain/${userId}.jpeg`);
        return deleteObject(storageRef)
            .then(() => {
                console.log("Image deleted successfully");
              
            })
            .catch((error) => {
                throw new Error(error.message);
            });
    };
    


    // function to get an image by userId here:
const getImageByUserId = (userId: string): Promise<string> => {
    const storageRef = ref(storage, `image/parrain/${userId}.jpeg`);
    return getDownloadURL(storageRef)
      .then((url) => {
       
        return url;
      })
      .catch((error) => {
        console.log(error.message);
        return "";
      });
  };


    const handleUploadFile = (parrainId:String) => {        
        if (imageFile) {
          const storageRef = ref(storage, `image/parrain/${parrainId}.jpeg`)
          uploadBytesResumable(storageRef, imageFile)
          .then(() => {
            console.log("Image uploaded successfully");
            // setInterval(async () => {
            //   window.location.href='/logout';
            // }, 2000);
          })
          .catch((error) => {
            console.log(error.message);
          });
         
        } else {
          console.log("File not found")
          
        }
      }



     
    return (
        <React.Fragment>
             <ToastContainer closeButton={false} limit={1} />
            {parrainInfo &&
            <div className="card">
                <div className="card-body">
                    <h6 className="mb-1 text-15">Personal Information</h6>
                    <p className="mb-4 text-slate-500 dark:text-zink-200">Update your photo and personal details here easily.</p>


                    <form className="update-form" id="update-form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            validation.handleSubmit();
                            return false;
                        }}>
                        <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">

                            {/* image upload */}
                            <div className="xl:col-span-12">
                                <div className="relative size-24 mx-auto mb-4 rounded-full shadow-md bg-slate-100 profile-user dark:bg-zink-500">
                                    <img src={selectedImage ||validation.values.photo || dummyImg} alt="" className="object-cover w-full h-full rounded-full user-profile-image" />
                                    <div className="absolute bottom-0 flex items-center justify-center size-8 rounded-full ltr:right-0 rtl:left-0 profile-photo-edit">
                                        <input
                                            id="profile-img-file-input"
                                            name="profile-img-file-input"
                                            type="file"
                                            accept="image/*"
                                            className="hidden profile-img-file-input"
                                            onChange={handleImageChange}
                                            />
                                        <label htmlFor="profile-img-file-input" className="flex items-center justify-center size-8 bg-white rounded-full shadow-lg cursor-pointer dark:bg-zink-600 profile-photo-edit">
                                            <ImagePlus className="size-4 text-slate-500 fill-slate-200 dark:text-zink-200 dark:fill-zink-500" />
                                        </label>
                                    </div>
                                </div>
                                {validation.touched.photo && validation.errors.photo ? (
                                    <p className="text-red-400">{validation.errors.photo}</p>
                                ) : null}
                            </div>

                            <div className="xl:col-span-6">
                                <label htmlFor="fname" className="inline-block mb-2 text-base font-medium">First Name</label>
                                <input type="text" id="fname" className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" placeholder="first name"
                                    name="fname"
                                    onChange={validation.handleChange}
                                    value={validation.values.fname || ""}
                                />
                                {validation.touched.fname && validation.errors.fname ? (
                                    <p className="text-red-400">{validation.errors.fname}</p>
                                ) : null}
                            </div>
                            <div className="xl:col-span-6">
                                <label htmlFor="lname" className="inline-block mb-2 text-base font-medium">Last Name</label>
                                <input type="text" id="lname" className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" placeholder="last name"
                                    name="lname"
                                    onChange={validation.handleChange}
                                    value={validation.values.lname || ""}
                                />
                                {validation.touched.lname && validation.errors.lname ? (
                                    <p className="text-red-400">{validation.errors.lname}</p>
                                ) : null}
                            </div>
                            <div className="xl:col-span-6">
                                <label htmlFor="email" className="inline-block mb-2 text-base font-medium">Email</label>
                                <input type="email" id="email" className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" placeholder="example@gmail.com"
                                    name="email"
                                    onChange={validation.handleChange}
                                    value={validation.values.email || ""}
                                />
                                {validation.touched.email && validation.errors.email ? (
                                    <p className="text-red-400">{validation.errors.email}</p>
                                ) : null}
                            </div>
                            <div className="xl:col-span-6">
                                <label htmlFor="password" className="inline-block mb-2 text-base font-medium">Password</label>
                                <input type="text" id="password" className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" placeholder="*****"
                                    name="password"
                                    onChange={validation.handleChange}
                                    value={validation.values.password || ""}
                                />
                                {validation.touched.password && validation.errors.password ? (
                                    <p className="text-red-400">{validation.errors.password}</p>
                                ) : null}
                            </div>
                            <div className="xl:col-span-6">
                                <label htmlFor="phone" className="inline-block mb-2 text-base font-medium">Phone Number</label>
                                <input type="text" id="phone" className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" placeholder="Enter phone number"
                                    name="phone"
                                    onChange={validation.handleChange}
                                    value={validation.values.phone || ""}
                                />
                                {validation.touched.phone && validation.errors.phone ? (
                                    <p className="text-red-400">{validation.errors.phone}</p>
                                ) : null}
                            </div>
                           
                            <div className="xl:col-span-6">
                                <label htmlFor="service" className="inline-block mb-2 text-base font-medium">Service</label>
                                <select className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" data-choices data-choices-search-false id="servicetInput"
                                    name="service"
                                    onChange={validation.handleChange}
                                    value={validation.values.service || ""}
                                >
                                    <option value="OIJ/M">OIJ/M</option>
                                    <option value="OIJ/R">OIJ/R</option>
                                    <option value="OIJ/A">OIJ/A</option>
                                    <option value="OIJ/B">OIJ/B</option>
                                   
                                </select>
                                {validation.touched.service && validation.errors.service ? (
                                    <p className="text-red-400">{validation.errors.service}</p>
                                ) : null}
                            </div>
                            <div className="xl:col-span-6">
                                <label htmlFor="speciality" className="inline-block mb-2 text-base font-medium">Speciality</label>
                                <select className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" data-choices data-choices-search-false id="typeSelect"
                                    name="speciality"
                                    onChange={validation.handleChange}
                                    value={validation.values.speciality || ""}
                                   
                                >
                                    <option value="Informatique">Informatique</option>
                                    <option value="Génie civil">Génie Civil</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="Phosphat">Phosphat</option>
                                   
                                </select>
                                {validation.touched.speciality && validation.errors.speciality ? (
                                    <p className="text-red-400">{validation.errors.speciality}</p>
                                ) : null}
                            </div>
                            
                          
                            
                        </div>
                        <div className="flex justify-end mt-6 gap-x-4">
                            <button type="submit" className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20">Update</button>
                        </div>
                    </form>


                </div>
            </div >
            }
        </React.Fragment >
    );
}

export default PersonalTabs;


