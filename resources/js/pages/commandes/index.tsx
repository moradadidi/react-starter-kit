import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, Link, usePage } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";  // Use date-fns for date formatting

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Orders",
        href: "/commandes",
    },
];

export default function Index() {
    const { commandes: initialCommandes = [] } = usePage().props as {
        commandes: {
            id: number;
            client: { name: string };
            type: { name: string };
            date: string;
            total_due: number; // Adjusted to match the controller property
            status: string;
        }[];
    };

    const [commandes, setCommandes] = useState(initialCommandes);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    useEffect(() => {
        setCommandes(initialCommandes);
    }, [initialCommandes]);

    const handleDelete = (id: number) => {
        setDeletingId(id);
        Inertia.delete(route("commandes.destroy", id), {
            onSuccess: () => {
                toast.success("Order deleted successfully!");
                setDeletingId(null);
                setCommandes(commandes.filter((cmd) => cmd.id !== id));
            },
            onError: () => {
                toast.error("Failed to delete order.");
                setDeletingId(null);
            },
        });
        toast.success("Order deleted successfully!");
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Orders" />
            <div className="p-6">
                <div className="mb-4 flex justify-end">
                    <Link
                        href="/commandes/create"
                        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                    >
                        Add Order
                    </Link>
                </div>

                <Table>
                    <TableCaption>Orders List</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {commandes.length > 0 ? (
                            commandes.map((cmd) => (
                                <TableRow key={cmd.id}>
                                    <TableCell>{cmd.id}</TableCell>
                                    <TableCell>{cmd.client?.name || "N/A"}</TableCell>
                                    <TableCell>{cmd.type?.name || "N/A"}</TableCell>
                                    <TableCell>{format(new Date(cmd.date), 'dd/MM/yyyy')}</TableCell> {/* Formatted date */}
                                    <TableCell>${cmd.total_due.toFixed(2)}</TableCell> {/* Use total_due */}
                                    <TableCell>{cmd.status}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/commandes/${cmd.id}/edit`}
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                <Pencil size={18} />
                                            </Link>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <button
                                                        type="button"
                                                        className="text-red-500 hover:text-red-700"
                                                        disabled={deletingId === cmd.id}
                                                    >
                                                        {deletingId === cmd.id ? (
                                                            <Loader2 className="h-5 w-5 animate-spin" />
                                                        ) : (
                                                            <Trash2 size={18} />
                                                        )}
                                                    </button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            Delete Order #{cmd.id}
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to delete this order? This
                                                            action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <div className="flex justify-end gap-2 mt-4">
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDelete(cmd.id)}
                                                        >
                                                            Delete
                                                        </AlertDialogAction>
                                                    </div>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center">
                                    No orders found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </AppLayout>
    );
}
