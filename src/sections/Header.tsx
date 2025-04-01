import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { LoginForm } from "@/features/auth/components/login-form";
import {
  User,
  Sun,
  Moon,
  Menu,
  MessageSquare,
  CheckSquare,
  Users,
  Home,
  Info,
  Mail,
  LogOut,
  Settings,
  CreditCard,
  Keyboard,
  Users2,
  UserPlus,
  Github,
} from "lucide-react";
import { useAuthContext } from "@/features/auth/hooks/useAuthContext";
import { LoginUserDTO } from "@/features/auth/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  onDrawerStateChange?: (open: boolean) => void;
}

export const Header = ({ onDrawerStateChange }: HeaderProps) => {
  const [isLoginDrawerOpen, setIsLoginDrawerOpen] = useState(false);
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, logout, login } = useAuthContext();
  const [isSuccess] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!user);

  useEffect(() => {
    setIsAuthenticated(user !== null);
    if (onDrawerStateChange) {
      if (isLoginDrawerOpen) onDrawerStateChange(user === null);
    }
  }, [user]);

  const handleLoginSubmit = ({ email, password }: LoginUserDTO) => {
    login({ email, password });

    if (isSuccess) {
      setIsLoginDrawerOpen(false);
      if (onDrawerStateChange) {
        onDrawerStateChange(false);
      }
    }
  };

  return (
    <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/30">
      <div className="container mx-auto py-3">
        <div className="flex flex-wrap items-center justify-between px-4">
          <div className="flex items-center gap-2 w-full md:w-auto justify-between">
            <Link
              to="/"
              className="flex items-center gap-2 text-xl font-bold text-primary transition-colors hover:text-primary/80"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
              </svg>
              <span className="font-bold tracking-tight">ClaimRequest</span>
            </Link>
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsNavDrawerOpen(true)}
                className="rounded-full"
              >
                <Menu size={20} />
              </Button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-grow justify-center">
            <NavigationMenu>
              <NavigationMenuList className="flex">
                <NavigationMenuItem>
                  <NavigationMenuLink>
                    <Link to="/">
                      <span>Home</span>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink>
                    <Link to="/contact">
                      <span>Contact</span>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right Side: Theme Switcher & Login */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-end mt-2 md:mt-0">
            <div className="flex items-center gap-2 bg-accent/30 p-1 rounded-full">
              <Sun className="h-4 w-4 text-yellow-500" />
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked: boolean) =>
                  setTheme(checked ? "dark" : "light")
                }
                className="data-[state=checked]:bg-primary"
              />
              <Moon className="h-4 w-4 text-blue-500" />
            </div>
            {isAuthenticated && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full"
                  >
                    <Avatar className="h-9 w-9 border-2 border-primary/20">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                        alt={user?.email}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user?.email.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.email}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                      <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <Link to="/dashboard">My Claims</Link>
                      <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Billing</span>
                      <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/approve-claims"
                        className="flex items-center w-full cursor-default"
                      >
                        <CheckSquare className="mr-2 h-4 w-4" />
                        <span>Approve Claim</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                      <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Keyboard className="mr-2 h-4 w-4" />
                      <span>Keyboard shortcuts</span>
                      <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Users2 className="mr-2 h-4 w-4" />
                      <span>Team</span>
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <UserPlus className="mr-2 h-4 w-4" />
                        <span>Invite users</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            <span>Email</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            <span>Message</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <span>More...</span>
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuItem>
                      <Users className="mr-2 h-4 w-4" />
                      <span>New Team</span>
                      <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Github className="mr-2 h-4 w-4" />
                    <span>GitHub</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>Support</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>API</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-500 focus:text-red-500"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Drawer
              open={isLoginDrawerOpen && !isAuthenticated}
              onOpenChange={(open) => {
                setIsLoginDrawerOpen(open);
                if (onDrawerStateChange) {
                  onDrawerStateChange(open);
                }
              }}
            >
              {!isAuthenticated && (
                <DrawerTrigger asChild>
                  <Button
                    variant="default"
                    className="flex items-center gap-2 whitespace-nowrap rounded-full"
                  >
                    <User size={16} />
                    <span>Login</span>
                  </Button>
                </DrawerTrigger>
              )}

              <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                  <DrawerHeader>
                    <DrawerTitle className="text-center text-2xl font-bold">
                      Welcome Back
                    </DrawerTitle>
                    <DrawerDescription className="text-center">
                      Enter your credentials below to access your account
                    </DrawerDescription>
                  </DrawerHeader>
                  <LoginForm onSubmit={handleLoginSubmit} />
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <Drawer open={isNavDrawerOpen} onOpenChange={setIsNavDrawerOpen}>
        <DrawerContent>
          <div className="p-4">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className="flex items-center gap-2 text-lg font-medium hover:text-primary"
                onClick={() => setIsNavDrawerOpen(false)}
              >
                <Home size={18} />
                <span>Home</span>
              </Link>
              <Link
                to="/approve-claims"
                className="flex items-center gap-2 text-lg font-medium hover:text-primary"
                onClick={() => setIsNavDrawerOpen(false)}
              >
                <Info size={18} />
                <span>Approve Claim</span>
              </Link>
              <Link
                to="/contact"
                className="flex items-center gap-2 text-lg font-medium hover:text-primary"
                onClick={() => setIsNavDrawerOpen(false)}
              >
                <Mail size={18} />
                <span>Contact</span>
              </Link>
            </nav>
          </div>
        </DrawerContent>
      </Drawer>
    </header>
  );
};
