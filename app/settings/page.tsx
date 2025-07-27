"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Bell, HardDrive, HelpCircle, Palette, Shield, User } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function SettingsPage() {
  const { toast } = useToast()
  const [theme, setTheme] = useState("system")
  const [notifications, setNotifications] = useState({
    memories: true,
    sharing: true,
    updates: false,
  })

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated",
    })
  }

  return (
    <div className="flex h-screen flex-col w-full">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-xl font-semibold">Settings</h1>
        </div>
        <Button onClick={handleSave}>Save changes</Button>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-3xl p-4 md:p-8">
          <div className="grid gap-8">
            <section>
              <div className="mb-4 flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/placeholder.svg?height=64&width=64" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">John Doe</h2>
                  <p className="text-muted-foreground">john.doe@example.com</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Change profile photo
              </Button>
            </section>

            <Separator />

            <section>
              <div className="mb-4 flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Account</h2>
              </div>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <input
                    id="name"
                    type="text"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    defaultValue="John Doe"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <input
                    id="email"
                    type="email"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    defaultValue="john.doe@example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <input
                    id="password"
                    type="password"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    defaultValue="••••••••••••"
                  />
                </div>
              </div>
            </section>

            <Separator />

            <section>
              <div className="mb-4 flex items-center gap-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Notifications</h2>
              </div>
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="memories" className="block">
                      Memories
                    </Label>
                    <p className="text-sm text-muted-foreground">Get notified about memories from past photos</p>
                  </div>
                  <Switch
                    id="memories"
                    checked={notifications.memories}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, memories: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sharing" className="block">
                      Sharing
                    </Label>
                    <p className="text-sm text-muted-foreground">Get notified when someone shares photos with you</p>
                  </div>
                  <Switch
                    id="sharing"
                    checked={notifications.sharing}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, sharing: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="updates" className="block">
                      Product updates
                    </Label>
                    <p className="text-sm text-muted-foreground">Get notified about new features and updates</p>
                  </div>
                  <Switch
                    id="updates"
                    checked={notifications.updates}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, updates: checked })}
                  />
                </div>
              </div>
            </section>

            <Separator />

            <section>
              <div className="mb-4 flex items-center gap-3">
                <Palette className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Appearance</h2>
              </div>
              <div className="grid gap-4">
                <RadioGroup value={theme} onValueChange={setTheme}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="light" />
                    <Label htmlFor="light">Light</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="dark" />
                    <Label htmlFor="dark">Dark</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="system" />
                    <Label htmlFor="system">System</Label>
                  </div>
                </RadioGroup>
              </div>
            </section>

            <Separator />

            <section>
              <div className="mb-4 flex items-center gap-3">
                <HardDrive className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Storage</h2>
              </div>
              <div className="grid gap-4">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">Storage used</span>
                    <span className="text-sm text-muted-foreground">3.2 GB of 15 GB</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full w-[21%] rounded-full bg-primary"></div>
                  </div>
                </div>
                <Button variant="outline">Manage storage</Button>
              </div>
            </section>

            <Separator />

            <section>
              <div className="mb-4 flex items-center gap-3">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Privacy & Security</h2>
              </div>
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="location" className="block">
                      Location data
                    </Label>
                    <p className="text-sm text-muted-foreground">Save location data in your photos</p>
                  </div>
                  <Switch id="location" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="face" className="block">
                      Face recognition
                    </Label>
                    <p className="text-sm text-muted-foreground">Use face recognition to organize photos</p>
                  </div>
                  <Switch id="face" defaultChecked />
                </div>
                <Button variant="outline">Privacy settings</Button>
              </div>
            </section>

            <Separator />

            <section>
              <div className="mb-4 flex items-center gap-3">
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Help & Support</h2>
              </div>
              <div className="grid gap-4">
                <Button variant="outline" asChild>
                  <Link href="#">Help center</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="#">Feedback</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="#">Terms of service</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="#">Privacy policy</Link>
                </Button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
