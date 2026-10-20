<?php

namespace App\Repositories\Database;

use App\Repositories\Contracts\ClienteRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DatabaseClienteRepository implements ClienteRepositoryInterface
{
    private string $table = 'clientes';

    private function toDatabase(array $dados): array
    {
        $mapped = [];
        
        if (isset($dados['nome'])) $mapped['nome'] = $dados['nome'];
        if (isset($dados['razaosocial'])) $mapped['razao_social'] = $dados['razaosocial'];
        if (isset($dados['cnpj'])) $mapped['cnpj'] = $dados['cnpj'];
        if (isset($dados['cpf'])) $mapped['cpf'] = $dados['cpf'];
        if (isset($dados['email'])) $mapped['email'] = $dados['email'];
        if (isset($dados['telefone'])) $mapped['telefone'] = $dados['telefone'];
        if (isset($dados['cidade'])) $mapped['cidade'] = $dados['cidade'];
        if (isset($dados['estado'])) $mapped['estado'] = $dados['estado'];
        
        return $mapped;
    }

    private function fromDatabase(object $row): array
    {
        return [
            'id'          => $row->id,
            'nome'        => $row->nome,
            'razaosocial' => $row->razao_social,
            'cnpj'        => $row->cnpj,
            'cpf'         => $row->cpf,
            'email'       => $row->email,
            'telefone'    => $row->telefone,
            'cidade'      => $row->cidade,
            'estado'      => $row->estado,
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
        $mapped['criado_em'] = now();
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
