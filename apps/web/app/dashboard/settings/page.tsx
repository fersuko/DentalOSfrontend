"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import apiClient from "@/lib/apiClient";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Separator } from "@workspace/ui/components/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Badge } from "@workspace/ui/components/badge";
import { Loader2, User as UserIcon, Shield, Bell } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    setSaving(true);
    try {
      await apiClient.put("/api/v1/users/me/password", {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
      });
      toast.success("Contraseña actualizada exitosamente");
      setPasswordForm({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch {
      toast.error("Error al cambiar la contraseña");
    } finally {
      setSaving(false);
    }
  };

  const roleLabels: Record<string, string> = {
    admin: "Administrador",
    doctor: "Doctor",
    receptionist: "Recepcionista",
    assistant: "Asistente",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configuración</h1>
        <p className="text-sm text-muted-foreground">
          Administra tu perfil y preferencias
        </p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">
            <UserIcon className="mr-2 h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="mr-2 h-4 w-4" />
            Seguridad
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notificaciones
          </TabsTrigger>
        </TabsList>

        {/* Profile */}
        <TabsContent value="profile" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del perfil</CardTitle>
              <CardDescription>
                Tu información de cuenta en DentalOS
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nombre completo</Label>
                  <Input value={user?.full_name ?? ""} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Usuario</Label>
                  <Input value={user?.username ?? ""} disabled />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={user?.email ?? ""} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Rol</Label>
                  <div className="flex h-9 items-center">
                    <Badge variant="secondary">
                      {roleLabels[user?.role ?? ""] ?? user?.role}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cambiar contraseña</CardTitle>
              <CardDescription>
                Actualiza tu contraseña de acceso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current_password">Contraseña actual</Label>
                  <Input
                    id="current_password"
                    type="password"
                    value={passwordForm.current_password}
                    onChange={(e) =>
                      setPasswordForm((p) => ({
                        ...p,
                        current_password: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <Separator />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="new_password">Nueva contraseña</Label>
                    <Input
                      id="new_password"
                      type="password"
                      value={passwordForm.new_password}
                      onChange={(e) =>
                        setPasswordForm((p) => ({
                          ...p,
                          new_password: e.target.value,
                        }))
                      }
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm_password">
                      Confirmar contraseña
                    </Label>
                    <Input
                      id="confirm_password"
                      type="password"
                      value={passwordForm.confirm_password}
                      onChange={(e) =>
                        setPasswordForm((p) => ({
                          ...p,
                          confirm_password: e.target.value,
                        }))
                      }
                      required
                      minLength={6}
                    />
                  </div>
                </div>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    "Cambiar Contraseña"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferencias de notificaciones</CardTitle>
              <CardDescription>
                Configura cómo recibes las notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Bell className="h-10 w-10 text-muted-foreground/30" />
                <p className="mt-3 text-sm text-muted-foreground">
                  Las configuraciones de notificaciones estarán disponibles
                  próximamente
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
