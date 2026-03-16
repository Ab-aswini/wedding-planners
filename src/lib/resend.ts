import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendWelcomeEmail(email: string, orgName: string) {
  return resend.emails.send({
    from: 'InviteForge <noreply@inviteforge.com>',
    to: email,
    subject: `Welcome to InviteForge, ${orgName}!`,
    html: `
      <h1>Welcome to InviteForge!</h1>
      <p>Your organization <strong>${orgName}</strong> has been created.</p>
      <p>Start creating beautiful wedding invitations today.</p>
    `,
  })
}

export async function sendRSVPNotification(
  email: string,
  guestName: string,
  inviteSlug: string,
  attending: boolean
) {
  return resend.emails.send({
    from: 'InviteForge <noreply@inviteforge.com>',
    to: email,
    subject: `New RSVP: ${guestName} ${attending ? 'is attending' : 'declined'}`,
    html: `
      <h2>New RSVP Received</h2>
      <p><strong>${guestName}</strong> has ${attending ? 'confirmed attendance' : 'declined the invitation'}.</p>
      <p>View all RSVPs in your <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/invites">dashboard</a>.</p>
    `,
  })
}
