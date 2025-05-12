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
  children 
}: { 
  label: string; 
  id: string; 
  error?: string; 
  children: React.ReactNode 
}) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    {children}
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);

export default function Create() {
  const { clients, types } = usePage().props as {
    clients: Client[];
    types: Type[];
  };

  const { data, setData, post, processing, errors, clearErrors, reset } = useForm({
    client_id: "",
    type_id: "",
    date: new Date().toISOString().split('T')[0],
    quantity: 1,
    unit_price: 0,
    status: "",
  });

  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<Partial<{
    clientName: string;
    typeName: string;
    date: string;
    quantity: number;
    unit_price: number;
    total: number;
    status: string;
  }>>({});

  useEffect(() => {
    const firstInput = document.getElementById('client_id');
    if (firstInput) {
      firstInput.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.client_id || !data.type_id) {
      toast.error('Please select both client and type');
      return;
    }

    const clientName = clients.find(c => c.id.toString() === data.client_id.toString())?.name || 'Unknown Client';
    const typeName = types.find(t => t.id.toString() === data.type_id.toString())?.name || 'Unknown Type';
    const total = data.quantity * data.unit_price;

    setReceiptData({
      clientName,
      typeName,
      date: data.date,
      quantity: data.quantity,
      unit_price: data.unit_price,
      total,
      status: data.status,
    });

    setShowReceipt(true);
  };

  const handleConfirmAndSubmit = () => {
    post(route("commandes.store"), {
      data,
      onSuccess: () => {
        toast.success('Order saved and receipt downloaded!');
        reset();
        setShowReceipt(false);
        router.get(route('commandes.index'));
      },
      onError: () => {
        toast.error('Failed to save order.');
      }
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Order" />
      <div className="p-6 max-w-2xl mx-auto">
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
              <SelectTrigger id="type_id" aria-label="Select a type" className={errors.type_id ? "border-red-500" : ""}>
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

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Quantity" id="quantity" error={errors.quantity}>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={data.quantity}
                onChange={(e) => setData("quantity", parseInt(e.target.value))}
              />
            </FormField>

            <FormField label="Unit Price" id="unit_price" error={errors.unit_price}>
              <Input
                id="unit_price"
                type="number"
                step="0.01"
                min="0"
                value={data.unit_price}
                onChange={(e) => setData("unit_price", parseFloat(e.target.value))}
              />
            </FormField>
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
          receiptData={receiptData}
          onConfirm={handleConfirmAndSubmit}
        />
      )}
    </AppLayout>
  );
}
