import { smtp } from "../../src/configEmail.js";
import * as dotenv from "dotenv";

dotenv.config();

export const sendMail = (recipientEmail, subject, template, recipientName, token, context) => {
    const configEmail = {
        from: `RoutePlanner <${process.env.NODEMAILER_HOST}>`,
        to: [recipientEmail],
        subject: subject,
        template: template,
        context: context
    };

    return new Promise((response) => {
        smtp.sendMail(configEmail).then(res => {
            response(res);
            smtp.close();
        }).catch(error => {
            const errorContent = {};
            errorContent.emailError = error;
            smtp.close();
            response(errorContent);
        });
    });
}