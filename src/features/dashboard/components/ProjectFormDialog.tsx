import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";

const projectSchema = z
  .object({
    projectName: z.string().min(1, "Project name is required"),
    projectCode: z.string().min(1, "Project code is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    budget: z.number().positive("Budget must be greater than 0"),
    projectDetail: z.string().min(1, "Project detail is required"),
    isDeleted: z.boolean().optional(),
  })
  .refine(
    (data) => {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      return startDate < endDate;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

interface ProjectFormData {
  projectName: string;
  projectCode: string;
  startDate: string;
  endDate: string;
  budget: number;
  projectDetail: string;
  isDeleted?: boolean;
}

interface ProjectFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  initialData?: ProjectFormData;
  mode: "create" | "edit";
}

const initialFormData: ProjectFormData = {
  projectName: "",
  projectCode: "",
  startDate: "",
  endDate: "",
  budget: 0,
  projectDetail: "",
};

export function ProjectFormDialog({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}: ProjectFormDialogProps) {
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setErrors({});
      return;
    }

    if (mode === "create") {
      setFormData(initialFormData);
    } else if (initialData) {
      const formatDateForInput = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };

      const formattedData = {
        ...initialData,
        startDate: formatDateForInput(initialData.startDate),
        endDate: formatDateForInput(initialData.endDate),
      };
      setFormData(formattedData);
    }
    setErrors({});
  }, [isOpen, initialData, mode]);

  const handleChange = (
    field: keyof ProjectFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async () => {
    try {
      if (mode === "create") {
        const startDate = new Date(formData.startDate);
        const now = new Date();
        if (startDate < now) {
          setErrors({ startDate: "Start date must be in the future" });
          return;
        }
      }

      const formatDateForSubmission = (dateString: string) => {
        const date = new Date(dateString);
        const offset = date.getTimezoneOffset() * 60000;
        const utcDate = new Date(date.getTime() - offset);

        const year = utcDate.getFullYear();
        const month = String(utcDate.getMonth() + 1).padStart(2, "0");
        const day = String(utcDate.getDate()).padStart(2, "0");
        const hours = String(utcDate.getHours()).padStart(2, "0");
        const minutes = String(utcDate.getMinutes()).padStart(2, "0");
        return `${year}-${month}-${day}T${hours}:${minutes}:00`;
      };

      const validatedData = {
        ...projectSchema.parse(formData),
        startDate: formatDateForSubmission(formData.startDate),
        endDate: formatDateForSubmission(formData.endDate),
      };

      setIsSubmitting(true);
      await onSubmit(validatedData);
      onClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogClose = () => {
    setFormData(initialFormData);
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add New Project" : "Edit Project"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Fill in the details to create a new project."
              : "Update the project details below."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="projectName">Project Name</label>
            <Input
              id="projectName"
              value={formData.projectName}
              onChange={(e) => handleChange("projectName", e.target.value)}
              className={errors.projectName ? "border-red-500" : ""}
            />
            {errors.projectName && (
              <p className="text-red-500 text-sm">{errors.projectName}</p>
            )}
          </div>

          <div className="grid gap-2">
            <label htmlFor="projectCode">Project Code</label>
            <Input
              id="projectCode"
              value={formData.projectCode}
              onChange={(e) => handleChange("projectCode", e.target.value)}
              className={errors.projectCode ? "border-red-500" : ""}
            />
            {errors.projectCode && (
              <p className="text-red-500 text-sm">{errors.projectCode}</p>
            )}
          </div>

          <div className="grid gap-2">
            <label htmlFor="startDate">Start Date</label>
            <Input
              id="startDate"
              type="datetime-local"
              value={formData.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
              className={errors.startDate ? "border-red-500" : ""}
            />
            {errors.startDate && (
              <p className="text-red-500 text-sm">{errors.startDate}</p>
            )}
          </div>

          <div className="grid gap-2">
            <label htmlFor="endDate">End Date</label>
            <Input
              id="endDate"
              type="datetime-local"
              value={formData.endDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
              className={errors.endDate ? "border-red-500" : ""}
            />
            {errors.endDate && (
              <p className="text-red-500 text-sm">{errors.endDate}</p>
            )}
          </div>

          <div className="grid gap-2">
            <label htmlFor="budget">Budget</label>
            <Input
              id="budget"
              type="number"
              value={formData.budget}
              onChange={(e) => handleChange("budget", Number(e.target.value))}
              className={errors.budget ? "border-red-500" : ""}
            />
            {errors.budget && (
              <p className="text-red-500 text-sm">{errors.budget}</p>
            )}
          </div>

          <div className="grid gap-2">
            <label htmlFor="projectDetail">Project Detail</label>
            <Textarea
              id="projectDetail"
              value={formData.projectDetail}
              onChange={(e) => handleChange("projectDetail", e.target.value)}
              className={errors.projectDetail ? "border-red-500" : ""}
            />
            {errors.projectDetail && (
              <p className="text-red-500 text-sm">{errors.projectDetail}</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleDialogClose}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : mode === "create"
              ? "Create Project"
              : "Update Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
