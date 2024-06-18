import type { Attachment } from "@sendgrid/helpers/classes";
import { createQueue } from "../helper/queue";
import { createMailData, sendMail } from "../mailer/config";

type SendMailJob<T = { [x: string]: any; }> = {
  emailData: T;
  templateId: string;
  receiverEmail: string;
  attachments?: Attachment[];
};

const emailQueue = createQueue<SendMailJob>("email");

emailQueue.process(async (job, done) => {
  const { emailData, receiverEmail, templateId } = job.data;

  try {
    const mailData = createMailData({
      to: receiverEmail,
      templateId,
      dynamicTemplateData: emailData,
    });

    const result = await sendMail(mailData);
    done(null, result);
  } catch (error) {
    if (error instanceof Error) {
      done(error);
    }
  }
});

export const createSendMailJob = (job: SendMailJob) => {
  return emailQueue.add(job);
};

export const createBulkSendMailJobs = (jobs: SendMailJob[]) => {
  const bulks = jobs.map((j) => ({ data: j }));
  return emailQueue.addBulk(bulks);
};

export type BulkEmailJobData<T> = {
  emailData: T,
  receiverEmail: string;
  attachments?: Attachment[];
}[]

export function createBulkEmailJobData<T extends any = { [x: string]: any; }>(
  data: BulkEmailJobData<T>,
  templateId: string
): SendMailJob<T>[] {
  return data.map((d) => ({ templateId, ...d }));
}
