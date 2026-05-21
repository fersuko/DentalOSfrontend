"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
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
import {
  CrosshairIcon as ToothIcon,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login({ username, password });
      
      const cached = localStorage.getItem("user_profile");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.role === "superadmin") {
          router.push("/superadmin");
        } else if (parsed.role === "doctor") {
          router.push("/doctor");
        } else if (parsed.role === "patient") {
          router.push("/portal");
        } else {
          router.push("/dashboard");
        }
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } };
      setError(
        axiosErr.response?.data?.detail ??
          "Credenciales incorrectas. Intente de nuevo.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="animate-blob absolute -left-20 top-20 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="animate-blob animation-delay-2000 absolute -right-20 top-40 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="animate-blob animation-delay-4000 absolute -bottom-20 left-1/3 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      <Card
        id="login-card"
        className="relative z-10 w-full max-w-md border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl"
      >
        <CardHeader className="space-y-4 text-center">
          {/* Logo */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/25">
            <ToothIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight text-white">
              DentalOS
            </CardTitle>
            <CardDescription className="mt-1 text-sm text-slate-400">
              Sistema de Gestión Odontológica
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div
                id="login-error"
                className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
              >
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm text-slate-300">
                Usuario
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Ingresa tu usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-blue-500/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-slate-300">
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="border-white/10 bg-white/5 pr-10 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              id="login-submit"
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-500 hover:to-cyan-400 hover:shadow-blue-500/40 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ingresando...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              DentalOS v1.0 · Gestión Dental Inteligente
            </p>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
