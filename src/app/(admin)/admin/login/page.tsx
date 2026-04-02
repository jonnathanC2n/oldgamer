"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For now, using hardcoded credentials as requested for the UI demo phase
    if (username === "admaster" && password === "@Quintela160") {
      // In a real app we'd set a cookie/token here
      localStorage.setItem("admin_is_logged_in", "true");
      router.push("/admin/dashboard");
    } else {
      setError("Usuário ou senha incorretos.");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-16rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl border bg-card p-8 shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Acesso <span className="text-primary-red">Admin</span>
          </h2>
          <p className="mt-2 text-sm text-foreground/60">
            Entre com suas credenciais para gerenciar a loja.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-foreground/40" />
              <input
                type="text"
                required
                className="block w-full rounded-lg border border-input bg-background py-3 pl-10 pr-3 transition-colors focus:border-primary-blue focus:outline-none focus:ring-1 focus:ring-primary-blue sm:text-sm"
                placeholder="Usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-foreground/40" />
              <input
                type="password"
                required
                className="block w-full rounded-lg border border-input bg-background py-3 pl-10 pr-3 transition-colors focus:border-primary-blue focus:outline-none focus:ring-1 focus:ring-primary-blue sm:text-sm"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <p className="text-center text-sm font-medium text-primary-red">
              {error}
            </p>
          )}

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-lg bg-primary-blue py-3 px-4 text-sm font-bold text-white transition-all hover:bg-primary-blue/90 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2"
            >
              Entrar
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </form>
        
        <div className="text-center">
          <Link href="/" className="text-sm font-medium text-primary-teal hover:underline">
            Voltar para a loja
          </Link>
        </div>
      </div>
    </div>
  );
}
