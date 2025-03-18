import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon } from "lucide-react";

export const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme();

    return (
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
    );
};