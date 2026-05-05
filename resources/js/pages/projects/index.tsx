import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Plus, Trash2, Edit } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import {
    Field,
    FieldDescription,
    FieldLabel,
} from "@/components/ui/field"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface Project {
    id: number;
    customer_id: number;
    name: string;
    description: string | null;
    status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
    deadline: string | null;
    progress: number;
    customer?: {
        id: number;
        name: string;
    }
}

export default function Index({ projects, customers }: PageProps<{ projects: Project[], customers: {id: number, name: string}[] }>) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        customer_id: '',
        name: '',
        description: '',
        status: 'Planning' as Project['status'],
        deadline: '',
        progress: 0,
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProject) {
            put(route('projects.update', editingProject.id), {
                onSuccess: () => {
                    setIsOpen(false);
                    setEditingProject(null);
                    reset();
                },
            });
        } else {
            post(route('projects.store'), {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
            });
        }
    };

    const onEdit = (project: Project) => {
        setEditingProject(project);
        setData({
            customer_id: project.customer_id.toString(),
            name: project.name,
            description: project.description || '',
            status: project.status,
            deadline: project.deadline || '',
            progress: project.progress,
        });
        setIsOpen(true);
    };

    const onDelete = (id: number) => {
        destroy(route('projects.destroy', id));
    };

    return (
        <AuthenticatedLayout
            header="Projects"
        >
            <Head title="Projects" />

            <div className="flex flex-col gap-4 p-4 pt-0">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
                        <p className="text-muted-foreground">Manage your active projects and track progress.</p>
                    </div>
                    
                    <Dialog open={isOpen} onOpenChange={(open) => {
                        setIsOpen(open);
                        if (!open) {
                            setEditingProject(null);
                            reset();
                            clearErrors();
                        }
                    }}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Add Project
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <form onSubmit={onSubmit}>
                                <DialogHeader>
                                    <DialogTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
                                    <DialogDescription>
                                        Fill in the details below to {editingProject ? 'update the' : 'create a new'} project.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <Field>
                                        <FieldLabel htmlFor="customer_id">Customer</FieldLabel>
                                        <Select
                                            value={data.customer_id}
                                            onValueChange={value => setData('customer_id', value)}
                                        >
                                            <SelectTrigger id="customer_id">
                                                <SelectValue placeholder="Select Customer" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {customers.map(customer => (
                                                    <SelectItem key={customer.id} value={customer.id.toString()}>{customer.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.customer_id && <FieldDescription className="text-red-500">{errors.customer_id}</FieldDescription>}
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="name">Project Name</FieldLabel>
                                        <Input 
                                            id="name" 
                                            value={data.name} 
                                            onChange={e => setData('name', e.target.value)}
                                            placeholder="Website Redesign" 
                                        />
                                        {errors.name && <FieldDescription className="text-red-500">{errors.name}</FieldDescription>}
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="description">Description</FieldLabel>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={e => setData('description', e.target.value)}
                                            placeholder="Project details..."
                                        />
                                        {errors.description && <FieldDescription className="text-red-500">{errors.description}</FieldDescription>}
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="status">Status</FieldLabel>
                                        <Select
                                            value={data.status}
                                            onValueChange={value => setData('status', value as any)}
                                        >
                                            <SelectTrigger id="status">
                                                <SelectValue placeholder="Select Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Planning">Planning</SelectItem>
                                                <SelectItem value="In Progress">In Progress</SelectItem>
                                                <SelectItem value="Completed">Completed</SelectItem>
                                                <SelectItem value="On Hold">On Hold</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.status && <FieldDescription className="text-red-500">{errors.status}</FieldDescription>}
                                    </Field>
                                    <Field>
                                        <div className="flex justify-between">
                                            <FieldLabel htmlFor="progress">Progress ({data.progress}%)</FieldLabel>
                                        </div>
                                        <div className="pt-2">
                                            <Slider
                                                id="progress"
                                                min={0}
                                                max={100}
                                                step={1}
                                                value={[data.progress]}
                                                onValueChange={(value) => setData('progress', value[0])}
                                            />
                                        </div>
                                        {errors.progress && <FieldDescription className="text-red-500">{errors.progress}</FieldDescription>}
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="deadline">Deadline</FieldLabel>
                                        <div className="flex flex-col gap-2 pt-1">
                                            <Popover modal={true}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal h-10",
                                                            !data.deadline && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {data.deadline ? format(new Date(data.deadline), "PPP") : <span>Pick a date</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={data.deadline ? new Date(data.deadline) : undefined}
                                                        onSelect={(date) => setData('deadline', date ? format(date, 'yyyy-MM-dd') : '')}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                        {errors.deadline && <FieldDescription className="text-red-500">{errors.deadline}</FieldDescription>}
                                    </Field>
                                </div>
                                <DialogFooter className="mt-6">
                                    <Button type="submit" className="w-full" disabled={processing}>
                                        {editingProject ? 'Update Project' : 'Save Project'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="rounded-md border bg-card text-card-foreground shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Project Name</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Progress</TableHead>
                                <TableHead>Deadline</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {projects.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        No projects found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                projects.map((project) => (
                                    <TableRow key={project.id}>
                                        <TableCell className="font-medium">{project.name}</TableCell>
                                        <TableCell>{project.customer?.name || '-'}</TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                project.status === 'Completed' ? 'default' :
                                                project.status === 'In Progress' ? 'secondary' : 'outline'
                                            }>
                                                {project.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="w-[150px]">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs text-muted-foreground">{project.progress}%</span>
                                                <Progress value={project.progress} className="h-1.5" />
                                            </div>
                                        </TableCell>
                                        <TableCell>{project.deadline || '-'}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon"
                                                    onClick={() => onEdit(project)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This will delete the project <strong>{project.name}</strong>.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction 
                                                                onClick={() => onDelete(project.id)}
                                                                className="bg-red-500 hover:bg-red-600"
                                                            >
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
