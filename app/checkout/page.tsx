import DeliveryForm from "@/components/checkout/delivery-form"
import OrderSummary from "@/components/checkout/order-summary"
import PaymentOptions from "@/components/checkout/payment-options"
import DeliveryEstimate from "@/components/checkout/delivery-estimate"

export default function CheckoutPage() {
  return (
    <main className="min-h-screen py-8 md:py-12">
      <div className="container px-4">
        <h1 className="text-2xl md:text-3xl font-serif font-bold mb-8 text-center">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <DeliveryForm />
            <PaymentOptions />
          </div>

          <div className="space-y-6">
            <OrderSummary />
            <DeliveryEstimate />
          </div>
        </div>
      </div>
    </main>
  )
}
