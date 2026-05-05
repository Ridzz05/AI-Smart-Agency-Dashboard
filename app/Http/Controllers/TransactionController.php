<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index()
    {
        return Inertia::render('transactions/index', [
            'transactions' => Transaction::with(['customer', 'project'])->latest()->get(),
        ]);
    }
}
