// resources/js/Pages/Commandes/Edit.tsx
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";
import { Save } from "lucide-react";

interface Client {
  id: number;
  name: string;
}

interface Type {
  id: number;
  name: string;
}

interface Commande {
  id: number;
  client_id: string | number;
  type_id: string | number;
  date: string;
  quantity: number;
  unit_price: number;
  status: string;
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Orders",
    href: "/commandes",
  },
  {
    title: "Edit",
    href: "/commandes/edit",
  },
];

export default function Edit({ commande, clients, types }: { commande: Commande; clients: Client[]; types: Type[] }) {
  const { data, setData, put, processing, errors, clearErrors } = useForm({
    client_id: commande.client_id.toString(),
    type_id: commande.type_id.toString(),
    date: commande.date,
    quantity: commande.quantity,
    unit_price: commande.unit_price,
    status: commande.status,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route("commandes.update", commande.id));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Order" />
      <div className="p-6 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Select */}
          <div className="space-y-2">
            <Label htmlFor="client_id">Client</Label>
            <Select
              onValueChange={(value) => {
                setData("client_id", value);
                if (errors.client_id) clearErrors("client_id");
              }}
              value={data.client_id}
            >
              <SelectTrigger
                id="client_id"
                aria-label="Select a client"
                className={errors.client_id ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id.toString()}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.client_id && (
              <p className="text-sm text-red-500">{errors.client_id}</p>
            )}
          </div>

          {/* Type Select */}
          <div className="space-y-2">
            <Label htmlFor="type_id">Type</Label>
            <Select
              onValueChange={(value) => {
                setData("type_id", value);
                if (errors.type_id) clearErrors("type_id");
              }}
              value={data.type_id}
            >
              <SelectTrigger
                id="type_id"
                aria-label="Select a type"
                className={errors.type_id ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                {types.map((type) => (
                  <SelectItem key={type.id} value={type.id.toString()}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type_id && (
              <p className="text-sm text-red-500">{errors.type_id}</p>
            )}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={data.date}
              onChange={(e) => setData("date", e.target.value)}
            />
            {errors.date && (
              <p className="text-sm text-red-500">{errors.date}</p>
            )}
          </div>

          {/* Quantity and Unit Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={data.quantity}
                onChange={(e) => setData("quantity", parseInt(e.target.value))}
              />
              {errors.quantity && (
                <p className="text-sm text-red-500">{errors.quantity}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit_price">Unit Price</Label>
              <Input
                id="unit_price"
                type="number"
                step="0.01"
                min="0"
                value={data.unit_price}
                onChange={(e) =>
                  setData("unit_price", parseFloat(e.target.value))
                }
              />
              {errors.unit_price && (
                <p className="text-sm text-red-500">{errors.unit_price}</p>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Input
              id="status"
              value={data.status}
              onChange={(e) => setData("status", e.target.value)}
            />
            {errors.status && (
              <p className="text-sm text-red-500">{errors.status}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={processing}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" />
              Modifier
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}