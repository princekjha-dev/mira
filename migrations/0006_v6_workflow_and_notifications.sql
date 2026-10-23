-- 0006_v6_workflow_and_notifications.sql
-- Real multi-user workflow state transitions, notifications, and application lifecycle constraints

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    entity_type VARCHAR(64),
    entity_id VARCHAR(64),
    read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'applications_status_check' AND conrelid = 'applications'::regclass
    ) THEN
        ALTER TABLE applications ADD CONSTRAINT applications_status_check CHECK (status IN (
            'DRAFT', 'SUBMITTED', 'UNDER_VERIFICATION', 'EVIDENCE_REQUIRED', 'APPROVED', 'REJECTED', 'WITHDRAWN', 'DISBURSED'
        ));
    END IF;
END $$;
