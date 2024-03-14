import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import { BsEyeSlash, BsEye } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import { customTextInputTheme } from "../../customFlowbiteThemes";

export default function SignUp() {
  const {
    loading,
    error: errorMessage,
    currentUser,
  } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({});
  //const [errorMessage, setErrorMessage] = useState(null);
  //const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visibleEr, setVisibleEr] = useState(true);

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [navigate, currentUser]);

  const validateEmail = (email) => {
    return !!String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
  };
  //console.log("validateEmail(formData.email): ", validateEmail(formData.email));

  const handleChange = (e) => {
    setVisibleEr(false);
    //setErrorMessage(null);
    //setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  //old without instant sign-in
  /*   const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("Please fill out all fields.");
    }
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
        setLoading(false); //my
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if (res.ok) {
        navigate("/sign-in");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  }; */
  //new with instant sign-in
  const handleSubmit = async (e) => {
    e.preventDefault();
    setVisibleEr(true);
    /*     if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill all the fields"));
    } */
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
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="min-h-screen sm:mt-20">
      <div className="mx-auto flex max-w-lg flex-col gap-5  p-3 md:items-center">
        <h3 className="text-center text-lg font-semibold">
          You can sign up with your email and password or with Google.
        </h3>
        <div className="text-center  text-sm text-orange-600">
          If you register with a wrong email or change it to a wrong one in your
          profile you will not be able to reset your password via email
        </div>
        <div className="flex-1">
          <form
            className="mx-auto flex w-[300px] flex-col gap-4"
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
            <Button
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
            </Button>
            <OAuth />
            <div className="flex gap-2 text-sm ">
              <span>Already have an account?</span>
              <Link to="/sign-in" className="text-blue-500">
                Sign In
              </Link>
            </div>
            <div className="flex gap-2 text-sm ">
              <span>Forgot&nbsp;the&nbsp;password?</span>
              <Link to="/forgot-password" className="text-blue-500">
                Reset&nbsp;the&nbsp;password
              </Link>
            </div>
          </form>
          {errorMessage && (
            <Alert
              className={`mt-5 text-justify ${!visibleEr && "hidden"}`}
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
