"use client"

import React from "react"; // Added import
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download, Printer } from "lucide-react"
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

type OrderItem = {
  name: string
  quantity: number
  price: number
  salePrice: number | null
  image: string
  options?: string
}

type OrderProps = {
  _id: string
  orderStatus: string
  paymentStatus: string
  paymentMethod: string
  shippingAddress: {
    fullName: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
    phone: string
    landmark?: string; // Added landmark
  }
  customImage?: {
    data: string;
    description: string;
  }
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  estimatedDelivery: string
  createdAt: string
}

// Create styles for PDF
const styles = {
  page: {
    padding: "20px",
    fontFamily: "Helvetica",
  },
  section: {
    marginBottom: "10px",
  },
  infoRow: {
    flexDirection: "row" as const,
    marginBottom: "5px",
  },
  infoLabel: {
    fontWeight: "bold" as const,
    marginRight: "5px",
  },
  infoValue: {},
  addressBox: {
    border: "1px solid #eee",
    padding: "10px",
    marginBottom: "10px",
  },
  tableHeader: {
    flexDirection: "row" as const,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid" as const,
    alignItems: "center" as const,
    textAlign: "center" as const,
    fontWeight: "bold" as const,
  },
  row: {
    flexDirection: "row" as const,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    borderBottomStyle: "solid" as const,
    alignItems: "center" as const,
    paddingTop: "5px",
    paddingBottom: "5px",
  },
  description: {
    width: "60%",
    textAlign: "left" as const,
    paddingLeft: "5px",
  },
  qty: {
    width: "10%",
    textAlign: "right" as const,
  },
  price: {
    width: "15%",
    textAlign: "right" as const,
  },
  amount: {
    width: "15%",
    textAlign: "right" as const,
    paddingRight: "5px",
  },
  header: {
    fontSize: "24px",
    marginBottom: "20px",
    textAlign: "center" as const,
    color: "#333",
  },
  subHeader: {
    fontSize: "18px",
    marginBottom: "10px",
    color: "#555",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    marginBottom: "20px",
  },
  th: {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "left" as const,
    backgroundColor: "#f2f2f2",
  },
  td: {
    border: "1px solid #ddd",
    padding: "8px",
  },
  image: {
    width: "50px",
    height: "50px",
    objectFit: "cover" as const,
  },
  total: {
    textAlign: "right" as const,
    marginTop: "20px",
    fontSize: "16px",
  },
  footer: {
    marginTop: "30px",
    textAlign: "center" as const,
    fontSize: "12px",
    color: "#777",
  },
  buttonContainer: {
    textAlign: "center" as const,
    marginTop: "20px",
  },
  downloadButton: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

// PDF Document Component
const InvoicePDF = ({ order }: { order: OrderProps }) => {
  const orderDate = new Date(order.createdAt).toLocaleDateString()
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.header}>INVOICE</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Invoice Number:</Text>
            <Text style={styles.infoValue}>INV-{order._id.substring(0, 8)}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date:</Text>
            <Text style={styles.infoValue}>{orderDate}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Payment Status:</Text>
            <Text style={styles.infoValue}>
              {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Payment Method:</Text>
            <Text style={styles.infoValue}>
              {order.paymentMethod === "online" ? "Online Payment" : "Cash on Delivery"}
            </Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.subHeader}>Bill To:</Text>
          <View style={styles.addressBox}>
            <Text>{order.shippingAddress.fullName}</Text>
            <Text>{order.shippingAddress.address}</Text>
            {order.shippingAddress.landmark && <Text>{order.shippingAddress.landmark}</Text>}
            <Text>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
            </Text>
            <Text>{order.shippingAddress.country}</Text>
            <Text>{order.shippingAddress.phone}</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.subHeader}>Order Items:</Text>
          
          <View style={styles.tableHeader}>
            <Text style={styles.description}>Description</Text>
            <Text style={styles.qty}>Qty</Text>
            <Text style={styles.price}>Price</Text>
            <Text style={styles.amount}>Amount</Text>
          </View>
          
          {order.items.map((item, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.description}>{item.name}</Text>
              <Text style={styles.qty}>{item.quantity}</Text>
              <Text style={styles.price}>₹{(item.salePrice || item.price).toFixed(2)}</Text>
              <Text style={styles.amount}>
                ₹{((item.salePrice || item.price) * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
          
          <View style={styles.row}>
            <Text style={styles.description}></Text>
            <Text style={styles.qty}></Text>
            <Text style={styles.price}>Subtotal:</Text>
            <Text style={styles.amount}>₹{order.subtotal.toFixed(2)}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.description}></Text>
            <Text style={styles.qty}></Text>
            <Text style={styles.price}>Shipping:</Text>
            <Text style={styles.amount}>₹{order.shipping.toFixed(2)}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.description}></Text>
            <Text style={styles.qty}></Text>
            <Text style={styles.price}>Tax:</Text>
            <Text style={styles.amount}>${order.tax.toFixed(2)}</Text>
          </View>
          
          <View style={styles.total}>
            <Text style={styles.description}></Text>
            <Text style={styles.qty}></Text>
            <Text style={styles.price}>Total:</Text>
            <Text style={styles.amount}>₹{order.total.toFixed(2)}</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text>Thank you for your purchase!</Text>
        </View>
      </Page>
    </Document>
  )
}

export default function InvoiceComponent({ order }: { order: OrderProps }) {
  return (
    <div style={styles.buttonContainer}>
      <PDFDownloadLink
        document={<InvoicePDF order={order} />}
        fileName={`invoice-${order._id.substring(0, 8)}.pdf`}
      >
        {({ blob, url, loading, error }) =>
          loading ? (
            <Button style={styles.downloadButton} disabled>
              Generating Invoice...
            </Button>
          ) : (
          <Button variant={"outline"} className="w-full bg-pastel-cream/50 hover:bg-pastel-cream/70">
            <Download className="mr-2 h-4 w-4" />
            Download Invoice
          </Button>
          )
        }
      </PDFDownloadLink>
    </div>
  );
}