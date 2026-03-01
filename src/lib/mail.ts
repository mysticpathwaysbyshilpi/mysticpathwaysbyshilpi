import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '465'),
    secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendContactEmail = async (data: {
    name: string;
    email?: string;
    phone?: string;
    countryCode?: string;
    message: string;
}) => {
    const { name, email, phone, countryCode, message } = data;

    const mailOptions = {
        from: `"Healings By Shilpi" <${process.env.EMAIL_USER}>`,
        to: 'mysticpathwaysbyshilpi@gmail.com',
        subject: `New Contact Message from ${name}`,
        html: `
            <h3>New Contact Form Submission</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email || 'Not provided'}</p>
            <p><strong>Phone:</strong> ${countryCode || ''} ${phone || 'Not provided'}</p>
            <hr />
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error };
    }
};
