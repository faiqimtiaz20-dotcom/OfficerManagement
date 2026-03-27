import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  Send,
  Clock,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { BroadcastModal } from "@/components/notifications/BroadcastModal";
import { toast } from "sonner";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success";
  time: string;
  read: boolean;
}

const initialNotifications: NotificationItem[] = [
  {
    id: "1",
    title: "SIA License Expiring",
    message: "Michael Brown's SIA license expires in 10 days",
    type: "warning",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    title: "Shift Confirmed",
    message: "James Wilson confirmed shift at Westfield for tomorrow",
    type: "success",
    time: "3 hours ago",
    read: false,
  },
  {
    id: "3",
    title: "New Officer Registered",
    message: "Rachel Green completed registration - pending BS7858",
    type: "info",
    time: "5 hours ago",
    read: true,
  },
  {
    id: "4",
    title: "Invoice Paid",
    message: "HSBC Holdings paid invoice INV-2026-001",
    type: "success",
    time: "1 day ago",
    read: true,
  },
  {
    id: "5",
    title: "Late Check-in Alert",
    message: "Sarah Connor checked in 15 minutes late at HSBC Tower",
    type: "warning",
    time: "1 day ago",
    read: true,
  },
];

const typeConfig = {
  info: { icon: Info, className: "bg-info/10 text-info" },
  warning: { icon: AlertTriangle, className: "bg-warning/10 text-warning" },
  success: { icon: CheckCircle, className: "bg-success/10 text-success" },
};

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [broadcastOpen, setBroadcastOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const canBroadcast =
    user?.role === "ADMIN" || user?.role === "OPS" || user?.role === "SCHEDULER";

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read.");
  };

  const markOneRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const removeNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.success("Notification removed.");
  };

  const alertsList = notifications.filter((n) => n.type === "warning" || n.type === "info");

  return (
    <MainLayout title="Notifications" subtitle="Alerts and system messages">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <span className="font-medium">{unreadCount} unread</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={markAllRead}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
            {canBroadcast && (
              <Button
                className="gradient-primary"
                size="sm"
                onClick={() => setBroadcastOpen(true)}
              >
                <Send className="h-4 w-4 mr-2" />
                Broadcast Message
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3 mt-4">
            {notifications.map((notification) => {
              const config = typeConfig[notification.type];
              const Icon = config.icon;
              return (
                <Card
                  key={notification.id}
                  className={cn(
                    "glass-card cursor-pointer transition-colors",
                    !notification.read && "border-primary/30 bg-primary/5"
                  )}
                  onClick={() => !notification.read && markOneRead(notification.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={cn("p-2 rounded-lg", config.className)}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{notification.title}</p>
                          {!notification.read && (
                            <span className="w-2 h-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {notification.time}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => removeNotification(notification.id, e)}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="unread" className="space-y-3 mt-4">
            {notifications
              .filter((n) => !n.read)
              .map((notification) => {
                const config = typeConfig[notification.type];
                const Icon = config.icon;
                return (
                  <Card
                    key={notification.id}
                    className="glass-card cursor-pointer border-primary/30 bg-primary/5"
                    onClick={() => markOneRead(notification.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={cn("p-2 rounded-lg", config.className)}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{notification.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {notification.time}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => removeNotification(notification.id, e)}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            {notifications.filter((n) => !n.read).length === 0 && (
              <Card className="glass-card">
                <CardContent className="py-12 text-center text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No unread notifications</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="alerts" className="space-y-3 mt-4">
            {alertsList.length > 0 ? (
              alertsList.map((notification) => {
                const config = typeConfig[notification.type];
                const Icon = config.icon;
                return (
                  <Card
                    key={notification.id}
                    className={cn(
                      "glass-card cursor-pointer transition-colors",
                      !notification.read && "border-primary/30 bg-primary/5"
                    )}
                    onClick={() => !notification.read && markOneRead(notification.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={cn("p-2 rounded-lg", config.className)}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{notification.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {notification.time}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card className="glass-card">
                <CardContent className="py-12 text-center text-muted-foreground">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No alerts. Configure automated alerts in Settings → Notifications.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <BroadcastModal open={broadcastOpen} onOpenChange={setBroadcastOpen} />
    </MainLayout>
  );
}
