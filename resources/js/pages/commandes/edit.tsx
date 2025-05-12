// resources/js/Pages/Commandes/Edit.tsx
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { useForm } from "@inertiajs/react";
import { useEffect } from "react";
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
import { Head } from "@inertiajs/react";

interface Client {
  id: number;
  name: string;
}

interface Type {
  id: number;
  name: string;
}

interface CommandeItem {
  designation: string;
  quantity: number;
  unit_price: number;
}

interface Commande {
  id: number;
  client_id: string | number;
  type_id: string | number;
  date: string;
  status: string;
  items: CommandeItem[];
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Orders", href: "/commandes" },
  { title: "Edit", href: "/commandes/edit" },
];

const FormField = ({
  label,
  id,
  error,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    {children}
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);

export default function Edit({
  commande,
  clients,
  types,
}: {
  commande: Commande;
  clients: Client[];
  types: Type[];
}) {
  const { data, setData, put, processing, errors, clearErrors } = useForm({
    client_id: commande.client_id.toString(),
    type_id: commande.type_id.toString(),
    date: commande.date,
    status: commande.status,
    items: commande.items || [],
  });

  const handleItemChange = (index: number, field: keyof CommandeItem, value: any) => {
    const updatedItems = [...data.items];
    updatedItems[index][field] = value;
    setData("items", updatedItems);
  };

  const handleAddItem = () => {
    setData("items", [...data.items, { designation: "", quantity: 1, unit_price: 0 }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route("commandes.update", commande.id), {
      onSuccess: () => toast.success("Order updated successfully!"),
      onError: () => toast.error("Failed to update order."),
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Order" />
      <div className="p-6 max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">

          <FormField label="Client" id="client_id" error={errors.client_id}>
            <Select
              onValueChange={(value) => {
                setData("client_id", value);
                if (errors.client_id) clearErrors("client_id");
              }}
              value={data.client_id}
            >
              <SelectTrigger id="client_id">
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
          </FormField>

          <FormField label="Type" id="type_id" error={errors.type_id}>
            <Select
              onValueChange={(value) => {
                setData("type_id", value);
                if (errors.type_id) clearErrors("type_id");
              }}
              value={data.type_id}
            >
              <SelectTrigger id="type_id">
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
          </FormField>

          <FormField label="Date" id="date" error={errors.date}>
            <Input
              id="date"
              type="date"
              value={data.date}
              onChange={(e) => setData("date", e.target.value)}
            />
          </FormField>

          {/* Items Editing Section */}
          <div className="space-y-4">
            {data.items.map((item, index) => (
              <div key={index} className="grid grid-cols-3 gap-4">
                <FormField label="Designation" id={`designation-${index}`}>
                  <Input
                    id={`designation-${index}`}
                    value={item.part_name}
                    onChange={(e) => handleItemChange(index, "designation", e.target.value)}
                  />
                </FormField>
                <FormField label="Quantity" id={`quantity-${index}`}>
                  <Input
                    id={`quantity-${index}`}
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value))}
                  />
                </FormField>
                <FormField label="Unit Price" id={`unit_price-${index}`}>
                  <Input
                    id={`unit_price-${index}`}
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.rate}
                    onChange={(e) => handleItemChange(index, "unit_price", parseFloat(e.target.value))}
                  />
                </FormField>
              </div>
            ))}
            <Button type="button" variant="secondary" onClick={handleAddItem}>
              + Add Item
            </Button>
          </div>

          <FormField label="Status" id="status" error={errors.status}>
            <Input
              id="status"
              value={data.status}
              onChange={(e) => setData("status", e.target.value)}
            />
          </FormField>

          <Button
            type="submit"
            disabled={processing}
            className="w-full flex items-center justify-center gap-2"
          >
            {processing && (
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            )}
            <Save className="h-4 w-4" />
            {processing ? "Updating..." : "Modifier"}
          </Button>
        </form>
      </div>
    </AppLayout>
  );
}
