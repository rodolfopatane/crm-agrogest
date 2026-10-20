<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\Contracts\InteracaoRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class InteracaoController extends Controller
{
    public function __construct(
        private readonly InteracaoRepositoryInterface $interacoes,
    ) {}

    public function index(string $entidadeTipo, string $entidadeId): JsonResponse
    {
        return response()->json($this->interacoes->byEntidade($entidadeTipo, $entidadeId));
    }

    public function store(Request $request): JsonResponse
    {
        $interacao = $this->interacoes->create($request->all());
        return response()->json($interacao, 201);
    }

    public function destroy(string $id): Response
    {
        $deleted = $this->interacoes->delete($id);
        if (! $deleted) {
            return response()->json(['message' => 'Interação não encontrada.'], 404);
        }
        return response()->noContent();
    }
}
