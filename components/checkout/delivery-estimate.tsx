import { Truck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DeliveryEstimate() {
  // In a real app, this would be calculated based on the selected delivery option
  const estimatedDelivery = {
    min: 5,
    max: 7,
    date: "May 15 - May 17, 2023",
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Delivery Estimate</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Truck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">{estimatedDelivery.date}</p>
            <p className="text-sm text-muted-foreground">
              {estimatedDelivery.min}-{estimatedDelivery.max} business days
            </p>
          </div>
        </div>

        <div className="mt-4 w-full bg-muted rounded-full h-2">
          <div className="bg-primary h-2 rounded-full w-1/3"></div>
        </div>
        <p className="text-xs text-center text-muted-foreground mt-2">Your order is being processed</p>
      </CardContent>
    </Card>
  )
}
