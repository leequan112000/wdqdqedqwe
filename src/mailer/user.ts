import { createMailData, mailSender, sendMail } from './config';
import { ResetPasswordRequestData } from './types';
import { resetPasswordRequestTemplate } from './templates';

export const sendResetPasswordEmail = (
  emailData: ResetPasswordRequestData,
  receiverEmail: string,
) => {
  const mailData = createMailData({
    to: receiverEmail,
    templateId: resetPasswordRequestTemplate,
    dynamicTemplateData: emailData,
  });

  return sendMail(mailData);
};
