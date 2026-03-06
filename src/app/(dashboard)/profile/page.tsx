import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const initials = session.user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "U";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Your account information
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Your profile details</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-6">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="text-xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="font-medium">{session.user.name ?? "No name"}</p>
            <p className="text-sm text-muted-foreground">
              {session.user.email}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
