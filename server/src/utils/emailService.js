import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Verification - EatClub',
    html: `
      <h2>Email Verification</h2>
      <p>Please click the link below to verify your email:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>This link expires in 24 hours.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset OTP - EatClub',
    html: `
      <h2>Password Reset</h2>
      <p>Your OTP for password reset is:</p>
      <h3>${otp}</h3>
      <p>This OTP expires in 10 minutes.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendDeliveryBoyCredentials = async (email, password, name) => {
  const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to EatClub - Delivery Partner Credentials',
    html: `
      <h2>Welcome to EatClub, ${name}!</h2>
      <p>You have been registered as a Delivery Partner. Please use the following credentials to login:</p>
      <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
        <p style="margin: 5px 0;"><strong>Password:</strong> ${password}</p>
      </div>
      <p><strong>Login URL:</strong> <a href="${loginUrl}">${loginUrl}</a></p>
      <p style="color: #666; font-size: 14px;">Please change your password after first login for security.</p>
      <hr style="margin: 20px 0;" />
      <p style="color: #999; font-size: 12px;">If you did not request this account, please contact support immediately.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendAdminEmailVerification = async (code) => {
  const adminEmail = process.env.ADMIN_VERIFICATION_EMAIL || 'vivekjangam73@gmail.com';
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: adminEmail,
    subject: 'Admin Email Change Verification - EatClub',
    html: `
      <h2>Admin Email Change Verification</h2>
      <p>A request has been made to change the admin email address.</p>
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
        <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">Your verification code is:</p>
        <h1 style="margin: 0; color: #667eea; font-size: 36px; letter-spacing: 8px;">${code}</h1>
      </div>
      <p style="color: #666;">This code expires in 10 minutes.</p>
      <hr style="margin: 20px 0;" />
      <p style="color: #999; font-size: 12px;">If you did not request this change, please ignore this email.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
