-- Verificar se o usuario izite95@gmail.com já existe e atualizar seu perfil para backoffice
UPDATE users 
SET role = 'backoffice' 
WHERE email = 'izite95@gmail.com';

-- Se não existe, inserir o usuario izite95@gmail.com com perfil backoffice
INSERT INTO users (email, nome, role, tipo, estado)
SELECT 'izite95@gmail.com', 'Administrador', 'backoffice', 'admin', 'Ativo'
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE email = 'izite95@gmail.com'
);