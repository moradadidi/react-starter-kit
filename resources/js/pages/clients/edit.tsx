import React from "react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast  from "react-hot-toast";
import { Loader2 } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Clients", href: "/clients" },
  { title: "Edit Client", href: "" },
];

export default function EditClient() {
  const { client } = usePage().props as {
    client: {
      id: number;
      name: string;
      telephone: string;
    };
  };

  const { data, setData, post, errors, processing } = useForm({
    name: client.name,
    telephone: client.telephone,
    _method: "PATCH",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    post(route("clients.update", client.id), {
      preserveScroll: true,
      data,
      onSuccess: () => {
        toast.success("Client updated successfully!");
      },
      onError: () => {
        toast.error("Failed to update client. Please check your inputs.");
      },
    });
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Client" />
      <div className="p-4 w-1/2 mx-auto">
        <h1 className="mb-4 text-2xl font-bold">Edit Client</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter client name"
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
              disabled={processing}
              autoFocus
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="telephone">Telephone</Label>
            <Input
              id="telephone"
              type="tel"
              placeholder="Enter client telephone"
              value={data.telephone}
              onChange={(e) => setData("telephone", e.target.value)}
              disabled={processing}
            />
            {errors.telephone && (
              <p className="mt-1 text-sm text-red-500">{errors.telephone}</p>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <Link
              href="/clients"
              className="rounded border border-gray-300 px-4 py-2 font-semibold text-gray-800 hover:bg-gray-100"
            >
              Cancel
            </Link>
            <Button type="submit" disabled={processing}>
              {processing ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </span>
              ) : (
                "Update Client"
              )}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
