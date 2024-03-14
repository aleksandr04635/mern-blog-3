import {
  Alert,
  Button,
  ModalBody,
  Textarea,
  TextInput,
  Label,
  Spinner,
} from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from "../redux/user/userSlice";
import { BsEyeSlash, BsEye } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";
import ModalComponent from "./ModalComponent";
import Loading from "./Loading";
import {
  customTextInputTheme,
  customTextareaTheme,
} from "../../customFlowbiteThemes";
import MyButton from "./MyButton";

export default function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [visibleEr, setVisibleEr] = useState(true);
  const [visible, setVisible] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const filePickerRef = useRef();
  const dispatch = useDispatch();

  //console.log("formData", formData);
  //console.log("loadingPage", loadingPage);
  //console.log("setVisibleEr", setVisibleEr);
  //console.log("formData.password?.length", formData.password?.length);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    const ef = async () => {
      setFormData({
        username: currentUser.username,
        email: currentUser.email,
        description: currentUser.description || "",
        password: "",
      });
      setLoadingPage(false);
    };

    ef();
  }, [currentUser]);

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const validateEmail = (email) => {
    return !!String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
  };

  const uploadImage = async () => {
    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write: if
    //       request.resource.size < 3 * 1024 * 1024 &&
    //       request.resource.contentType.matches('image/.*')
    //     }
    //   }
    // }
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload image (File must be less than 3MB)",
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      },
    );
  };

  const handleChange = (e) => {
    setVisibleEr(false);
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    setVisibleEr(true);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No changes made");
      return;
    }
    console.log("sent formData:", formData);
    if (imageFileUploading) {
      setUpdateUserError("Please wait for image to upload");
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  if (loadingPage) {
    return <Loading />;
  }
  /* <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div> */

  return (
    <div className="mx-auto w-full max-w-lg px-3">
      <h1 className="my-2 text-center text-xl font-semibold">Profile</h1>
      <h3 className=" my-1 text-center  text-base">
        Here you can change your avatar image or data. Don't enter the data you
        don't want to change
      </h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className="relative h-32 w-32 cursor-pointer self-center overflow-hidden rounded-full shadow-md"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={4}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(230, 92, 0, ${
                    imageFileUploadProgress / 100 /* opacity changes */
                  })`,
                },
                text: { fill: "rgb(230, 92, 0)" },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="user"
            className={`h-full w-full rounded-full border-2 border-[lightgray] object-cover ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}
        {/* 
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="password"
          onChange={handleChange}
        /> */}
        {/*         <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          disabled={loading || imageFileUploading}
        >
          {loading ? "Loading..." : "Update"}
        </Button>
 */}
        <div>
          <Label htmlFor="username" value="Your username:" />
          <TextInput
            type="text"
            placeholder="Username"
            id="username"
            /*  defaultValue={currentUser.username} */
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
            /* defaultValue={currentUser.email} */
            onChange={handleChange}
            value={formData.email}
            color={validateEmail(formData?.email) ? "info" : "failure"}
            helperText={validateEmail(formData?.email) ? "" : "enter an email"}
            theme={customTextInputTheme}
          />
        </div>
        <div>
          <Label htmlFor="description" value="Write briefly about yourself:" />
          {/*           <TextInput
            type="description"
            placeholder="Your short description"
            id="description"
            onChange={handleChange}
            value={formData.description}
          /> */}
          <Textarea
            placeholder="Your short description"
            maxLength="300"
            id="description"
            color="info"
            onChange={handleChange}
            className="h-[160px] sm:h-[80px]"
            value={formData.description}
            theme={customTextareaTheme}
            /*               helperText={
                formData.intro?.length > 5 ? "" : "minimum 5 characters"
              } */
          />
        </div>
        <div className="relative">
          <Label
            htmlFor="password"
            value="Your password, if you want to change it:"
          />
          <TextInput
            type={visible ? "text" : "password"}
            placeholder="Password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            color={
              !(formData.password && formData.password.length < 6)
                ? "info"
                : "failure"
            }
            helperText={
              !(formData.password && formData.password.length < 6)
                ? ""
                : "minimum 6 characters"
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
        <MyButton
          type="submit"
          disabled={
            loading ||
            imageFileUploading ||
            formData.username?.length < 6 ||
            !validateEmail(formData.email) ||
            (formData.password && formData.password.length < 6)
          }
          className=" w-full "
        >
          {loading ? (
            <>
              <Spinner size="sm" />
              <span className="pl-3">Loading...</span>
            </>
          ) : (
            /*  <>
             <Loading className="py-0" />
              <Spinner size="sm" />
              <span className="pl-3">Loading...</span>
            </> */
            "Update"
          )}
        </MyButton>
        {/*        <Button
          outline
          gradientDuoTone="purpleToBlue"
          type="submit"
          disabled={
            loading ||
            imageFileUploading ||
            formData.username?.length < 6 ||
            !validateEmail(formData.email) ||
            (formData.password && formData.password.length < 6)
          }
        >
          {loading ? (
            <>
              <Spinner size="sm" />
              <span className="pl-3">Loading...</span>
            </>
          ) : (
            "Update"
          )}
        </Button> */}

        {updateUserSuccess && (
          <Alert
            color="info"
            className={`mt-5 text-justify ${!visibleEr && "hidden"}`}
          >
            {updateUserSuccess}
          </Alert>
        )}
        {updateUserError && (
          <Alert
            color="failure"
            className={`mt-5 text-justify ${!visibleEr && "hidden"}`}
          >
            {updateUserError}
          </Alert>
        )}
      </form>
      {/*       <div className="mt-4 flex justify-around gap-4">
        <Button
          type="button"
          outline
          gradientDuoTone="pinkToOrange"
          className="w-full"
          onClick={() => setShowModal(true)}
        >
          Delete Account
        </Button>
        <Button
          type="button"
          outline
          gradientDuoTone="redToYellow"
          className="w-full"
          onClick={handleSignout}
        >
          Sign Out
        </Button>
      </div> */}
      <div className="mt-4 flex justify-around gap-4">
        <MyButton
          type="button"
          onClick={() => setShowModal(true)}
          style="danger"
          className=" w-full"
        >
          Delete Account
        </MyButton>
        <MyButton
          type="button"
          onClick={handleSignout}
          style="attention"
          className="w-full"
        >
          Sign Out
        </MyButton>
      </div>
      {/*      <Link to={"/create-post"} className="">
        <Button
          type="button"
          outline
          gradientDuoTone="purpleToBlue"
          className="mb-10 mt-10 w-full"
        >
          Create a post
        </Button>
      </Link> */}
      <Link to={"/create-post"} className="">
        <MyButton type="button" className="mb-10 mt-10 w-full">
          Create a post
        </MyButton>
      </Link>
      {/*       {error && (
        <Alert
          color="failure"
          className={`mt-5 text-justify ${!visibleEr && "hidden"}`}
        >
          {error}
        </Alert>
      )} */}
      <ModalComponent
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDeleteUser}
        text={"Are you sure you want to delete your account?"}
      />
    </div>
  );
}
