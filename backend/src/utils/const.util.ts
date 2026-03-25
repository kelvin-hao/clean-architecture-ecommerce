export const ACCESS_TOKEN_EXPRIRE_IN = '15m'
export const REFRESH_TOKEN_EXPRIRE_IN = '7d'

export const MORGAN_FORMAT = 'dev'

export const CONTEXT = {
  ERROR: 'ERROR RESPONSE',
  SUSSESS: 'SUCCESS RESPONSE',
  REQUEST: 'NEW REQUEST'
}

export const DATABASE_DOCUMENT = {
  VENDOR: 'vendor',
  CATEGORY: 'category',
  USER: 'user',
  PRODUCT_SPU: 'product_spu',
  PRODUCT_SKU: 'product_sku',
  PERMISSION: 'permission',
  ROLE: 'role',
  ORDER: 'order',
  INVENTORY: 'inventory',
  PAYMENT: 'payment'
}

export const MAX_LEVEL_CATEGORY = 5

export const BYTE_UNIT = 1024

export const SEVEN_DAYS_IN_SECONDS = 7 * 24 * 60 * 60

export const ONE_DAYS_IN_SECONDS = 24 * 60 * 60

export const FIVE_MINUTES_IN_SECONDS = 5 * 60

export const FIFTEN_MINUTES_IN_SECONDS = 15 * 60

export const ONE_MINUTES_IN_SECONDS = 60

export const DEFAULT_AVATAR =
  'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg'

export const EMAIL_TEMPLATE_TWO_STEP_VERIFICATION = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify Your Login</title>
</head>

<body style="margin:0;padding:0;background-color:#f5f7fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f7fb;padding:20px 0;">
    <tr>
      <td align="center">

        <!-- Container -->
        <table width="100%" max-width="600px" cellpadding="0" cellspacing="0"
          style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#4f46e5,#3b82f6);padding:24px;text-align:center;color:#fff;">
              <h1 style="margin:0;font-size:22px;font-weight:600;">🔐 Two-Step Verification</h1>
              <p style="margin:6px 0 0;font-size:14px;opacity:0.9;">
                Secure login confirmation
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px 24px;">

              <p style="margin:0 0 16px;color:#333;font-size:15px;">
                Hi there,
              </p>

              <p style="margin:0 0 20px;color:#555;font-size:15px;line-height:1.6;">
                Use the verification code below to complete your login. This code is valid for
                <strong>10 minutes</strong>.
              </p>

              <!-- Code Box -->
              <div style="text-align:center;margin:30px 0;">
                <span style="
                  display:inline-block;
                  font-size:28px;
                  letter-spacing:6px;
                  font-weight:700;
                  padding:14px 24px;
                  border-radius:10px;
                  background:#f1f5ff;
                  color:#4f46e5;
                  border:1px dashed #c7d2fe;
                ">
                  {{verification_code}}
                </span>
              </div>

              <p style="margin:0 0 20px;color:#666;font-size:14px;line-height:1.6;">
                If you didn’t request this code, you can safely ignore this email. Someone else may have tried to access your account.
              </p>

              <p style="margin:0;color:#333;font-size:14px;">
                Best regards,<br />
                <strong>Your Company Team</strong>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px;text-align:center;background:#f9fafb;font-size:12px;color:#888;">
              <p style="margin:0;">© 2026 Your Company. All rights reserved.</p>
              <p style="margin:6px 0 0;">
                Contact us:
                <a href="mailto:huynhnhathao0609@gmail.com" style="color:#4f46e5;text-decoration:none;">
                  huynhnhathao0609@gmail.com
                </a>
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`

export const EMAIL_TEMPLATE_RESET_PASSWORD = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Reset Your Password</title>
</head>

<body style="margin:0;padding:0;background-color:#f5f7fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f7fb;padding:20px 0;">
    <tr>
      <td align="center">

        <!-- Container -->
        <table width="100%" max-width="600px" cellpadding="0" cellspacing="0"
          style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#ef4444,#f97316);padding:24px;text-align:center;color:#fff;">
              <h1 style="margin:0;font-size:22px;font-weight:600;">🔑 Reset Your Password</h1>
              <p style="margin:6px 0 0;font-size:14px;opacity:0.9;">
                Secure your account access
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px 24px;text-align:left;">

              <p style="margin:0 0 16px;color:#333;font-size:15px;">
                Hi there,
              </p>

              <p style="margin:0 0 20px;color:#555;font-size:15px;line-height:1.6;">
                We received a request to reset your password. Click the button below to create a new one.
              </p>

              <!-- Button -->
              <div style="text-align:center;margin:30px 0;">
                <a href="{{reset_url}}"
                  style="
                    display:inline-block;
                    padding:14px 28px;
                    font-size:16px;
                    font-weight:600;
                    color:#ffffff;
                    background:linear-gradient(135deg,#ef4444,#f97316);
                    border-radius:10px;
                    text-decoration:none;
                    box-shadow:0 6px 16px rgba(239,68,68,0.3);
                  ">
                  Reset Password
                </a>
              </div>

              <p style="margin:0 0 16px;color:#666;font-size:14px;line-height:1.6;">
                This link will expire in <strong>15 minutes</strong> for security reasons.
              </p>

              <p style="margin:0 0 20px;color:#666;font-size:14px;line-height:1.6;">
                If you didn’t request this, you can safely ignore this email. Your password will remain unchanged.
              </p>

              <!-- Fallback URL -->
              <p style="margin:0 0 10px;color:#999;font-size:12px;">
                Or copy and paste this URL into your browser:
              </p>
              <p style="word-break:break-all;color:#4f46e5;font-size:12px;">
                {{reset_url}}
              </p>

              <p style="margin-top:24px;color:#333;font-size:14px;">
                Best regards,<br />
                <strong>Your Company Team</strong>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px;text-align:center;background:#f9fafb;font-size:12px;color:#888;">
              <p style="margin:0;">© 2026 Your Company. All rights reserved.</p>
              <p style="margin:6px 0 0;">
                Need help?
                <a href="mailto:support@huynhnhathao.com" style="color:#ef4444;text-decoration:none;">
                  support@huynhnhathao.com
                </a>
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`
