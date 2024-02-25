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
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa6";
import { TiMinus } from "react-icons/ti";

import TinyMCEEditor from "../components/TinyMCEEditor";

export default function PostEditor({ mode, postId }) {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  //const [postData, setPostData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [tagString, setTagString] = useState(""); //scalar
  const [tags, setTags] = useState([]); //array of objects
  console.log("tags in PostEditor : ", tags);
  //const [allTags, setAllTags] = useState([]);
  const [allTagsInDB, setAllTagsInDB] = useState([]);
  const [loading, setLoading] = useState(true);

  //console.log("PostEditor(mode, postId) : ", mode, postId);
  //console.log("formData in PostEditor : ", formData);

  function slugFromString(s) {
    return s
      .replace(/[^a-z\-A-Z0-9-]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .split(" ")
      .join("-")
      .toLowerCase();
  }

  function prohibitedToAddFromString() {
    return (
      [...tags, ...allTagsInDB]
        .map((t) => t.slug)
        .indexOf(slugFromString(tagString)) !== -1
    );
  }

  /*   console.log("[...tags, ...allTagsInDB]", [...tags, ...allTagsInDB]);
  console.log(
    "tags.map(t=>t.slug):",
    tags.map((t) => t.slug)
  ); */
  function allowedToAddFromDB(tg) {
    // tags.map(t=>t.slug).indexOf(tg.slug)
    return tags.map((t) => t.slug).indexOf(tg.slug) == -1;
  }

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const rest = await fetch(`/api/tag/get-all-tags`);
        const datat = await rest.json();
        console.log("datat from fetch: ", datat);
        if (!rest.ok) {
          console.log(datat.message);
          setPublishError(datat.message);
          return;
        }
        if (rest.ok) {
          if (datat.tags.length > 0) {
            setAllTagsInDB(datat.tags);
          }

          setLoading(false);
        }

        if (mode == "edit") {
          const res = await fetch(`/api/post/getposts?postId=${postId}`);
          const data = await res.json();
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
            if (data.posts[0].tags && data.posts[0].tags?.length > 0) {
              setTags(data.posts[0].tags);
            }
          }
        }
        setLoading(false);
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
      name: tagString.trim(),
      slug: slugFromString(tagString),
    });
    setTags(updatedTags);
    setTagString("");
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
        }`,
        {
          method: `${mode == "edit" ? "PUT" : "POST"}`,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      console.log("received data in handleSubmit: ", data);
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
    <div className="p-1 pr-2  max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-2xl my-2 font-semibold">
        {mode == "edit" ? "Update a post" : "Create a post"}
      </h1>
      {loading ? (
        <div className="h-[80vh] flex justify-center items-center w-full">
          <Spinner size="xl" />
        </div>
      ) : (
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          {/* importance */}
          <div className="flex flex-col ">
            <div className="flex flex-row items-center gap-1">
              <div className="text-lg px-1">Importance:</div>
              <div className="text-lg">{formData.importance || 1}</div>
              <div className="flex flex-col   text-sm">
                <button
                  className=" relative border items-center text-lg text-center rounded-t-lg w-[19px] h-[16px]"
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      importance: (formData.importance || 1) + 1,
                    })
                  }
                >
                  <p className="top-[-9px] right-[3px] absolute align-middle ">
                    +
                  </p>
                </button>
                <button
                  className=" relative border items-center text-2xl text-center rounded-b-lg w-[19px] h-[16px]"
                  type="button"
                  onClick={() => {
                    !!formData.importance & (formData.importance > 1) &&
                      setFormData({
                        ...formData,
                        importance: (formData.importance || 1) - 1,
                      });
                  }}
                >
                  <p className="top-[-12px] right-[4px] absolute align-middle ">
                    -
                  </p>
                </button>
              </div>
            </div>
            <div className="text-base px-1">
              Your posts are sorted by importance on your page. Don't set it
              above 1 without real purpose
            </div>
          </div>

          {/* image */}
          <div>
            <h3 className="p-1 text-lg">Front image (optional):</h3>
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
            <h3 className=" text-lg">Tags list (optional):</h3>
            <p>Addition of already existing tags is preferable </p>
            <div className="flex items-center ">
              <TextInput
                value={tagString}
                onChange={(e) => setTagString(e.target.value)}
                className=" py-1 outline-none rounded border-teal-500 "
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
                className=""
                disabled={prohibitedToAddFromString()}
              >
                Create&nbsp;a&nbsp;new&nbsp;tag
              </Button>
            </div>
            <div className="flex flex-col  mt-1">
              <p>Tags to the post:</p>
              {tags?.map((t, i) => (
                <div
                  onClick={() => deleteTag(i)}
                  key={i}
                  className="flex cursor-pointer justify-start w-[350px] dark:text-gray-200 items-center space-x-2 mr-4 dark:bg-gray-700 bg-gray-100 px-2 py-1 rounded-lg"
                >
                  <p className="text-white bg-gray-500 rounded-full  p-1 text-sm">
                    <TiMinus />
                  </p>
                  <p>{t.name}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col  mt-1">
              <p>Already existing tags: </p>
              {allTagsInDB
                ?.filter((t) => allowedToAddFromDB(t))
                .filter((t) => t.name.indexOf(tagString.trim()) == 0)
                .slice(0, 10)
                .map((t, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setTags([...tags, t]);
                    }}
                    className={`${
                      allowedToAddFromDB(t) ? "cursor-pointer" : ""
                    } flex justify-start w-[350px] dark:text-gray-200 
                    items-start space-x-2 mr-4 dark:bg-gray-700 bg-gray-100 px-2 py-1 rounded-lg`}
                  >
                    <p
                      onClick={() => deleteTag(i)}
                      className="text-white bg-gray-500 rounded-full cursor-pointer p-1 text-sm"
                    >
                      <FaPlus />
                    </p>
                    <p className="w-[235px]">{t.name}</p>{" "}
                    <p>
                      {t.number_of_posts}{" "}
                      {t.number_of_posts > 1 ? "posts" : "post"}{" "}
                    </p>
                  </div>
                ))}
            </div>
          </div>

          {/* title */}
          <div className="flex flex-col  justify-between">
            <Label
              htmlFor="title"
              color="gray"
              value="Title (minimum 6 characters):"
              className="p-1 text-lg"
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
                formData.title?.length > 5 ? "" : "minimum 6 characters"
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
              value="Introduction (minimum 6 characters):"
              className="p-1 text-lg"
            />
            <Textarea
              placeholder="Write an introduction"
              maxLength="300"
              id="intro"
              color={formData.intro?.length > 5 ? "success" : "failure"}
              onChange={(e) =>
                setFormData({ ...formData, intro: e.target.value })
              }
              className="h-[160px] sm:h-[80px] text-justify text-sm "
              value={formData.intro || ""}
              helperText={
                formData.intro?.length > 5 ? "" : "minimum 6 characters"
              }
            />
            <p className="text-gray-500 text-xs">
              {300 - (formData.intro?.length ?? 0)} characters remaining
            </p>
          </div>

          {/* Text */}
          <h3 className="p-1 text-lg">Main content (necessary):</h3>
          {/*           <ReactQuill
            theme="snow"
            value={formData.content || ""}
            placeholder="Write the main text"
            className="h-72 mb-12"
            required
            onChange={(value) => {
              setFormData({ ...formData, content: value });
            }}
          /> */}

          <TinyMCEEditor
            value2={formData.content || ""}
            onChange={(value3) => {
              setFormData({ ...formData, content: value3 });
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

//sort(function (a, b) {
// return a.number_of_posts - b.number_of_posts;
//})
