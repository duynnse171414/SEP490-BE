import { ViewClaimRqCard } from "@/components/common/ViewClaimRqCard";
import { ClaimRequestDTO } from "@/features/claims/types";
import { useApproveClaims, useClaimsByPM } from "@/features/claims/hooks/useClaims";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ClaimsPage = () => {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const { data, isLoading } = useClaimsByPM({ status: 2 });
  const claims = data?.data;
  const [selectedClaim, setSelectedClaim] = useState<string[]>([]);
  const { approveSelectedClaims, isApproving } = useApproveClaims();

  const handleApproveSelected = () => {
    approveSelectedClaims(selectedClaim);
    setSelectedClaim([]);
  };

  const projects = Array.from(
    new Set(claims?.map((claim: ClaimRequestDTO) => claim.project.projectId))
  ).map((projectId) =>
    claims?.find((claim) => claim.project.projectId === projectId)?.project
  );

  const filteredClaims = selectedProject
    ? claims?.filter((claim) => claim.project.projectId === selectedProject)
    : claims;

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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredClaims?.map((claim) => (
          <ViewClaimRqCard 
          key={claim.claimId} 
          claim={claim}
          />
        ))}
      </div>
    </div>
  );
};

export default ClaimsPage;
