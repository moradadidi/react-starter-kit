import React from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, useForm, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast  from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function CreateType() {
  const { data, setData, post, processing, errors } = useForm({ name: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    post(route("types.store"), {
      onSuccess: () => toast.success("Type created successfully!"),
      onError: () => toast.error("Failed to create type."),
    });
  }

  return (
    <AppLayout>
      <Head title="Create Plastic Type" />
      <div className="p-4 w-1/2 mx-auto">
        <h1 className="mb-4 text-2xl font-bold">Create Type</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
              disabled={processing}
              autoFocus
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>
          <div className="flex justify-end gap-4">
            <Link
              href="/types"
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
                "Create Type"
              )}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
