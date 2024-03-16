import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import { BsEyeSlash, BsEye } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import {
  customAlertTheme,
  customTextInputTheme,
} from "../../customFlowbiteThemes";
import MyButton from "../components/MyButton";
import validateEmail from "../utils/validateEmail";
import Loading from "../components/Loading";

export default function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  //for without email sending version
  /*   const {
    loading,
    error: errorMessage,
    currentUser,
  } = useSelector((state) => state.user); */

  //for email sending version
  const { currentUser } = useSelector((state) => state.user);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [visible, setVisible] = useState(false);
  const [visibleEr, setVisibleEr] = useState(true);
  const [signUpSuccess, setSignUpSuccess] = useState(null);
  const [encodedCallbackUrl, setEncodedCallbackUrl] = useState("");
  const urlParams = new URLSearchParams(location.search);
  console.log("errorMessage from SignUp: ", errorMessage);
  console.log("visibleEr from SignUp: ", visibleEr);
  const callbackUrl = urlParams.get("callbackUrl");
  //console.log("signUpSuccess from SignUp: ", signUpSuccess);
  //console.log("validateEmail(formData.email): ", validateEmail(formData.email));

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const callbackUrl = urlParams.get("callbackUrl");
    //let encodedCallbackUrl = encodeURIComponent(callbackUrl);
    setEncodedCallbackUrl(encodeURIComponent(callbackUrl));
    //console.log("callbackUrl from SignUp: ", callbackUrl);
    if (currentUser) {
      //navigate("/");
      navigate(`${callbackUrl ?? "/"}`);
    }
  }, [navigate, currentUser]);

  const handleChange = (e) => {
    setVisibleEr(false);
    //setErrorMessage(null);
    //setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  //for with email sending version
  //ADD HERE EMAIL VARIFICATION SENDING with sending encodedCallbackUrl to server
  // and adding it there to the link, sent to email
  const handleSubmit = async (e) => {
    e.preventDefault();
    setVisibleEr(true);
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("Please fill out all fields.");
    }
    if (encodedCallbackUrl && encodedCallbackUrl !== "null") {
      formData.encodedCallbackUrl = encodedCallbackUrl;
    }
    console.log("formData from SignUp: ", formData);
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setErrorMessage(data.message);
      }
      if (res.ok) {
        setSignUpSuccess(
          "You have signed up successfully. Now go to your email and click the email verification link. You can close this window",
        );
        // navigate("/sign-in");
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  //for without email sending version
  /* const handleSubmit = async (e) => {
    e.preventDefault();
    setVisibleEr(true);
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill all the fields"));
    }
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }
      if (res.ok) {
        dispatch(signInSuccess(data));
        //navigate("/");
        navigate(`${callbackUrl ?? "/"}`);
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  }; */

  return (
    <div className="min-h-screen sm:mt-10">
      <div className="mx-auto flex max-w-lg flex-col gap-4  p-3 md:items-center">
        <h3 className="text-center text-lg font-semibold">
          You can sign up with your email and password or with Google.
        </h3>
        {/*  <div className="text-center  text-sm text-orange-600">
          If you register with a wrong email or change it to a wrong one in your
          profile you will not be able to reset your password via email
        </div> */}
        <div className="flex-1">
          <form
            className="mx-auto flex w-[300px] flex-col gap-3"
            onSubmit={handleSubmit}
          >
            <div>
              <Label htmlFor="username" value="Your username:" />
              <TextInput
                type="text"
                placeholder="Username"
                id="username"
                onChange={handleChange}
                value={formData.username}
                color={formData.username?.length > 5 ? "info" : "failure"}
                helperText={
                  formData.username?.length > 5 ? "" : "minimum 6 characters"
                }
                theme={customTextInputTheme}
              />
            </div>
            <div>
              <Label htmlFor="email" value="Your email:" />
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                onChange={handleChange}
                value={formData.email}
                color={validateEmail(formData?.email) ? "info" : "failure"}
                helperText={
                  validateEmail(formData?.email) ? "" : "enter an email"
                }
                theme={customTextInputTheme}
              />
            </div>
            <div className="relative">
              <Label htmlFor="password" value="Your password:" />
              <TextInput
                type={visible ? "text" : "password"}
                placeholder="Password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                color={formData.password?.length > 5 ? "info" : "failure"}
                helperText={
                  formData.password?.length > 5 ? "" : "minimum 6 characters"
                }
                theme={customTextInputTheme}
              />
              <p
                onClick={() => setVisible(!visible)}
                className="absolute right-[-21px] top-[35px] h-10 w-12 cursor-pointer border-none text-xl"
              >
                {visible ? <BsEyeSlash /> : <BsEye />}
              </p>
            </div>
            {/*      <Button
              outline
              gradientDuoTone="purpleToBlue"
              type="submit"
              disabled={
                loading ||
                formData.username?.length < 6 ||
                !validateEmail(formData.email) ||
                formData.password?.length < 6
              }
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button> */}
            <MyButton
              type="submit"
              disabled={
                loading ||
                formData.username?.length < 6 ||
                !validateEmail(formData.email) ||
                formData.password?.length < 6
              }
              className=" w-full "
            >
              {loading ? (
                /*  <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </> */
                <Loading type="button" />
              ) : (
                "Sign Up"
              )}
            </MyButton>
            <OAuth />
            <div className="flex items-center gap-2 text-sm ">
              <span>Already have an account?</span>
              <Link
                /* to="/sign-in" */ to={`/sign-in?callbackUrl=${encodedCallbackUrl}`}
                className="link-stand"
              >
                Sign In
              </Link>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span>Forgot&nbsp;the&nbsp;password?</span>
              <Link to="/forgot-password" className="link-stand">
                Reset&nbsp;the&nbsp;password
              </Link>
            </div>
          </form>
          {errorMessage && (
            <Alert
              className={`mx-auto mt-5 w-[300px] text-justify ${!visibleEr && "hidden"}`}
              color="failure"
            >
              {/* it can be failure or success */}
              {errorMessage}
            </Alert>
          )}
          {signUpSuccess && (
            /*  ${!visibleEr && "hidden"} */
            <Alert
              color="info"
              className={`mx-auto mt-5 w-[300px] text-justify `}
              theme={customAlertTheme}
            >
              {signUpSuccess}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
