import { useParams } from "react-router-dom";
import PostEditor from "../components/PostEditor.jsx";

export default function UpdatePost() {
  const { postId } = useParams();

  return <PostEditor mode={"edit"} postId={postId} />;
}
