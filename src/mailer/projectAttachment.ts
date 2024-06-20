import { createBulkSendMailJobs, createSendMailJob, createBulkEmailJobData } from "../queues/sendMail.queues";
import { contractUploadNoticeTemplate, contractUpdateNoticeTemplate, documentUploadNoticeTemplate } from "./templates";

type DocumentUploadNoticeEmailData = {
  login_url: string;
  receiver_full_name: string;
  project_title: string;
  company_name: string;
}

export const documentUploadNoticeEmail = async (emailData: DocumentUploadNoticeEmailData, receiverEmail: string) => {
  createSendMailJob({
    emailData,
    receiverEmail,
    templateId: documentUploadNoticeTemplate,
  });
}

type BulkDocumentUploadNoticeEmailData = {
  emailData: DocumentUploadNoticeEmailData;
  receiverEmail: string;
}

export const bulkDocumentUploadNoticeEmail = async (data: BulkDocumentUploadNoticeEmailData[]) => {
  const bulks = createBulkEmailJobData(data, documentUploadNoticeTemplate)
  createBulkSendMailJobs(bulks)
}

type ContractUploadNoticeEmailData = {
  login_url: string;
  receiver_full_name: string;
  project_title: string;
  company_name: string;
}

export const contractUploadNoticeEmail = async (emailData: ContractUploadNoticeEmailData, receiverEmail: string) => {
  createSendMailJob({
    emailData,
    receiverEmail,
    templateId: contractUploadNoticeTemplate,
  });
}

type BulkContractUploadNoticeEmailData = {
  emailData: ContractUploadNoticeEmailData;
  receiverEmail: string;
}

export const bulkContractUploadNoticeEmail = async (data: BulkContractUploadNoticeEmailData[]) => {
  const bulks = createBulkEmailJobData(data, contractUploadNoticeTemplate)
  createBulkSendMailJobs(bulks)
}

type ContractUpdateNoticeEmailData = {
  login_url: string;
  receiver_full_name: string;
  project_title: string;
  company_name: string;
}

export const contractUpdateNoticeEmail = async (emailData: ContractUpdateNoticeEmailData, receiverEmail: string) => {
  createSendMailJob({
    emailData,
    receiverEmail,
    templateId: contractUpdateNoticeTemplate,
  });
}

type BulkContractUpdateNoticeEmailData = {
  emailData: ContractUpdateNoticeEmailData;
  receiverEmail: string;
}

export const bulkContractUpdateNoticeEmail = async (data: BulkContractUpdateNoticeEmailData[]) => {
  const bulks = createBulkEmailJobData(data, contractUploadNoticeTemplate)
  createBulkSendMailJobs(bulks)
}

