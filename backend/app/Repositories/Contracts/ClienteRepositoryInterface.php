<?php

namespace App\Repositories\Contracts;

interface ClienteRepositoryInterface
{
    public function all(): array;

    public function find(string $id): ?array;

    public function create(array $dados): array;

    public function update(string $id, array $dados): ?array;

    public function delete(string $id): bool;
}
