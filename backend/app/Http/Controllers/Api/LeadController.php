<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\Contracts\LeadRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class LeadController extends Controller
{
    public function __construct(
        private readonly LeadRepositoryInterface $leads,
    ) {}

    public function index(): JsonResponse
    {
        return response()->json($this->leads->all());
    }

    public function store(Request $request): JsonResponse
    {
        $lead = $this->leads->create($request->all());
        return response()->json($lead, 201);
    }

    public function show(string $id): JsonResponse
    {
        $lead = $this->leads->find($id);
        if (! $lead) {
            return response()->json(['message' => 'Lead não encontrado.'], 404);
        }
        return response()->json($lead);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $lead = $this->leads->update($id, $request->all());
        if (! $lead) {
            return response()->json(['message' => 'Lead não encontrado.'], 404);
        }
        return response()->json($lead);
    }

    public function destroy(string $id): Response
    {
        $deleted = $this->leads->delete($id);
        if (! $deleted) {
            return response()->json(['message' => 'Lead não encontrado.'], 404);
        }
        return response()->noContent();
    }
}
