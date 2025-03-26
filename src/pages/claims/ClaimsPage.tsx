import { putData } from "@/api/fetchers";
import { ViewClaimRqCard } from "@/components/common/ViewClaimRqCard";
import { useClaimsByPM } from "@/features/claims/hooks/useClaims";
import { ClaimStatus } from "@/features/claims/types";
import { useState } from "react";
import useSWR from "swr";

const ClaimsPage = () => {
  const { data, isLoading, mutate } = useClaimsByPM({ status: 2 });
  const claims = data?.data;
  const [selectedClaim, setSelectedClaim] = useState<string[]>([]);
  const [isApproving, setIsApproving] = useState(false);

  console.log("Claims =", claims);
  const handleApprove = (staffId: string) => {
    console.log(`Approved claim for staff ${staffId}`);
  };

  const handleReject = (staffId: string) => {
    console.log(`Rejected claim for staff ${staffId}`);
  };

  const handleSelect = (claimId: string, checked: boolean) => {
    setSelectedClaim((prevSelected) =>
      checked ? [...prevSelected, claimId] : prevSelected.filter((id) => id !== claimId)
    );
  };

  const handleApproveSelected = async () => {
    if (selectedClaim.length === 0) return;
    setIsApproving(true);
  
    console.log("Approving claims:", selectedClaim);
  
    try {
      const response = await putData("/ClaimRequests/approve", selectedClaim);
      console.log("API response:", response);
      setSelectedClaim([]);
    } catch (error: any) {
      console.error("Error approving claims:", error.response?.data || error.message);
    } finally {
      setIsApproving(false);
      await mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Claims Dashboard</h1>
        <div className="text-center">Loading claims...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Claims Dashboard</h1>
      <div className="flex justify-end mb-4">
        <button
          onClick={handleApproveSelected}
          disabled={selectedClaim.length === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400"
        >
           {isApproving ? "Processing..." : "Approve Selected"}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {claims?.map((claim) => (
          <ViewClaimRqCard
            key={claim.claimId}
            claim={claim}
            isExtendable={claim.claimStatus === ClaimStatus.PendingApproval}
            onApprove={() => handleApprove(claim.staff.staffId)}
            onReject={() => handleReject(claim.staff.staffId)}
            onSelect={(checked) => handleSelect(claim.claimId, checked)}
          />
        ))}
      </div>
    </div>
  );
};

export default ClaimsPage;