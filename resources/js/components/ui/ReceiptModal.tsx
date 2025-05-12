import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import toast from "react-hot-toast";

interface ReceiptProps {
  clientName?: string;
  typeName?: string;
  date?: string;
  quantity?: number;
  unit_price?: number;
  total?: number;
  status?: string;
}

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptData: ReceiptProps;
}

export default function ReceiptModal({ isOpen, onClose, receiptData }: ReceiptModalProps) {
  const generatePDF = async () => {
    const receipt = document.getElementById('receipt-content');
    if (!receipt) return;

    try {
      // Ensure styles are applied before capturing
      receipt.classList.add('receipt-print');

      const canvas = await html2canvas(receipt, {
        backgroundColor: '#FFFFFF',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`receipt-${Date.now()}.pdf`);

      receipt.classList.remove('receipt-print');
      onClose();

    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("Failed to generate PDF.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Order Receipt</DialogTitle>
        </DialogHeader>

        {/* Receipt Content */}
        <div id="receipt-content" className="p-6 bg-white text-black rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">ORDER RECEIPT</h2>
          <div className="space-y-2 mb-6">
            <p><strong>Date:</strong> {receiptData.date || 'N/A'}</p>
            <p><strong>Client:</strong> {receiptData.clientName || 'N/A'}</p>
            <p><strong>Product:</strong> {receiptData.typeName || 'N/A'}</p>
            <p><strong>Quantity:</strong> {receiptData.quantity || 0}</p>
            <p><strong>Unit Price:</strong> ${receiptData.unit_price?.toFixed(2) || '0.00'}</p>
            <p><strong>Status:</strong> {receiptData.status || 'N/A'}</p>
            <p className="text-lg font-bold mt-4">
              <strong>Total:</strong> ${receiptData.total?.toFixed(2) || '0.00'}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button onClick={generatePDF}>Download PDF</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}