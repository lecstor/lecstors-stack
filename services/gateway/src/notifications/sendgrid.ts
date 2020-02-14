// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
import sgMail from "@sendgrid/mail";
import config from "@lecstor/config";

sgMail.setApiKey(config.notifications.sendgrid.apiKey);

type Message = {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html: string;
};

export function sendMail(message: Message) {
  sgMail.send(message);
}
