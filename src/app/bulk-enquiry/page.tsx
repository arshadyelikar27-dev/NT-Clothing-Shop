import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bulk Order Enquiry — NOBLE TEXTILE",
  description: "Submit a bulk order or wholesale enquiry to Noble Textile. For large quantity orders of fabrics, dress materials, sarees, kurtis and more.",
};

import { BulkEnquiryClient } from "./BulkEnquiryClient";

export default function BulkEnquiryPage() {
  return <BulkEnquiryClient />;
}
