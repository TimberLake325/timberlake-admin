import nodemailer from 'nodemailer';
import { getSMTPConfig, SMTPConfig } from './configService';

export async function sendEmail({ to, subject, text, html }: { to: string | string[], subject: string, text?: string, html?: string }) {
    const configResponse = await getSMTPConfig();

    if (!configResponse.success || !configResponse.data) {
        console.error("Email service error: SMTP configuration missing or invalid.");
        return { success: false, message: "SMTP configuration missing" };
    }

    const { host, port, secure, auth, from } = configResponse.data as SMTPConfig;

    const transporter = nodemailer.createTransport({
        host,
        port: Number(port),
        secure: !!secure,
        auth: {
            user: auth?.user,
            pass: auth?.pass,
        },
    });

    try {
        await transporter.sendMail({
            from: from || auth?.user,
            to: Array.isArray(to) ? to.join(',') : to,
            subject,
            text,
            html,
        });
        return { success: true, message: "Email sent successfully" };
    } catch (error) {
        console.error("Nodemailer error:", error);
        return { success: false, message: "Failed to send email" };
    }
}
