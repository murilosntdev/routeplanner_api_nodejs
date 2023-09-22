import { smtp } from "../../configs/emailConfig.js";
import * as dotenv from "dotenv";

dotenv.config();

export const sendMail = (recipientEmail, subject, template, context) => {
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

export const hideEmail = (email) => {
    var at = email.indexOf("@");
    var username = email.substring(1, at - 1);
    var asterisk = '*'.repeat(username.length);
    var hidden = email.replace(username, asterisk);

    return (hidden);
}