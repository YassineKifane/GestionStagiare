import React, { useEffect } from "react";
import { Facebook, Github, Mail, Twitter } from "lucide-react";
import { loginUser, socialLogin } from "slices/thunk";
import { useDispatch, useSelector } from "react-redux";
import withRouter from "Common/withRouter";
import { createSelector } from 'reselect';
import AuthIcon from "Parrain/pages/AuthenticationInner/AuthIcon";
import { toast } from "react-toastify";

import { CHECK_INTERN } from "services/internsAPIs/internsAPIs"


// Formik validation
import * as Yup from "yup";
import { useFormik as useFormic } from "formik";


import {storage} from "helpers/firebaseConfig";
import { ref, getDownloadURL } from "firebase/storage";


// Image
import logoLight from 'assets/images/logo-light.png';
import logoDark from 'assets/images/logo-dark.png';
import img1 from "assets/images/auth/img-01.png";
import us from "assets/images/flags/us.svg";
import es from "assets/images/flags/es.svg";
import de from "assets/images/flags/de.svg";
import fr from "assets/images/flags/fr.svg";
import jp from "assets/images/flags/jp.svg";
import it from "assets/images/flags/it.svg";
import ru from "assets/images/flags/ru.svg";
import ae from "assets/images/flags/ae.svg";
import { Link } from "react-router-dom";
import { loginError } from "slices/auth/login/reducer";

