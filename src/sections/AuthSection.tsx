import { useAuthContext } from "@/features/auth/hooks/useAuthContext";
import { LoginUserDTO } from "@/features/auth/types";
import { LoginForm } from "@/features/auth/components/login-form";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { UserDropdown } from "@/components/common/UserDropdown";

interface AuthSectionProps {
    isAuthenticated: boolean;
    isLoginDrawerOpen: boolean;
    setIsLoginDrawerOpen: (open: boolean) => void;
    onLoginSubmit: ({ email, password }: LoginUserDTO) => void;
    onDrawerStateChange?: (open: boolean) => void;
}

export const AuthSection = ({
    isAuthenticated,
    isLoginDrawerOpen,
    setIsLoginDrawerOpen,
    onLoginSubmit,
    onDrawerStateChange,
}: AuthSectionProps) => {
    const { user } = useAuthContext();

    return isAuthenticated ? (
        <UserDropdown user={user} />
    ) : (
        <Drawer
            open={isLoginDrawerOpen}
            onOpenChange={(open) => {
                setIsLoginDrawerOpen(open);
                if (onDrawerStateChange) {
                    onDrawerStateChange(open);
                }
            }}
        >
            <DrawerTrigger asChild>
                <Button
                    variant="default"
                    className="flex items-center gap-2 whitespace-nowrap rounded-full"
                >
                    <User size={16} />
                    <span>Login</span>
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle className="text-center text-2xl font-bold">Welcome Back</DrawerTitle>
                        <DrawerDescription className="text-center">
                            Enter your credentials below to access your account
                        </DrawerDescription>
                    </DrawerHeader>
                    <LoginForm onSubmit={onLoginSubmit} />
                </div>
            </DrawerContent>
        </Drawer>
    );
};