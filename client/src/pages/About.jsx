import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-screen flex ">
      <div className="max-w-2xl text-justify mx-auto p-3 ">
        <div>
          <h1 className="text-2xl font font-semibold text-center my-5">
            About My Blog
          </h1>
          <div className="text-md flex flex-col gap-4">
            <p>
              This blogspot was created by me, Oleksandr Liashchenko as a
              demonstration of my skill set.
            </p>
            <p>
              It uses React as a front framework and Express as a back one with
              Mongo as a database. Deployment to Vercel required the
              minimization of the number of .js files in the API directory and a
              new database connection for each serverless function.
            </p>
            <p>
              Redux Toolkit was used to store user data, the theme, and the
              number of posts per page. Note how the pagination is made: the
              number of posts on the topmost page varies depending on the total
              number of posts, corresponding to the query. It, and the whole
              pagination system was made for the purpose of full correspondence
              of shown data to the URL, so that the addition of new posts
              doesn't change what posts are shown by the old URL, so that they
              all can be stored in bookmarks, for example. Note how changing the
              number of posts per page changes the URL, just like the selection
              of author or tag, the posts of which are shown.
            </p>
            <p>
              User authentication is made with two options: email and password
              or via Google account. Note that after registration with Google
              OAuth, you will be able to create a password on the profile page
              or through an email password resetting mechanism, and use it just
              as a combination of email and password, or as originally, through
              a Google account. Also, appreciate how I made a password resetting
              functionality with an email made from a template sending.
            </p>
            <p>
              For the creation of posts and comments, I use TinyMCE rich text
              editor. You can use images in it either via the existing URL or by
              uploading the images immediately from the editor during the post
              or comment writing. Images from the editor are uploaded to
              Firebase storage, just like user avatar images and front pictures
              of posts, though you can find a commented variant of uploading to
              Cloudinary in the code.
            </p>
            <p>
              Note how I made a logical tree of comments more readable with just
              a style. Also, try to delete an already deleted comment. It will
              just change status and will be deleted automatically then all the
              comments to it will be deleted - try it.
            </p>
            <Link
              className="text-blue-500 hover:underline"
              to={`https://github.com/aleksandr04635/mern-blog-3`}
            >
              You can see the code here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
