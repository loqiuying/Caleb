-- ============================================
-- AI Chat Assistant - Supabase Schema
-- 在 Supabase Dashboard → SQL Editor 中执行
-- ============================================

-- UUID 生成扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. sessions 会话表
-- ============================================
CREATE TABLE sessions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title           VARCHAR(200) NOT NULL DEFAULT '新对话',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_summary_at TIMESTAMPTZ,
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    metadata        JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_sessions_updated_at
    ON sessions(updated_at DESC) WHERE is_deleted = FALSE;

-- ============================================
-- 2. messages 消息表
-- ============================================
CREATE TABLE messages (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id   UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    role         VARCHAR(20) NOT NULL
                 CHECK (role IN ('system', 'user', 'assistant')),
    content      TEXT NOT NULL,
    token_count  INTEGER NOT NULL DEFAULT 0,
    seq          INTEGER NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    metadata     JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_messages_session_id  ON messages(session_id);
CREATE INDEX idx_messages_session_seq ON messages(session_id, seq);

-- ============================================
-- 3. memory_summaries 记忆摘要表
-- ============================================
CREATE TABLE memory_summaries (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id        UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    summary           TEXT NOT NULL,
    from_message_seq  INTEGER NOT NULL,
    to_message_seq    INTEGER NOT NULL,
    summarized_tokens INTEGER NOT NULL DEFAULT 0,
    summary_tokens    INTEGER NOT NULL DEFAULT 0,
    version           INTEGER NOT NULL DEFAULT 1,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_memsum_session_id  ON memory_summaries(session_id);
CREATE INDEX idx_memsum_created_at  ON memory_summaries(created_at DESC);

-- ============================================
-- 触发器：插入消息时自动更新 sessions.updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_session_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE sessions SET updated_at = NOW() WHERE id = NEW.session_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_session_timestamp
    AFTER INSERT ON messages
    FOR EACH ROW EXECUTE FUNCTION update_session_timestamp();

-- ============================================
-- 行级安全（RLS）
-- ============================================
ALTER TABLE sessions         ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages         ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_summaries ENABLE ROW LEVEL SECURITY;

-- 后端使用 service_role key 可绕过 RLS
