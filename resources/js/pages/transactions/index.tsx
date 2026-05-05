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
import { Plus, Trash2, Edit, ExternalLink, Paperclip } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

interface Transaction {
    id: number;
    customer_id: number;
    project_id: number | null;
    amount: number;
    status: 'Pending' | 'Paid' | 'Cancelled';
    invoice_url: string | null;
    attachment_path: string | null;
    customer?: { id: number; name: string };
    project?: { id: number; name: string };
    created_at: string;
}

export default function Index({ transactions, customers, projects }: PageProps<{ 
    transactions: Transaction[], 
    customers: {id: number, name: string}[],
    projects: {id: number, name: string}[]
}>) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        customer_id: '',
        project_id: '',
        amount: '',
        status: 'Pending' as Transaction['status'],
        invoice_url: '',
        attachment: null as File | null,
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingTransaction) {
            put(route('transactions.update', editingTransaction.id), {
                onSuccess: () => {
                    setIsOpen(false);
                    setEditingTransaction(null);
                    reset();
                },
            });
        } else {
            post(route('transactions.store'), {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
            });
        }
    };

    const onEdit = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setData({
            customer_id: transaction.customer_id.toString(),
            project_id: transaction.project_id?.toString() || '',
            amount: transaction.amount.toString(),
            status: transaction.status,
            invoice_url: transaction.invoice_url || '',
        });
        setIsOpen(true);
    };

    const onDelete = (id: number) => {
        destroy(route('transactions.destroy', id));
    };

    return (
        <AuthenticatedLayout
            header="Transactions"
        >
            <Head title="Transactions" />

            <div className="flex flex-col gap-4 p-4 pt-0">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
                        <p className="text-muted-foreground">Monitor sales and handle invoices.</p>
                    </div>
                    
                    <Sheet open={isOpen} onOpenChange={(open) => {
                        setIsOpen(open);
                        if (!open) {
                            setEditingTransaction(null);
                            reset();
                            clearErrors();
                        }
                    }}>
                        <SheetTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Add Transaction
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="sm:max-w-[425px]">
                            <form onSubmit={onSubmit}>
                                <SheetHeader>
                                    <SheetTitle>{editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}</SheetTitle>
                                    <SheetDescription>
                                        Record a new payment or update existing transaction details.
                                    </SheetDescription>
                                </SheetHeader>
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
                                        <FieldLabel htmlFor="project_id">Project (Optional)</FieldLabel>
                                        <Select
                                            value={data.project_id}
                                            onValueChange={value => setData('project_id', value)}
                                        >
                                            <SelectTrigger id="project_id">
                                                <SelectValue placeholder="No Project" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">No Project</SelectItem>
                                                {projects.map(project => (
                                                    <SelectItem key={project.id} value={project.id.toString()}>{project.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.project_id && <FieldDescription className="text-red-500">{errors.project_id}</FieldDescription>}
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="amount">Amount (IDR)</FieldLabel>
                                        <Input 
                                            id="amount" 
                                            type="number"
                                            value={data.amount} 
                                            onChange={e => setData('amount', e.target.value)}
                                            placeholder="500000" 
                                        />
                                        {errors.amount && <FieldDescription className="text-red-500">{errors.amount}</FieldDescription>}
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
                                                <SelectItem value="Pending">Pending</SelectItem>
                                                <SelectItem value="Paid">Paid</SelectItem>
                                                <SelectItem value="Cancelled">Cancelled</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.status && <FieldDescription className="text-red-500">{errors.status}</FieldDescription>}
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="invoice_url">Invoice URL (Link)</FieldLabel>
                                        <Input 
                                            id="invoice_url" 
                                            type="url"
                                            value={data.invoice_url} 
                                            onChange={e => setData('invoice_url', e.target.value)}
                                            placeholder="https://..." 
                                        />
                                        {errors.invoice_url && <FieldDescription className="text-red-500">{errors.invoice_url}</FieldDescription>}
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="attachment">Attachment (Proof of Payment)</FieldLabel>
                                        <Input 
                                            id="attachment" 
                                            type="file"
                                            onChange={e => setData('attachment', e.target.files?.[0] || null)}
                                        />
                                        {errors.attachment && <FieldDescription className="text-red-500">{errors.attachment}</FieldDescription>}
                                    </Field>
                                </div>
                                <SheetFooter>
                                    <Button type="submit" disabled={processing} className="w-full">
                                        {editingTransaction ? 'Update Transaction' : 'Save Transaction'}
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
                                <TableHead>Date</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Project</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Docs</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center">
                                        No transactions found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                transactions.map((transaction) => (
                                    <TableRow key={transaction.id}>
                                        <TableCell className="text-sm">{new Date(transaction.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell className="font-medium">{transaction.customer?.name || '-'}</TableCell>
                                        <TableCell className="text-sm">{transaction.project?.name || '-'}</TableCell>
                                        <TableCell>Rp {new Intl.NumberFormat('id-ID').format(transaction.amount)}</TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                transaction.status === 'Paid' ? 'default' :
                                                transaction.status === 'Pending' ? 'secondary' : 'destructive'
                                            }>
                                                {transaction.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                {transaction.invoice_url && (
                                                    <a href={transaction.invoice_url} target="_blank" rel="noopener noreferrer" title="View Invoice">
                                                        <ExternalLink className="h-4 w-4 text-blue-500 hover:text-blue-600" />
                                                    </a>
                                                )}
                                                {transaction.attachment_path && (
                                                    <a href={`/storage/${transaction.attachment_path}`} target="_blank" rel="noopener noreferrer" title="View Attachment">
                                                        <Paperclip className="h-4 w-4 text-muted-foreground hover:text-blue-500" />
                                                    </a>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon"
                                                    onClick={() => onEdit(transaction)}
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
                                                            <AlertDialogTitle>Delete Transaction?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This will delete this transaction record.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction 
                                                                onClick={() => onDelete(transaction.id)}
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
