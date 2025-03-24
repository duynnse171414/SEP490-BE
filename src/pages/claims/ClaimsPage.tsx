import { ViewClaimRqCard } from "@/components/common/ViewClaimRqCard";
import { useClaimsByPM } from "@/features/claims/hooks/useClaims";
import { ClaimStatus } from "@/features/claims/types";

const ClaimsPage = () => {
  const { data, isLoading } = useClaimsByPM({ status: 1 });
  const claims = data?.data;
  console.log("Claims =", claims);
  const handleApprove = (staffId: string) => {
    console.log(`Approved claim for staff ${staffId}`);
  };

  const handleReject = (staffId: string) => {
    console.log(`Rejected claim for staff ${staffId}`);
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
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {claims?.map((claim) => (
          <ViewClaimRqCard
            key={claim.staff.staffId}
            claim={claim}
            isExtendable={claim.claimStatus === ClaimStatus.PendingApproval}
            onApprove={() => handleApprove(claim.staff.staffId)}
            onReject={() => handleReject(claim.staff.staffId)}
          />
        ))}
      </div>
    </div>
  );
};

export default ClaimsPage;