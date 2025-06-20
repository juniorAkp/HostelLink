import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
} from "../helpers/emailTemplates";
import { transporter, sender } from "../config/email";

export const sendVerificationEmail = async (email:string, token:number) => {
  try {
    transporter.sendMail({
      from: sender.email,
      to: email,
      text: "Verify",
      subject: "verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", token.toString()),
    });
  } catch (error) {
    console.log("error sending mail", error);
  }
};

export const sendWelcomeEmail = async (email:string, username:string  ) => {
  try {
    transporter.sendMail({
      from: sender.email,
      to: email,
      text: "Welcome",
      subject: "Welcome to My World",
      html: WELCOME_EMAIL_TEMPLATE.replace("{userName}", username),
    });
  } catch (error) {
    console.log("error sending mail", error);
  }
};

export const sendPasswordResetEmail = async (email:string, token:number ) => {
  try {
    transporter.sendMail({
      from: sender.email,
      to: email,
      subject: "Your Password Reset Code",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetCode}", token.toString()),
    });
  } catch (error) {
    console.log("error sending password reset email:", error);
  }
};

export const sendPasswordResetSuccessEmail = async (email:string) => {
  try {
    transporter.sendMail({
      from: sender.email,
      to: email,
      subject: "Your Password Has Been Reset",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    });
    console.log("Password reset success email sent");
  } catch (error) {
    console.log("Error sending success email:", error);
  }
};
