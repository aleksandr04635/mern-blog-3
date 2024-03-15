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
import { FaPlus } from "react-icons/fa";
import { TiMinus } from "react-icons/ti";

import {
  useAddNewPostMutation,
  useEditPostMutation,
  useGetTagsQuery,
} from "../redux/apiSlice.js";

import TinyMCEEditor from "../components/TinyMCEEditor";
import Loading from "./Loading";
import {
  customTextInputTheme,
  customTextareaTheme,
} from "../../customFlowbiteThemes";

export default function PostEditor({ mode, postId }) {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [tagString, setTagString] = useState(""); //scalar
  const [tags, setTags] = useState([]); //array of objects
  //const [allTagsInDB, setAllTagsInDB] = useState([]);
  const [loading, setLoading] = useState(true);
  //console.log("tags in PostEditor : ", tags);
  //console.log("formData.importance in PostEditor : ", formData.importance);

  //console.log("PostEditor(mode, postId) : ", mode, postId);
  //console.log("formData in PostEditor : ", formData);
  /*   const [
    addNewPost,
    {
      data: returnData,
      isLoading,
      isError: returnIsError,
      error: returnError,
      isSuccess: isSuccessPost,
    },
  ] = useAddNewPostMutation(); */
  const [addNewPost, createMutationResult] = useAddNewPostMutation();
  //console.log("isSuccessPost  in PostEditor : ", isSuccessPost);
  const [editPost, editMutationResult] = useEditPostMutation();

  const {
    data: allTagsInDB = [],
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetTagsQuery(); //{ pollingInterval: 10 }

  useEffect(() => {
    const fetchPost = async () => {
      try {
        /*         if (isFetching) {
          //setLoading(true);
          console.log("isFetching in PostEditor : ", isFetching);
        } else if (isSuccess) {
          setLoading(false);
          console.log("tagsQ in PostEditor : ", tagsQ);
          if (tagsQ.length > 0) {
            setAllTagsInDB(tagsQ);
          }
        } else if (isError) {
          setLoading(false);
          console.log("error in PostEditor : ", error);
          setPublishError(error);
        } */
        /*         const restag = await fetch(`/api/tag/get-all-tags`);
        const datat = await restag.json();
        console.log("datat from fetch: ", datat);
        if (!restag.ok) {
          console.log(datat.message);
          setPublishError(datat.message);
          return;
        }
        if (restag.ok) {
          if (datat.length > 0) {
            setAllTagsInDB(datat);
          }
          setLoading(false);
        } */
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
            console.log("data.posts[0] in PostEditor.jsx: ", data.posts[0]);
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
  }, [mode, postId]);

  function slugFromString(str) {
    return str
      .replace(/[^a-z\-A-Z0-9-]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .split(" ")
      .join("-")
      .toLowerCase();
    //encodeURIComponent(Url);
  }

  function prohibitedToCreateTagFromString() {
    return (
      [...tags, ...allTagsInDB]
        .map((t) => t.slug)
        .indexOf(slugFromString(tagString)) !== -1 ||
      slugFromString(tagString).length < 3
    );
  }

  /*   console.log("[...tags, ...allTagsInDB]", [...tags, ...allTagsInDB]);
  console.log(
    "tags.map(t=>t.slug):",
    tags.map((t) => t.slug)
  ); */
  function allowedToAddFromDB(tag) {
    return tags.map((t) => t.slug).indexOf(tag.slug) == -1;
  }

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
        },
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const addTag = () => {
    if (tags.length < 10) {
      let updatedTags = [...tags];
      updatedTags.push({
        name: tagString.trim(),
        slug: slugFromString(tagString),
      });
      setTags(updatedTags);
      setTagString("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.importance) {
      formData.importance = 1;
    }
    formData.tags = tags;
    console.log("formData from handleSubmit: ", formData);
    try {
      let res;
      if (mode !== "edit") {
        res = await addNewPost(formData).unwrap();
        /*    if (isSuccessPost) {
          navigate(`/`);
        } */
      } else {
        /*      const res = await fetch(
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
        ); */
        res = await editPost({
          postId: formData._id,
          userId: currentUser._id,
          formData,
        }).unwrap();

        //navigate(`/post/${res.slug}`);

        /*         const data = await res.json();
        console.log("received data in handleSubmit: ", data);
        if (!res.ok) {
          setPublishError(data.message);
          return;
        }
        if (res.ok) {
          setPublishError(null);
          navigate(`/post/${data.slug}`);
        } */
      }
      console.log("response came in function in PostEditor. res: ", res);
      navigate(`/post/${res?.slug}`);
    } catch (err) {
      const errMsg =
        "data" in err
          ? "message" in err.data
            ? err.data.message
            : JSON.stringify(err.data)
          : "message" in err
            ? err.message
            : "error" in err
              ? err.error
              : JSON.stringify(err);
      setPublishError(errMsg);
      //setPublishError("Something went wrong");
    }
  };
  /* 
  useEffect(() => {
    console.log("createMutationResult  in PostEditor : ", createMutationResult);
    if (
      createMutationResult.status == "fulfilled" &&
      createMutationResult.isSuccess == true
    ) {
      navigate(`/post/${createMutationResult.data.slug}`);
    }
    if (editMutationResult.isError == true) {
      setPublishError(editMutationResult.error.message);
    }
  }, [createMutationResult]);

  useEffect(() => {
    console.log("editMutationResult  in PostEditor : ", editMutationResult);
    if (
      editMutationResult.status == "fulfilled" &&
      editMutationResult.isSuccess == true
    ) {
      navigate(`/post/${editMutationResult.data.slug}`);
    }
    if (editMutationResult.isError == true) {
      setPublishError(editMutationResult.error.message);
    }
  }, [editMutationResult]);
 */

  return (
    <div className="post-editor mx-auto min-h-screen  max-w-3xl p-1 pr-2">
      <h1 className="my-2 text-center text-2xl font-semibold">
        {mode == "edit" ? "Update a post" : "Create a post"}
      </h1>
      {loading ? (
        <Loading className="my-10 " />
      ) : (
        /*  <div className="flex h-[80vh] w-full items-center justify-center">
          <Spinner size="xl" />
        </div> */
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          {/* importance */}
          <div className="flex flex-col ">
            <div className="flex flex-row items-center gap-1">
              <div className="px-1 text-lg">Importance:</div>
              <div className="text-lg">{formData?.importance || 1}</div>
              <div className="flex flex-col   text-sm">
                <button
                  className=" relative h-[16px] w-[19px] items-center overflow-hidden rounded-t-lg  border border-main-border text-center text-lg outline-1 outline-main-border hover:bg-active-bg hover:outline dark:hover:bg-dark-active-bg"
                  type="button"
                  onClick={() => {
                    return setFormData({
                      ...formData,
                      importance: formData?.importance
                        ? formData.importance + 1
                        : 2,
                    });
                  }}
                >
                  {/*   importance: (formData.importance || 1) + 1, */}
                  <p className="absolute right-[3px] top-[-1px] align-middle leading-3">
                    +
                  </p>
                </button>
                <button
                  className="relative h-[16px] w-[19px] items-center overflow-hidden rounded-b-lg border  border-main-border text-center text-2xl outline-1 outline-main-border hover:bg-active-bg hover:outline dark:hover:bg-dark-active-bg"
                  type="button"
                  onClick={() => {
                    if (!!formData.importance & (formData.importance > 1)) {
                      console.log(
                        "formData.importance before - : ",
                        formData.importance,
                      );
                      return setFormData({
                        ...formData,
                        importance: formData.importance - 1,
                      });
                    }
                  }}
                >
                  <p className="absolute right-[4px] top-[-12px] h-[3px] align-middle">
                    -
                  </p>
                </button>
              </div>
            </div>
            <div className="px-1 text-base">
              Your posts are sorted by importance on your page. Don't set it
              above 1 without real purpose
            </div>
          </div>

          {/* image */}
          <div>
            <h3 className="p-1 text-lg">Front image (optional):</h3>
            <div className="flex items-center justify-between gap-4 rounded-lg border border-main-border p-3">
              <FileInput
                type="file"
                accept="image/*"
                /*  color="info" */
                onChange={(e) => setFile(e.target.files[0])}
                /* className="border-cyan-500 bg-cyan-50 text-cyan-900 placeholder-cyan-700 focus:border-cyan-500 focus:ring-cyan-500 dark:border-cyan-400 dark:bg-cyan-100 dark:focus:border-cyan-500 dark:focus:ring-cyan-500" */
                /*   className="bg-active-bg mr-4 flex w-[350px] cursor-pointer items-center justify-start space-x-2 
                  rounded-lg px-2 py-1 dark:bg-dark-active-bg dark:text-white" */
              />
              {/*      <input
                type="file"
                accept="image/*"
                color="gray"
                onChange={(e) => setFile(e.target.files[0])}
              /> */}
              <Button
                type="button"
                gradientDuoTone="purpleToBlue"
                size="sm"
                outline
                onClick={handleUpdloadImage}
                disabled={!file || imageUploadProgress}
              >
                {imageUploadProgress ? (
                  <div className="h-16 w-16">
                    <CircularProgressbar
                      value={imageUploadProgress}
                      text={`${imageUploadProgress || 0}%`}
                    />
                  </div>
                ) : (
                  "Upload\u00A0Image"
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
                className="w-full  object-cover"
              />
            )}
          </div>
          {/* tags */}
          <div className="flex flex-col">
            <h3 className=" text-lg">Tags list (optional):</h3>
            <p>Addition of already existing tags is preferable </p>
            <p>Start printing to narrow down the list of existing tags </p>
            <div className="flex flex-col items-start sm:flex-row ">
              {/*   <input
        type="text"
        placeholder="Search..."
                value={searchTerm}
        onChange={(e) => change(e.target.value)}
        className="border-main-border focus:border-main-border focus:ring-main-border
       w-[300px] rounded-lg border py-1.5 dark:bg-dark-active-bg"
      /> */}
              <input
                value={tagString}
                onChange={(e) => setTagString(e.target.value)}
                className=" mr-2 h-10 w-full  rounded-lg border
                 border-main-border py-1 outline-none focus:border-main-border focus:ring-main-border dark:bg-dark-active-bg sm:w-[350px]"
                placeholder="Enter a post tag"
                type="text"
              />
              <Button
                onClick={addTag}
                outline
                gradientDuoTone="purpleToBlue"
                className=""
                disabled={prohibitedToCreateTagFromString()}
              >
                Create&nbsp;a&nbsp;new&nbsp;tag
              </Button>
            </div>
            <div className="mt-1 flex  flex-col">
              <p>Tags to the post:</p>
              {tags?.map((t, i) => (
                <div
                  onClick={() => setTags(tags.filter((e, n) => n != i))}
                  key={i}
                  className="mr-4 flex w-full cursor-pointer items-center justify-start space-x-2 rounded-lg bg-active-bg 
                  px-2 py-1 dark:bg-dark-active-bg dark:text-white sm:w-[350px]"
                >
                  <p className="rounded-full bg-main-border p-1  text-sm text-white">
                    <TiMinus />
                  </p>
                  <p>{t.name}</p>
                </div>
              ))}
            </div>
            <div className="mt-1 flex  flex-col">
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
                    } mr-4 flex w-full items-start justify-start 
                    space-x-2 rounded-lg bg-active-bg px-2 py-1 dark:bg-dark-active-bg dark:text-white sm:w-[350px]`}
                  >
                    <div className=" flex w-full items-start space-x-2 ">
                      <p
                        /*  onClick={() => deleteTag(i)} */
                        className="cursor-pointer rounded-full bg-main-border p-1 text-sm text-white"
                      >
                        <FaPlus />
                      </p>
                      <p /* className="w-[235px]" */>{t.name}</p>
                    </div>
                    <p className="w-[110px] text-center">
                      {t.number_of_posts}
                      {"\u00A0"}
                      {t.number_of_posts > 1 ? "posts" : "post"}
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
              color={formData.title?.length > 5 ? "info" : "failure"}
              helperText={
                formData.title?.length > 5 ? "" : "minimum 6 characters"
              }
              theme={customTextInputTheme}
            />
            <p className="p-1 text-xs text-additional-text dark:text-dark-additional-text">
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
              color={formData.intro?.length > 5 ? "info" : "failure"}
              onChange={(e) =>
                setFormData({ ...formData, intro: e.target.value })
              }
              className="h-[160px] text-justify text-sm sm:h-[80px] "
              value={formData.intro || ""}
              helperText={
                formData.intro?.length > 5 ? "" : "minimum 6 characters"
              }
              theme={customTextareaTheme}
            />
            <p className="text-xs text-additional-text dark:text-dark-additional-text">
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
          <div className="flex items-center justify-around gap-2  ">
            <Button
              type="submit"
              disabled={
                formData.title?.length < 6 ||
                !formData.content ||
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
