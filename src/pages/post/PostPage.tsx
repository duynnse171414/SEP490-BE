import { useParams } from "react-router-dom";
import { usePosts, PostCard } from "../../features/posts";

export const PostPage = () => {
  const { id } = useParams<{ id: any }>();
  const { data: post, error, isLoading } = usePosts(id || "1");

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  return post ? <PostCard post={post} /> : null;
};

export default PostPage;