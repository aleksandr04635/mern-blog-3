import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useLocation, useNavigate } from "react-router-dom";
import MyButton from "./MyButton";

export default function OAuth() {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const callbackUrl = urlParams.get("callbackUrl");

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      //console.log("resultsFromGoogle: ", resultsFromGoogle);
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          googlePhotoUrl: resultsFromGoogle.user.photoURL,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate(`${callbackUrl ?? "/"}`);
        //navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    /*     <Button
      type="button"
      gradientDuoTone="purpleToBlue"
      outline
      onClick={handleGoogleClick}
    >
      <AiFillGoogleCircle className="w-6 h-6 mr-2" />
      Continue with Google
    </Button> */
    <MyButton type="button" onClick={handleGoogleClick} className=" w-full ">
      <AiFillGoogleCircle className="mr-2 h-6 w-6" />
      Continue with Google
    </MyButton>
  );
}
