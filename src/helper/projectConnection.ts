import { Milestone, ProjectConnection, ProjectRequest, Quote } from "@prisma/client";
import { MilestoneStatus, ProjectConnectionCollaborationStatus, QuoteStatus } from "./constant";

export type ProjectConnectionWithProjectRequestQuoteMilestone = ProjectConnection & { project_request: ProjectRequest; quotes: (Quote & { milestones: Milestone[] })[] }
export type ProjectConnectionWithQuoteMilestone = ProjectConnection & { quotes: (Quote & { milestones: Milestone[] })[] }

export const checkProjectConnectionByCollaborationStatus = (
  data: ProjectConnectionWithQuoteMilestone | ProjectConnectionWithProjectRequestQuoteMilestone,
  status: ProjectConnectionCollaborationStatus
) => {
  const pendingDecisionQuotes = data?.quotes?.filter((q) => q.status === QuoteStatus.PENDING_DECISION) || [];
  const acceptedOngoingQuotes = data?.quotes?.filter((q) => {
    const onGoingMilestones = q.milestones.filter((m) => m.status !== MilestoneStatus.COMPLETED);
    const isOngoing = onGoingMilestones.length > 0;
    return q.status === QuoteStatus.ACCEPTED && isOngoing;
  }) || [];
  const acceptedCompletedQuotes = data?.quotes?.filter((q) => {
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
}

export const filterByCollaborationStatus = <T extends ProjectConnectionWithQuoteMilestone[] | ProjectConnectionWithProjectRequestQuoteMilestone[]>(
  data: T,
  status: ProjectConnectionCollaborationStatus
) => {
  return data.filter((pc) => checkProjectConnectionByCollaborationStatus(pc, status)) as T
}
