<?php

namespace App\Providers;

use App\Repositories\Contracts\ClienteRepositoryInterface;
use App\Repositories\Contracts\InteracaoRepositoryInterface;
use App\Repositories\Contracts\LeadRepositoryInterface;
use App\Repositories\Database\DatabaseClienteRepository;
use App\Repositories\Database\DatabaseInteracaoRepository;
use App\Repositories\Database\DatabaseLeadRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(ClienteRepositoryInterface::class, DatabaseClienteRepository::class);
        $this->app->bind(LeadRepositoryInterface::class, DatabaseLeadRepository::class);
        $this->app->bind(InteracaoRepositoryInterface::class, DatabaseInteracaoRepository::class);
    }
}
