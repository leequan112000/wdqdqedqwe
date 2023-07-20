import { Milestone, ProjectConnection, ProjectRequest, Quote } from "@prisma/client";
import { MilestonePaymentStatus, ProjectConnectionCollaborationStatus, QuoteStatus } from "./constant";

export type ProjectConnectionWithProjectRequestQuoteMilestone = ProjectConnection & { project_request: ProjectRequest; quotes: (Quote & { milestones: Milestone[] })[] }
export type ProjectConnectionWithQuoteMilestone = ProjectConnection & { quotes: (Quote & { milestones: Milestone[] })[] }

function filterOngoingMilestones(milestones: Milestone[]) {
  return milestones.filter((m) =>
    m.payment_status !== MilestonePaymentStatus.PAID
    || m.vendor_payment_status !== MilestonePaymentStatus.PAID
  );
}

export const checkProjectConnectionByCollaborationStatus = (
  data: ProjectConnectionWithQuoteMilestone | ProjectConnectionWithProjectRequestQuoteMilestone,
  status: ProjectConnectionCollaborationStatus
) => {
  const now = new Date();
  // Pending quote: pending for biotech decision and not expired
  const pendingDecisionQuotes = data?.quotes?.filter((q) =>
    (q.expired_at && now < q.expired_at) && q.status === QuoteStatus.PENDING_DECISION
  ) || [];
  // Ongoing quote: accepted and has ongoing milestones
  const acceptedOngoingQuotes = data?.quotes?.filter((q) => {
    const onGoingMilestones = filterOngoingMilestones(q.milestones);
    const isOngoing = onGoingMilestones.length > 0;
    return q.status === QuoteStatus.ACCEPTED && isOngoing;
  }) || [];
  // Completed quote: all the accepted quotes has no ongoing milestones
  const acceptedCompletedQuotes = data?.quotes?.filter((q) => {
    const onGoingMilestones = filterOngoingMilestones(q.milestones);
    const isCompleted = onGoingMilestones.length === 0;
    return q.status === QuoteStatus.ACCEPTED && isCompleted;
  }) || [];

  /**
   * Consider completed if:
   *  - no pending decision quotes and
   *  - no ongoing quotes and
   *  - at least 1 completed quote
   */
  if (status === ProjectConnectionCollaborationStatus.COMPLETED) {
    return pendingDecisionQuotes.length === 0 && acceptedOngoingQuotes.length === 0 && acceptedCompletedQuotes.length > 0;
  }

  /**
   * Consider ongoing if:
   *  - at least 1 ongoing quotes or
   *  - never accept any quotes (no accepted quotes but has any pending decision quote) or
   *  - completed all quotes but has pending decision quotes
   */
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
