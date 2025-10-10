export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendVerificationEmail(
  email: string, 
  name: string, 
  code: string
): Promise<void> {
  // Implement email sending logic here
  // You can use Nodemailer, SendGrid, Resend, etc.
  console.log(`Verification code for ${email}: ${code}`);
  
  // Example with Resend (you'll need to install resend)
  /*
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  await resend.emails.send({
    from: 'your-email@domain.com',
    to: email,
    subject: 'Verify your email',
    html: `
      <h1>Verify your email</h1>
      <p>Hello ${name},</p>
      <p>Your verification code is: <strong>${code}</strong></p>
      <p>This code will expire in 10 minutes.</p>
    `
  });
  */
}