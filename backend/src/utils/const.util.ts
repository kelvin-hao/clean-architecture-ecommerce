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
  ORDER: 'order'
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
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 50px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .email-header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #ddd;
        }
        .email-header h1 {
            margin: 0;
            color: #333;
        }
        .email-body {
            padding: 20px;
        }
        .email-body p {
            color: #555;
            line-height: 1.6;
        }
        .verification-code {
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            background-color: #f9f9f9;
            padding: 10px;
            border-radius: 4px;
            margin: 20px 0;
            color: #007bff;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>Two-Step Verification</h1>
        </div>
        <div class="email-body">
            <p>Thank you for securing your account. Please use the following verification code to complete the login process:</p>
            <div class="verification-code">{{verification_code}}</div>
            <p>If you did not request this, please ignore this email. The code will expire in 10 minutes.</p>
            <p>Best regards,</p>
            <p>&copy; 2025. All rights reserved.</p>
            <p>Contact with us: <a href="mailto:huynhnhathao0609@gmail.com">huynhnhathao0609@gmail.com</a></p>
        </div>
    </div>
</body>
</html>
`

export const EMAIL_TEMPLATE_RESET_PASSWORD = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 50px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .email-header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #eeeeee;
        }
        .email-header h1 {
            margin: 0;
            color: #333333;
            font-size: 24px;
        }
        .email-body {
            padding: 20px;
            text-align: center;
        }
        .email-body p {
            color: #555555;
            line-height: 1.6;
            font-size: 16px;
        }
        .reset-button {
            display: inline-block;
            margin: 20px auto;
            padding: 12px 25px;
            background-color: #007bff;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
        }
        .reset-button:hover {
            background-color: #0056b3;
        }
        .security-notice {
            font-size: 12px;
            color: #888888;
            margin-top: 20px;
        }
        .email-footer {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #eeeeee;
            font-size: 12px;
            color: #888888;
        }
        .email-footer a {
            color: #007bff;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>Password Reset Request</h1>
        </div>
        <div class="email-body">
            <p>You recently requested to reset your password. Please click the button below to set a new one.</p>
            <a href="{{reset_url}}" class="reset-button">Reset Your Password</a>
            <p class="security-notice">This link is valid for 15 minutes. If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
        </div>
        <div class="email-footer">
            <p>&copy; 2025 Huynh Nhat Hao. All rights reserved.</p>
            <p>Contact Us: <a href="mailto:huynhnhathao0609.com">support@huynhnhathao0609.com</a></p>
        </div>
    </div>
</body>
</html>`
