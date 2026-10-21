import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-3xl font-bold">IT Support System</h1>
        <p className="text-muted-foreground">
          A simple system for reporting and managing
          internal IT support</p><Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Manage IT problems</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Check system</p>
            <Button>click</Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
