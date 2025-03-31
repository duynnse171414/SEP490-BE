import { ClaimStatus, ClaimRequestDTO } from "@/features/claims/types";
import { useApproveClaims, useClaimsByPM } from "@/features/claims/hooks/useClaims";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ClaimsPage = () => {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);
  const { data, isLoading, mutate } = useClaimsByPM({ status: 2 });
  const claims = data?.data;
  const [selectedClaim, setSelectedClaim] = useState<string[]>([]);
  const { approveSelectedClaims, isApproving } = useApproveClaims();

  const handleSelect = (claimId: string, checked: boolean) => {
    setSelectedClaim((prevSelected) =>
      checked ? [...prevSelected, claimId] : prevSelected.filter((id) => id !== claimId)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (filteredClaims && checked) {
      setSelectedClaim(filteredClaims.map(claim => claim.claimId));
    } else {
      setSelectedClaim([]);
    }
  };

  const handleApproveSelected = () => {
    approveSelectedClaims(selectedClaim);
    setSelectedClaim([]);
  };

  const projects = Array.from(
    new Set(claims?.map((claim: ClaimRequestDTO) => claim.project.projectId))
  ).map((projectId) =>
    claims?.find((claim) => claim.project.projectId === projectId)?.project
  );

  // Filter claims by project and status
  const filteredClaims = claims?.filter(claim => {
    const matchesProject = selectedProject ? claim.project.projectId === selectedProject : true;
    const matchesStatus = selectedStatus !== null ? claim.claimStatus === selectedStatus : true;
    return matchesProject && matchesStatus;
  });

  const areAllSelected = filteredClaims && filteredClaims.length > 0 && 
    filteredClaims.every(claim => selectedClaim.includes(claim.claimId));

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Claims Dashboard
        </h1>
        <div className="text-center">Loading claims...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Claims Dashboard</h1>
      <div className="flex justify-end mb-4">
        <Button
          onClick={handleApproveSelected}
          disabled={selectedClaim.length === 0 || isApproving}
          className="gap-2"
        >
          {isApproving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Approve Selected ({selectedClaim.length})
            </>
          )}
        </Button>
      </div>
      <div className="mb-4 flex gap-4">
        <Select
          onValueChange={(value) => setSelectedProject(value === "all" ? null : Number(value))}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projects.map((project) => (
              <SelectItem key={project?.projectId} value={String(project?.projectId)}>
                {project?.projectName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => setSelectedStatus(value === "all" ? null : Number(value))}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.entries(ClaimStatus)
              .filter(([key]) => !isNaN(Number(key)))
              .map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox 
                  checked={areAllSelected}
                  onCheckedChange={handleSelectAll}
                  disabled={!filteredClaims || filteredClaims.length === 0}
                />
              </TableHead>
              <TableHead>Staff Name</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Hours</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!filteredClaims || filteredClaims.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No claims found matching the current filters
                </TableCell>
              </TableRow>
            ) : (
              filteredClaims.map((claim) => (
                <TableRow key={claim.claimId}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedClaim.includes(claim.claimId)} 
                      onCheckedChange={(checked) => handleSelect(claim.claimId, !!checked)}
                    />
                  </TableCell>
                  <TableCell>{claim.staff.staffName}</TableCell>
                  <TableCell>{claim.project.projectName}</TableCell>
                  <TableCell>{format(new Date(claim.claimDate), "PPP")}</TableCell>
                  <TableCell>{claim.workingHours} hrs</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      claim.claimStatus === ClaimStatus.Approved 
                        ? "bg-green-500 text-white" 
                        : claim.claimStatus === ClaimStatus.Rejected 
                          ? "bg-red-500 text-white" 
                          : "bg-yellow-500 text-white"
                    }`}>
                      {ClaimStatus[claim.claimStatus]}
                    </span>
                  </TableCell>
                  <TableCell>{claim.updateAt ? format(new Date(claim.updateAt), "PPP") : "N/A"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ClaimsPage;