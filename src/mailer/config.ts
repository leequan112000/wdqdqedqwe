import sendGridMail from '@sendgrid/mail';

sendGridMail.setApiKey(process.env.SENDGRID_API_KEY || "");

export const mailSender = process.env.MAIL_SENDER;

export const sendMail = async (mailData: any) => {
  try {
    await sendGridMail.send(mailData)
  } catch (error) {
    return error;
  }
};