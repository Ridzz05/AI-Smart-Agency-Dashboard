<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Project;
use App\Models\Transaction;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $totalCustomers = Customer::count();
        $totalProjects = Project::count();
        $totalRevenue = Transaction::where('status', 'Paid')->sum('amount');
        
        $projectsByStatus = Project::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get();

        // Revenue for the last 6 months - formatted in PHP for database compatibility
        $revenueData = Transaction::where('status', 'Paid')
            ->where('created_at', '>=', now()->subMonths(6))
            ->orderBy('created_at')
            ->get()
            ->groupBy(function($item) {
                return $item->created_at->format('M');
            })
            ->map(function($group, $month) {
                return [
                    'month' => $month,
                    'total' => (float)$group->sum('amount')
                ];
            })
            ->values();

        // Recent Activities (Combined)
        $recentCustomers = Customer::latest()->take(2)->get()->map(function($item) {
            return [
                'type' => 'customer',
                'title' => 'Customer Baru',
                'description' => 'Menambahkan ' . $item->name,
                'time' => $item->created_at->diffForHumans(),
                'icon' => 'user'
            ];
        });

        $recentProjects = Project::latest()->take(2)->get()->map(function($item) {
            return [
                'type' => 'project',
                'title' => 'Proyek Baru',
                'description' => 'Mulai proyek: ' . $item->name,
                'time' => $item->created_at->diffForHumans(),
                'icon' => 'briefcase'
            ];
        });

        $recentTransactions = Transaction::where('status', 'Paid')->latest()->take(2)->get()->map(function($item) {
            return [
                'type' => 'transaction',
                'title' => 'Pembayaran Masuk',
                'description' => 'IDR ' . number_format($item->amount) . ' dari ' . ($item->customer->name ?? 'Client'),
                'time' => $item->created_at->diffForHumans(),
                'icon' => 'dollar'
            ];
        });

        $activities = $recentCustomers->concat($recentProjects)->concat($recentTransactions)
            ->sortByDesc('time')
            ->values()
            ->take(5);

        return Inertia::render('dashboard', [
            'stats' => [
                'totalCustomers' => $totalCustomers,
                'totalProjects' => $totalProjects,
                'totalRevenue' => (float)$totalRevenue,
            ],
            'projectsByStatus' => $projectsByStatus,
            'revenueData' => $revenueData,
            'activities' => $activities,
        ]);
    }
}
