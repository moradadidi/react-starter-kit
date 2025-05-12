import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { useForm, usePage, router } from "@inertiajs/react";
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
import { Head } from "@inertiajs/react";
import { Save } from "lucide-react";
import ReceiptModal from "@/components/ui/ReceiptModal";

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

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Orders",
    href: "/commandes",
  },
  {
    title: "Create",
    href: "/commandes/create",
  },
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

export default function Create() {
    const { clients = [], types = [] } = usePage().props as {
        clients?: Client[];
        types?: Type[];
      };
      

  const { data, setData, post, processing, errors, clearErrors, reset } = useForm({
    client_id: "",
    type_id: "",
    date: new Date().toISOString().split("T")[0],
    status: "",
    items: [
      {
        designation: "",
        quantity: 1,
        unit_price: 0,
      },
    ],
  });

  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    const firstInput = document.getElementById("client_id");
    if (firstInput) {
      firstInput.focus();
    }
  }, []);

  const handleAddItem = () => {
    setData("items", [...(data.items || []), { designation: "", quantity: 1, unit_price: 0 }]);
  };

  const handleItemChange = (index: number, field: keyof CommandeItem, value: any) => {
    const updatedItems = [...(data.items || [])];
    updatedItems[index][field] = value;
    setData("items", updatedItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.client_id || !data.type_id) {
      toast.error("Please select both client and type");
      return;
    }

    setShowReceipt(true);
  };

  const handleConfirmAndSubmit = () => {
    post(route("commandes.store"), {
      data,
      onSuccess: () => {
        toast.success("Order saved successfully!");
        reset();
        setShowReceipt(false);
        router.get(route("commandes.index"));
      },
      onError: () => {
        toast.error("Failed to save order.");
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Order" />
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
              <SelectTrigger id="client_id" aria-label="Select a client" className={errors.client_id ? "border-red-500" : ""}>
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(clients) &&
                  clients.map((client) => (
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
              <SelectTrigger id="type_id" aria-label="Select a type" className={errors.type_id ? "border-red-500" : ""}>
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
  {Array.isArray(types) &&
    types.map((type) => (
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

          <div className="space-y-4">
            {Array.isArray(data.items) &&
              data.items.map((item, index) => (
                <div key={index} className="grid grid-cols-3 gap-4">
                  <FormField label="Designation" id={`designation-${index}`}>
                    <Input
                      id={`designation-${index}`}
                      value={item.designation}
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
                      value={item.unit_price}
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
            {processing ? "Creating..." : "Enregistrer"}
          </Button>
        </form>
      </div>

      {showReceipt && (
        <ReceiptModal
          isOpen={showReceipt}
          onClose={() => setShowReceipt(false)}
          receiptData={{
            clientName: clients.find((c) => c.id.toString() === data.client_id)?.name || "",
            typeName: types.find((t) => t.id.toString() === data.type_id)?.name || "",
            date: data.date,
            items: data.items || [],
            status: data.status,
          }}
          onConfirm={handleConfirmAndSubmit}
        />
      )}
    </AppLayout>
  );
}
