import React, { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

export default function TinyMCEEditor({ value2, onChange }) {
  const editorRef = useRef(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  // const [cont, setCont] = useState("");
  //console.log("value2:", value2);
  // console.log("cont:", cont);

  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };
  return (
    <>
      {/*       <Editor
        //apiKey="uloldf7z9pe592lrmjoh9s32tjjx7ylnar853dybeypiebee"
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        onInit={(evt, editor) => (editorRef.current = editor)}
        onEditorChange={(e) => onChange(e)}
        //initialValue="<p>This is the initial content of the editor.</p>"
        //initialValue={value2}
        value={value2}
        init={{
          height: 500,
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "code",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      /> */}
      <Editor
        //apiKey="uloldf7z9pe592lrmjoh9s32tjjx7ylnar853dybeypiebee"
        //apiKey="your-api-key"
        //tinymceScriptSrc={process.env.PUBLIC_URL + '/tinymce/tinymce.min.js'}
        //tinymceScriptSrc="/tinymce/tinymce.min.js"
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        onInit={(evt, editor) => (editorRef.current = editor)}
        onEditorChange={(e) => onChange(e)}
        //initialValue="<p>This is the initial content of the editor.</p>"
        //initialValue={value2}
        value={value2}
        //onEditorChange={()=>setCont(editorRef.current.getContent())}

        //initialValue="<p>This is the initial content of the editor.</p>"

        init={{
          //REMOVES TINY WARNING!!!:
          /*           init_instance_callback: function (editor) {
            var freeTiny = document.querySelector(".tox .tox-notification--in");
            freeTiny.style.display = "none";
          }, */
          init_instance_callback: function (editor) {
            var freeTiny = document.querySelector(".tox-promotion");
            if (freeTiny) {
              freeTiny.style.display = "none";
            }
          },
          promotion: false, //a note about update
          height: 600,
          //content_css: '/myLayout.css',
          //browser_spellcheck: true,
          language: "en",
          image_title: true,
          image_caption: true,
          language_url: "/tinymce/langs/es.js",
          file_picker_types: "file image media",
          //automatic_uploads: true,
          //URL of our upload handler (for more details check: https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_url)
          images_upload_url: "/api/file-with-multer2", //uncomment AND REDO to MY API
          //menubar: false,
          menubar: true,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "media",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "code",
            "help",
            "wordcount",
            "autoresize",
          ],
          toolbar:
            "paste undo redo remove| blocks |  link image media | code | preview |" +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat  | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",

          file_picker_callback: function (cb, value, meta) {
            console.log("file_picker_callback:");
            console.log("meta.filetype:");
            console.log(meta.filetype);
            console.log(meta.filetype == "image");
            //upload only if it's image
            //if (meta.filetype == 'image')
            {
              var input = document.createElement("input");
              input.setAttribute("type", "file");
              input.setAttribute("accept", "image/*, video/*, media/*");

              input.onchange = async function () {
                var file = this.files[0];
                console.log("file:");
                console.log(file);
                let formData = new FormData();
                formData.append("file", file);
                //const response = await fetch('/upload-from-tinymce-to-fs', {  //this works with upload to fs
                const response = await fetch(
                  "/upload-from-tinymce-to-cloudinary",
                  {
                    //this works with upload to cloudinary
                    method: "POST",
                    headers: {
                      // "Content-Type": "multipart/form-data",
                    },
                    body: formData,
                    //body:file
                  }
                );
                const json = await response.json();
                console.log("res:");
                console.log(json);
                if (json.message) {
                  tinymce.activeEditor.notificationManager.open({
                    text: json.message,
                    type: "error",
                    timeout: 7000,
                  });
                  alert(json.message);
                  return;
                  //cb(json.message, {  });
                }
                //console.log("location");
                //console.log(json.location);
                var ulr = window.location.href + json.location;
                console.log(ulr);

                var reader = new FileReader();
                reader.onload = function () {
                  //cb(blobInfo.blobUri(), { title: "AA"+file.name });
                  //cb(ulr, { alt: file.name, title: json.location });  //this works with upload to fs ONLY
                  cb(json.location, { alt: file.name, title: json.location }); //this works with upload to cloudinary and fs
                };
                reader.readAsDataURL(file);
              };

              input.click();
            }
            //if (meta.filetype == 'media') {      callback('movie.mp4', { source2: 'alt.ogg', poster: 'image.jpg' });    }
          },

          /*       file_picker_callback: function (cb, value, meta) {
            console.log("file_picker_callback:");
            console.log("meta.filetype:");
            console.log(meta.filetype);
            console.log(meta.filetype == "image");
            //upload only if it's image
            //if (meta.filetype == 'image')
            {
              var input = document.createElement("input");
              input.setAttribute("type", "file");
              input.setAttribute("accept", "image/*, video/*, media/*");
              input.onchange = async function () {
                let file = this.files[0];
                console.log("file:", file);

                                 let formData = new FormData();
                formData.append("file", file);
                const response = await fetch("/api/file-with-multer2", {
                  //this works with upload to cloudinary
                  method: "POST",
                  headers: {
                    // "Content-Type": "multipart/form-data",
                  },
                  body: formData,
                  //body:file
                });
                const json = await response.json();
                console.log("res:");
                console.log(json); 

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
                    (snapshot) => {},
                    (error) => {
                      setImageUploadError("Image upload failed");
                                             tinymce.activeEditor.notificationManager.open({
                        text: error.message,
                        type: "error",
                        timeout: 5000,
                      }); 
                    },
                    () =>
                      //async function () {
                      {
                        getDownloadURL(uploadTask.snapshot.ref).then(
                          (downloadURL) => {
                            console.log("from getDownloadURL:", downloadURL);
                            setImageUploadError(null);
                            let reader = new FileReader();
                            reader.onload = function () {
                              //cb(blobInfo.blobUri(), { title: "AA"+file.name });
                              //cb(ulr, { alt: file.name, title: json.location });  //this works with upload to fs ONLY
                              cb(downloadURL, {
                                alt: file.name,
                                title: downloadURL,
                              }); //this works with upload to cloudinary and fs
                            };
                            reader.readAsDataURL(file);
                            //setFormData({ ...formData, image: downloadURL });
                          }
                        );
                        //let URL=await getDownloadURL(uploadTask.snapshot.ref)
                      }
                  );
                } catch (error) {
                  setImageUploadError("Image upload failed");

                  console.log(error);
                }

                //var ulr = window.location.href + json.location;
                // console.log(ulr);

                /                var reader = new FileReader();
                reader.onload = function () {
                  //cb(blobInfo.blobUri(), { title: "AA"+file.name });
                  //cb(ulr, { alt: file.name, title: json.location });  //this works with upload to fs ONLY
                  cb(json.location, { alt: file.name, title: json.location }); //this works with upload to cloudinary and fs
                };
                reader.readAsDataURL(file); 
              };
              input.click();
            }
            //if (meta.filetype == 'media') { callback('movie.mp4', { source2: 'alt.ogg', poster: 'image.jpg' });    }
          }, */
        }}
      />
      <button type="button" onClick={log}>
        Log editor content
      </button>
    </>
  );
}
