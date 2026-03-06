import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize how the app looks on your device
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <span className="text-sm">Theme</span>
          <ThemeToggle />
        </CardContent>
      </Card>
    </div>
  );
}
