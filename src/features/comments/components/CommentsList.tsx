import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Comment } from "@/features/comments/types";

interface CommentsListProps {
  comments?: Comment[];
}

const CommentsList: React.FC<CommentsListProps> = ({ comments }) => {
  return (
    <div className="space-y-4">
      {comments?.map((comment) => (
        <Card key={comment.id} className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-start gap-4">
            <Avatar>
              <AvatarFallback>{comment.email.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium text-lg">{comment.name}</div>
                  <div className="text-sm text-gray-500 mb-2">{comment.email}</div>
                </div>
                <div className="text-xs text-gray-400">Post ID: {comment.postId}</div>
              </div>
              <p className="text-gray-700">{comment.body}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default CommentsList;
