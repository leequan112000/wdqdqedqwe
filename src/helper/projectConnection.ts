import { Milestone, ProjectConnection, Quote } from "@prisma/client";
import { MilestoneStatus, ProjectConnectionCollaborationStatus, QuoteStatus } from "./constant";

export const filterByCollaborationStatus = (
  data: (ProjectConnection & { quotes?: (Quote & { milestones: Milestone[] })[] })[],
  status: ProjectConnectionCollaborationStatus
) => {
  return data.filter((pc) => {
    const pendingDecisionQuotes = pc?.quotes?.filter((q) => q.status === QuoteStatus.PENDING_DECISION) || [];
    const acceptedOngoingQuotes = pc?.quotes?.filter((q) => {
      const onGoingMilestones = q.milestones.filter((m) => m.status !== MilestoneStatus.COMPLETED);
      const isOngoing = onGoingMilestones.length > 0;
      return q.status === QuoteStatus.ACCEPTED && isOngoing;
    }) || [];
    const acceptedCompletedQuotes = pc?.quotes?.filter((q) => {
      const onGoingMilestones = q.milestones.filter((m) => m.status !== MilestoneStatus.COMPLETED);
      const isCompleted = onGoingMilestones.length === 0;
      return q.status === QuoteStatus.ACCEPTED && isCompleted;
    }) || [];

    if (status === ProjectConnectionCollaborationStatus.COMPLETED) {
      return pendingDecisionQuotes.length === 0 && acceptedOngoingQuotes.length === 0 && acceptedCompletedQuotes.length > 0;
    }
    if (status === ProjectConnectionCollaborationStatus.ONGOING) {
      return acceptedOngoingQuotes.length > 0 || (pendingDecisionQuotes.length >= 0 && acceptedCompletedQuotes.length === 0) || (acceptedCompletedQuotes.length > 0 && pendingDecisionQuotes.length > 0)
    }
    return false;
  })
}
