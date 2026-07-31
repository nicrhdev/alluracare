-- scripts/set-admin.sql

-- Replace 'your-email@example.com' with your email
UPDATE users 
SET role = 'ADMIN' 
WHERE email = 'vaisletten@gmail.com';