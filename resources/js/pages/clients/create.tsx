import React from "react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, useForm, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast  from "react-hot-toast";
import { Loader2 } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Clients", href: "/clients" },
  { title: "Create Client", href: "/clients/create" },
];

export default function CreateClient() {
  const { data, setData, post, errors, processing } = useForm({
    name: "",
    telephone: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    post(route("clients.store"), {
      onSuccess: () => {
        toast.success("Client created successfully!");
      },
      onError: () => {
        toast.error("Failed to create client. Please check your inputs.");
      },
    });
    
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Client" />
      <div className="p-4 w-1/2 mx-auto">
        <h1 className="mb-4 text-2xl font-bold">Create Client</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
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
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Telephone Field */}
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

          {/* Action Buttons */}
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
                  Creating...
                </span>
              ) : (
                "Create Client"
              )}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
