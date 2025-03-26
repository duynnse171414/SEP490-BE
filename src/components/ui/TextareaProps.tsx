import * as React from "react";
import { cn } from "@/lib/utils"; // Nếu bạn dùng hàm `cn` để gộp classNames

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "border border-input bg-background rounded-md p-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
