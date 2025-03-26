import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Clock, User, Briefcase, Calendar, CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { ClaimRequestDTO, ClaimStatus } from "@/features/claims/types";
import { Checkbox } from "@/components/ui/checkbox";

interface ViewClaimRqCardProps {
    claim: ClaimRequestDTO;
    className?: string;
    isExtendable?: boolean;
    onApprove?: () => void;
    onReject?: () => void;
    onSelect?: (checked: boolean) => void;
}

const statusConfig = {
    [ClaimStatus.Draft]: { color: "bg-gray-100 text-gray-700" },
    [ClaimStatus.PendingApproval]: { color: "bg-yellow-100 text-yellow-700" },
    [ClaimStatus.Approved]: { color: "bg-green-100 text-green-700" },
    [ClaimStatus.Paid]: { color: "bg-blue-100 text-blue-700" },
    [ClaimStatus.Rejected]: { color: "bg-red-100 text-red-700" },
    [ClaimStatus.Cancelled]: { color: "bg-slate-100 text-slate-700" },
};

export const ViewClaimRqCard = ({
    claim,
    className,
    isExtendable = false,
    onApprove,
    onReject,
    onSelect,
}: ViewClaimRqCardProps) => {
    return (
        <Card className={cn("w-full max-w-xs", className)}>
            <CardHeader className="text-center">
                <div className="flex justify-center items-center gap-4 text-muted-foreground">
                    <div className="px-4 pt-4">
                        <Checkbox onCheckedChange={(checked) => onSelect?.(!!checked)} />
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">
                            {format(new Date(claim.claimDate), "PPP")}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">{claim.workingHours} hours</span>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Status Badge */}
                <div className="flex justify-center items-center gap-2">
                    <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium",
                        statusConfig[claim.claimStatus].color
                    )}>
                        {ClaimStatus[claim.claimStatus]}
                    </span>
                </div>

                {/* Staff Info */}
                <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">{claim.staff.staffName}</span>
                        <span className="text-xs text-muted-foreground">{claim.staff.staffId}</span>
                    </div>
                </div>

                {/* Project Info */}
                <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{claim.project.projectName}</span>
                </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-1 text-xs text-muted-foreground text-left">
                {claim.approvedByUser && claim.approvedAt && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className="cursor-help">
                                    Approved by {claim.approvedByUser.staffName}
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Approved: {format(new Date(claim.approvedAt), "PPP 'at' p")}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
                {claim.rejectedByUser && claim.rejectAt && (
                    <div className="text-red-600">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="cursor-help">
                                        Rejected by {claim.rejectedByUser.staffName}
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Rejected: {format(new Date(claim.rejectAt), "PPP 'at' p")}</p>
                                    {claim.rejectionReason && (
                                        <p>Reason: {claim.rejectionReason}</p>
                                    )}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                )}
                {claim.updateAt && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className="cursor-help">
                                    Last updated {format(new Date(claim.updateAt), "PPP 'at' p")}
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{format(new Date(claim.updateAt), "PPP 'at' p")}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </CardFooter>

            {isExtendable && (
                <div className="-mb-6 mt-2">
                    <div className="grid grid-cols-2 gap-px bg-muted">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="w-full rounded-b-sm bg-card border-t hover:bg-red-50 text-red-600 hover:text-red-700 h-12 text-sm font-medium transition-colors"
                                        onClick={onReject}
                                    >
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Reject
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">
                                    <p>Reject Claim</p>
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="w-full rounded-b-sm bg-card border-t hover:bg-green-50 text-green-600 hover:text-green-700 h-12 text-sm font-medium transition-colors"
                                        onClick={onApprove}
                                    >
                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                        Approve
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">
                                    <p>Approve Claim</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            )}
        </Card>
    );
};
