import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import toast from "react-hot-toast";

interface ReceiptItem {
  designation: string;
  quantity: number;
  unit_price: number;
}

interface ReceiptProps {
  clientName?: string;
  typeName?: string;
  date?: string;
  items: ReceiptItem[];
  status?: string;
}

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptData: ReceiptProps;
  onConfirm: () => void;
}

export default function ReceiptModal({ isOpen, onClose, receiptData, onConfirm }: ReceiptModalProps) {
    const generatePDF = () => {
        const pdf = new jsPDF();
        const margin = 15;
        let y = margin;
      
        // Title
        pdf.setFontSize(20);
        pdf.setTextColor(33, 37, 41);
        pdf.text("Order Receipt", margin, y);
        y += 12;
      
        // Client & Order Info
        pdf.setFontSize(12);
        pdf.setTextColor(66, 66, 66);
        pdf.text(`Date: ${receiptData.date || 'N/A'}`, margin, (y += 10));
        pdf.text(`Client: ${receiptData.clientName || 'N/A'}`, margin, (y += 8));
        pdf.text(`Product Type: ${receiptData.typeName || 'N/A'}`, margin, (y += 8));
        pdf.text(`Status: ${receiptData.status || 'N/A'}`, margin, (y += 10));
      
        // Table Headers
        y += 5;
        pdf.setDrawColor(200);
        pdf.line(margin, y, 195 - margin, y);
        y += 5;
      
        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);
        pdf.text("Designation", margin, y);
        pdf.text("Qty", margin + 80, y);
        pdf.text("Unit Price", margin + 110, y);
        pdf.text("Subtotal", margin + 150, y);
        y += 6;
      
        pdf.setDrawColor(220);
        pdf.line(margin, y, 195 - margin, y);
        y += 4;
      
        // Items
        let total = 0;
        receiptData.items.forEach((item) => {
          const subtotal = item.unit_price * item.quantity;
          total += subtotal;
      
          pdf.text(item.designation, margin, y);
          pdf.text(`${item.quantity}`, margin + 85, y);
          pdf.text(`$${item.unit_price.toFixed(2)}`, margin + 110, y);
          pdf.text(`$${subtotal.toFixed(2)}`, margin + 150, y);
      
          y += 8;
          if (y > 270) {
            pdf.addPage();
            y = margin;
          }
        });
      
        // Total
        y += 10;
        pdf.setDrawColor(100);
        pdf.line(margin, y, 195 - margin, y);
        y += 10;
      
        pdf.setFontSize(14);
        pdf.setTextColor(33, 37, 41);
        pdf.text(`Total: $${total.toFixed(2)}`, margin, y);
      
        pdf.save(`receipt-${Date.now()}.pdf`);
        onClose();
        onConfirm();
      };
      
      

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Order Receipt</DialogTitle>
        </DialogHeader>

        {/* Receipt Content */}
        <div
          id="receipt-content"
          className="p-6 bg-white text-black rounded-lg shadow-md print-safe"
          style={{
            color: '#000',
            backgroundColor: '#fff',
          }}
        >
          <h2 className="text-2xl font-bold mb-4">ORDER RECEIPT</h2>
          <div className="space-y-2 mb-6">
            <p><strong>Date:</strong> {receiptData.date || 'N/A'}</p>
            <p><strong>Client:</strong> {receiptData.clientName || 'N/A'}</p>
            <p><strong>Product:</strong> {receiptData.typeName || 'N/A'}</p>

            {receiptData.items.map((item, idx) => (
              <div key={idx} className="ml-4">
                <p><strong>Item:</strong> {item.designation}</p>
                <p><strong>Qty:</strong> {item.quantity}</p>
                <p><strong>Unit Price:</strong> ${item.unit_price.toFixed(2)}</p>
              </div>
            ))}

            <p><strong>Status:</strong> {receiptData.status || 'N/A'}</p>
            <p className="text-lg font-bold mt-4">
              <strong>Total:</strong> $
              {receiptData.items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={generatePDF}>Download PDF & Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
