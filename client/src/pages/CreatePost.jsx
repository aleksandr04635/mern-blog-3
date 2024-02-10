import {
  Alert,
  Button,
  FileInput,
  Select,
  TextInput,
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
import { useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";
import { ImCross } from "react-icons/im";

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);

  const [tag, setTag] = useState(""); //scalar
  const [tags, setTags] = useState([]); //array of objects

  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    //setFormData({ ...formData, tags: tags });
    formData.tags = tags;
    // console.log("formData: ", formData);
    try {
      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
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
    <div className="p-2 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-3 font-semibold">Create a post</h1>
      {/*       <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt="upload"
            className="w-full h-72 object-cover"
          />
        )}
        
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
          placeholder="Write something..."
          className="h-72 mb-12"
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <Button type="submit" outline gradientDuoTone="purpleToBlue">
          Publish
        </Button>
        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
      </form> */}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* image */}
        <div>
          <h3 className="p-1">Front image (optional):</h3>
          <div className="flex gap-4 items-center justify-between border border-teal-500 rounded-lg p-3">
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
        </div>
        {/* tags */}
        <div className="flex flex-col">
          <h3 className="p-1 text-base">Tags list (optional):</h3>
          <div className="flex items-center space-x-4 md:space-x-8">
            <TextInput
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="px-4 py-2 outline-none rounded border-teal-500 "
              placeholder="Enter a post tag"
              /* color="success" */
              type="text"
            />
            <div
              onClick={addTag}
              className="bg-teal-500 rounded-lg text-white px-4 py-2 font-semibold cursor-pointer"
            >
              Add
            </div>
          </div>
          <div className="flex flex-wrap px-4 mt-3">
            {tags?.map((t, i) => (
              <div
                key={i}
                className="flex justify-center items-center space-x-2 mr-4 bg-gray-200 px-2 py-1 rounded-lg"
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
            value={formData.title}
            color={formData.title?.length > 5 ? "success" : "failure"}
            helperText={
              formData.title?.length > 5 ? "" : "minimum 5 characters"
            }
          />
          <p className="text-gray-500 p-1 text-xs">
            {150 - formData.title?.length} characters remaining
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
            placeholder="Add a comment..."
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
            {300 - formData.intro?.length} characters remaining
          </p>
        </div>
        {/* Text */}
        <h3 className="p-1">Main content (necessary):</h3>
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
            Create a post
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
    </div>
  );
}
