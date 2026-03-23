import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

/** Account and app preferences (placeholder until backend exists). */
export default function SettingsPage() {
  return (
    <div className="px-4 lg:px-6">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>
            Notification preferences, profile, and integrations will live here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No configurable options yet.</p>
        </CardContent>
      </Card>
    </div>
  )
}
