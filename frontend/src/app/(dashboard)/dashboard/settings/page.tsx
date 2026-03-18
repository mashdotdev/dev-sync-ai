import { Card, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your account preferences.</p>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
          <Settings className="size-10 text-muted-foreground" />
          <p className="font-medium">Coming soon</p>
          <p className="text-sm text-muted-foreground">
            Account settings will be available here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
