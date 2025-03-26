import { postData } from "@/api/fetchers";
import { useProject } from "@/features/project/hooks/useProject";
import { usePmStaff } from "@/features/staff/hooks/usePmStaff";
import { useStaffProject } from "@/features/staff/hooks/useStaffProject";
import { useState } from "react";
import Select from "react-select";

const CreateClaimPage: React.FC = () => {
    const [informTo, setInformTo] = useState<{ value: string; label: string }[]>([]);
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

    if (projectsLoading || pmsLoading || staffsLoading) return <p>Loading...</p>;
    if (projectsError) return <p className="text-red-500">Error at project fetching: {projectsError.message}</p>;
    if (pmsError) return <p className="text-red-500">Error at pm fetching: {projectsError.message}</p>;
    if (staffsError) return <p className="text-red-500">Error at staff fetching: {projectsError.message}</p>;

    const addDayForm = () => {
        const updated = [...dayForms, { startDate: '', endDate: '', workingHours: '' }];
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
        for (let form of dayForms) {
            if (!form.startDate || !form.endDate || !form.workingHours) {
                return false;
            }
        }
        if (conflictIndexes.length > 0) return false;
        return true;
    };

    const handleSubmit = () => {
        const listRequest: { date: string; workingHours: number }[] = [];

        dayForms.forEach(form => {
            const { startDate, endDate, workingHours } = form;
            if (!startDate || !endDate || !workingHours) return;

            const workingHoursFloat = parseFloat(workingHours);
            if (isNaN(workingHoursFloat)) return;

            const start = new Date(startDate);
            const end = new Date(endDate);

            const current = new Date(start);
            while (current <= end) {
                const dateStr = current.toISOString(); // full ISO for C#
                listRequest.push({
                    date: dateStr,
                    workingHours: workingHoursFloat
                });
                current.setDate(current.getDate() + 1);
            }
        });

        // Tạo payload cơ bản
        const payload: any = {
            projectId: selectedProject!,
            approverId: approverId!,
            listRequest: listRequest
        };

        // Thêm expectedDate nếu có
        if (expectedDate) {
            payload.expectedDate = new Date(expectedDate).toISOString();
        }

        // Thêm inforStaffs nếu có chọn
        const staffIds = informTo.map(item => item.value);
        if (staffIds.length > 0) {
            payload.inforStaffs = staffIds;
        }

        console.log("📤 Payload to backend (optional fields handled):", payload);
        try {
            const response = postData("/ClaimRequests", payload);
            console.log("success:", response);
          } catch (err) {
            console.error("Error:", err);
          }
        // Gửi API tại đây nếu cần
        // axios.post('/api/claim-request', payload).then(...);
    };
    
    return (
        <div className="container mx-auto p-4">
            <div>
                <div className="mb-5 flex">
                    <div className="w-4/5">
                        <h1 className="text-3xl font-bold">CREATE NEW REQUEST</h1>
                    </div>
                    <div className="flex justify-end items-center w-1/10">
                        <button className="p-1.5 px-4 bg-white text-blue-600 hover:bg-gray-200 hover:rounded-md">Close</button>
                    </div>
                    <div className="flex justify-center items-center w-1/10">
                        <button
                            disabled={!isFormValid()}
                            onClick={handleSubmit}
                            className={`border p-1.5 px-4 rounded-md ${!isFormValid()
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-gray-200 text-white hover:bg-blue-200 hover:text-blue-600 hover:font-semibold'
                                }`}>
                            Submit
                        </button>
                    </div>
                </div>

                <div className="flex bg-blue-200 p-5">
                    <div className="bg-white w-2/3 m-2 rounded-md">
                        <div className="head-title-detail flex pt-5 pb-5 bg-blue-50 rounded-t-md">
                            <div className="w-3/4">
                                <h1 className="m-2 text-xl font-semibold">Request Details</h1>
                            </div>
                            <div className="w-1/4">
                                <h1 className="m-2 text-xl font-medium">Remaining Leave</h1>
                            </div>
                        </div>
                        <div className="select-project flex flex-col bg-white pb-5">
                            <div>
                                <h4 className="text-lg mt-2 ml-5">Project <span className="text-red-700">*</span></h4>
                            </div>
                            <div>
                                <select className="border border-gray-300 rounded-md p-2 ml-2 bg-white w-7/20"
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setSelectedProject(value ? Number(value) : undefined);
                                        setSelectedProject(Number(value))
                                    }}
                                >
                                    <option>--:--</option>
                                    {projects?.map((project) => (
                                        <option key={project.projectId} value={project.projectId}>
                                            {project.projectName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="select-day flex flex-col pb-2 rounded-b-md">
                            <div className="flex">
                                <div className="w-5/6">
                                    <h4 className="text-lg m-5">
                                        Duration Total: {dayForms.length} day(s)
                                    </h4>
                                </div>
                                <div className="w-1/6">
                                    <button
                                        onClick={addDayForm}
                                        type="button"
                                        className="border border-white-300 rounded-md p-1.5 px-6 m-5 bg-blue-200 text-blue-600 hover:bg-blue-300 hover:font-semibold"
                                    >
                                        Add Day
                                    </button>
                                </div>
                            </div>

                            <div className="grid bg-gray-100 pb-2 ml-2 mr-2 mb-2 border border-white-300 rounded-md">
                                <div>
                                    <h4 className="text-lg ml-5 mt-2 mb-3">{dayForms.length} day(s)</h4>
                                </div>
                                <div className="max-h-[300px] overflow-y-auto">
                                    {/* Danh sách các form ngày */}
                                    {dayForms.map((form, index) => {
                                        const hasConflict = conflictIndexes.includes(index);

                                        return (
                                            <div className={`mb-3 p-2 rounded-md ${hasConflict ? 'border border-red-500 bg-red-100' : 'border border-gray-200'
                                                }`}
                                                key={index}>
                                                <form className="flex items-end">
                                                    <div className="flex flex-col w-1/3 ml-2">
                                                        <label>Start Date <span className="text-red-700">*</span></label>
                                                        <input
                                                            className="border border-gray-300 rounded-md bg-white p-2 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
                                                            max={today}
                                                            type="date"
                                                            value={form.startDate}
                                                            onChange={(e) => updateDayForm(index, 'startDate', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col w-1/3 ml-2 mr-2">
                                                        <label>End Date <span className="text-red-700">*</span></label>
                                                        <input
                                                            className="border border-gray-300 rounded-md bg-white p-2 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
                                                            max={today}
                                                            min={form.startDate || undefined}
                                                            type="date"
                                                            value={form.endDate}
                                                            onChange={(e) => updateDayForm(index, 'endDate', e.target.value)}
                                                            disabled={!form.startDate}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col w-1/4 mr-2">
                                                        <label>Working hours <span className="text-red-700">*</span></label>
                                                        <input
                                                            className="border border-gray-300 rounded-md bg-white p-1"
                                                            type="text"
                                                            value={form.workingHours}
                                                            onChange={(e) => updateDayForm(index, 'workingHours', e.target.value)}
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeDayForm(index)}
                                                        className="bg-red-200 text-red-600 rounded-md px-3 py-1 mb-1 mr-2 hover:bg-red-300 hover:font-semibold"
                                                    >
                                                        Remove
                                                    </button>
                                                </form>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-1/3 ml-2 mr-2 mb-2 rounded-md">
                        <div className="head-title-status mt-2 pt-5 pb-5 bg-white rounded-t-md border-b-2 border-gray-200">
                            <h1 className="m-2 text-lg font-semibold">Approval Status</h1>
                        </div>
                        <div className="flex flex-col bg-white rounded-b-md pb-5">
                            <div className="flex flex-col m-3 w-19/20">
                                <label className="mb-2">Approver <span className="text-red-700">*</span></label>
                                <select className="border border-gray-300 rounded-md p-2 ml-2 bg-white"
                                    value={approverId}
                                    onChange={(e) => setApproverId(e.target.value)}
                                >
                                    <option value="">--:--</option>
                                    {Array.isArray(pms) && pms.map((staff) => (
                                        <option key={staff.staffId} value={staff.staffId}>
                                            {staff.staffName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col m-3 w-19/20">
                                <label className="mb-2">Inform to</label>
                                <div className="ml-2">
                                    <Select
                                        options={staffOptions}
                                        isMulti
                                        value={informTo}
                                        onChange={(selectedOptions) => {
                                            if ((selectedOptions as any[]).length <= 3) {
                                                setInformTo(selectedOptions as any[]);
                                            }
                                        }}
                                        placeholder="--:--"
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        styles={{
                                            container: (provided) => ({
                                                ...provided,
                                                width: '100%',
                                            }),
                                        }}
                                    />
                                </div>
                            </div>
                            <form>
                                <div className="flex flex-col m-3">
                                    <label className="mb-2">Expected Approve</label>
                                    <input
                                        className="border border-gray-300 rounded-md bg-white p-2 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-50"
                                        min={now}
                                        type="datetime-local"
                                        value={expectedDate}
                                        onChange={(e) => setExpectedDate(e.target.value)}
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default CreateClaimPage;