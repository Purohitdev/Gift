"use client"

import { useState } from "react"
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download, Printer } from "lucide-react"

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
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 12,
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subheader: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    borderBottomStyle: 'solid',
    alignItems: 'center',
    height: 30,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderBottomStyle: 'solid',
    alignItems: 'center',
    height: 30,
    fontWeight: 'bold',
  },
  description: { width: '60%' },
  qty: { width: '10%', textAlign: 'center' },
  price: { width: '15%', textAlign: 'right' },
  amount: { width: '15%', textAlign: 'right' },
  total: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#000000',
    borderTopStyle: 'solid',
    alignItems: 'center',
    height: 30,
    fontWeight: 'bold',
  },
  addressBox: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderStyle: 'solid',
    borderRadius: 5,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  infoLabel: {
    width: '30%',
    fontWeight: 'bold',
  },
  infoValue: {
    width: '70%',
  },
});

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
          <Text style={styles.subheader}>Bill To:</Text>
          <View style={styles.addressBox}>
            <Text>{order.shippingAddress.fullName}</Text>
            <Text>{order.shippingAddress.address}</Text>
            <Text>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
            </Text>
            <Text>{order.shippingAddress.country}</Text>
            <Text>{order.shippingAddress.phone}</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.subheader}>Order Items:</Text>
          
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
  // Removed unused state
  
  // Handle print functionality
  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    
    if (printWindow) {
      const orderDate = new Date(order.createdAt).toLocaleDateString()
      
      const docContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Invoice - ${order._id.substring(0, 8)}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
              .invoice-container { max-width: 800px; margin: 0 auto; }
              .invoice-header { text-align: center; margin-bottom: 30px; }
              .invoice-header h1 { font-size: 24px; margin-bottom: 10px; }
              .invoice-info { margin-bottom: 20px; }
              .invoice-info-row { display: flex; margin-bottom: 5px; }
              .invoice-info-label { width: 150px; font-weight: bold; }
              .address-box { border: 1px solid #ddd; padding: 10px; margin-bottom: 20px; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
              th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
              th { border-top: 1px solid #ddd; }
              .text-right { text-align: right; }
              .total-row { font-weight: bold; border-top: 2px solid #000; }
              @media print {
                body { font-size: 12px; }
                button { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="invoice-container">
              <div class="invoice-header">
                <h1>INVOICE</h1>
              </div>
              
              <div class="invoice-info">
                <div class="invoice-info-row">
                  <div class="invoice-info-label">Invoice Number:</div>
                  <div>INV-${order._id.substring(0, 8)}</div>
                </div>
                <div class="invoice-info-row">
                  <div class="invoice-info-label">Date:</div>
                  <div>${orderDate}</div>
                </div>
                <div class="invoice-info-row">
                  <div class="invoice-info-label">Payment Status:</div>
                  <div>${order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}</div>
                </div>
                <div class="invoice-info-row">
                  <div class="invoice-info-label">Payment Method:</div>
                  <div>${order.paymentMethod === "online" ? "Online Payment" : "Cash on Delivery"}</div>
                </div>
              </div>
              
              <h2>Bill To:</h2>
              <div class="address-box">
                <p>${order.shippingAddress.fullName}</p>
                <p>${order.shippingAddress.address}</p>
                <p>${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}</p>
                <p>${order.shippingAddress.country}</p>
                <p>${order.shippingAddress.phone}</p>
              </div>
              
              <h2>Order Items:</h2>
              <table>
                <thead>
                  <tr>
                    <th width="50%">Description</th>
                    <th width="10%">Qty</th>
                    <th width="20%" class="text-right">Price</th>
                    <th width="20%" class="text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${order.items.map(item => `
                    <tr>
                      <td>${item.name}</td>
                      <td>${item.quantity}</td>
                      <td class="text-right">₹${(item.salePrice || item.price).toFixed(2)}</td>
                      <td class="text-right">₹${((item.salePrice || item.price) * item.quantity).toFixed(2)}</td>
                    </tr>
                  `).join('')}
                  <tr>
                    <td colspan="2"></td>
                    <td class="text-right">Subtotal:</td>
                    <td class="text-right">₹${order.subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colspan="2"></td>
                    <td class="text-right">Shipping:</td>
                    <td class="text-right">₹${order.shipping.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colspan="2"></td>
                    <td class="text-right">Tax:</td>
                    <td class="text-right">₹${order.tax.toFixed(2)}</td>
                  </tr>
                  <tr class="total-row">
                    <td colspan="2"></td>
                    <td class="text-right">Total:</td>
                    <td class="text-right">₹${order.total.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
              
              <div>
                <p>Thank you for your purchase!</p>
              </div>
              
              <button onclick="window.print(); window.close();">Print Invoice</button>
            </div>
            <script>
              window.onload = function() {
                window.print();
              }
            </script>
          </body>
        </html>
      `
      
      const doc = printWindow.document;
      doc.open();
      doc.write(docContent);
      doc.close();
    }
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Invoice
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          You can download or print your invoice for your records.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            className="flex items-center gap-2" 
            onClick={handlePrint}
          >
            <Printer className="h-4 w-4" />
            Print Invoice
          </Button>
          
          <PDFDownloadLink
            document={<InvoicePDF order={order} />}
            fileName={`invoice-${order._id.substring(0, 8)}.pdf`}
            className="w-full sm:w-auto"
          >
            {({ loading }) => (
              <Button 
                variant="default" 
                className="flex items-center gap-2 w-full" 
                disabled={loading}
              >
                <Download className="h-4 w-4" />
                {loading ? "Generating PDF..." : "Download Invoice"}
              </Button>
            )}
          </PDFDownloadLink>
        </div>
      </CardContent>
    </Card>
  )
}