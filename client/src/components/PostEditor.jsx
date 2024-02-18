import {
  Alert,
  Button,
  FileInput,
  Select,
  TextInput,
  Spinner,
  Textarea,
  Label,
} from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { ImCross } from "react-icons/im";

export default function PostEditor({ mode, postId }) {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  //const [postData, setPostData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [tag, setTag] = useState(""); //scalar
  const [tags, setTags] = useState([]); //array of objects
  const [loading, setLoading] = useState(true);

  //console.log("PostEditor(mode, postId) : ", mode, postId);
  console.log("formData in PostEditor : ", formData);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (mode == "edit") {
          const res = await fetch(`/api/post/getposts?postId=${postId}`);
          const data = await res.json();
          console.log("formData upon fetch: ", formData);
          if (!res.ok) {
            console.log(data.message);
            setPublishError(data.message);
            setLoading(false);
            return;
          }
          if (res.ok) {
            console.log("data.posts[0]: ", data.posts[0]);
            setPublishError(null);
            setFormData(data.posts[0]);
            //setPostData(data.posts[0]);
            setTags(data.posts[0].tags);
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchPost();
  }, [postId]);

  const handleUpdloadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image upload failed");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  //console.log("tags :", tags);
  const deleteTag = (i) => {
    //console.log("tags before:", tags);
    //console.log("i:", i);
    //let updatedTags = [...tags];
    //console.log("tags after:", updatedTags.splice(i, 1));
    // updatedTags.splice(i, 1);
    setTags((t) => {
      //console.log("c:", c);
      //return c.splice(i, 1);
      return t.filter((e, n) => n != i);
    });
  };

  const addTag = () => {
    let updatedTags = [...tags];
    updatedTags.push({
      name: tag.trim(),
      slug: tag
        .replace(/[^a-z\-A-Z0-9-]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .split(" ")
        .join("-")
        /* .toLowerCase() */
        .replace(/[^a-z\-A-Z0-9-]/g, ""),
    });
    setTag("");
    setTags(updatedTags);
  };

  //console.log("formData.content.length: ", formData.content.length);
  //console.log("formData: ", formData);
  const handleSubmit = async (e) => {
    e.preventDefault();
    formData.tags = tags;
    //formData._id = postData._id; //it gets lost
    console.log("formData from handleSubmit: ", formData);
    try {
      const res = await fetch(
        // `/api/post/updatepost/${formData._id}/${currentUser._id}`,//old
        `${
          mode == "edit"
            ? `/api/post/updatepost/${formData._id}/${currentUser._id}`
            : "/api/post/create"
        }`, //my
        {
          method: `${mode == "edit" ? "PUT" : "POST"}`,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };

  //create

  return (
    <div className="p-1 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-xl my-2 font-semibold">
        {mode == "edit" ? "Update a post" : "Create a post"}
      </h1>
      {loading ? (
        <div className="h-[80vh] flex justify-center items-center w-full">
          <Spinner size="xl" />
        </div>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* image */}
          <div>
            <h3 className="p-1">Front image (optional):</h3>
            <div className="flex gap-4 items-center justify-between border border-teal-500 rounded-lg p-3">
              <FileInput
                type="file"
                accept="image/*"
                color="gray"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <Button
                type="button"
                gradientDuoTone="purpleToBlue"
                size="sm"
                outline
                onClick={handleUpdloadImage}
                disabled={imageUploadProgress}
              >
                {imageUploadProgress ? (
                  <div className="w-16 h-16">
                    <CircularProgressbar
                      value={imageUploadProgress}
                      text={`${imageUploadProgress || 0}%`}
                    />
                  </div>
                ) : (
                  "Upload Image"
                )}
              </Button>
            </div>
            {imageUploadError && (
              <Alert color="failure">{imageUploadError}</Alert>
            )}
            {formData.image && (
              <img
                src={formData.image}
                alt="upload"
                className="w-full h-72 object-cover"
              />
            )}
          </div>
          {/* tags */}
          <div className="flex flex-col">
            <h3 className="p-1 text-base">Tags list (optional):</h3>
            <div className="flex items-center space-x-4 md:space-x-2">
              <TextInput
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="px-4 py-2 outline-none rounded border-teal-500 "
                placeholder="Enter a post tag"
                /* color="success" */
                type="text"
              />
              {/*              <div
                onClick={addTag}
                className="bg-teal-500 rounded-lg text-white px-4 py-2 font-semibold cursor-pointer"
              >
                Add
              </div> */}
              <Button
                onClick={addTag}
                outline
                gradientDuoTone="purpleToBlue"
                className="w-[70px]"
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap px-4 mt-3">
              {tags?.map((t, i) => (
                <div
                  key={i}
                  className="flex justify-center dark:text-gray-200 items-center space-x-2 mr-4 dark:bg-gray-700 bg-gray-200 px-2 py-1 rounded-lg"
                >
                  <p>{t.name}</p>
                  <p
                    onClick={() => deleteTag(i)}
                    className="text-white bg-gray-500 rounded-full cursor-pointer p-1 text-sm"
                  >
                    <ImCross />
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* importance */}
          <div className="flex items-center gap-1">
            <div className="text-sm px-1">importance:</div>
            <div className="text-lg">{formData.importance || 1}</div>
            <div className="flex flex-col   text-sm">
              <button
                className=" relative border items-center text-center rounded-t-lg w-[15px] h-[12px]"
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    importance: (formData.importance || 1) + 1,
                  })
                }
              >
                <p className="top-[-5px] right-[2px] absolute align-middle ">
                  +
                </p>
              </button>
              <button
                className=" relative border items-center text-center rounded-b-lg w-[15px] h-[12px]"
                type="button"
                onClick={() => {
                  !!formData.importance & (formData.importance > 1) &&
                    setFormData({
                      ...formData,
                      importance: (formData.importance || 1) - 1,
                    });
                }}
              >
                <p className="top-[-6px] right-[4px] absolute align-middle ">
                  -
                </p>
              </button>
            </div>
            <div className="text-sm px-2">
              Your posts will be sorted by this importance on your page. Not set
              it above 1 without real purpose
            </div>
          </div>

          {/* title */}
          <div className="flex flex-col  justify-between">
            {/* <h3 className="p-1">Title (minimum 5 characters):</h3> */}
            <Label
              htmlFor="title"
              color="gray"
              value="Title (minimum 5 characters)"
              className="p-1 text-base"
            />
            <TextInput
              type="text"
              maxLength="150"
              placeholder="Title"
              required
              id="title"
              className="flex-1"
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              value={formData.title || ""}
              color={formData.title?.length > 5 ? "success" : "failure"}
              helperText={
                formData.title?.length > 5 ? "" : "minimum 5 characters"
              }
            />
            <p className="text-gray-500 p-1 text-xs">
              {150 - (formData.title?.length ?? 0)} characters remaining
            </p>
          </div>
          {/* intro */}
          <div className="flex flex-col">
            {/* <h3 className="p-1">Introduction (minimum 5 characters):</h3> */}
            <Label
              htmlFor="intro"
              color="gray"
              value="Introduction (minimum 5 characters)"
              className="p-1 text-base"
            />
            <Textarea
              placeholder="Write an introduction"
              maxLength="300"
              id="intro"
              color={formData.intro?.length > 5 ? "success" : "failure"}
              onChange={(e) =>
                setFormData({ ...formData, intro: e.target.value })
              }
              className="h-[160px] sm:h-[80px]"
              value={formData.intro || ""}
              helperText={
                formData.intro?.length > 5 ? "" : "minimum 5 characters"
              }
            />
            <p className="text-gray-500 text-xs">
              {300 - (formData.intro?.length ?? 0)} characters remaining
            </p>
          </div>
          {/* Text */}
          <h3 className="p-1">Main content (necessary):</h3>
          <ReactQuill
            theme="snow"
            value={formData.content || ""}
            placeholder="Write the main text"
            className="h-72 mb-12"
            required
            onChange={(value) => {
              setFormData({ ...formData, content: value });
            }}
          />
          {/* Controls */}
          <div className="flex gap-2 items-center justify-around  ">
            <Button
              type="submit"
              disabled={
                formData.title?.length < 6 ||
                formData.content?.length < 16 ||
                !formData.intro ||
                formData.intro?.length < 5
              }
              gradientDuoTone="purpleToBlue"
              className="w-[150px]"
            >
              {mode == "edit" ? "Update the post" : "Create a post"}
            </Button>
            <Button
              type="button"
              outline
              className="w-[150px] "
              gradientDuoTone="purpleToBlue"
              onClick={() => {
                navigate(-1);
              }}
            >
              Back
            </Button>
          </div>
          {publishError && (
            <Alert className="mt-5" color="failure">
              {publishError}
            </Alert>
          )}
        </form>
      )}
    </div>
  );
}
