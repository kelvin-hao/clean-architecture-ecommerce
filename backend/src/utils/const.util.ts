export const ACCESS_TOKEN_EXPRIRE_IN = '2m'
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
  PAYMENT: 'payment',
  NOTIFICATION: 'notification',
  USER_NOTIFICATION: 'user_notification',
  DISCOUNT: 'discount'
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

<body style="margin:0;padding:0;background-color:#eef2ff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0f172a;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;visibility:hidden;">
    Your secure verification code is ready. It expires in 5 minutes.
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(180deg,#eef2ff 0%,#f8fafc 100%);padding:32px 12px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 18px 50px rgba(15,23,42,0.12);">
          <tr>
            <td style="background:linear-gradient(135deg,#312e81 0%,#4f46e5 45%,#2563eb 100%);padding:32px 28px;color:#ffffff;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="display:inline-block;padding:6px 12px;border-radius:999px;background:rgba(255,255,255,0.14);font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">
                      YourShop Security
                    </div>
                    <h1 style="margin:16px 0 8px;font-size:30px;line-height:1.25;font-weight:800;">Verify your login</h1>
                    <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(255,255,255,0.88);">
                      Use the one-time code below to safely complete your sign in.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 28px;">
              <p style="margin:0 0 14px;font-size:15px;line-height:1.7;color:#334155;">Hi there,</p>
              <p style="margin:0 0 22px;font-size:15px;line-height:1.8;color:#475569;">
                We detected a login attempt for your account. Enter this verification code to continue.
                The code will expire in <strong style="color:#1e293b;">5 minutes</strong>.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                <tr>
                  <td align="center" style="padding:22px;border-radius:18px;background:linear-gradient(180deg,#eef2ff 0%,#f8fbff 100%);border:1px solid #c7d2fe;">
                    <div style="font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#6366f1;margin-bottom:10px;">
                      Verification code
                    </div>
                    <div style="display:inline-block;padding:14px 22px;border-radius:14px;background:#ffffff;border:1px dashed #818cf8;font-size:30px;font-weight:800;letter-spacing:8px;color:#312e81;box-shadow:0 8px 20px rgba(79,70,229,0.12);">
                      {{verification_code}}
                    </div>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 22px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;">
                <tr>
                  <td style="padding:16px 18px;">
                    <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#0f172a;">Security tips</p>
                    <p style="margin:0 0 6px;font-size:13px;color:#475569;line-height:1.7;">• Never share this code with anyone.</p>
                    <p style="margin:0 0 6px;font-size:13px;color:#475569;line-height:1.7;">• Our team will never ask for your OTP by email or phone.</p>
                    <p style="margin:0;font-size:13px;color:#475569;line-height:1.7;">• If this wasn't you, simply ignore this email and change your password.</p>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:14px;line-height:1.8;color:#475569;">
                Thanks,<br />
                <strong style="color:#0f172a;">The YourShop Team</strong>
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 28px;background:#0f172a;text-align:center;">
              <p style="margin:0 0 6px;font-size:12px;color:#cbd5e1;">© 2026 YourShop. All rights reserved.</p>
              <p style="margin:0;font-size:12px;color:#94a3b8;">
                Need help? <a href="mailto:huynhnhathao0609@gmail.com" style="color:#93c5fd;text-decoration:none;">huynhnhathao0609@gmail.com</a>
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
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Your Password</title>
</head>

<body style="margin:0;padding:0;background-color:#fff7ed;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0f172a;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;visibility:hidden;">
    Reset your password securely. This link will expire in 15 minutes.
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(180deg,#fff7ed 0%,#f8fafc 100%);padding:32px 12px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 18px 50px rgba(15,23,42,0.12);">
          <tr>
            <td style="background:linear-gradient(135deg,#b91c1c 0%,#ea580c 50%,#f97316 100%);padding:32px 28px;color:#ffffff;">
              <div style="display:inline-block;padding:6px 12px;border-radius:999px;background:rgba(255,255,255,0.14);font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">
                YourShop Account Recovery
              </div>
              <h1 style="margin:16px 0 8px;font-size:30px;line-height:1.25;font-weight:800;">Reset your password</h1>
              <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(255,255,255,0.9);">
                We received a request to secure your account with a new password.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 28px;">
              <p style="margin:0 0 14px;font-size:15px;line-height:1.7;color:#334155;">Hi there,</p>
              <p style="margin:0 0 22px;font-size:15px;line-height:1.8;color:#475569;">
                Click the button below to create a new password for your account. For your security,
                this reset link will expire in <strong style="color:#0f172a;">15 minutes</strong>.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                <tr>
                  <td align="center" style="padding:10px 0 4px;">
                    <a href="{{reset_url}}" style="display:inline-block;padding:14px 30px;border-radius:14px;background:linear-gradient(135deg,#dc2626 0%,#f97316 100%);color:#ffffff;font-size:16px;font-weight:700;text-decoration:none;box-shadow:0 10px 24px rgba(234,88,12,0.28);">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 22px;background:#fff7ed;border:1px solid #fdba74;border-radius:16px;">
                <tr>
                  <td style="padding:16px 18px;">
                    <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#9a3412;">Please note</p>
                    <p style="margin:0 0 6px;font-size:13px;color:#7c2d12;line-height:1.7;">• If you did not request a password reset, you can ignore this email.</p>
                    <p style="margin:0 0 6px;font-size:13px;color:#7c2d12;line-height:1.7;">• Your current password will remain unchanged until a new one is saved.</p>
                    <p style="margin:0;font-size:13px;color:#7c2d12;line-height:1.7;">• For safety, use a strong password you haven’t used before.</p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;">Alternative link</p>
              <p style="margin:0 0 22px;word-break:break-all;font-size:13px;line-height:1.7;color:#2563eb;">
                {{reset_url}}
              </p>

              <p style="margin:0;font-size:14px;line-height:1.8;color:#475569;">
                Stay secure,<br />
                <strong style="color:#0f172a;">The YourShop Team</strong>
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 28px;background:#0f172a;text-align:center;">
              <p style="margin:0 0 6px;font-size:12px;color:#cbd5e1;">© 2026 YourShop. All rights reserved.</p>
              <p style="margin:0;font-size:12px;color:#94a3b8;">
                Need help? <a href="mailto:support@huynhnhathao.com" style="color:#fdba74;text-decoration:none;">support@huynhnhathao.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
