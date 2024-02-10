import {
  Alert,
  Button,
  FileInput,
  Select,
  TextInput,
  Spinner,
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

export default function UpdatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [postData, setPostData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [tag, setTag] = useState(""); //scalar
  const [tags, setTags] = useState([]); //array of objects
  const [loading, setLoading] = useState(true);

  const { postId } = useParams();

  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    try {
      const fetchPost = async () => {
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
          setPostData(data.posts[0]);
          setTags(data.posts[0].tags);
          setLoading(false);
        }
      };

      fetchPost();
      console.log("formData upon fetch: ", formData);
    } catch (error) {
      console.log(error.message);
    }
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
        .replace(/[^a-z\-+A-Z0-9-]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .split(" ")
        .join("+")
        /* .toLowerCase() */
        .replace(/[^a-z\-+A-Z0-9-]/g, ""),
    });
    setTag("");
    setTags(updatedTags);
  };

  //console.log("formData: ", formData);
  const handleSubmit = async (e) => {
    e.preventDefault();
    formData.tags = tags;
    formData._id = postData._id; //it gets lost
    //console.log("formData from handleSubmit: ", formData);
    try {
      const res = await fetch(
        // `/api/post/updatepost/${formData._id}/${currentUser._id}`,//old
        `/api/post/updatepost/${formData._id}/${currentUser._id}`, //my
        {
          method: "PUT",
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
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update post</h1>
      {loading ? (
        <div className="h-[80vh] flex justify-center items-center w-full">
          <Spinner size="xl" />
        </div>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 sm:flex-row justify-between">
            <TextInput
              type="text"
              placeholder="Title"
              required
              id="title"
              className="flex-1"
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              value={formData.title}
            />
          </div>
          <div className="flex gap-4 items-center justify-between border border-teal-500 rounded p-3">
            <FileInput
              type="file"
              accept="image/*"
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
          {/* tags */}
          <div className="flex flex-col">
            <div className="flex items-center space-x-4 md:space-x-8">
              <input
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="px-4 py-2 outline-none rounded border-teal-500 "
                placeholder="Enter a post tag"
                type="text"
              />
              <div
                onClick={addTag}
                className="bg-teal-500 rounded text-white px-4 py-2 font-semibold cursor-pointer"
              >
                Add
              </div>
            </div>
            <div className="flex px-4 mt-3">
              {tags?.map((t, i) => (
                <div
                  key={i}
                  className="flex justify-center items-center space-x-2 mr-4 bg-gray-200 px-2 py-1 rounded-md"
                >
                  <p>{t.name}</p>
                  <p
                    onClick={() => deleteTag(i)}
                    className="text-white bg-teal-500 rounded-full cursor-pointer p-1 text-sm"
                  >
                    <ImCross />
                  </p>
                </div>
              ))}
            </div>
          </div>
          <ReactQuill
            theme="snow"
            value={formData.content}
            placeholder="Write something..."
            className="h-72 mb-12"
            required
            onChange={(value) => {
              setFormData({ ...formData, content: value });
            }}
          />
          <div className="flex gap-2 items-center justify-around  ">
            <Button
              type="submit"
              outline
              gradientDuoTone="purpleToBlue"
              className="w-[150px]"
            >
              Update post
            </Button>
            <Button
              type="button"
              outline
              className="w-[150px] "
              gradientDuoTone="pinkToOrange"
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
