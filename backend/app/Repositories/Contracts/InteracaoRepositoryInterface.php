<?php

namespace App\Repositories\Contracts;

interface InteracaoRepositoryInterface
{
    public function byEntidade(string $entidadeTipo, string $entidadeId): array;

    public function create(array $dados): array;

    public function delete(string $id): bool;
}
