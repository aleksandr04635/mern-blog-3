import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
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

export default function Test() {
  const { id } = useParams();
  const { currentUser } = useSelector((state) => state.user);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [formData, setFormData] = useState({});
  const [visible, setVisible] = useState(false);
  //const [visibleEr, setVisibleEr] = useState(true);
  const { loading: load2, error: errorMessage2 } = useSelector(
    (state) => state.user
  );
  //const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log("id : ", id);
  //console.log("token : ", token);
  //console.log("visibleEr: ", visibleEr);
  //console.log("formData: ", formData);
  //console.log("formData.password: ", formData.password);
  //console.log("formData.password.length: ", formData.password?.length);
  const handleChange = (e) => {
    // setVisibleEr(false);
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  /*   useEffect(() => {
    if (currentUser || !token) {
      navigate("/");
    }
  }, [navigate, currentUser, token]); */

  /* const handleSubmit = async (e) => {
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

  return (
    <div className="min-h-screen sm:mt-20">
      <div className="flex p-3 max-w-lg mx-auto flex-col  md:items-center gap-5">
        <h3 className="text-lg font-semibold text-center">
          Enter your new password.
        </h3>
        {id ? <div>id: {id}</div> : <div>No id</div>}
        <div className="flex-1">
          {/*        <form
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
                  formData.conpassword == formData.password
                    ? "success"
                    : "failure"
                }
                helperText={
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
                "Sign In"
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
              <span>Forgot&nbsp;the&nbsp;password?</span>
              <Link to="/forgot-password" className="text-blue-500">
                Reset&nbsp;the&nbsp;password
              </Link>
            </div>
          </form> */}
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
