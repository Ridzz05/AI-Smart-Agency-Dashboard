<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('dashboard');
})->name('dashboard');

Route::resource('customers', \App\Http\Controllers\CustomerController::class);
Route::resource('projects', \App\Http\Controllers\ProjectController::class);
Route::resource('transactions', \App\Http\Controllers\TransactionController::class);




