<?php

use App\Http\Controllers\Api\ClienteController;
use App\Http\Controllers\Api\InteracaoController;
use App\Http\Controllers\Api\LeadController;
use Illuminate\Support\Facades\Route;

Route::apiResource('clientes', ClienteController::class)
    ->where(['cliente' => '[0-9a-fA-F-]{36}']);

Route::apiResource('leads', LeadController::class)
    ->where(['lead' => '[0-9a-fA-F-]{36}']);

Route::get('/{entidadeTipo}/{entidadeId}/interacoes', [InteracaoController::class, 'index'])
    ->where('entidadeTipo', 'cliente|lead')
    ->where('entidadeId', '[0-9a-fA-F-]{36}');

Route::post('/interacoes', [InteracaoController::class, 'store']);
Route::delete('/interacoes/{id}', [InteracaoController::class, 'destroy'])
    ->where('id', '[0-9a-fA-F-]{36}');
