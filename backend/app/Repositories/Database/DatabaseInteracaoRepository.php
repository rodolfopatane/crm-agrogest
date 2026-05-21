<?php

namespace App\Repositories\Database;

use App\Repositories\Contracts\InteracaoRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DatabaseInteracaoRepository implements InteracaoRepositoryInterface
{
    private string $table = 'interacoes';

    private function toDatabase(array $dados): array
    {
        $mapped = [];
        
        if (isset($dados['entidadeTipo']) && isset($dados['entidadeId'])) {
            if ($dados['entidadeTipo'] === 'cliente') {
                $mapped['cliente_id'] = $dados['entidadeId'];
                $mapped['lead_id'] = null;
            } elseif ($dados['entidadeTipo'] === 'lead') {
                $mapped['lead_id'] = $dados['entidadeId'];
                $mapped['cliente_id'] = null;
            }
        }
        
        if (isset($dados['tipo'])) $mapped['tipo'] = $dados['tipo'];
        if (isset($dados['descricao'])) $mapped['descricao'] = $dados['descricao'];
        if (isset($dados['data'])) $mapped['data'] = $dados['data'];
        
        return $mapped;
    }

    private function fromDatabase(object $row): array
    {
        $entidadeTipo = $row->cliente_id ? 'cliente' : 'lead';
        $entidadeId = $row->cliente_id ?: $row->lead_id;
        
        return [
            'id'           => $row->id,
            'entidadeTipo' => $entidadeTipo,
            'entidadeId'   => $entidadeId,
            'tipo'         => $row->tipo,
            'descricao'    => $row->descricao,
            'data'         => $row->data,
        ];
    }

    public function byEntidade(string $entidadeTipo, string $entidadeId): array
    {
        $query = DB::table($this->table);
        
        if ($entidadeTipo === 'cliente') {
            $query->where('cliente_id', $entidadeId);
        } elseif ($entidadeTipo === 'lead') {
            $query->where('lead_id', $entidadeId);
        } else {
            return [];
        }
        
        $rows = $query->get();
        
        return $rows->map(fn($row) => $this->fromDatabase($row))->values()->toArray();
    }

    public function create(array $dados): array
    {
        $id = (string) Str::uuid();
        $mapped = $this->toDatabase($dados);
        $mapped['id'] = $id;
        $mapped['data'] = $dados['data'] ?? date('Y-m-d');
        $mapped['criado_em'] = now();
        
        DB::table($this->table)->insert($mapped);
        
        $row = DB::table($this->table)->where('id', $id)->first();
        return $this->fromDatabase($row);
    }

    public function delete(string $id): bool
    {
        $deleted = DB::table($this->table)->where('id', $id)->delete();
        
        return $deleted > 0;
    }
}
