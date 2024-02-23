import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import { BsEyeSlash } from "react-icons/bs";
import { BsEye } from "react-icons/bs";
import OAuth from "../components/OAuth";

export default function ResetPassword() {
  const { id, token } = useParams();
  const navigate = useNavigate();
  const {
    loading: load2,
    error: errorMessage2,
    currentUser,
  } = useSelector((state) => state.user);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [formData, setFormData] = useState({});
  const [visible, setVisible] = useState(false);
  const [success, setSuccess] = useState(false);

  //const dispatch = useDispatch();

  console.log("id : ", id);
  console.log("token : ", token);
  //console.log("visibleEr: ", visibleEr);
  //console.log("formData: ", formData);
  //console.log("formData.password: ", formData.password);
  //console.log("formData.password.length: ", formData.password?.length);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  useEffect(() => {
    if (currentUser || !token) {
      // navigate("/");
      navigate("/dashboard?tab=profile");
    }
  }, [navigate, currentUser, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    formData.token = token;
    if (!formData.conpassword || !formData.password) {
      return setErrorMessage("Please fill out all fields.");
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log("data received in ResetPassword: ", data);
      setLoading(false); //my
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      if (res.ok) {
        setSuccess(true);
        //navigate("/sign-in");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen sm:mt-20">
      <div className="flex p-3 max-w-xl mx-auto flex-col  md:items-center gap-5">
        <h3 className="text-lg font-semibold text-center">
          Enter your new password.
        </h3>
        <div className="flex-1">
          <form
            className="flex flex-col w-[300px] mx-auto gap-4"
            onSubmit={handleSubmit}
          >
            <div className="relative">
              <Label htmlFor="password" value="Your password:" />
              <TextInput
                type={visible ? "text" : "password"}
                placeholder="Password"
                id="password"
                value={formData.password || ""}
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
            <div className="relative">
              <Label htmlFor="conpassword" value="Confirm your password:" />
              <TextInput
                type={visible ? "text" : "password"}
                placeholder="Confirm your password"
                id="conpassword"
                value={formData.conpassword || ""}
                onChange={handleChange}
                color={
                  formData.conpassword?.length > 5 &&
                  formData.conpassword == formData.password
                    ? "success"
                    : "failure"
                }
                helperText={
                  formData.conpassword?.length > 5 &&
                  formData.conpassword == formData.password
                    ? ""
                    : "Confirmation of the password is wrong"
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
                formData.password?.length < 6 ||
                formData.conpassword !== formData.password
              }
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Reset the password"
              )}
            </Button>
            <OAuth />
            {/*             <div className="flex gap-2 text-sm ">
              <span>Dont Have an account?</span>
              <Link to="/sign-up" className="text-blue-500">
                Sign Up
              </Link>
            </div> */}
            {/*             <div className="flex gap-2 text-sm ">
              <span>Forgot&nbsp;the&nbsp;password?</span>
              <Link to="/forgot-password" className="text-blue-500">
                Reset&nbsp;the&nbsp;password
              </Link>
            </div> */}
          </form>
          {errorMessage && (
            <Alert
              /* hidden={!visibleEr} */
              className={`mt-5 text-justify `}
              color="failure"
            >
              {/* it can be failure or success */}
              {errorMessage}
            </Alert>
          )}
          {success && (
            <>
              <Alert className={`mt-5 text-center mx-auto `} color="success">
                {/* it can be failure or success */}
                The password had been resetted succesfully. You can sign in now
              </Alert>
              <Button
                onClick={() => navigate("/sign-in")}
                className={`mt-5 text-center mx-auto `}
                gradientDuoTone="purpleToBlue"
                outline
              >
                Sign In
              </Button>
              {/*              <Link className={`mt-5  `} to="/sign-in">
                              </Link> */}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
