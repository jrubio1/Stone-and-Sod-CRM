import AppShell from "@/components/ui/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CustomersPage() {
  return (
    <AppShell>
      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Placeholder for table/filter/form */}
          <p>This is where your customer data table will go.</p>
        </CardContent>
      </Card>
    </AppShell>
  );
}