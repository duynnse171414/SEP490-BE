import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Mail, Phone, Globe, Briefcase, CheckCircle, Clock } from "lucide-react";
import { useUser } from "@/features/users/hooks/useUsers";
import { Todo } from "@/features/todos/types";
import { Post, usePostsByUserId } from "@/features/posts";
import { useAlbumsByUserId } from "@/features/albums/hooks/useAlbums";
import { useTodosByUserId } from "@/features/todos/hooks/useTodos";
import { Album } from "@/features/albums/types";
import SplashScreen from "@/sections/SplashScreen";
import { motion } from "framer-motion";

export const UserDetailPage = () => {
  const { id } = useParams();
  const userId = id || "1";
  const { data: user, error, isLoading } = useUser(userId);
  const { data: posts } = usePostsByUserId({ userId });
  const { data: albums } = useAlbumsByUserId({ userId });
  const { data: todos } = useTodosByUserId({ userId });
  const completedTodos = todos?.filter((todo: Todo) => todo.completed) || [];
  const pendingTodos = todos?.filter((todo: Todo) => !todo.completed) || [];

  if (isLoading) {
    return <SplashScreen />;
  }

  if (error) {
    return <div className="text-center text-red-500 my-8">Error: {error.message}</div>;
  }

  if (!user) {
    return <div className="text-center my-8">User not found</div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
      {/* Cover Photo */}
      <div className="relative h-48 w-full mb-6">
        <img src="https://via.placeholder.com/1920x300" alt="Cover Photo" className="w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center p-4">
          <Avatar className="h-24 w-24 -mb-12 bg-white">
            <AvatarFallback>{user.email.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Profile Information */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col items-center">
          <CardTitle className="text-3xl font-bold">{user.email}</CardTitle>
          <p className="text-gray-500">@{user.email}</p>
        </div>
        <Link to="/users">
          <Button variant="outline">Back to Users</Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* User Info Card */}
        <Card className="lg:col-span-1">
          <CardContent className="space-y-2">
            <p className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4" /> {user.email}
            </p>
            <p className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4" /> {user.email}
            </p>
            <p className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4" /> {user.email}
            </p>
            <p className="flex items-center gap-2 text-sm">
              <Briefcase className="h-4 w-4" /> {user.email}
            </p>
            <p className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4" /> {user.email}
            </p>
          </CardContent>
        </Card>

        {/* Tabs for Posts, Albums, and Todos */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="posts">
            <TabsList className="flex space-x-4">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="albums">Albums</TabsTrigger>
              <TabsTrigger value="todos">Todos</TabsTrigger>
            </TabsList>
            {/* Posts Tab */}
            <TabsContent value="posts">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                {posts?.length ? (
                  posts.map((post: Post) => (
                    <Card key={post.id}>
                      <CardHeader>
                        <CardTitle>{post.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500">{post.body}</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-gray-500">No posts available.</p>
                )}
              </motion.div>
            </TabsContent>
            {/* Albums Tab */}
            <TabsContent value="albums">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
                {albums?.length ? (
                  albums.map((album: Album) => (
                    <Card key={album.id}>
                      <CardContent>
                        <p className="text-sm font-medium">{album.title}</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-gray-500">No albums available.</p>
                )}
              </motion.div>
            </TabsContent>
            {/* Todos Tab */}
            <TabsContent value="todos">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
                <h3 className="text-lg font-semibold">Completed</h3>
                {completedTodos.length ? (
                  completedTodos.map((todo: Todo) => (
                    <Card key={todo.id}>
                      <CardContent className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <p className="text-sm">{todo.title}</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-gray-500">No completed tasks.</p>
                )}
                <h3 className="text-lg font-semibold mt-4">Pending</h3>
                {pendingTodos.length ? (
                  pendingTodos.map((todo: Todo) => (
                    <Card key={todo.id}>
                      <CardContent className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-500" />
                        <p className="text-sm">{todo.title}</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-gray-500">No pending tasks.</p>
                )}
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
};

export default UserDetailPage;