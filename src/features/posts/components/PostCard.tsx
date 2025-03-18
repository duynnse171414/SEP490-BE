import { Post } from "../types";

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-xl font-semibold">{post.title}</h2>
      <p className="mt-2 text-gray-600">{post.body}</p>
    </div>
  );
};