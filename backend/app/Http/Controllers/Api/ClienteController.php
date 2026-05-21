<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\Contracts\ClienteRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ClienteController extends Controller
{
    public function __construct(
        private readonly ClienteRepositoryInterface $clientes,
    ) {}

    public function index(): JsonResponse
    {
        return response()->json($this->clientes->all());
    }

    public function store(Request $request): JsonResponse
    {
        $cliente = $this->clientes->create($request->all());
        return response()->json($cliente, 201);
    }

    public function show(string $id): JsonResponse
    {
        $cliente = $this->clientes->find($id);
        if (! $cliente) {
            return response()->json(['message' => 'Cliente não encontrado.'], 404);
        }
        return response()->json($cliente);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $cliente = $this->clientes->update($id, $request->all());
        if (! $cliente) {
            return response()->json(['message' => 'Cliente não encontrado.'], 404);
        }
        return response()->json($cliente);
    }

    public function destroy(string $id): Response
    {
        $deleted = $this->clientes->delete($id);
        if (! $deleted) {
            return response()->json(['message' => 'Cliente não encontrado.'], 404);
        }
        return response()->noContent();
    }
}
