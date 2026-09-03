"use client";

import { useState } from "react";
import { MapPin, Plus, Edit2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/lib/store";

export default function AddressesClient({ initialAddresses }: { initialAddresses: any[] }) {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();
  const { showNotification } = useUIStore();

  const handleAddNew = () => {
    setCurrentAddress({
      fullName: "",
      phone: "",
      house: "",
      street: "",
      area: "",
      city: "Latur",
      state: "Maharashtra",
      pinCode: "413512",
      landmark: "",
      type: "HOME",
    });
    setIsEditing(true);
  };

  const handleEdit = (addr: any) => {
    setCurrentAddress({ ...addr });
    setIsEditing(true);
  };

  const handlePinCodeChange = (pincodeVal: string) => {
    const cleaned = pincodeVal.replace(/\D/g, "").slice(0, 6);
    setCurrentAddress((prev: any) => ({ ...prev, pinCode: cleaned }));

    if (cleaned.length === 6) {
      if (cleaned.startsWith("413512") || cleaned.startsWith("4135")) {
        setCurrentAddress((prev: any) => ({ ...prev, city: "Latur", state: "Maharashtra" }));
      } else if (cleaned.startsWith("411")) {
        setCurrentAddress((prev: any) => ({ ...prev, city: "Pune", state: "Maharashtra" }));
      } else if (cleaned.startsWith("400")) {
        setCurrentAddress((prev: any) => ({ ...prev, city: "Mumbai", state: "Maharashtra" }));
      } else if (cleaned.startsWith("431")) {
        setCurrentAddress((prev: any) => ({ ...prev, city: "Chhatrapati Sambhajinagar", state: "Maharashtra" }));
      } else if (cleaned.startsWith("416")) {
        setCurrentAddress((prev: any) => ({ ...prev, city: "Kolhapur", state: "Maharashtra" }));
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const isUpdate = !!currentAddress.id;
      const res = await fetch("/api/account/addresses", {
        method: isUpdate ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentAddress),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save address");

      if (isUpdate) {
        setAddresses(addresses.map((a) => (a.id === data.address.id ? data.address : a)));
        showNotification("Address updated successfully", "success");
      } else {
        setAddresses([data.address, ...addresses]);
        showNotification("Address added successfully", "success");
      }
      setIsEditing(false);
      setCurrentAddress(null);
      router.refresh();
    } catch (err: any) {
      showNotification(err.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      const res = await fetch("/api/account/addresses", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete address");
      setAddresses(addresses.filter((a) => a.id !== id));
      showNotification("Address deleted", "success");
      router.refresh();
    } catch (err: any) {
      showNotification(err.message, "error");
    }
  };

  if (isEditing) {
    return (
      <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3", padding: "24px" }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", marginBottom: "20px" }}>
          {currentAddress?.id ? "Edit Address" : "Add New Address"}
        </h2>
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }} className="sm:grid-cols-2">
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Full Name *</label>
              <input required type="text" className="input" value={currentAddress.fullName} onChange={(e) => setCurrentAddress({...currentAddress, fullName: e.target.value})} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Phone Number *</label>
              <input required type="tel" className="input" value={currentAddress.phone} onChange={(e) => setCurrentAddress({...currentAddress, phone: e.target.value})} />
            </div>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }} className="sm:grid-cols-3">
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>PIN Code *</label>
              <input required type="text" className="input" maxLength={6} value={currentAddress.pinCode} onChange={(e) => handlePinCodeChange(e.target.value)} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>City *</label>
              <input required type="text" className="input" value={currentAddress.city} onChange={(e) => setCurrentAddress({...currentAddress, city: e.target.value})} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>State *</label>
              <input required type="text" className="input" value={currentAddress.state} onChange={(e) => setCurrentAddress({...currentAddress, state: e.target.value})} />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Flat, House no., Building, Apartment *</label>
            <input required type="text" className="input" value={currentAddress.house} onChange={(e) => setCurrentAddress({...currentAddress, house: e.target.value})} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Street, Sector, Area *</label>
            <input required type="text" className="input" value={currentAddress.street} onChange={(e) => setCurrentAddress({...currentAddress, street: e.target.value})} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Landmark (Optional)</label>
            <input type="text" className="input" value={currentAddress.landmark || ""} onChange={(e) => setCurrentAddress({...currentAddress, landmark: e.target.value})} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>Address Type</label>
            <div style={{ display: "flex", gap: "12px" }}>
              {["HOME", "WORK", "OTHER"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setCurrentAddress({...currentAddress, type})}
                  style={{
                    padding: "8px 16px",
                    fontSize: "12px",
                    fontWeight: currentAddress.type === type ? 600 : 400,
                    border: currentAddress.type === type ? "1.5px solid #1A1918" : "1px solid #E4DDD3",
                    backgroundColor: currentAddress.type === type ? "#1A1918" : "white",
                    color: currentAddress.type === type ? "white" : "#1A1918",
                    cursor: "pointer",
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: "16px", display: "flex", gap: "12px", justifyContent: "flex-end" }}>
            <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary" style={{ padding: "10px 20px" }}>Cancel</button>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ padding: "10px 20px" }}>
              {isSubmitting ? "Saving..." : "Save Address"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
        <button onClick={handleAddNew} className="btn btn-primary btn-sm" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
          <Plus size={16} /> Add New Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3", padding: "60px 20px", textAlign: "center" }}>
          <MapPin size={44} style={{ margin: "0 auto 16px", color: "#8A8279" }} />
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "22px", marginBottom: "8px" }}>
            No Saved Addresses
          </h2>
          <p style={{ fontSize: "14px", color: "#8A8279", marginBottom: "24px" }}>
            You haven't added any addresses yet. Add one now for quicker checkout.
          </p>
          <button onClick={handleAddNew} className="btn btn-primary">
            Add Address
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }} className="sm:grid-cols-2">
          {addresses.map((addr) => (
            <div key={addr.id} style={{ backgroundColor: "white", border: "1px solid #E4DDD3", padding: "20px", position: "relative" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", backgroundColor: "#F3EFEA", color: "#1A1918" }}>
                  {addr.type}
                </span>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button onClick={() => handleEdit(addr)} style={{ background: "none", border: "none", cursor: "pointer", color: "#8A8279" }}>
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(addr.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9E3B2B" }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#1A1918", marginBottom: "4px" }}>
                {addr.fullName}
              </h3>
              <p style={{ fontSize: "13px", color: "#8A8279", lineHeight: 1.6 }}>
                {addr.house}, {addr.street}
                <br />
                {addr.area && `${addr.area}, `}
                {addr.city}, {addr.state} - {addr.pinCode}
                {addr.landmark && <br />}
                {addr.landmark && `Landmark: ${addr.landmark}`}
              </p>
              <p style={{ fontSize: "13px", color: "#1A1918", marginTop: "8px", fontWeight: 500 }}>
                Phone: +91 {addr.phone}
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
