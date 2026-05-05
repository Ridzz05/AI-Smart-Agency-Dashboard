import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Head, Link } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Users, Briefcase, DollarSign, TrendingUp, Plus } from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function Dashboard({
    stats,
    projectsByStatus,
    revenueData,
    activities,
}: any) {
    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Dashboard" />

            <div className="flex flex-col gap-6 p-6 pt-6">
                {/* Greeting Hero Widget */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-8 text-white shadow-2xl border border-white/5">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">Selamat Datang Kembali! 👋</h2>
                            <p className="mt-2 text-slate-300 max-w-xl">
                                Hari ini sistem memiliki <span className="font-semibold text-indigo-400">{stats?.totalProjects || 0} proyek</span> aktif. 
                                Tetap semangat untuk <span className="font-semibold text-indigo-400">Ki, Jo, dan Nath</span> dalam mengelola agensi!
                            </p>
                            <div className="mt-6 flex flex-wrap gap-3">
                                <Link href={route('projects.index')} className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium transition-all hover:bg-indigo-500 shadow-lg shadow-indigo-500/20">
                                    <Plus className="mr-2 h-4 w-4" /> Proyek Baru
                                </Link>
                                <Link href={route('transactions.index')} className="inline-flex items-center justify-center rounded-lg bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-md border border-white/10 transition-colors hover:bg-white/20">
                                    <DollarSign className="mr-2 h-4 w-4" /> Catat Transaksi
                                </Link>
                            </div>
                        </div>
                        <div className="hidden lg:block">
                            <div className="flex -space-x-4">
                                {['Ki', 'Jo', 'Na'].map((name) => (
                                    <div key={name} className="h-16 w-16 rounded-full border-4 border-slate-800 bg-slate-900 flex items-center justify-center text-indigo-400 font-bold text-xl shadow-2xl">
                                        {name}
                                    </div>
                                ))}
                            </div>
                            <p className="mt-3 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">Core Team Active</p>
                        </div>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="absolute -bottom-10 left-20 h-32 w-32 rounded-full bg-indigo-400/20 blur-2xl"></div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.totalCustomers || 0}</div>
                            <p className="text-xs text-muted-foreground">Registered leads & clients</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.totalProjects || 0}</div>
                            <p className="text-xs text-muted-foreground">Across all stages</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Rp {new Intl.NumberFormat('id-ID').format(stats?.totalRevenue || 0)}</div>
                            <p className="text-xs text-muted-foreground">From paid transactions</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg. Progress</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">64%</div>
                            <p className="text-xs text-muted-foreground">Project completion rate</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Revenue Overview</CardTitle>
                            <CardDescription>Monthly revenue growth for the last 6 months.</CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={revenueData || []}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="month" />
                                        <YAxis tickFormatter={(value) => `Rp ${value / 1000}k`} />
                                        <Tooltip formatter={(value: any) => `Rp ${new Intl.NumberFormat('id-ID').format(value)}`} />
                                        <Bar dataKey="total" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>Latest actions in the CRM.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-8">
                                {activities && activities.length > 0 ? (
                                    activities.map((activity: any, i: number) => (
                                        <div key={i} className="flex items-center">
                                            <div className={`flex h-9 w-9 items-center justify-center rounded-full border shadow-sm ${
                                                activity.type === 'customer' ? 'bg-blue-100 text-blue-600' :
                                                activity.type === 'project' ? 'bg-green-100 text-green-600' :
                                                'bg-amber-100 text-amber-600'
                                            }`}>
                                                {activity.type === 'customer' ? <Users className="h-4 w-4" /> :
                                                 activity.type === 'project' ? <Briefcase className="h-4 w-4" /> :
                                                 <DollarSign className="h-4 w-4" />}
                                            </div>
                                            <div className="ml-4 space-y-1">
                                                <p className="text-sm font-medium leading-none">{activity.title}</p>
                                                <p className="text-sm text-muted-foreground">{activity.description}</p>
                                            </div>
                                            <div className="ml-auto font-medium text-xs text-muted-foreground">{activity.time}</div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-4">Belum ada aktivitas terbaru.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-7">
                        <CardHeader>
                            <CardTitle>Project Status Distribution</CardTitle>
                            <CardDescription>Visual breakdown of projects across different stages.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={projectsByStatus || []}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="count"
                                            nameKey="status"
                                            // label={({ name, percent }: { name: string, percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {(projectsByStatus || []).map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
