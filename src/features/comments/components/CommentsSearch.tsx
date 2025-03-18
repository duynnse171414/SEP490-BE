import { Input } from "@/components/ui/input";

interface CommentsSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const CommentsSearch: React.FC<CommentsSearchProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="mb-6 max-w-md mx-auto">
      <Input
        type="text"
        placeholder="Search comments..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default CommentsSearch;
