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
  import { type BreadcrumbItem } from "@/types";
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
  
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: "Clients",
      href: "/clients",
    },
  ];
  
  export default function Index() {
    const { clients: initialClients = [] } = usePage().props as {
      clients: {
        id: number;
        name: string;
        telephone: string;
      }[];
    };
  
    const [clients, setClients] = useState(initialClients);
    const [deletingId, setDeletingId] = useState<number | null>(null);
  
    useEffect(() => {
      setClients(initialClients);
    }, [initialClients]);
  
    const handleDelete = (id: number) => {
      setDeletingId(id);
      Inertia.delete(route("clients.destroy", id), {
        onSuccess: () => {
          toast.success("Client deleted successfully!");
          setDeletingId(null);
          Inertia.reload();
        },
        onError: () => {
          toast.error("Failed to delete client.");
          setDeletingId(null);
        },
      });
    };
  
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Clients" />
        <div className="p-4">
          <div className="mb-4 flex justify-end">
            <Link
              href="/clients/create"
              className="rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
            >
              Add Client
            </Link>
          </div>
  
          <Table>
            <TableCaption>Clients List</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Telephone</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.length > 0 ? (
                clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>{client.id}</TableCell>
                    <TableCell>{client.name}</TableCell>
                    <TableCell>{client.telephone}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link
                          href={`/clients/${client.id}/edit`}
                          className="rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600"
                        >
                          Edit
                        </Link>
  
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              type="button"
                              className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Client #{client.id}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete{" "}
                                <strong>{client.name}</strong>? This action
                                cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="flex justify-end gap-2 mt-4">
                              <AlertDialogCancel asChild>
                                <button className="rounded bg-gray-300 px-3 py-1 text-gray-800 hover:bg-gray-400">
                                  Cancel
                                </button>
                              </AlertDialogCancel>
                              <AlertDialogAction asChild>
                                <button
                                  className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600 flex items-center gap-2"
                                  onClick={() => handleDelete(client.id)}
                                  disabled={deletingId === client.id}
                                >
                                  {deletingId === client.id && (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  )}
                                  {deletingId === client.id
                                    ? "Deleting..."
                                    : "Yes, Delete"}
                                </button>
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
                  <TableCell colSpan={4} className="text-center">
                    No clients found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </AppLayout>
    );
  }
  