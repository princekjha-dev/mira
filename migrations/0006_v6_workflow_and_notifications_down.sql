-- 0006_v6_workflow_and_notifications_down.sql
DROP TABLE IF EXISTS notifications CASCADE;
ALTER TABLE applications DROP CONSTRAINT IF EXISTS applications_status_check;
ALTER TABLE applications ADD CONSTRAINT applications_status_check CHECK (status IN (
    'DRAFT', 'SUBMITTED', 'UNDER_VERIFICATION', 'APPROVED', 'REJECTED', 'WITHDRAWN', 'DISBURSED'
));
