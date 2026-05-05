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

        return Inertia::render('dashboard', [
            'stats' => [
                'totalCustomers' => $totalCustomers,
                'totalProjects' => $totalProjects,
                'totalRevenue' => (float)$totalRevenue,
            ],
            'projectsByStatus' => $projectsByStatus,
            'revenueData' => $revenueData,
        ]);
    }
}
