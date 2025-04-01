import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Clock, User, Briefcase, Calendar } from "lucide-react";
import { format } from "date-fns";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { ClaimRequestDTO, ClaimStatus } from "@/features/claims/types";

interface ViewClaimRqCardProps {
    claim: ClaimRequestDTO;
    className?: string;
    onSelect?: (checked: boolean) => void;
    selected?: boolean;
}

export const ViewClaimRqCard = ({
    claim,
    className,
    onSelect,
    selected = false,
}: ViewClaimRqCardProps) => {
    return (
        <Card
            className={cn(
                "w-full max-w-xs transition-colors relative overflow-hidden",
                className,
                selected ? "ring-1 ring-primary bg-primary/5" : "hover:ring-1 hover:ring-primary/30",
                "ring-inset"
            )}
            onClick={() => onSelect?.(!selected)}
        >
            <CardHeader className="text-center">
                <div className="flex justify-center items-center gap-4 text-muted-foreground">
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
                        claim.claimStatus === ClaimStatus.Approved ? "bg-green-500 text-white" :
                            claim.claimStatus === ClaimStatus.Rejected ? "bg-red-500 text-white" :
                                "bg-yellow-500 text-white"
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
        </Card>
    );
};
