-- Demo identity is an explicit server-side property, never inferred from browser state.
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT FALSE;

UPDATE users
SET is_demo = TRUE
WHERE email IN (
    'citizen@mira.local',
    'officer@mira.local',
    'verifier@mira.local',
    'admin@mira.local',
    'auditor@mira.local'
);
