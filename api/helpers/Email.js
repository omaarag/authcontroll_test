import nodemailer from 'nodemailer'

const getTransport = () => nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
})

export const emailRegister = async (data) => {
  const { email, name, token } = data
  const transport = getTransport()
  try {
    const info = await transport.sendMail({
      from: `CERAGUI <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Confirm your account',
      text: 'Confirm your account',
      html: `
      <p>Hi <strong>${name}</strong>!</p>
      <p>Thank you for registering on our website. To complete the registration process, we need you to confirm your email address by clicking on the link below:</p>
      <p><a href='${process.env.FRONTEND_URL}/confirm/${token}'>Confirm account</a></p>
      <p>If you haven't created an account on our website, please disregard this email.</p>
      <p>Thank you!</p>
      `
    })
    console.log(`Email sent: ${info.messageId}`)
  } catch (error) {
    console.log('Error. Email not sent.' + error)
  }
}

export const emailPassword = async (data) => {
  const { email, name, token } = data
  const transport = getTransport()
  try {
    const info = await transport.sendMail({
      from: `CERAGUI <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Change',
      text: 'Password Change',
      html: `
      <p>Hi <strong>${name}</strong>!</p>
      <p>We have received a request to change the password for your account on our website. To proceed with the password change, please click on the link below:</p>
      <p><a href='${process.env.FRONTEND_URL}/forgot/${token}'>Change password</a></p>
      <p>If you did not request to change your password, please ignore this email. Your current password will remain valid.</p>
      <p>Thank you!</p>
      `
    })
    console.log(`Email sent: ${info.messageId}`)
  } catch (error) {
    console.log('Error. Email not sent')
  }
}
