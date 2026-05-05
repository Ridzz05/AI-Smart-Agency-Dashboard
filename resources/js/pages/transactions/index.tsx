import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';

export default function Index({ transactions }: PageProps<{ transactions: any[] }>) {
    return (
        <AuthenticatedLayout
            header="Transactions"
        >
            <Head title="Transactions" />

            <div className="flex flex-col gap-4 p-4 pt-0">
                <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
                <p className="text-muted-foreground">Monitor sales and handle invoices.</p>
                <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">Transaction management UI coming soon...</p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
