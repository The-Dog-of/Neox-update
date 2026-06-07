-- ============================================================
--  NeoX Studio — Supabase Setup
--  Execute este SQL no SQL Editor do seu projeto Supabase
--  Dashboard → SQL Editor → New Query → cole tudo → Run
-- ============================================================

-- ── 1. TABELAS ──────────────────────────────────────────────

-- Slides do carrossel
CREATE TABLE IF NOT EXISTS public.slides (
    id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title       text NOT NULL,
    subtitle    text,
    url         text NOT NULL,
    type        text NOT NULL CHECK (type IN ('image', 'video')),
    sort_order  int DEFAULT 0,
    created_at  timestamptz DEFAULT now()
);

-- Jogos
CREATE TABLE IF NOT EXISTS public.games (
    id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name        text NOT NULL,
    desc_pt     text,
    desc_en     text,
    image_url   text,
    media_type  text DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
    game_link   text,
    discord_url text,
    status      text DEFAULT 'DEV' CHECK (status IN ('DEV', 'LIVE', 'PARTNER')),
    sort_order  int DEFAULT 0,
    created_at  timestamptz DEFAULT now()
);

-- Membros da equipe
CREATE TABLE IF NOT EXISTS public.team_members (
    id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name        text NOT NULL,
    role_pt     text,
    role_en     text,
    image_url   text,
    roblox_url  text,
    sort_order  int DEFAULT 0,
    created_at  timestamptz DEFAULT now()
);

-- ── 2. LEITURA PÚBLICA (qualquer visitante pode LER) ────────

ALTER TABLE public.slides       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Todos podem ler
CREATE POLICY "public_read_slides"
    ON public.slides FOR SELECT USING (true);

CREATE POLICY "public_read_games"
    ON public.games FOR SELECT USING (true);

CREATE POLICY "public_read_team"
    ON public.team_members FOR SELECT USING (true);

-- Somente autenticados (admin) podem escrever
CREATE POLICY "admin_insert_slides"
    ON public.slides FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "admin_update_slides"
    ON public.slides FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "admin_delete_slides"
    ON public.slides FOR DELETE
    USING (auth.role() = 'authenticated');

CREATE POLICY "admin_insert_games"
    ON public.games FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "admin_update_games"
    ON public.games FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "admin_delete_games"
    ON public.games FOR DELETE
    USING (auth.role() = 'authenticated');

CREATE POLICY "admin_insert_team"
    ON public.team_members FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "admin_update_team"
    ON public.team_members FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "admin_delete_team"
    ON public.team_members FOR DELETE
    USING (auth.role() = 'authenticated');

-- ── 3. STORAGE BUCKETS ──────────────────────────────────────
-- Execute cada INSERT separadamente se der erro de duplicata

INSERT INTO storage.buckets (id, name, public)
VALUES ('slides', 'slides', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('team', 'team', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('games', 'games', true)
ON CONFLICT (id) DO NOTHING;

-- Leitura pública dos arquivos
CREATE POLICY "public_read_slides_storage"
    ON storage.objects FOR SELECT
    USING (bucket_id IN ('slides', 'team', 'games'));

-- Somente admin pode fazer upload / deletar
CREATE POLICY "admin_upload_slides_storage"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id IN ('slides', 'team', 'games')
        AND auth.role() = 'authenticated');

CREATE POLICY "admin_delete_slides_storage"
    ON storage.objects FOR DELETE
    USING (bucket_id IN ('slides', 'team', 'games')
        AND auth.role() = 'authenticated');

CREATE POLICY "admin_update_slides_storage"
    ON storage.objects FOR UPDATE
    USING (bucket_id IN ('slides', 'team', 'games')
        AND auth.role() = 'authenticated');

-- ── 4. DADOS INICIAIS (mesmos do site atual) ─────────────────

INSERT INTO public.slides (title, subtitle, url, type, sort_order) VALUES
('Anime Crash', 'Skills Preview',    'assets/slides/1.png',    'image', 1),
('Anime Crash', 'Gameplay Oficial',  'assets/slides/ac.mp4',   'video', 2),
('Anime Crash', 'System Quests',     'assets/slides/quests.png','image', 3)
ON CONFLICT DO NOTHING;

INSERT INTO public.games (name, desc_pt, desc_en, image_url, media_type, game_link, discord_url, status, sort_order) VALUES
('Anime Crash',
 'Entre na arena e prove seu valor no jogo mais frenético do ano.',
 'Enter the arena and prove your worth in the most frantic game of the year.',
 'assets/slides/ac.mp4', 'video', '#', 'https://discord.gg/mwgNVfzc', 'DEV', 1),
('Anime Paradise',
 'Domine os céus e a terra com seus poderes celestiais.',
 'Master the skies and earth with your celestial powers.',
 'assets/slides/anime paradise 1.png', 'image', '#', 'https://discord.gg/TeDCH3Wq', 'DEV', 2),
('Anime Brawl Simulator',
 'Um simulador de anime para Roblox com uma nova abordagem ao gênero.',
 'An upcoming Roblox Anime Simulator and a new spin on the genre.',
 'assets/slides/Anime Brawl.png', 'image', '#', 'https://discord.gg/afpW7ppQ3c', 'PARTNER', 3)
ON CONFLICT DO NOTHING;

INSERT INTO public.team_members (name, role_pt, role_en, image_url, roblox_url, sort_order) VALUES
('SasaDev',        'Dono',             'Owner',           'assets/team/sasa.png',      'https://www.roblox.com/users/5790284269/profile', 1),
('Real Dado',      'Sub-Dono',         'co-Owner',        'assets/team/RealDado.png',  'https://www.roblox.com/pt/users/3604784551/profile', 2),
('SimpleDev',      'Programador Líder','Lead Programmer', 'assets/team/Simple.png',    'https://www.roblox.com/users/7919453133/profile', 3),
('Nouts Best Dev', 'Construtor',       'Builder',         'assets/team/nouts.png',     'https://www.roblox.com/users/1297403215/profile', 4),
('Collyn',         'Programador',      'Programmer',      'assets/team/Collyn.png',    'https://www.roblox.com/users/4339383022/profile', 5),
('Do_nopps',       'Efeitos Visuais',  'VFX Maker',       'assets/team/do_nopps.png',  'https://www.roblox.com/users/2731128149/profile', 6),
('Slow',           'Animador',         'Animator',        'assets/team/Slow.png',      'https://www.roblox.com/pt/users/2620031389/profile', 7),
('Pinto',          'Modelador',        'Modeler',         'assets/team/pimto.png',     'https://www.roblox.com/pt/users/1387944612/profile', 8),
('Davi',           'QA Tester',        'QA Tester',       'assets/team/davi.png',      'https://www.roblox.com/pt/users/1213557895/profile', 9)
ON CONFLICT DO NOTHING;
