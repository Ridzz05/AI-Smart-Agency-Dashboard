<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\AIController;

Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

Route::resource('customers', \App\Http\Controllers\CustomerController::class);
Route::resource('projects', ProjectController::class);
Route::resource('transactions', TransactionController::class);

Route::get('/ai', [AIController::class, 'index'])->name('ai.index');
Route::get('/ai/insight', [AIController::class, 'getInsight'])->name('ai.insight');
Route::post('/ai/chat', [AIController::class, 'chat'])->name('ai.chat');

// Support Chat Routes
Route::prefix('support')->group(function () {
    // Public routes
    Route::post('/init', [\App\Http\Controllers\SupportController::class, 'initChat'])->name('support.init');
    Route::post('/{id}/send', [\App\Http\Controllers\SupportController::class, 'sendMessage'])->name('support.send');
    
    // Admin routes
    Route::middleware(['auth'])->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\SupportController::class, 'adminIndex'])->name('support.admin.index');
        Route::get('/{id}/messages', [\App\Http\Controllers\SupportController::class, 'getMessages'])->name('support.admin.messages');
        Route::post('/{id}/close', [\App\Http\Controllers\SupportController::class, 'closeChat'])->name('support.admin.close');
    });
});
