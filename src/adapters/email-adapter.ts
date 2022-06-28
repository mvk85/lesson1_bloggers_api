import nodemailer from 'nodemailer';

const emailAddress = process.env.emailAddressApp;
const emailPassword = process.env.emailPasswordApp;

export class EmailAtapter {
    async sendEmail(
        email: string, 
        subject: string, 
        message: string,
        title?: string
        ) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: emailAddress,
                pass: emailPassword,
            },
        });

        const info = await transporter.sendMail({
            from: `"${title}" ${emailAddress}`, // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            html: message, // html body
        });

        return info;
    }
}