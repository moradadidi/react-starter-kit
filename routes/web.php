<?php

use App\Http\Controllers\ClientController;
use App\Http\Controllers\CommandeController; // Ensure this class exists in the specified namespace
use App\Http\Controllers\TypeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::resource('clients' , ClientController::class);
Route::resource('types' , TypeController::class);
Route::resource('commandes' , CommandeController::class);


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
