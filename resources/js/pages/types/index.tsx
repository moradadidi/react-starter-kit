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
  import toast  from "react-hot-toast";
  import { useEffect, useState } from "react";
  import { Loader2 } from "lucide-react";
  
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: "Plastic Types",
      href: "/types",
    },
  ];
  
  export default function Index() {
    const { types: initialTypes = [] } = usePage().props as {
      types: {
        id: number;
        name: string;
      }[];
    };
  
    const [types, setTypes] = useState(initialTypes);
    const [deletingId, setDeletingId] = useState<number | null>(null);
  
    useEffect(() => {
      setTypes(initialTypes);
    }, [initialTypes]);
  
    const handleDelete = (id: number) => {
      setDeletingId(id);
      Inertia.delete(route("types.destroy", id), {
        onSuccess: () => {
          toast.success("Type deleted successfully!");
          setDeletingId(null);
          Inertia.reload();
        },
        onError: () => {
          toast.error("Failed to delete type.");
          setDeletingId(null);
        },
      });
    };
  
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Types" />
        <div className="p-4">
          <div className="mb-4 flex justify-end">
            <Link
              href="/types/create"
              className="rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
            >
              Add Type
            </Link>
          </div>
  
          <Table>
            <TableCaption>Types List</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {types.length > 0 ? (
                types.map((type) => (
                  <TableRow key={type.id}>
                    <TableCell>{type.id}</TableCell>
                    <TableCell>{type.name}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link
                          href={`/types/${type.id}/edit`}
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
                                Delete Type #{type.id}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete{" "}
                                <strong>{type.name}</strong>? This action cannot
                                be undone.
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
                                  onClick={() => handleDelete(type.id)}
                                  disabled={deletingId === type.id}
                                >
                                  {deletingId === type.id && (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  )}
                                  {deletingId === type.id
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
                  <TableCell colSpan={3} className="text-center">
                    No types found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </AppLayout>
    );
  }
  