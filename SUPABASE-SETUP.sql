-- ============================================
-- SCHEMA SQL PARA SUPABASE
-- Sistema de Gerenciamento de Terços
-- Pastoral Familiar
-- ============================================

-- 1. Criar tabela de grupos
CREATE TABLE IF NOT EXISTS grupos (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  icone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Criar tabela de casais da pastoral
CREATE TABLE IF NOT EXISTS casais_pastoral (
  id BIGINT PRIMARY KEY,
  grupo_id TEXT REFERENCES grupos(id) ON DELETE CASCADE,
  nome1 TEXT NOT NULL,
  telefone1 TEXT,
  nome2 TEXT,
  telefone2 TEXT,
  cadastro_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Criar tabela de famílias sorteadas
CREATE TABLE IF NOT EXISTS familias_sorteadas (
  id BIGINT PRIMARY KEY,
  grupo_id TEXT REFERENCES grupos(id) ON DELETE CASCADE,
  nome1 TEXT NOT NULL,
  telefone1 TEXT,
  nome2 TEXT,
  telefone2 TEXT,
  endereco TEXT,
  observacoes TEXT,
  data_sorteio TIMESTAMP WITH TIME ZONE,
  cadastro_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Criar tabela de escala mensal
CREATE TABLE IF NOT EXISTS escala (
  id SERIAL PRIMARY KEY,
  grupo_id TEXT REFERENCES grupos(id) ON DELETE CASCADE,
  mes TEXT NOT NULL,
  casal_id BIGINT,
  cadastro_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(grupo_id, mes)
);

-- 5. Criar tabela de terços
CREATE TABLE IF NOT EXISTS tercos (
  id BIGINT PRIMARY KEY,
  grupo_id TEXT REFERENCES grupos(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  hora TIME,
  padre TEXT,
  familia_id BIGINT,
  casais_ids BIGINT[],
  observacoes TEXT,
  confirmacoes JSONB DEFAULT '[]'::jsonb,
  cadastro_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INSERIR GRUPOS INICIAIS
-- ============================================

INSERT INTO grupos (id, nome, icone) VALUES
  ('sabado-19h30', 'Sábado 19h30', '🕯️'),
  ('domingo-7h30', 'Domingo 7h30', '🌅'),
  ('domingo-9h30', 'Domingo 9h30', '☀️'),
  ('domingo-17h-capela', 'Domingo 17h Capela', '⛪'),
  ('domingo-19h', 'Domingo 19h', '🌙')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_casais_grupo ON casais_pastoral(grupo_id);
CREATE INDEX IF NOT EXISTS idx_familias_grupo ON familias_sorteadas(grupo_id);
CREATE INDEX IF NOT EXISTS idx_escala_grupo ON escala(grupo_id);
CREATE INDEX IF NOT EXISTS idx_escala_mes ON escala(mes);
CREATE INDEX IF NOT EXISTS idx_tercos_grupo ON tercos(grupo_id);
CREATE INDEX IF NOT EXISTS idx_tercos_data ON tercos(data);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE grupos ENABLE ROW LEVEL SECURITY;
ALTER TABLE casais_pastoral ENABLE ROW LEVEL SECURITY;
ALTER TABLE familias_sorteadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE escala ENABLE ROW LEVEL SECURITY;
ALTER TABLE tercos ENABLE ROW LEVEL SECURITY;

-- Políticas de leitura pública (todos podem ler)
CREATE POLICY "Permitir leitura grupos" ON grupos FOR SELECT USING (true);
CREATE POLICY "Permitir leitura casais" ON casais_pastoral FOR SELECT USING (true);
CREATE POLICY "Permitir leitura familias" ON familias_sorteadas FOR SELECT USING (true);
CREATE POLICY "Permitir leitura escala" ON escala FOR SELECT USING (true);
CREATE POLICY "Permitir leitura tercos" ON tercos FOR SELECT USING (true);

-- Políticas de escrita pública (temporário, para desenvolvimento)
-- NOTA: Em produção, trocar por auth.role() = 'authenticated'
CREATE POLICY "Permitir escrita grupos" ON grupos FOR ALL USING (true);
CREATE POLICY "Permitir escrita casais" ON casais_pastoral FOR ALL USING (true);
CREATE POLICY "Permitir escrita familias" ON familias_sorteadas FOR ALL USING (true);
CREATE POLICY "Permitir escrita escala" ON escala FOR ALL USING (true);
CREATE POLICY "Permitir escrita tercos" ON tercos FOR ALL USING (true);

-- ============================================
-- COMENTÁRIOS DAS TABELAS (DOCUMENTAÇÃO)
-- ============================================

COMMENT ON TABLE grupos IS 'Grupos de missa da Pastoral Familiar';
COMMENT ON TABLE casais_pastoral IS 'Casais membros fixos da pastoral';
COMMENT ON TABLE familias_sorteadas IS 'Famílias sorteadas para receber terço';
COMMENT ON TABLE escala IS 'Escala mensal de responsáveis pela pasta';
COMMENT ON TABLE tercos IS 'Terços agendados e realizados';

COMMENT ON COLUMN tercos.confirmacoes IS 'Array JSON com confirmações: [{"casalId": 123, "confirmedAt": "2024-12-19T10:00:00Z"}]';
COMMENT ON COLUMN tercos.casais_ids IS 'Array de IDs dos casais participantes';

-- ============================================
-- FIM DO SCRIPT
-- ============================================
