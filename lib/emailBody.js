export function emailBody(fullname, otp) {
  return `<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your OTP Code</title>
</head>
<body style="background-color:#f3f4f6; font-family: Arial, sans-serif; padding:20px;">
    <div style="max-width:600px; margin:auto; background:#fff; border-radius:10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="background:#0d5f72; color:white; padding:20px; text-align:center;">
            <h1>Your OTP Code</h1>
        </div>
        <div style="padding:20px; text-align:center;">
            <p>Hello, <strong>${fullname}</strong></p>
            <p>Your One-Time Password (OTP) for account verification is:</p>
            <div style="background:#f3f4f6; padding:15px; border-radius:5px; margin:20px auto; max-width:200px;">
                <p style="font-size:24px; font-weight:bold; color:#0d5f72; letter-spacing: 4px;">${otp}</p>
            </div>
            <p>This OTP is valid for <strong>2 minutes</strong>. Do not share this code.</p>
            <p>If you didn't request this, please ignore this email.</p>
        </div>
        <div style="background:#f3f4f6; padding:10px; text-align:center; font-size:12px;">
            &copy; 2025 Your Company Name. All rights reserved.
        </div>
    </div>
</body>
</html>`;
}
