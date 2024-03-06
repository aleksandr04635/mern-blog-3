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
              Mongo database accessed through Mongoose ORM. Deployment to Vercel
              required the minimization of the number of .js files in the API
              directory and a new database connection for each serverless
              function. For UI elements Flowbite library with Tailwind styles is
              used.
            </p>
            <p>
              Redux Toolkit is used to store user data, the theme, and the
              number of posts per page, persisting them in the local storage.
              RTK query performs comments, posts and comments fetching, creating
              and updating by invalidating the cached query results by
              corresponding data mutations. For example, create a post with tags
              and then delete it from a posts list screen. The numbers of posts
              with tags in the tags list will change by posts mutations. Also,
              you can edit a post in completely another window and change its
              tag, and upon returning to the main window with the tags list it
              will change.
            </p>
            <p>
              The entire comments tree system worked in this way, by
              invalidation of queries in the cache by mutations initially, you
              can still find this code commented, but then I remade the comments
              tree to manual cache changing by optimistic update - changing the
              cache before the delivery of the query result in case of editing
              and liking, or pessimistic update - by changing the result of
              previous queries depending on the result of new ones of another
              endpoint in case of creation and deletion of comments. It
              minimised the time the user sees any loading to the minimum.
              Possible errors are accounted for too - you can uncomment
              commented throwing of test errors in comment.route.js in the API
              folder and see the result, for example by clicking like of comment
              - like count would initially change and then the error would
              appear with rollback of like count change, without loading
              indicators that you can see during the initial loading.
            </p>
            <p>
              Note how I made a logical tree of comments more readable with just
              a style. Also, try to delete an already commented comment. It will
              just change status and will be deleted automatically when all the
              comments to it will be deleted - try it. It works even for an
              entire branch of comments, marked for deletion while at least one
              comment to them all remains not deleted - they all will be deleted
              in DB and UI by deletion of that last comment.
            </p>
            <p>
              Note how the pagination is made: the number of posts on the
              topmost page varies depending on the total number of posts,
              corresponding to the query. It, and the whole pagination system
              was made with the intent of full correspondence of shown data to
              the URL, so that the addition of new posts doesn't change which
              posts are shown by the old URL, so that they all can be stored in
              bookmarks, for example. Note how changing the number of posts per
              page changes the URL, just like the selection of author or tag,
              the posts of which are shown.
            </p>
            <p>
              User authentication is made with two options: email and password
              or via Google account. Note that after registration with Google
              OAuth, you will be able to create a password on the profile page
              or through an email password resetting mechanism, and use it just
              as a combination of email and password, or as originally, through
              a Google account. Also, appreciate how I made a password reset
              functionality with sending an email made from a template.
            </p>
            <p>
              For the creation of posts and comments, I use TinyMCE rich text
              editor. You can use images in it either via the existing URL or by
              uploading the images immediately from the editor during the post
              or comment writing. Images from the editor are automatically
              uploaded to Firebase storage, just like user avatar images and
              front pictures of posts, though you can find a commented variant
              of uploading to Cloudinary in the code.
            </p>
            <p>
              Notice the tooltips that appear when attempting to vote for a post
              while seeing only the post list or attempting to vote while not
              being signed in - they change their position depending on whether
              the page scroll would make a tooltip invisible.
            </p>
            <Link
              className="link-stand"
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
