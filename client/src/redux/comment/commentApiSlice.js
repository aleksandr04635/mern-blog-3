// Import the RTK Query methods from the React-specific entry point
//import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiSlice } from "../apiSlice";

// Define our single API slice object
export const commentsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getComments: builder.query({
      query: ({ level, idOfParentPostOrComment }) => {
        const qs = `/comment/get${
          level == 1 ? `Post` : `Comment`
        }Comments/${idOfParentPostOrComment}`;
        console.log(
          "in commentsApiSlice called getComments to level, id:",
          level,
          idOfParentPostOrComment
        );
        return {
          url: qs,
        };
      },
      //transformResponse: (response, meta, arg) => response?.data?.comments,
      /*       transformResponse: (response, meta, arg) => {
        console.log("response.data in getComments:", response.data);
        return response?.data?.comments;
      }, */
      providesTags: (result, error, arg) => {
        // console.log("arg in getComments:", arg);
        let providedTags = [];
        if (arg.level == 1) {
          providedTags = [
            { type: "CommentsToPost", id: arg.idOfParentPostOrComment },
          ];
        } else {
          providedTags = [
            { type: "CommentsToComment", id: arg.idOfParentPostOrComment },
          ];
        }
        console.log("providedTags by getComments:", providedTags);
        return providedTags;
      },
    }),

    createComment: builder.mutation({
      query: ({ level, idOfPostOrCommentWhichIsCommented, content }) => {
        console.log(
          "in commentsApiSlice called createComment to level, idOfCommentedOne:",
          level,
          idOfPostOrCommentWhichIsCommented,
          content
        );
        return {
          url: `/comment/create`,
          method: "POST",
          body: {
            level,
            idOfPostOrCommentWhichIsCommented,
            content,
          },
        };
      },
      invalidatesTags: (result, error, arg) => {
        console.log("result in createComment:", result);
        //console.log("arg in createComment:", arg);
        let invalidatedTags = [];
        if (result) {
          if (arg.level == 1) {
            invalidatedTags = [
              {
                type: "CommentsToPost",
                id: arg.idOfPostOrCommentWhichIsCommented,
              },
            ];
          } else {
            invalidatedTags = [
              {
                type: "CommentsToComment",
                id: arg.idOfPostOrCommentWhichIsCommented,
              },
            ];
          }
        }
        console.log("invalidatedTags by createComment:", invalidatedTags);
        return invalidatedTags;
      },
    }),

    updateComment: builder.mutation({
      query: ({
        level,
        idOfEditedComment,
        content,
        idOfParentPostOrCommentOfEditedComment,
      }) => {
        console.log(
          "in commentsApiSlice called updateComment to level, idOfUpdated:",
          level,
          idOfEditedComment,
          content,
          idOfParentPostOrCommentOfEditedComment
        );
        return {
          url: `/comment/editComment/${idOfEditedComment}`,
          method: "PUT",
          body: {
            content,
          },
        };
      },
      invalidatesTags: (result, error, arg) => {
        console.log("result in updateComment:", result);
        //console.log("arg in updateComment:", arg);
        let invalidatedTags = [];
        if (result) {
          if (arg.level == 1) {
            invalidatedTags = [
              {
                type: "CommentsToPost",
                id: arg.idOfParentPostOrCommentOfEditedComment,
              },
            ];
          } else {
            invalidatedTags = [
              {
                type: "CommentsToComment",
                id: arg.idOfParentPostOrCommentOfEditedComment,
              },
            ];
          }
        }
        console.log("invalidatedTags by updateComment:", invalidatedTags);
        return invalidatedTags;
      },
    }),
  }),
});

export const {
  useGetCommentsQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
} = apiSlice;

/* editPost: builder.mutation({
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
    invalidatesTags: (result, error, arg) => [
      { type: 'Post', id: arg.postId },
    ], 
  invalidatesTags: ["Tags"], */

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

/*        addNewPost: builder.mutation({
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
         
          invalidatesTags: () => ["Tags"],
        }),
 */

/*  invalidatesTags: (result, error, arg) => [
              { type: 'Post', id: arg.postId },
            ], */
