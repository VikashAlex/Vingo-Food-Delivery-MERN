import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config();
const transporter = nodemailer.createTransport({
    service: "Gmail",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
    },
});

export const SendEmail = async (userEmail, otp) => {
    await transporter.sendMail({
        from: process.env.EMAIL,
        to: userEmail,
        subject: "Reset Your Vingo Account Password ✔",
        html: `<div style='font-family:Arial; padding:20px;'><h2>Vingo OTP</h2><p>Your OTP for Password Reset is:</p><h3 style='background:#f3f3f3;padding:10px;border-radius:6px;display:inline-block;'>${otp}</h3><p>This OTP is valid for 5 minutes.</p><p>If you didn't request this, ignore the email.</p></div>`
    })
}

export const SendDeliveryEmail = async (user, otp) => {
    await transporter.sendMail({
        from: process.env.EMAIL,
        to: user.email,
        subject: "Your Delivery OTP – Vingo",
        html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Vingo Delivery Verification</h2>
            <p>Hello ${user.fullName || "Customer"},</p>
            <p>Your OTP for confirming the delivery of your order is:</p>

            <h3 style="
                background: #f3f3f3;
                padding: 10px 15px;
                border-radius: 6px;
                display: inline-block;
                letter-spacing: 2px;
            ">
                ${otp}
            </h3>

            <p>This OTP is valid for <b>5 minutes</b>.</p>
            <p>Please share this OTP with the delivery partner only after receiving your order.</p>

            <p style="color: #777; font-size: 13px;">
                If you did not place this order, please ignore this email.
            </p>

            <p>Thank you,<br><b>Team Vingo</b></p>
        </div>
        `
    });
};
