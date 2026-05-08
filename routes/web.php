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
