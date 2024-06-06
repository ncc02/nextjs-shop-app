import nodemailer from 'nodemailer'
import { google } from 'googleapis'

const oAuth2Client = new google.auth.OAuth2(
  process.env.MAIL_SERVICE_CLIENT_ID,
  process.env.MAIL_SERVICE_CLIENT_SECRET,
  process.env.MAIL_SERVICE_REDIRECT_URI,
)
oAuth2Client.setCredentials({ refresh_token: process.env.MAIL_SERVICE_RToken })

type EmailPayload = {
  to: string
  subject: string
  html: string
}

export const sendEmail = async (data: EmailPayload) => {
  try {
    const accessToken = (await oAuth2Client.getAccessToken()).token
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.MAIL_SERVICE_EMAIL,
        clientId: process.env.MAIL_SERVICE_CLIENT_ID,
        clientSecret: process.env.MAIL_SERVICE_CLIENT_SECRET,
        refreshToken: process.env.MAIL_SERVICE_RToken,
        accessToken: accessToken as string,
      },
    })
    await transport.sendMail({
      from: `"<${process.env.MAIL_SERVICE_EMAIL}>"`,
      ...data,
    })
  } catch (error) {
    console.log(error)
  }
}
