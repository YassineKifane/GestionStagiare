import React from "react";


// Formik validation
import * as Yup from "yup";
import { useFormik as useFormic } from "formik";
import { toast } from "react-toastify";
import {loginError, loginSuccess} from '../../../slices/auth/login/reducer'

// Image
import logoLight from "assets/images/logo-light.png";
import logoDark from "assets/images/logo-dark.png";
import { useDispatch, useSelector } from "react-redux";
import withRouter from "Common/withRouter";
import { createSelector } from 'reselect';
import AuthIcon from "Parrain/pages/AuthenticationInner/AuthIcon";
import { Link } from "react-router-dom";

import {CHECK_PARRAIN} from "services/parrainsAPIs/parrainsAPIs"

import {storage} from "helpers/firebaseConfig";
import { ref, getDownloadURL} from "firebase/storage";

const Login = (props: any) => {

    document.title = "Login | OCP - Parrain de stage";

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

    const { user, success, error } = useSelector(selectLogin)

    const validation: any = useFormic({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            email: user.email || '',
            password: user.password || '',
        },
        validationSchema: Yup.object({
            email: Yup.string().required("Please Enter Your email"),
            password: Yup.string().required("Please Enter Your Password"),
        }),
        onSubmit: (values: any) => {
            console.log(values)
            dispatch(checkParrain(values, props.router.navigate));
        }
    });



    const getImageByUserId = (userId: string): Promise<string> => {
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
    async function checkParrain(data:any, history:any) {
        try {
            const response = await fetch(`${CHECK_PARRAIN}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
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
                    dispatch(loginSuccess(responseData));
                    const image = await getImageByUserId(responseData.parrain.parrainId)
                    localStorage.setItem("userImage", image);
                    console.log(image);
                    localStorage.setItem("authUser", JSON.stringify(responseData.parrain));
                    localStorage.setItem("isAdmin", "true");

                    setCookie("token", responseData.token, 1);
                    
                    toast.success("Logged in Successfully", { autoClose: 3000 });
                    window.location.href = '/dashboard';
               
                
            }
            return responseData;
        } catch (error) {
         
            toast.error("Login Failed", { autoClose: 2000 });
            dispatch(loginError(error));
        }
    }
    
    
   

    React.useEffect(() => {
        const bodyElement = document.body;

        bodyElement.classList.add('flex', 'items-center', 'justify-center', 'min-h-screen', 'py-16', 'lg:py-10', 'bg-slate-50', 'dark:bg-zink-800', 'dark:text-zink-100', 'font-public');

        return () => {
            bodyElement.classList.remove('flex', 'items-center', 'justify-center', 'min-h-screen', 'py-16', 'lg:py-10', 'bg-slate-50', 'dark:bg-zink-800', 'dark:text-zink-100', 'font-public');
        }
    }, []);

    return (
        <React.Fragment>
            <div className="relative">
                <AuthIcon />

                <div className="mb-0 w-screen lg:mx-auto lg:w-[500px] card shadow-lg border-none shadow-slate-100 relative">
                    <div className="!px-10 !py-12 card-body">
                        <Link to="/">
                            <img src={logoLight} alt="" className="hidden h-12 mx-auto dark:block" />
                            <img src={logoDark} alt="" className="block h-12 mx-auto dark:hidden" />
                        </Link>

                        <div className="mt-8 text-center">
                            <h4 className="mb-1 text-custom-500 dark:text-custom-500">Espace Parrain</h4>
                            <p className="text-slate-500 dark:text-zink-200">Connectez-vous pour continuer à OCP.</p>
                        </div>

                        <form className="mt-10" id="signInForm"
                            onSubmit={(event: any) => {
                                event.preventDefault();
                                validation.handleSubmit();
                                return false;
                            }}>
                            {success && <div className="px-4 py-3 mb-3 text-sm text-green-500 border border-green-200 rounded-md bg-green-50 dark:bg-green-400/20 dark:border-green-500/50" id="successAlert">
                            Vous êtes <b>connecté avec succès</b>.
                            </div>}
                            {error && <div className="px-4 py-3 mb-3 text-sm text-red-500 border border-red-200 rounded-md bg-red-50 dark:bg-red-400/20 dark:border-red-500/50" id="successAlert">
                            Votre connexion a <b>échoué</b>.
                            </div>}
                            <div className="mb-3">
                                <label htmlFor="email" className="inline-block mb-2 text-base font-medium">Email</label>
                                <input
                                    type="text"
                                    id="email"
                                    name="email"
                                    className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                                    placeholder="Enter username or email"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.email || ""}
                                />
                                {validation.touched.email && validation.errors.email ? (
                                    <div id="email-error" className="mt-1 text-sm text-red-500">{validation.errors.email}</div>
                                ) : null}

                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="inline-block mb-2 text-base font-medium">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                                    placeholder="Enter password"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.password || ""
                                }
                                />
                                {validation.touched.password && validation.errors.password ? (
                                    <div id="password-error" className="mt-1 text-sm text-red-500">{validation.errors.password}</div>
                                ) : null}
                            </div>
                            <div>
                                {/* <div className="flex items-center gap-2">
                                    <input id="checkboxDefault1" className="size-4 border rounded-sm appearance-none bg-slate-100 border-slate-200 dark:bg-zink-600 dark:border-zink-500 checked:bg-custom-500 checked:border-custom-500 dark:checked:bg-custom-500 dark:checked:border-custom-500 checked:disabled:bg-custom-400 checked:disabled:border-custom-400" type="checkbox" value="" />
                                    <label htmlFor="checkboxDefault1" className="inline-block text-base font-medium align-middle cursor-pointer">Remember me</label>
                                </div> */}
                                {/* <div id="remember-error" className="hidden mt-1 text-sm text-red-500">Please check the "Remember me" before submitting the form.</div> */}
                            </div>
                            <div className="mt-10">
                                <button type="submit" className="w-full text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20">Sign In</button>
                            </div>

                            
                            <div className="mt-10 text-center">
                                <p className="mb-0 text-slate-500 dark:text-zink-200">Êtes-vous un stagiaire? <Link to="/auth-login-boxed" className="font-semibold underline transition-all duration-150 ease-linear text-slate-500 dark:text-zink-200 hover:text-custom-500 dark:hover:text-custom-500"> SignIn</Link> </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default withRouter(Login);