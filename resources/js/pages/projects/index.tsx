import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';

export default function Index({ projects }: PageProps<{ projects: any[] }>) {
    return (
        <AuthenticatedLayout
            header="Projects"
        >
            <Head title="Projects" />

            <div className="flex flex-col gap-4 p-4 pt-0">
                <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
                <p className="text-muted-foreground">Manage your active projects and track progress.</p>
                <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">Project management UI coming soon...</p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
