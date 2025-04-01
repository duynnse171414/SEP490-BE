import { useState } from "react";
import { useCreateClaims } from "@/features/claims/hooks/useCreateClaims";
import { useProject } from "@/features/project/hooks/useProject";
import { usePmStaff } from "@/features/staff/hooks/usePmStaff";
import { useStaffProject } from "@/features/staff/hooks/useStaffProject";
import { toast } from "sonner";

// Shadcn UI components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MultiSelect, Option } from "@/components/ui/multi-select";

const CreateClaimPage: React.FC = () => {
    const [informTo, setInformTo] = useState<Option[]>([]);
    const [selectedProject, setSelectedProject] = useState<number | undefined>();
    const [approverId, setApproverId] = useState<string | undefined>();
    const { data: projects, error: projectsError, isLoading: projectsLoading } = useProject();
    const { data: pms, error: pmsError, isLoading: pmsLoading } = usePmStaff(selectedProject);
    const { data: staffs, error: staffsError, isLoading: staffsLoading } = useStaffProject(selectedProject);
    const [dayForms, setDayForms] = useState([
        { startDate: '', endDate: '', workingHours: '' }
    ]);
    const today = new Date().toISOString().split("T")[0];
    const now = new Date().toISOString().slice(0, 16);
    const [conflictIndexes, setConflictIndexes] = useState<number[]>([]);
    const staffOptions = Array.isArray(staffs) && staffs?.map((staff: any) => ({
        value: staff.staffId,
        label: staff.staffName
    })) || [];
    const [expectedDate, setExpectedDate] = useState<string>('');
    const validForms: typeof dayForms = [];
    const invalidForms: typeof dayForms = [];

    if (projectsLoading) return <p>Loading...</p>;
    if (projectsError) return <p className="text-destructive">Error at project fetching: {projectsError.message}</p>;
    if (pmsError) return <p className="text-destructive">Error at pm fetching: {projectsError.message}</p>;
    if (staffsError) return <p className="text-destructive">Error at staff fetching: {projectsError.message}</p>;

    const addDayForm = () => {
        const updated = [{ startDate: '', endDate: '', workingHours: '' }, ...dayForms];
        setDayForms(updated);
        detectConflicts(updated);
    };

    const removeDayForm = (indexToRemove: any) => {
        const updated = dayForms.filter((_, index) => index !== indexToRemove);
        setDayForms(updated);
        detectConflicts(updated);
    };

    const detectConflicts = (forms: typeof dayForms) => {
        const dateMap = new Map<string, number[]>();

        forms.forEach((form, index) => {
            const { startDate, endDate } = form;
            if (!startDate || !endDate) return;

            const current = new Date(startDate);
            const end = new Date(endDate);

            while (current <= end) {
                const dateStr = current.toISOString().split("T")[0];
                if (!dateMap.has(dateStr)) {
                    dateMap.set(dateStr, []);
                }
                dateMap.get(dateStr)!.push(index);
                current.setDate(current.getDate() + 1);
            }
        });

        const conflicts = new Set<number>();
        for (const indexes of dateMap.values()) {
            if (indexes.length > 1) {
                indexes.forEach((i) => conflicts.add(i));
            }
        }

        setConflictIndexes(Array.from(conflicts));
    };

    const updateDayForm = (index: any, field: any, value: string) => {
        const updatedForms = [...dayForms];
        if (field === 'workingHours') {
            const parsed = parseFloat(value);
            if (isNaN(parsed) || parsed < 0) {
                return;
            }
        }
        updatedForms[index] = { ...updatedForms[index], [field]: value };
        if (field === 'startDate' && updatedForms[index].endDate && value > updatedForms[index].endDate) {
            updatedForms[index].endDate = '';
        }
        setDayForms(updatedForms);
        detectConflicts(updatedForms);
    };

    const isFormValid = () => {
        if (!selectedProject) return false;
        if (!approverId) return false;
        if (dayForms.length === 0) return false;
        for (let form of dayForms) {
            if (!form.startDate || !form.endDate || !form.workingHours) {
                return false;
            }
        }
        if (conflictIndexes.length > 0) return false;
        return true;
    };

    const handleSubmit = async () => {
        const listRequest: { date: string; workingHours: number }[] = [];

        dayForms.forEach(form => {
            const { startDate, endDate, workingHours } = form;
            const workingHoursFloat = parseFloat(workingHours);

            if (startDate && endDate && workingHours && !isNaN(workingHoursFloat) && workingHoursFloat > 0) {
                const start = new Date(startDate);
                const end = new Date(endDate);
                const current = new Date(start);
                while (current <= end) {
                    listRequest.push({
                        date: current.toISOString(),
                        workingHours: workingHoursFloat
                    });
                    current.setDate(current.getDate() + 1);
                }
                validForms.push(form);
            } else {
                invalidForms.push(form);
            }
        });

        if (listRequest.length === 0) {
            alert("Không có dữ liệu hợp lệ để gửi.");
            return;
        }

        if (invalidForms.length > 0) {
            alert("Một số form bị sai định dạng và đã được giữ lại để chỉnh sửa.");
        }

        const payload: any = {
            projectId: selectedProject!,
            approverId: approverId!,
            listRequest: listRequest
        };

        if (expectedDate) {
            payload.expectedDate = new Date(expectedDate).toISOString();
        }

        const staffIds = informTo.map(item => item.value);
        if (staffIds.length > 0) {
            payload.inforStaffs = staffIds;
        }

        console.log("Payload to backend (optional fields handled):", payload);
        try {
            const response = await useCreateClaims("/ClaimRequests", payload);
            if (!response.success) {
                toast.error(response.message);
                return;
            }
            toast.success("Create request successfully");
            setDayForms(invalidForms);
        } catch (err: any) {
            toast.error(err.message || "Lỗi hệ thống.");
            console.error("Error:", err);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">CREATE NEW REQUEST</h1>
                <div className="flex gap-2">
                    <Button variant="outline">Close</Button>
                    <Button
                        disabled={!isFormValid()}
                        onClick={handleSubmit}
                        variant={!isFormValid() ? "secondary" : "default"}
                    >
                        Submit
                    </Button>
                </div>
            </div>

            <div className="flex gap-4 p-5 rounded-lg">
                <Card className="w-2/3 shadow-sm">
                    <CardHeader className="border-b bg-muted/30">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-xl font-semibold">Request Details</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="mb-6">
                            <Label htmlFor="project" className="text-base mb-2 block">
                                Project <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                onValueChange={(value) => setSelectedProject(Number(value))}
                            >
                                <SelectTrigger className="w-[240px]">
                                    <SelectValue placeholder="Select project" />
                                </SelectTrigger>
                                <SelectContent>
                                    {projects?.map((project) => (
                                        <SelectItem key={project.projectId} value={project.projectId.toString()}>
                                            {project.projectName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium">
                                    Duration Total: {dayForms.length} day(s)
                                </h3>
                                <Button
                                    onClick={() => {
                                        const updated = [{ startDate: '', endDate: '', workingHours: '' }, ...dayForms];
                                        setDayForms(updated);
                                        detectConflicts(updated);
                                    }}
                                    variant="secondary"
                                    size="sm"
                                >
                                    Add Day
                                </Button>
                            </div>

                            <div className="border rounded-md">
                                <table className="w-full">
                                    <thead className="bg-muted/50">
                                        <tr>
                                            <th className="text-left px-4 py-2 font-medium text-sm">Start Date</th>
                                            <th className="text-left px-4 py-2 font-medium text-sm">End Date</th>
                                            <th className="text-left px-4 py-2 font-medium text-sm">Working Hours</th>
                                            <th className="text-right px-4 py-2 font-medium text-sm">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dayForms.map((form, index) => {
                                            const hasConflict = conflictIndexes.includes(index);

                                            return (
                                                <tr
                                                    key={index}
                                                    className={`border-t ${hasConflict ? 'bg-destructive/10' : 'even:bg-muted/20'}`}
                                                >
                                                    <td className="px-4 py-3">
                                                        <Input
                                                            id={`startDate-${index}`}
                                                            type="date"
                                                            max={today}
                                                            value={form.startDate}
                                                            onChange={(e) => updateDayForm(index, 'startDate', e.target.value)}
                                                            className={hasConflict ? "border-destructive" : ""}
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Input
                                                            id={`endDate-${index}`}
                                                            type="date"
                                                            max={today}
                                                            min={form.startDate || undefined}
                                                            value={form.endDate}
                                                            onChange={(e) => updateDayForm(index, 'endDate', e.target.value)}
                                                            disabled={!form.startDate}
                                                            className={hasConflict ? "border-destructive" : ""}
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Input
                                                            id={`workingHours-${index}`}
                                                            type="number"
                                                            min="0"
                                                            step="0.1"
                                                            value={form.workingHours}
                                                            onChange={(e) => updateDayForm(index, 'workingHours', e.target.value)}
                                                            className={hasConflict ? "border-destructive" : ""}
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => removeDayForm(index)}
                                                        >
                                                            Remove
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="w-1/3 shadow-sm">
                    <CardHeader className="border-b bg-muted/30">
                        <CardTitle className="text-xl font-semibold">Approval</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div>
                            <Label htmlFor="approver" className="mb-2 block">
                                Approver <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                onValueChange={(value) => setApproverId(value)}
                                value={approverId}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select approver" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.isArray(pms) && pms.map((staff) => (
                                        <SelectItem key={staff.staffId} value={staff.staffId}>
                                            {staff.staffName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="informTo" className="mb-2 block">
                                Inform to
                            </Label>
                            <MultiSelect
                                options={staffOptions}
                                selectedValues={informTo}
                                onValueChange={(selectedOptions) => {
                                    if (selectedOptions.length <= 3) {
                                        setInformTo(selectedOptions);
                                    }
                                }}
                                placeholder="Select staff to inform"
                                className="w-full"
                                maxSelectedValues={3}
                            />
                        </div>

                        <div>
                            <Label htmlFor="expectedDate" className="mb-2 block">
                                Expected Approve
                            </Label>
                            <Input
                                id="expectedDate"
                                type="datetime-local"
                                min={now}
                                value={expectedDate}
                                onChange={(e) => setExpectedDate(e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default CreateClaimPage;
