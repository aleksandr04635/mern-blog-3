## MERN Blog with comments structure, tags, search, dark mode and image uploading from a rich text editor

<div align="justify">
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
</div>

It's deployed to Vercel [here](https://oleksandrs-mern-blog.vercel.app/)

<!--
All the rest is here only for examples

The previous version is deployed [here](https://mern-blog-2-khaki.vercel.app/)

<br />

<div align="center" style="margin: 30px;">
<a href="https://refine.dev/">
  <img alt="refine logo" src="https://refine.ams3.cdn.digitaloceanspaces.com/readme/refine-readme-banner.png">
</a>
</div>
<div align="center">
    <a href="https://refine.dev">Home Page</a> |
    <a href="https://discord.gg/refine">Discord</a> |
    <a href="https://refine.dev/examples/">Examples</a> |
    <a href="https://refine.dev/blog/">Blog</a> |
    <a href="https://refine.dev/docs/">Documentation</a>
</div>
<br />

<div align="center"><strong>Build your <a href="https://reactjs.org/">React</a>-based CRUD applications, without constraints.</strong><br>An open source, headless web application framework developed with flexibility in mind.
</div>
<br />

[![Discord](https://img.shields.io/discord/837692625737613362.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/refine)
[![Twitter Follow](https://img.shields.io/twitter/follow/refine_dev?style=social)](https://twitter.com/refine_dev)

<a href="https://www.producthunt.com/posts/refine-3?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-refine&#0045;3" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=362220&theme=light&period=daily" alt="refine - 100&#0037;&#0032;open&#0032;source&#0032;React&#0032;framework&#0032;to&#0032;build&#0032;web&#0032;apps&#0032;3x&#0032;faster | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

# Build and Deploy a Full Stack MERN Dashboard App With CRUD, Auth, and Charts Using Refine - Client App

![app_cover](https://user-images.githubusercontent.com/18739364/218060209-b0119d40-5c9c-48d0-b96b-ec802816ab50.png)

[Refer to the server app source code](https://github.com/refinedev/refine/tree/master/examples/mern-dashboard-server)

With modern material design, a fully functional dashboard, a property management page, and a users page - both connected to our database and a profile page that connects the two, this video is the updated full-stack MERN course you’ve all been waiting for.

Alongside building this application, you'll learn how to use the most in-demand technologies today:

1. Node.js, Express.js, MongoDB, and React.js that together form the powerful MERN stack
2. Material UI: The most popular UI Component Kit nowadays
3. TypeScript: Yep, you heard that right; we’ll be using TypeScript on this project! No previous typescript knowledge is required
4. You’ll learn how to transform a Figma design into a fully functioning website
5. You’ll also learn how to optimize images and store them on the cloud using Cloudinary
6. Provide a quick and easy way for your users to log in and register using Google \*\*\*\*Auth
7. And most importantly, you’ll learn how to build React-based CRUD applications incredibly quickly using refine.

Developed by [@adrianhajdin](https://github.com/adrianhajdin) ([JavaScript Mastery](https://www.youtube.com/@javascriptmastery)).
Launch your development career with project-based coaching - [JS Mastery Pro](https://www.jsmastery.pro)

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Try this example on your local

```bash
npm create refine-app@latest -- --example mern-dashboard-client
```

-->
