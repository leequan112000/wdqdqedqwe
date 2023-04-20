import sendGridMail, { MailDataRequired } from '@sendgrid/mail';

sendGridMail.setApiKey(process.env.SENDGRID_API_KEY || "");

export const mailSender = process.env.MAIL_SENDER;

type RemoveFromField<Type> = {
  [Property in keyof Type as Exclude<Property, "from">]: Type[Property];
};

export const createMailData = (mailData: RemoveFromField<MailDataRequired>): MailDataRequired => ({
  replyTo: mailSender,
  ...mailData,
  from: `Cromatic <${mailSender}>`,
});

export const sendMail = async (mailData: MailDataRequired) => {
  try {
    return await sendGridMail.send(mailData)
  } catch (error) {
    return error;
  }
};
