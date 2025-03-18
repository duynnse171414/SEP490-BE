import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "@/features/users/types";

interface AlbumsFilterProps {
  userId: string;
  onUserChange: (value: string) => void;
  users?: User[];
}

const AlbumsFilter: React.FC<AlbumsFilterProps> = ({ userId, onUserChange, users }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6 justify-center">
      <div className="mt-4 md:mt-0">
        <Select value={userId} onValueChange={onUserChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by user" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            {users?.map((user) => (
              <SelectItem key={user.id} value={user.id.toString()}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AlbumsFilter;
