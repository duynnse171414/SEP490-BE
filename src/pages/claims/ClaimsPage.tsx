import { ClaimStatus, ClaimRequestDTO } from "@/features/claims/types";
import {
  useApproveClaims,
  useClaimsByPM,
  useRejectClaims,
} from "@/features/claims/hooks/useClaims";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { XCircle } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AuthGuard } from "@/guards/authGuard";

const ClaimsPage = () => {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const { data, isLoading } = useClaimsByPM({ status: 2 });
  const claims = data?.data;
  const [selectedClaim, setSelectedClaim] = useState<string[]>([]);
  const { approveSelectedClaims, isApproving } = useApproveClaims();
  const { rejectSelectedClaims, isRejecting } = useRejectClaims();
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);


  const handleSelect = (claimId: string, checked: boolean) => {
    setSelectedClaim((prevSelected) =>
      checked
        ? [...prevSelected, claimId]
        : prevSelected.filter((id) => id !== claimId)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (filteredClaims && checked) {
      setSelectedClaim(filteredClaims.map((claim) => claim.claimId));
    } else {
      setSelectedClaim([]);
    }
  };
  
  const handleApproveSelected = async () => {
    try {
      await approveSelectedClaims(selectedClaim);
      toast.success(
        `Successfully approved ${selectedClaim.length} claim(s).`
      );
      setSelectedClaim([]);
    } catch (error: any) {
      toast.error(
        `Failed to approve claims: ${error.message || "An unknown error occurred"}`
      );
    }
  };

  const handleRejectSelected = async () => {
    try {
      await rejectSelectedClaims(selectedClaim, rejectionReason);
      toast.success(
        `Successfully rejected ${selectedClaim.length} claim(s).`
      );
      setSelectedClaim([]);
      setRejectionReason("");
      setIsRejectDialogOpen(false);
    } catch (error: any) {
      toast.error(
        `Failed to reject claims: ${error.message || "An unknown error occurred"}`
      );
    }
  };

  const projects = Array.from(
    new Set(claims?.map((claim: ClaimRequestDTO) => claim.project.projectId))
  ).map(
    (projectId) =>
      claims?.find((claim) => claim.project.projectId === projectId)?.project
  );

  // Filter claims by project only
  const filteredClaims = claims?.filter((claim) => {
    const matchesProject = selectedProject
      ? claim.project.projectId === selectedProject
      : true;
    return matchesProject;
  });

  const areAllSelected =
    filteredClaims &&
    filteredClaims.length > 0 &&
    filteredClaims.every((claim) => selectedClaim.includes(claim.claimId));

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
    <AuthGuard>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Claims Dashboard
        </h1>
        <div className="flex justify-between items-center mb-4">
          <Select
            onValueChange={(value) =>
              setSelectedProject(value === "all" ? null : Number(value))
            }
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((project) => (
                <SelectItem
                  key={project?.projectId}
                  value={String(project?.projectId)}
                >
                  {project?.projectName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex space-x-2">
            <Dialog
              open={isRejectDialogOpen}
              onOpenChange={setIsRejectDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  disabled={selectedClaim.length === 0 || isRejecting}
                  className="gap-2 h-full"
                >
                  {isRejecting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4" />
                      Reject Selected ({selectedClaim.length})
                    </>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reject Claims</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                  <label
                    htmlFor="rejectionReason"
                    className="text-sm font-medium"
                  >
                    Rejection Reason
                  </label>
                  <Input
                    id="rejectionReason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Enter reason for rejection..."
                  />
                </div>
                <DialogFooter>
                  <Button
                    variant="ghost"
                    onClick={() => setIsRejectDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleRejectSelected();
                    }}
                    disabled={!rejectionReason || isRejecting}
                  >
                    {isRejecting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Rejecting...
                      </>
                    ) : (
                      "Confirm Reject"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button
              onClick={handleApproveSelected}
              disabled={selectedClaim.length === 0 || isApproving}
              className="gap-2 h-full"
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
                        onCheckedChange={(checked) =>
                          handleSelect(claim.claimId, !!checked)
                        }
                      />
                    </TableCell>
                    <TableCell>{claim.staff.staffName}</TableCell>
                    <TableCell>{claim.project.projectName}</TableCell>
                    <TableCell>
                      {format(new Date(claim.claimDate), "PPP")}
                    </TableCell>
                    <TableCell>{claim.workingHours} hrs</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${claim.claimStatus === ClaimStatus.Approved
                          ? "bg-green-500 text-white"
                          : claim.claimStatus === ClaimStatus.Rejected
                            ? "bg-red-500 text-white"
                            : "bg-yellow-500 text-white"
                          }`}
                      >
                        {ClaimStatus[claim.claimStatus]}
                      </span>
                    </TableCell>
                    <TableCell>
                      {claim.updateAt
                        ? format(new Date(claim.updateAt), "PPP")
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>{" "}
    </AuthGuard>
  );
};

export default ClaimsPage;
