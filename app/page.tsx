
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { users } from "@/db/schema";

export default async function Home() {
  const allUsers = await db.select().from(users);

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-3xl font-bold">IT support system</h1>
        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Manage IT problems</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Check system</p>
            <Button>Click</Button>
          </CardContent>
        </Card>
        <h2 className="text-2xl font-semibold">Users</h2>
        {allUsers.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent><p>User id: {user.id}</p></CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}
