import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
  const OFFICER_PORTAL_BASE_URL =
    (import.meta.env.VITE_OFFICER_PORTAL_URL as string | undefined)?.replace(/\/$/, "") ??
    "http://localhost:8081";
  const { login } = useAuth();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const loggedIn = login(identifier, password);
    if (!loggedIn) {
      setError("Unknown user or wrong password. Demo accounts use password: password");
      return;
    }
    if (loggedIn.role === "OFFICER") {
      window.location.assign(`${OFFICER_PORTAL_BASE_URL}/portal/dashboard`);
    } else if (loggedIn.role === "SUPER_ADMIN") {
      navigate("/platform", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Card className="w-full max-w-md glass-card border border-primary/20">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold text-center">
            GuardForce CRM
          </CardTitle>
          <p className="text-sm text-muted-foreground text-center">
            Sign in with your email or username (same accounts as DB seed)
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="login-id">
                Email or username
              </label>
              <Input
                id="login-id"
                type="text"
                autoComplete="username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="admin@guardforce.local or platformadmin"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="login-password">
                Password
              </label>
              <Input
                id="login-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}

            <Button type="submit" className="w-full gradient-primary mt-2">
              Continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

