<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;
use Laravel\Passport\Passport;



class AppServiceProvider extends ServiceProvider
{
    
    public function register(): void
    {
        Passport::ignoreRoutes();

    }

    public function boot(): void
    {

    }
}
