"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Truck } from "lucide-react";

interface AdminOrderStatusUpdaterProps {
  orderId: string;
  currentStatus: string;
  trackingNumber: string;
  courierPartner: string;
  adminNotes: string;
}

export function AdminOrderStatusUpdater({
  orderId,
  currentStatus,
  trackingNumber: initialTracking,
  courierPartner: initialCourier,
  adminNotes: initialNotes,
}: AdminOrderStatusUpdaterProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [trackingNumber, setTrackingNumber] = useState(initialTracking);
  const [courierPartner, setCourierPartner] = useState(initialCourier);
  const [adminNotes, setAdminNotes] = useState(initialNotes);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage("");

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          trackingNumber,
          courierPartner,
          adminNotes,
        }),
      });

      if (res.ok) {
        setMessage("Order updated successfully!");
        router.refresh();
      } else {
        setMessage("Failed to update order");
      }
    } catch {
      setMessage("Error connecting to server");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3", padding: "24px" }}>
      <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "16px", marginBottom: "16px" }}>
        Fulfillment & Status Control
      </h3>

      {message && (
        <div
          style={{
            backgroundColor: message.includes("success") ? "#E8F5E9" : "#FEE2E2",
            color: message.includes("success") ? "#2C6E3F" : "#991B1B",
            padding: "8px 12px",
            fontSize: "12px",
            marginBottom: "16px",
          }}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <div>
          <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
            Order Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input"
            style={{ fontSize: "13px", padding: "8px 12px" }}
          >
            <option value="PENDING">Pending Payment</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PAYMENT_RECEIVED">✅ Payment Received</option>
            <option value="PROCESSING">Processing / Cutting Fabric</option>
            <option value="PACKED">Packed in Store</option>
            <option value="SHIPPED">Handed to Courier (Shipped)</option>
            <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
            <option value="DELIVERED">Delivered to Customer</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="RETURN_REQUESTED">Return Requested</option>
            <option value="RETURNED">Returned</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>


        <button
          type="submit"
          disabled={isUpdating}
          className="btn btn-primary btn-sm"
          style={{ width: "100%", padding: "10px" }}
        >
          {isUpdating ? "Saving..." : "Update Order Status"}
        </button>
      </form>
    </div>
  );
}
