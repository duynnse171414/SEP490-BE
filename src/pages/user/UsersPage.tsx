import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUsers } from "@/features/users/hooks/useUsers";
import SplashScreen from "@/sections/SplashScreen";
import { User } from "@/features/users/types";
import { Loader2, XCircleIcon } from "lucide-react";
import { Label } from "@/components/ui/label";

export const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { data: users, error, isLoading } = useUsers();
  const filteredUsers = users?.filter((user: User) =>
    [user.name, user.email, user.username, user.company?.name]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Users</h1>
      {/* Search Input */}
      <div className="mb-6 flex items-center justify-center">
        <Label htmlFor="search" className="sr-only">
          Search users
        </Label>
        <Input
          id="search"
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md w-full"
        />
      </div>
      {isLoading ? (
        <SplashScreen />
      ) : error ? (
        <div className="text-center my-8 text-red-500 flex items-center justify-center">
          <XCircleIcon className="w-6 h-6 mr-2" />
          Error: {error.message}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers?.map((user: User) => (
            <Card key={user.id} className="flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl">{user.name}</CardTitle>
                    <p className="text-sm text-gray-500">@{user.username}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-2 pb-2">
                <p className="text-sm">
                  <span className="font-semibold">Email:</span> {user.email}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Phone:</span> {user.phone}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Company:</span>{" "}
                  {user.company?.name}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Website:</span> {user.website}
                </p>
              </CardContent>
              <CardFooter>
                <Link to={`/users/${user.id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    View Profile
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UsersPage;