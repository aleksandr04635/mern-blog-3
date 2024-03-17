import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import { BsEyeSlash } from "react-icons/bs";
import { BsEye } from "react-icons/bs";
import OAuth from "../components/OAuth";
import { customTextInputTheme } from "../../customFlowbiteThemes";
import MyButton from "../components/MyButton";
import validateEmail from "../utils/validateEmail";
import Loading from "../components/Loading";

export default function SignIn() {
  const {
    loading,
    error: errorMessage,
    currentUser,
  } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [visible, setVisible] = useState(false);
  const [visibleEr, setVisibleEr] = useState(true);
  const [encodedCallbackUrl, setEncodedCallbackUrl] = useState("");
  const [token, setToken] = useState("");
  //console.log("visibleEr: ", visibleEr);
  console.log("formData in SignIn : ", formData);
  console.log("token in SignIn : ", token);
  //console.log("formData.password: ", formData.password);
  //console.log("formData.password.length: ", formData.password?.length);
  const urlParams = new URLSearchParams(location.search);
  const callbackUrl = urlParams.get("callbackUrl");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const callbackUrl = urlParams.get("callbackUrl");
    const emailFromUrl = urlParams.get("email");
    if (emailFromUrl) {
      setFormData({ ...formData, email: emailFromUrl });
    }
    const tokenFromUrl = urlParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
    //let encodedCallbackUrl = encodeURIComponent(callbackUrl);
    setEncodedCallbackUrl(encodeURIComponent(callbackUrl));
    //console.log("callbackUrl from SignIn: ", callbackUrl);
    if (currentUser) {
      //navigate("/");
      navigate(`${callbackUrl ?? "/"}`);
    }
  }, [navigate, currentUser]);

  const handleChange = (e) => {
    setVisibleEr(false);
    // setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setVisibleEr(true);
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill all the fields"));
    }
    if (token) {
      formData.token = token;
    }
    if (encodedCallbackUrl && encodedCallbackUrl != "null") {
      formData.encodedCallbackUrl = encodedCallbackUrl;
    }
    console.log("formData from handleSubmit in SignIn : ", formData);
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
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
  };

  return (
    <div className="min-h-screen sm:mt-10">
      <div className="mx-auto flex max-w-lg flex-col gap-4  p-3 md:items-center">
        <h3 className="text-center text-lg font-semibold">
          You can sign in with your email and password or with Google.
        </h3>
        <div className="flex-1">
          <form
            className="mx-auto flex w-[300px] flex-col gap-3"
            onSubmit={handleSubmit}
          >
            <div>
              <Label htmlFor="email" value="Your email:" />
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                onChange={handleChange}
                value={formData.email || ""}
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
                value={formData.password || ""}
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
            {/*     <Button
              outline
              gradientDuoTone="purpleToBlue"
              type="submit"
              disabled={
                loading ||
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
                "Sign In"
              )}
            </Button> */}
            <MyButton
              type="submit"
              disabled={
                loading ||
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
                "Sign In"
              )}
            </MyButton>
            <OAuth />
            <div className="flex items-center gap-2 text-sm">
              <span>Dont Have an account?</span>
              <Link
                /* to={`/sign-up?${encodedCallbackUrl}`} */
                to={`/sign-up?callbackUrl=${encodedCallbackUrl}`}
                className="link-stand"
              >
                Sign Up
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
              /* hidden={!visibleEr} */
              className={`mx-auto mt-5 w-[300px] text-justify ${!visibleEr && "hidden"}`}
              color="failure"
            >
              {/* it can be failure or success */}
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
