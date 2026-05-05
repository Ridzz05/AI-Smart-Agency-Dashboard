<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Project;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class AIController extends Controller
{
    public function index()
    {
        return Inertia::render('ai/index');
    }

    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
        ]);

        $apiKey = config('services.openrouter.key');
        
        if (!$apiKey) {
            return response()->json([
                'error' => 'OpenRouter API Key not found. Please add OPENROUTER_API_KEY to your .env file.'
            ], 500);
        }

        // Gather context from the system
        $context = $this->getSystemContext();

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
                'HTTP-Referer' => config('app.url'),
                'X-Title' => config('app.name'),
            ])->post('https://openrouter.ai/api/v1/chat/completions', [
                'model' => 'baidu/qianfan-ocr-fast:free',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => $context
                    ],
                    [
                        'role' => 'user',
                        'content' => $request->message
                    ]
                ],
            ]);

            if ($response->successful()) {
                return response()->json($response->json());
            }

            return response()->json([
                'error' => 'Failed to communicate with AI: ' . $response->body()
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'AI Error: ' . $e->getMessage()
            ], 500);
        }
    }

    private function getSystemContext()
    {
        // Aggregating Data for AI Context
        $customersCount = Customer::count();
        $leadsCount = Customer::where('status', 'Lead')->count();
        $activeCustomers = Customer::where('status', 'Active')->count();
        
        $projectsCount = Project::count();
        $projectsInProgress = Project::where('status', 'In Progress')->count();
        $completedProjects = Project::where('status', 'Completed')->count();
        
        $totalRevenue = Transaction::where('status', 'Paid')->sum('amount');
        $pendingRevenue = Transaction::where('status', 'Pending')->sum('amount');

        $activeProjectsList = Project::where('status', 'In Progress')->with('customer')->latest()->take(5)->get()
            ->map(fn($p) => "- {$p->name} (Client: {$p->customer->name}, Progress: {$p->progress}%)")
            ->implode("\n");

        $recentTransactions = Transaction::with('customer')->latest()->take(3)->get()
            ->map(fn($t) => "- IDR " . number_format($t->amount, 0, ',', '.') . " for client {$t->customer->name} (Status: {$t->status})")
            ->implode("\n");

        return "You are 'KitaAI', a Senior Business & CRM Analyst for the 'AdminCRM-Kita' system. 
        Your primary goal is to help the agency administrator manage their business effectively.

        CORE SYSTEM KNOWLEDGE:
        - CUSTOMERS: Total: {$customersCount} (Active: {$activeCustomers}, Leads: {$leadsCount})
        - PROJECTS: Total: {$projectsCount} (In Progress: {$projectsInProgress}, Completed: {$completedProjects})
        - FINANCIALS: Total Revenue: IDR " . number_format($totalRevenue, 0, ',', '.') . ", Pending: IDR " . number_format($pendingRevenue, 0, ',', '.') . "

        DETAILED CONTEXT:
        Active Projects:\n{$activeProjectsList}
        Recent Transactions:\n{$recentTransactions}

        YOUR BEHAVIOR RULES:
        1. FOCUS: Always prioritize answering based on the CRM data provided above.
        2. GENERAL KNOWLEDGE: You can answer general business, marketing, or administrative questions, but try to relate them back to how they can be applied to this CRM (e.g., if asked about 'marketing', suggest looking at the 'Leads' in the system).
        3. TONE: Professional, analytical, but encouraging. 
        4. DATA LIMITS: If the user asks for specific data NOT listed in your context (like a specific transaction from 2 years ago), politely tell them to check the 'Transactions' or 'Projects' module for more details.
        5. FORMAT: Use bullet points for lists and keep paragraphs short.

        You are now ready to assist the Administrator.";
    }
}
