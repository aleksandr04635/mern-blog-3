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
        /*         console.log(
          "in commentsApiSlice called getComments to level, id:",
          level,
          idOfParentPostOrComment
        ); */
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
        //console.log("result in getComments:", result);
        // console.log("arg in getComments:", arg);
        let providedTags = [];
        if (result) {
          if (arg.level == 1) {
            providedTags = [
              { type: "CommentsToPost", id: arg.idOfParentPostOrComment },
            ];
          } else {
            providedTags = [
              { type: "CommentsToComment", id: arg.idOfParentPostOrComment },
            ];
          }
        }
        //console.log("providedTags by getComments:", providedTags);
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
      //Pessimistic Update
      async onQueryStarted(
        { level, idOfPostOrCommentWhichIsCommented, content },
        { dispatch, queryFulfilled }
      ) {
        try {
          const { data: createdComment } = await queryFulfilled;
          const patchResult = dispatch(
            apiSlice.util.updateQueryData(
              "getComments",
              {
                level,
                idOfParentPostOrComment: idOfPostOrCommentWhichIsCommented,
              },
              (draft) => {
                //console.log("draft in updateComment:", draft);
                /* const arr = draft.comments;
                arr = arr.push(createdComment); */
                draft.comments.splice(draft.comments.length, 0, createdComment); //added to the end
              }
            )
          );
        } catch {
          //patchResult.undo();
        }
      },
      /*       invalidatesTags: (result, error, arg) => {
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
        return []; //invalidatedTags;
      }, */
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
      //Optimistic Update
      async onQueryStarted(
        {
          level,
          idOfEditedComment,
          content,
          idOfParentPostOrCommentOfEditedComment,
        },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          //() => {
          /*    console.log(
            " apiSlice.util.updateQueryData in updateComment:",
            apiSlice.util.updateQueryData
          ); */
          apiSlice.util.updateQueryData(
            "getComments",
            {
              level,
              idOfParentPostOrComment: idOfParentPostOrCommentOfEditedComment,
            },
            (draft) => {
              //console.log("draft in updateComment:", draft);
              const comment = draft.comments.find(
                (comment) => comment._id === idOfEditedComment
              );
              if (comment) {
                comment.content = content;
              }
            }
          )
          //}
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      /*       invalidatesTags: (result, error, arg) => {
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
      }, */
    }),

    deleteComment: builder.mutation({
      query: ({
        level,
        idOfDeletedComment,
        idOfParentPostOrCommentToDeletedComment,
        idOfGrandparentPostOrCommentToDeletedComment,
        listOfAncestorsOfComment,
      }) => {
        console.log(
          "in commentsApiSlice called deleteComment to level, idOfDeletedComment, idOfParentPostOrCommentToDeletedComment, idOfGrandparentPostOrCommentToDeletedComment:",
          level,
          idOfDeletedComment,
          idOfParentPostOrCommentToDeletedComment,
          idOfGrandparentPostOrCommentToDeletedComment,
          listOfAncestorsOfComment
        );
        return {
          url: `/comment/deleteComment/${idOfDeletedComment}`,
          method: "DELETE",
        };
      },
      //Pessimistic Update
      async onQueryStarted(
        {
          level,
          idOfDeletedComment,
          idOfParentPostOrCommentToDeletedComment,
          idOfGrandparentPostOrCommentToDeletedComment,
          listOfAncestorsOfComment,
        },
        { dispatch, queryFulfilled }
      ) {
        try {
          const { data } = await queryFulfilled;
          console.log(" data in deleteComment:", data);
          //const { data: createdComment } = await queryFulfilled;
          if (data == "Comment has been deleted") {
            console.log(" Comment has been deleted in deleteComment");
            const patchResult = dispatch(
              apiSlice.util.updateQueryData(
                "getComments",
                {
                  level,
                  idOfParentPostOrComment:
                    idOfParentPostOrCommentToDeletedComment,
                },
                (draft) => {
                  let ind = 0;
                  draft.comments.forEach((com, i) => {
                    if (com._id == idOfDeletedComment) {
                      ind = i;
                    }
                  });
                  const comment = draft.comments.find(
                    (comment) => comment._id === idOfDeletedComment
                  );
                  console.log(" ind in deleteComment", ind);
                  /*  if (comment) {
                    comment.content =
                      "<p style='color:orange;  font-size: 0.875em; '>DELETED</p>";
                  } */
                  draft.comments.splice(
                    ind, //- 1,
                    1
                  );
                }
              )
            );
          } else if (data == "Comment was set to be deleted") {
            console.log(
              " updating the section of the parent of deleted comment in deleteComment"
            );
            const patchResult = dispatch(
              apiSlice.util.updateQueryData(
                "getComments",
                {
                  level,
                  idOfParentPostOrComment:
                    idOfParentPostOrCommentToDeletedComment,
                },
                (draft) => {
                  const comment = draft.comments.find(
                    (comment) => comment._id === idOfDeletedComment
                  );
                  if (comment) {
                    comment.content =
                      "<p style='color:orange;  font-size: 0.875em; '>This comment is deleted by its author and will be deleted completely when all the comments to it will be deleted</p>";
                  }
                }
              )
              /*         apiSlice.endpoints.getComments.initiate(
                {
                  level: level,
                  idOfParentPostOrComment:
                    idOfParentPostOrCommentToDeletedComment,
                },
                { subscribe: false, forceRefetch: true }
              ) */
            );
          } else {
            //data=number Of Deleted Ancestors
            //if (data == "Comment and his parent one were deleted") {
            console.log(
              "updating the section of the ancestor of deleted comment in deleteComment, number of deleted generations of ancestors",
              data
            );
            const arr = listOfAncestorsOfComment.split(" ");
            console.log("arr in deleteComment: ", arr);
            const idOfFirstNotDeletedAncestorPostOrComment =
              arr[arr.length - data - 1];
            const idOfTopmostDeletedComment = arr[arr.length - data];
            console.log(
              "idOfFirstNotDeletedAncestorPostOrComment in deleteComment: ",
              idOfFirstNotDeletedAncestorPostOrComment
            );
            const patchResult = dispatch(
              apiSlice.util.updateQueryData(
                "getComments",
                {
                  level: level - data,
                  idOfParentPostOrComment:
                    idOfFirstNotDeletedAncestorPostOrComment,
                },
                (draft) => {
                  let ind = 0;
                  draft.comments.forEach((com, i) => {
                    if (com._id == idOfTopmostDeletedComment) {
                      ind = i;
                    }
                  });
                  console.log("ind in deleteComment: ", ind);
                  draft.comments.splice(ind, 1);
                }
              )
              /*   apiSlice.endpoints.getComments.initiate(
                {
                  level: level - data, // level-1
                  idOfParentPostOrComment: firstNotDeletedCom,
                },
                { subscribe: false, forceRefetch: true }
              ) */
            );
          }
        } catch {
          //patchResult.undo();
        }
      },
      /*        invalidatesTags: (result, error, arg) => {
        console.log("result in deleteComment:", result);
        //console.log("arg in deleteComment:", arg);
        let invalidatedTags = [];
        if (
          result == "Comment has been deleted" ||
          result == "Comment was set to be deleted"
        ) {
          if (arg.level == 1) {
            invalidatedTags = [
              {
                type: "CommentsToPost",
                id: arg.idOfParentPostOrCommentToDeletedComment,
              },
            ];
          } else {
            invalidatedTags = [
              {
                type: "CommentsToComment",
                id: arg.idOfParentPostOrCommentToDeletedComment,
              },
            ];
          }
        }
        if (result == "Comment and his parent one were deleted") {
          if (arg.level == 2) {
            invalidatedTags = [
              {
                type: "CommentsToPost",
                id: arg.idOfGrandparentPostOrCommentToDeletedComment,
              },
            ];
          } else {
            invalidatedTags = [
              {
                type: "CommentsToComment",
                id: arg.idOfGrandparentPostOrCommentToDeletedComment,
              },
            ];
          }
        }
        console.log("invalidatedTags by deleteComment:", invalidatedTags);
        return invalidatedTags;
      }, */
    }),

    likeComment: builder.mutation({
      query: ({
        level,
        idOfLikedComment,
        idOfParentPostOrCommentToLikedComment,
        type,
        action,
        userId,
      }) => {
        console.log(
          "in commentsApiSlice called likeComment to level, idOfLikedComment, idOfParentPostOrCommentToLikedComment,type,action, userId:",
          level,
          idOfLikedComment,
          idOfParentPostOrCommentToLikedComment,
          type,
          action,
          userId
        );
        return {
          url: `/comment/likeComment/${idOfLikedComment}`,
          method: "PUT",
          //JSON.stringify
          body: {
            type: type,
            action: action,
          },
        };
      },
      //Optimistic Update
      async onQueryStarted(
        {
          level,
          idOfLikedComment,
          idOfParentPostOrCommentToLikedComment,
          type,
          action,
          userId,
        },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData(
            "getComments",
            {
              level,
              idOfParentPostOrComment: idOfParentPostOrCommentToLikedComment,
            },
            (draft) => {
              const comment = draft.comments.find(
                (comment) => comment._id === idOfLikedComment
              );
              if (comment) {
                if (type == "l" && action == "+") {
                  comment.numberOfLikes += 1;
                  comment.likes.push(userId);
                  const userIndexInDislikes = comment.dislikes.indexOf(userId);
                  if (userIndexInDislikes !== -1) {
                    comment.numberOfDislikes -= 1;
                    comment.dislikes.splice(userIndexInDislikes, 1);
                  }
                }
                if (type == "l" && action == "-") {
                  const userIndex = comment.likes.indexOf(userId);
                  comment.numberOfLikes -= 1;
                  comment.likes.splice(userIndex, 1);
                }
                if (type == "d" && action == "+") {
                  comment.numberOfDislikes += 1;
                  comment.dislikes.push(userId);
                  const userIndexInLikes = comment.likes.indexOf(userId);
                  if (userIndexInLikes !== -1) {
                    comment.numberOfLikes -= 1;
                    comment.likes.splice(userIndexInLikes, 1);
                  }
                }
                if (type == "d" && action == "-") {
                  const userIndexInDislikes = comment.dislikes.indexOf(userId);
                  comment.numberOfDislikes -= 1;
                  comment.dislikes.splice(userIndexInDislikes, 1);
                }
                /*  comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                  dislikes: data.dislikes,
                  numberOfDislikes: data.dislikes.length,
                }
              : comment
          ) */
              }
            }
          )
          //}
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetCommentsQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useLikeCommentMutation,
} = apiSlice;

//https://redux-toolkit.js.org/rtk-query/usage/manual-cache-updates

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
