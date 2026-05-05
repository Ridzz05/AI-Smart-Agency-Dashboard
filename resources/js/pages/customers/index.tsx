import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Edit } from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
} from "@/components/ui/sheet"
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
import {
    Field,
    FieldDescription,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useForm } from "@inertiajs/react"
import { useState } from "react"

interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
    status: 'Lead' | 'Active' | 'Past';
}

export default function Index({ customers }: PageProps<{ customers: Customer[] }>) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        status: 'Lead' as Customer['status'],
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCustomer) {
            put(route('customers.update', editingCustomer.id), {
                onSuccess: () => {
                    setIsOpen(false);
                    setEditingCustomer(null);
                    reset();
                },
            });
        } else {
            post(route('customers.store'), {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
            });
        }
    };

    const onEdit = (customer: Customer) => {
        setEditingCustomer(customer);
        setData({
            name: customer.name,
            email: customer.email,
            phone: customer.phone || '',
            address: customer.address || '',
            status: customer.status,
        });
        setIsOpen(true);
    };

    const onDelete = (id: number) => {
        destroy(route('customers.destroy', id));
    };

    return (
        <AuthenticatedLayout
            header="Customers"
        >
            <Head title="Customers" />

            <div className="flex flex-col gap-4 p-4 pt-0">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">Customer Management</h1>
                    
                    <Sheet open={isOpen} onOpenChange={(open) => {
                        setIsOpen(open);
                        if (!open) {
                            setEditingCustomer(null);
                            reset();
                            clearErrors();
                        }
                    }}>
                        <SheetTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Add Customer
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="sm:max-w-[425px]">
                            <form onSubmit={onSubmit}>
                                <SheetHeader>
                                    <SheetTitle>{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</SheetTitle>
                                    <SheetDescription>
                                        Fill in the details below to {editingCustomer ? 'update the' : 'create a new'} customer.
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="grid gap-4 py-4">
                                    <Field>
                                        <FieldLabel htmlFor="name">Full Name</FieldLabel>
                                        <Input 
                                            id="name" 
                                            value={data.name} 
                                            onChange={e => setData('name', e.target.value)}
                                            placeholder="John Doe" 
                                        />
                                        {errors.name && <FieldDescription className="text-red-500">{errors.name}</FieldDescription>}
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="email">Email Address</FieldLabel>
                                        <Input 
                                            id="email" 
                                            type="email" 
                                            value={data.email} 
                                            onChange={e => setData('email', e.target.value)}
                                            placeholder="john@example.com" 
                                        />
                                        {errors.email && <FieldDescription className="text-red-500">{errors.email}</FieldDescription>}
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                                        <Input 
                                            id="phone" 
                                            value={data.phone} 
                                            onChange={e => setData('phone', e.target.value)}
                                            placeholder="+62..." 
                                        />
                                        {errors.phone && <FieldDescription className="text-red-500">{errors.phone}</FieldDescription>}
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="address">Address</FieldLabel>
                                        <Textarea
                                            id="address"
                                            value={data.address}
                                            onChange={e => setData('address', e.target.value)}
                                            placeholder="Full address..."
                                        />
                                        {errors.address && <FieldDescription className="text-red-500">{errors.address}</FieldDescription>}
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
                                                <SelectItem value="Lead">Lead</SelectItem>
                                                <SelectItem value="Active">Active</SelectItem>
                                                <SelectItem value="Past">Past</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.status && <FieldDescription className="text-red-500">{errors.status}</FieldDescription>}
                                    </Field>
                                </div>
                                <SheetFooter>
                                    <Button type="submit" disabled={processing} className="w-full">
                                        {editingCustomer ? 'Update Customer' : 'Save Customer'}
                                    </Button>
                                </SheetFooter>
                            </form>
                        </SheetContent>
                    </Sheet>
                </div>

                <div className="rounded-md border bg-card text-card-foreground shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No customers found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                customers.map((customer) => (
                                    <TableRow key={customer.id}>
                                        <TableCell className="font-medium">{customer.name}</TableCell>
                                        <TableCell>{customer.email}</TableCell>
                                        <TableCell>{customer.phone || '-'}</TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                customer.status === 'Active' ? 'default' :
                                                customer.status === 'Lead' ? 'secondary' : 'outline'
                                            }>
                                                {customer.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon"
                                                    onClick={() => onEdit(customer)}
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
                                                                This action cannot be undone. This will permanently delete the customer
                                                                <strong> {customer.name}</strong> and all associated data.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction 
                                                                onClick={() => onDelete(customer.id)}
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
