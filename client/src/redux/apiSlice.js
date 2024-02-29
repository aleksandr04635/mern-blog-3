// Import the RTK Query methods from the React-specific entry point
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define our single API slice object
export const apiSlice = createApi({
  reducerPath: "api",
  tagTypes: ["Tags", "CommentsToComment", "CommentsToPost"],
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getTags: builder.query({
      query: () => "/tag/get-all-tags",
      providesTags: ["Tags"],
    }),
    addNewPost: builder.mutation({
      query: (initialPost) => ({
        url: "/post/create",
        method: "POST",
        body: initialPost,
      }),
      invalidatesTags: ["Tags"],
    }),
    editPost: builder.mutation({
      query: ({ postId, userId, formData }) => {
        console.log("called editPost:", `post/updatepost/${postId}/${userId}`);
        return {
          url: `post/updatepost/${postId}/${userId}`,
          method: "PUT",
          // In a real app, we'd probably need to base this on user ID somehow
          // so that a user can't do the same reaction more than once
          body: formData,
        };
      },
      /*  invalidatesTags: (result, error, arg) => [
          { type: 'Post', id: arg.postId },
        ], */
      invalidatesTags: ["Tags"],
    }),
    deletePost: builder.mutation({
      query: ({ postId, userId }) => {
        console.log(
          "called  deletePost:",
          `post/updatepost/${postId}/${userId}`
        );
        return {
          url: `post/deletepost/${postId}/${userId}`,
          method: "DELETE",
        };
      },
      /*  invalidatesTags: (result, error, arg) => [
          { type: 'Post', id: arg.postId },
        ], */
      invalidatesTags: () => ["Tags"],
    }),
  }),
});

/* mode == "edit"
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
res = await editPost({
postId: formData._id,
userId: currentUser._id,
formData,
}).unwrap(); */

// Export the auto-generated hook for the `getPosts` query endpoint
export const {
  useGetTagsQuery,
  useAddNewPostMutation,
  useEditPostMutation,
  useDeletePostMutation,
} = apiSlice;

/*         const restag = await fetch(`/api/tag/get-all-tags`);
        const datat = await restag.json();
        console.log("datat from fetch: ", datat);
        if (!restag.ok) {
          console.log(datat.message);
          setPublishError(datat.message);
          return;
        }
        if (restag.ok) {
          if (datat.tags.length > 0) {
            setAllTagsInDB(datat.tags);
          }
          setLoading(false);
        } */
