import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import { BsEyeSlash, BsEye } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  //const [errorMessage, setErrorMessage] = useState(null);
  //const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const [visibleEr, setVisibleEr] = useState(true);
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const validateEmail = (email) => {
    return !!String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  //console.log("validateEmail(formData.email): ", validateEmail(formData.email));

  const handleChange = (e) => {
    setVisibleEr(false);
    //setErrorMessage(null);
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  //old
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
  //new
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
      <div className="flex p-3 max-w-lg mx-auto flex-col  md:items-center gap-5">
        <h3 className="text-lg font-semibold text-center">
          You can sign up with your email and password or with Google.
        </h3>
        <div className="flex-1">
          <form
            className="flex flex-col w-[250px] mx-auto gap-4"
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
                color={formData.username?.length > 5 ? "success" : "failure"}
                helperText={
                  formData.username?.length > 5 ? "" : "minimum 6 characters"
                }
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
                color={validateEmail(formData?.email) ? "success" : "failure"}
                helperText={
                  validateEmail(formData?.email) ? "" : "enter an email"
                }
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
                color={formData.password?.length > 5 ? "success" : "failure"}
                helperText={
                  formData.password?.length > 5 ? "" : "minimum 6 characters"
                }
              />
              <p
                onClick={() => setVisible(!visible)}
                className="cursor-pointer border-none w-12 h-10 absolute text-xl top-[35px] right-[-21px]"
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
