import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
import { customTextInputTheme } from "../../customFlowbiteThemes";

export default function ForgotPassword() {
  const [formData, setFormData] = useState({});
  //const [visible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [visibleEr, setVisibleEr] = useState(true);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  //const { loading, error: errorMessage } = useSelector((state) => state.user);
  //const dispatch = useDispatch();

  console.log("errorMessage: ", errorMessage);
  //console.log("visibleEr: ", visibleEr);
  //console.log("formData: ", formData);
  //console.log("formData.password: ", formData.password);
  //console.log("formData.password.length: ", formData.password?.length);

  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard?tab=profile");
    }
  }, [navigate, currentUser]);

  const handleChange = (e) => {
    setVisibleEr(false);
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const validateEmail = (email) => {
    return !!String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
  };

  /*   const handleSubmit = async (e) => {
    e.preventDefault();
    setVisibleEr(true);
    if (!formData.email) {
      return dispatch(signInFailure("Please fill all the fields"));
    }
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/forgot-password", {
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
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  }; */

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      return setErrorMessage("Please fill out all fields.");
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log("data received in ForgotPassword.jsx: ", data);
      if (data.success === false) {
        //setLoading(false); //my
        return setErrorMessage(data.message);
      }
      if (res.ok) {
        setSuccess(true);
        //navigate("/sign-in");
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen sm:mt-20">
      <div className="mx-auto flex max-w-xl flex-col gap-5  p-3 md:items-center">
        <h3 className="text-center text-lg font-semibold">
          Enter your email to reset your password.
        </h3>
        <div className="flex-1">
          <form
            className="mx-auto flex w-[300px] flex-col gap-4"
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
            <Button
              outline
              gradientDuoTone="purpleToBlue"
              type="submit"
              disabled={loading || !validateEmail(formData.email)}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Send me a link to reset the password"
              )}
            </Button>
            <OAuth />
            <div className="flex gap-2 text-sm ">
              <span>Dont Have an account?</span>
              <Link to="/sign-up" className="text-blue-500">
                Sign Up
              </Link>
            </div>
            <div className="flex gap-2 text-sm ">
              <span>Already have an account?</span>
              <Link to="/sign-in" className="text-blue-500">
                Sign In
              </Link>
            </div>
          </form>
          {errorMessage && (
            <Alert
              /* hidden={!visibleEr} */
              /* className={`mt-5 text-justify ${!visibleEr && "hidden"}`} */
              className={`mt-5 text-justify `}
              color="failure"
            >
              {/* it can be failure or success */}
              {errorMessage}
            </Alert>
          )}
          {success && (
            <Alert className={`mt-5 text-center `} color="success">
              {/* it can be failure or success */}
              The email with a reset link had been sent to your email. Go there
              and click it
            </Alert>
          )}
        </div>
      </div>
    </div>
    /*  <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:items-center gap-5">
        <h3 className="text-lg font-semibold text-center">
          You can sign in with your email and password or with Google.
        </h3>

        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email" value="Your email" />
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="password" value="Your password" />
              <TextInput
                type="password"
                placeholder="**********"
                id="password"
                onChange={handleChange}
              />
            </div>
            <Button
              outline
              gradientDuoTone="purpleToBlue"
              type="submit"
              disabled={
                loading || !formData.email || formData.password?.length < 3
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
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Dont Have an account?</span>
            <Link to="/sign-up" className="text-blue-500">
              Sign Up
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div> */
  );
}
