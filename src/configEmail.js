import * as nodemailer from "nodemailer";
import * as dotenv from "dotenv"
import hbs from "nodemailer-express-handlebars";
import path from "path";

dotenv.config();

export const smtp = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    secure: process.env.NODEMAILER_SECURE,
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS
    }
});

const handlebarsOptions = {
    viewEngine: {
        extName: ".html",
        partialsDir: path.resolve('./views'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./views'),
    extName: ".handlebars",
}

smtp.use('compile', hbs(handlebarsOptions));