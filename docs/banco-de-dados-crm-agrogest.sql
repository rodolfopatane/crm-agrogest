CREATE TABLE `usuarios` (
  `id` char(36) PRIMARY KEY,
  `nome` varchar(100) NOT NULL,
  `email` varchar(150) UNIQUE NOT NULL,
  `senha_hash` varchar(255) NOT NULL COMMENT 'Bcrypt hash — nunca armazenar senha em texto claro',
  `criado_em` timestamp NOT NULL DEFAULT (now()),
  `atualizado_em` timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE `clientes` (
  `id` char(36) PRIMARY KEY COMMENT 'UUID gerado pela aplicação',
  `nome` varchar(150) NOT NULL COMMENT 'Nome do contato principal',
  `razao_social` varchar(200) NOT NULL,
  `cnpj` char(18) UNIQUE NOT NULL COMMENT 'Formato: DD.DDD.DDD/DDDD-DD',
  `cpf` char(14) COMMENT 'Formato: DDD.DDD.DDD-DD — opcional para pessoa física',
  `email` varchar(150) NOT NULL,
  `telefone` varchar(15) NOT NULL COMMENT 'Formato: (DD) DDDDD-DDDD',
  `cidade` varchar(100) NOT NULL,
  `estado` char(2) COMMENT 'UF — ex.: SP, RJ, MG',
  `criado_em` timestamp NOT NULL DEFAULT (now()),
  `atualizado_em` timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE `leads` (
  `id` char(36) PRIMARY KEY COMMENT 'UUID gerado pela aplicação',
  `nome` varchar(150) NOT NULL COMMENT 'Nome do contato',
  `empresa` varchar(200) COMMENT 'Nome da empresa do lead',
  `email` varchar(150) NOT NULL,
  `telefone` varchar(15) NOT NULL COMMENT 'Formato: (DD) DDDDD-DDDD',
  `origem` ENUM ('indicacao', 'site', 'rede_social', 'ligacao_fria', 'outro') NOT NULL DEFAULT 'indicacao',
  `etapa` ENUM ('novo', 'contato', 'negociacao', 'ganho', 'perdido') NOT NULL DEFAULT 'novo',
  `servico` ENUM ('renasem', 'sipeagro_estabelecimento', 'ibama_ctf', 'licencas_produtos_controlados', 'sipeagro_produtos', 'responsabilidade_tecnica', 'iso', 'auditoria_interna', 'business_intelligence', 'automacao_agropecuaria', 'projetos_ia', 'parceria_cana'),
  `observacoes` text,
  `convertido_para_cliente_id` char(36) COMMENT 'UUID de cliente preenchido ao converter o lead',
  `data_criacao` date NOT NULL DEFAULT (current_date),
  `atualizado_em` timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE `interacoes` (
  `id` char(36) PRIMARY KEY COMMENT 'UUID gerado pela aplicação',
  `cliente_id` char(36) COMMENT 'UUID preenchido quando a interação é com um cliente',
  `lead_id` char(36) COMMENT 'UUID preenchido quando a interação é com um lead',
  `tipo` ENUM ('ligacao', 'email', 'whatsapp', 'reuniao', 'outro') NOT NULL DEFAULT 'ligacao',
  `descricao` text NOT NULL,
  `data` date NOT NULL,
  `criado_em` timestamp NOT NULL DEFAULT (now())
);

CREATE UNIQUE INDEX `uq_clientes_cnpj` ON `clientes` (`cnpj`);

CREATE INDEX `idx_clientes_email` ON `clientes` (`email`);

CREATE INDEX `idx_leads_etapa` ON `leads` (`etapa`);

CREATE INDEX `idx_leads_cliente_conversao` ON `leads` (`convertido_para_cliente_id`);

CREATE INDEX `idx_interacoes_cliente` ON `interacoes` (`cliente_id`);

CREATE INDEX `idx_interacoes_lead` ON `interacoes` (`lead_id`);

ALTER TABLE `usuarios` COMMENT = 'Usuários com acesso ao sistema CRM';

ALTER TABLE `clientes` COMMENT = 'Clientes ativos da AgroGest';

ALTER TABLE `leads` COMMENT = 'Potenciais clientes em pipeline de vendas (kanban).
Fluxo de etapas: novo → contato → negociacao → ganho | perdido.
Quando convertido, o campo convertido_para_cliente_id registra o vínculo.
';

ALTER TABLE `interacoes` COMMENT = 'Histórico de interações com clientes e leads.
Exatamente um dos campos cliente_id ou lead_id deve ser preenchido por registro
(garantido via CHECK constraint: (cliente_id IS NOT NULL) <> (lead_id IS NOT NULL)).
';

ALTER TABLE `leads` ADD FOREIGN KEY (`convertido_para_cliente_id`) REFERENCES `clientes` (`id`);

ALTER TABLE `interacoes` ADD FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE;

ALTER TABLE `interacoes` ADD FOREIGN KEY (`lead_id`) REFERENCES `leads` (`id`) ON DELETE CASCADE;;
