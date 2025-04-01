import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { LoginForm } from "@/features/auth/components/login-form";
import {
  User,
  Sun,
  Moon,
  Menu,
  CheckSquare,
  Home,
  Info,
  Mail,
  LogOut,
  UserPlus,
} from "lucide-react";
import { useAuthContext } from "@/features/auth/hooks/useAuthContext";
import { LoginUserDTO } from "@/features/auth/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

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
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginAttempted, setLoginAttempted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsAuthenticated(user !== null);
    if (onDrawerStateChange) {
      if (isLoginDrawerOpen) onDrawerStateChange(user === null);
    }
  }, [user]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCommandOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (loginAttempted) {
      if (user) {
        toast.success("Login successful!", {
          description: "Welcome back to ClaimRequest",
        });
        
        setIsLoginDrawerOpen(false);
        if (onDrawerStateChange) {
          onDrawerStateChange(false);
        }
      } else {
        toast.error("Login failed", {
          description: "Invalid credentials. Please try again.",
        });
      }
      setLoginAttempted(false);
      setIsLoggingIn(false);
    }
  }, [user, loginAttempted]);

  const handleLoginSubmit = async ({ email, password }: LoginUserDTO) => {
    setIsLoggingIn(true);
    try {
      await login({ email, password });
      setLoginAttempted(true);
    } catch (error) {
      toast.error("Login failed", {
        description: error instanceof Error ? error.message : "Please check your credentials and try again",
      });
      setIsLoggingIn(false);
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

          {/* Desktop Navigation with Search */}
          {isAuthenticated && (
            <div className="hidden md:flex flex-grow justify-center">
              <Button
                variant="outline"
                className="relative w-full max-w-sm justify-start text-sm text-muted-foreground"
                onClick={() => setIsCommandOpen(true)}
              >
                <span className="hidden lg:inline-flex">Search for pages...</span>
                <span className="inline-flex lg:hidden">Search...</span>
                <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </Button>
            </div>
          )}

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
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center w-full">
                      <User className="mr-2 h-4 w-4" />
                      <span>My Claims</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/approve-claims" className="flex items-center w-full">
                      <CheckSquare className="mr-2 h-4 w-4" />
                      <span>Approve Claims</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-500 focus:text-red-500"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
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
                  <LoginForm onSubmit={handleLoginSubmit} isLoading={isLoggingIn} />
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>

      {/* Command Dialog */}
      <CommandDialog open={isCommandOpen} onOpenChange={setIsCommandOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Pages">
            <CommandItem onSelect={() => {
              navigate("/dashboard");
              setIsCommandOpen(false);
            }}>
              <User className="mr-2 h-4 w-4" />
              <span>My Claims</span>
            </CommandItem>
            <CommandItem onSelect={() => {
              navigate("/create-claim");
              setIsCommandOpen(false);
            }}>
              <UserPlus className="mr-2 h-4 w-4" />
              <span>Create Claim</span>
            </CommandItem>
            <CommandItem onSelect={() => {
              navigate("/approve-claims");
              setIsCommandOpen(false);
            }}>
              <CheckSquare className="mr-2 h-4 w-4" />
              <span>Approve Claims</span>
            </CommandItem>

          </CommandGroup>
        </CommandList>
      </CommandDialog>

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