const LoginBoxed = (props: any) => {

    document.title = "Sign In | OCP - Group Cherifien Phosphat";
    const dispatch = useDispatch<any>();

    const selectLogin = createSelector(
        (state: any) => state.Register,
        (state: any) => state.Login,
        (register, login) => ({
            user: register.user,
            success: login.success,
            error: login.error
        })
    )

    const { user, success, error } = useSelector(selectLogin);
    const validation: any = useFormic({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().required("Please Enter Your email"),
            password: Yup.string().required("Please Enter Your Password"),
        }),
        onSubmit: (values: any) => {
            console.log("onSubmit");
            console.log(values)
            checkIntern(values);
        }
    });

    function setCookie(name:any, value:any, days:any) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }


    // handle login function 
    async function checkIntern(data:any) {
        try {
            console.log("calling checkIntern...");
            const response = await fetch(`${CHECK_INTERN}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
    
            if (!response.ok) {
                console.log("Login Failed");
                dispatch(loginError(response));
                toast.error("Login Failed", { autoClose: 2000 });
                return;
            }
    
            const responseData = await response.json();
            
            if (responseData) {
               
                    console.log(responseData);
                    const parrainImage = await getImageByParrainId(responseData.intern.parrainId);
                    localStorage.setItem("parrainImage", parrainImage);
                    localStorage.setItem("authUser", JSON.stringify(responseData.intern));
                    setCookie("token", responseData.token, 1);
                    localStorage.setItem("isAdmin", "false");
                    toast.success("Logged in Successfully", { autoClose: 3000 });
                   // navigate to dashboard here whitout props:
                   window.location.href = '/dashboard';

            }
            return responseData.intern;
        } catch (error) {
           console.log("eroor fin")
            toast.error("Login Failed", { autoClose: 2000 });
            dispatch(loginError(error));
        }
    }


    const getImageByParrainId = (userId: string): Promise<string> => {
        const storageRef = ref(storage, `image/parrain/${userId}.jpeg`);
        return getDownloadURL(storageRef)
          .then((url) => {
            console.log(url);
            return url;
          })
          .catch((error) => {
            console.log(error.message);
            return "";
          });
      };



    

      useEffect(() => {
        toast.error("Login Failed", { autoClose: 2000 });
        
      },[]);


    return (
        <React.Fragment>
            <div className="flex items-center justify-center min-h-screen px-4 py-16 bg-cover bg-auth-pattern dark:bg-auth-pattern-dark dark:text-zink-100 font-public">
                <div className="mb-0 border-none shadow-none  w-screen lg:mx-auto lg:w-[500px] card bg-white/70 dark:bg-zink-500/70">
                   
                    <div className="grid grid-cols-1 gap-0 lg:grid-cols-12">
                        <div className="lg:col-span-full">
                            <div className="!px-12 !py-12 card-body">

                            <div className="flex justify-center mb-5">
                                <Link to="/">
                                    <img src={logoLight} alt="" className="hidden h-12 dark:block" />
                                    <img src={logoDark} alt="" className="block h-12 dark:hidden" />
                                </Link>
                            </div>

                                <div className="text-center">
                                    <h4 className="mb-2 text-purple-500 dark:text-purple-500">Espace Stagiaire</h4>
                                    <p className="text-slate-500 dark:text-zink-200">Connectez-vous pour continuer à OCP.</p>
                                </div>

                                <form className="mt-10" id="signInForm"
                                    onSubmit={(event: any) => {
                                    event.preventDefault();
                                    validation.handleSubmit();
                                    return false;
                                }}>
                                    {
                                        success &&
                                        <div className=" px-4 py-3 mb-3 text-sm text-green-500 border border-green-200 rounded-md bg-green-50 dark:bg-green-400/20 dark:border-green-500/50" id="successAlert">
                                        Vous êtes <b>connecté avec succès</b>.
                                    </div>
                                    }

                                    {error && <div className="px-4 py-3 mb-3 text-sm text-red-500 border border-red-200 rounded-md bg-red-50 dark:bg-red-400/20 dark:border-red-500/50" id="successAlert">
                                        Votre connexion a <b>échoué</b>.
                                    </div>}
                                    
                                    <div className="mb-3">
                                        <label htmlFor="username" className="inline-block mb-2 text-base font-medium">Email</label>
                                        
                                        <input type="text"
                                        id="email"
                                        name="email"
                                        className="form-input dark:bg-zink-600/50 border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                                        placeholder="Enter your email"
                                        onChange={validation.handleChange}
                                        onBlur={validation.handleBlur}
                                        value={validation.values.email || ""}/>
                                          {validation.touched.email && validation.errors.email ? (
                                            <div id="email-error" className="mt-1 text-sm text-red-500">{validation.errors.email}</div>
                                            ) : null}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="inline-block mb-2 text-base font-medium">Password</label>
                                        <input type="password"
                                        id="password"
                                        name="password"
                                        className="form-input dark:bg-zink-600/50 border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                                        placeholder="Enter password"
                                        onChange={validation.handleChange}
                                        onBlur={validation.handleBlur}
                                        value={validation.values.password || ""}/>
                                        {validation.touched.password && validation.errors.password ? (
                                            <div id="password-error" className="mt-1 text-sm text-red-500">{validation.errors.password}</div>
                                        ) : null}
                                    </div>
                                    <div>
                                        {/* <div className="flex items-center gap-2">
                                            <input id="checkboxDefault1" className="size-4 border rounded-sm appearance-none bg-slate-100 border-slate-200 dark:bg-zink-600/50 dark:border-zink-500 checked:bg-custom-500 checked:border-custom-500 dark:checked:bg-custom-500 dark:checked:border-custom-500 checked:disabled:bg-custom-400 checked:disabled:border-custom-400" type="checkbox" defaultValue="" />
                                            <label htmlFor="checkboxDefault1" className="inline-block text-base font-medium align-middle cursor-pointer">Remember me</label>
                                        </div> */}
                                        {/* <div id="remember-error" className="hidden mt-1 text-sm text-red-500">Please check the "Remember me" before submitting the form.</div> */}
                                    </div>
                                    <div className="mt-10">
                                        <button type="submit" className="w-full text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20">Sign In</button>
                                    </div>

                                  
                                 
                                </form>
                                <div className="mt-10 text-center">
                                <p className="mb-0 text-slate-500 dark:text-zink-200">Êtes-vous un Parrain? <Link to="/login" className="font-semibold underline transition-all duration-150 ease-linear text-slate-500 dark:text-zink-200 hover:text-custom-500 dark:hover:text-custom-500"> SignIn</Link> </p>
                            </div>
                            </div>
                        </div>
                       
                    </div>
                </div>
            </div>

        </React.Fragment>
    );
}

export default LoginBoxed;


