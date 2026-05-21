<?php

namespace App\Repositories\Database;

use App\Repositories\Contracts\LeadRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DatabaseLeadRepository implements LeadRepositoryInterface
{
    private string $table = 'leads';

    private function normalizeEnum(?string $value, string $type): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }
        
        $maps = [
            'origem' => [
                'Indicação'    => 'indicacao',
                'indicacao'    => 'indicacao',
                'Site'         => 'site',
                'site'         => 'site',
                'Rede Social'  => 'rede_social',
                'rede_social'  => 'rede_social',
                'Ligação Fria' => 'ligacao_fria',
                'ligacao_fria' => 'ligacao_fria',
                'Outro'        => 'outro',
                'outro'        => 'outro',
            ],
            'etapa' => [
                'novo'        => 'novo',
                'contato'     => 'contato',
                'negociacao'  => 'negociacao',
                'ganho'       => 'ganho',
                'perdido'     => 'perdido',
            ],
            'servico' => [
                'Regularização para produção de mudas (RENASEM)'         => 'renasem',
                'renasem'                                                 => 'renasem',
                'Registro de estabelecimento (SIPEAGRO)'                  => 'sipeagro_estabelecimento',
                'sipeagro_estabelecimento'                                => 'sipeagro_estabelecimento',
                'IBAMA – CTF (Cadastro Técnico Federal)'                  => 'ibama_ctf',
                'ibama_ctf'                                               => 'ibama_ctf',
                'Licenças para Produtos Controlados'                      => 'licencas_produtos_controlados',
                'licencas_produtos_controlados'                           => 'licencas_produtos_controlados',
                'Registro de produtos (SIPEAGRO)'                         => 'sipeagro_produtos',
                'sipeagro_produtos'                                       => 'sipeagro_produtos',
                'Responsabilidade Técnica'                                => 'responsabilidade_tecnica',
                'responsabilidade_tecnica'                                => 'responsabilidade_tecnica',
                'Implantação de normas ISO (ISO 9001, ISO 14001, ISO 45001, ESG)' => 'iso',
                'iso'                                                     => 'iso',
                'Auditoria interna'                                       => 'auditoria_interna',
                'auditoria_interna'                                       => 'auditoria_interna',
                'Business Intelligence'                                   => 'business_intelligence',
                'business_intelligence'                                   => 'business_intelligence',
                'Automação agropecuária'                                  => 'automacao_agropecuaria',
                'automacao_agropecuaria'                                  => 'automacao_agropecuaria',
                'Projetos de implementação de IA'                         => 'projetos_ia',
                'projetos_ia'                                             => 'projetos_ia',
                'Parceria com produtores de mudas de cana de açúcar'      => 'parceria_cana',
                'parceria_cana'                                           => 'parceria_cana',
            ],
        ];
        
        return $maps[$type][$value] ?? strtolower($value);
    }

    private function toDatabase(array $dados): array
    {
        $mapped = [];
        
        if (isset($dados['nome'])) $mapped['nome'] = $dados['nome'];
        if (isset($dados['empresa'])) $mapped['empresa'] = $dados['empresa'];
        if (isset($dados['email'])) $mapped['email'] = $dados['email'];
        if (isset($dados['telefone'])) $mapped['telefone'] = $dados['telefone'];
        if (isset($dados['origem'])) $mapped['origem'] = $this->normalizeEnum($dados['origem'], 'origem');
        if (isset($dados['etapa'])) $mapped['etapa'] = $this->normalizeEnum($dados['etapa'], 'etapa');
        if (isset($dados['servico'])) $mapped['servico'] = $this->normalizeEnum($dados['servico'], 'servico');
        if (isset($dados['observacoes'])) $mapped['observacoes'] = $dados['observacoes'];
        
        return $mapped;
    }

    private function fromDatabase(object $row): array
    {
        return [
            'id'          => $row->id,
            'nome'        => $row->nome,
            'empresa'     => $row->empresa,
            'email'       => $row->email,
            'telefone'    => $row->telefone,
            'origem'      => $row->origem,
            'etapa'       => $row->etapa,
            'servico'     => $row->servico ?? '',
            'observacoes' => $row->observacoes ?? '',
            'dataCriacao' => $row->data_criacao,
        ];
    }

    public function all(): array
    {
        $rows = DB::table($this->table)->get();
        
        return $rows->map(fn($row) => $this->fromDatabase($row))->toArray();
    }

    public function find(string $id): ?array
    {
        $row = DB::table($this->table)->where('id', $id)->first();
        
        return $row ? $this->fromDatabase($row) : null;
    }

    public function create(array $dados): array
    {
        $id = (string) Str::uuid();
        $mapped = $this->toDatabase($dados);
        $mapped['id'] = $id;
        $mapped['data_criacao'] = date('Y-m-d');
        $mapped['atualizado_em'] = now();
        
        DB::table($this->table)->insert($mapped);
        
        $row = DB::table($this->table)->where('id', $id)->first();
        return $this->fromDatabase($row);
    }

    public function update(string $id, array $dados): ?array
    {
        $exists = DB::table($this->table)->where('id', $id)->exists();
        
        if (!$exists) {
            return null;
        }
        
        $mapped = $this->toDatabase($dados);
        $mapped['atualizado_em'] = now();
        
        DB::table($this->table)->where('id', $id)->update($mapped);
        
        $row = DB::table($this->table)->where('id', $id)->first();
        return $this->fromDatabase($row);
    }

    public function delete(string $id): bool
    {
        $deleted = DB::table($this->table)->where('id', $id)->delete();
        
        return $deleted > 0;
    }
}
