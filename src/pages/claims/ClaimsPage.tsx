import { ViewClaimRqCard } from "@/components/common/ViewClaimRqCard";
import { useApproveClaims, useClaimsByPM } from "@/features/claims/hooks/useClaims";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";

const ClaimsPage = () => {
  const { data, isLoading, mutate } = useClaimsByPM({ status: 2 });
  const claims = data?.data;
  const [selectedClaim, setSelectedClaim] = useState<string[]>([]);
  const { approveSelectedClaims, isApproving } = useApproveClaims();

  const handleSelect = (claimId: string, checked: boolean) => {
    setSelectedClaim((prevSelected) =>
      checked ? [...prevSelected, claimId] : prevSelected.filter((id) => id !== claimId)
    );
  };

  const handleApproveSelected = () => {
    approveSelectedClaims(selectedClaim);
    setSelectedClaim([]);
  };

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
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {claims?.map((claim) => (
          <ViewClaimRqCard
            key={claim.claimId}
            claim={claim}
            selected={selectedClaim.includes(claim.claimId)}
            onSelect={(checked) => handleSelect(claim.claimId, checked)}
          />
        ))}
      </div>
    </div>
  );
};

export default ClaimsPage;
