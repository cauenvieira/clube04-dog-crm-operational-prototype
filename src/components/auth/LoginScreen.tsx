import { useState } from "react";
import { PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, PAPEL_LABEL } from "@/lib/auth-store";
import { addAudit } from "@/lib/audit-store";

const QUICK_USERS = [
  { email: "admin@clube04.local", label: "Administrador" },
  { email: "lider@clube04.local", label: "Líder" },
  { email: "atendente@clube04.local", label: "Atendente" },
];

export function LoginScreen() {
  const { login, users } = useAuth();
  const [email, setEmail] = useState("admin@clube04.local");
  const [senha, setSenha] = useState("123456");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = login(email, senha);
    if (!result.ok) {
      setError(result.message ?? "Falha ao entrar.");
      return;
    }
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (user) addAudit({ action: "login", actorName: user.nome, actorRole: user.papel, summary: `Login local como ${PAPEL_LABEL[user.papel]}` });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-xl shadow-primary/5 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/25">
            <PawPrint className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold">Clube04 CRM</h1>
            <p className="text-xs text-muted-foreground">Protótipo operacional · Mogi das Cruzes</p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label className="text-xs">Usuário</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" autoComplete="username" />
          </div>
          <div>
            <Label className="text-xs">Senha</Label>
            <Input value={senha} onChange={(e) => setSenha(e.target.value)} type="password" className="mt-1" autoComplete="current-password" />
          </div>
          {error && <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">{error}</div>}
          <Button type="submit" className="w-full">Entrar</Button>
        </form>

        <div className="mt-6 pt-4 border-t border-border">
          <div className="text-xs font-semibold text-muted-foreground mb-2">Acessos rápidos do mock</div>
          <div className="grid gap-2">
            {QUICK_USERS.map((u) => (
              <button
                key={u.email}
                type="button"
                onClick={() => { setEmail(u.email); setSenha("123456"); setError(""); }}
                className="text-left rounded-lg border border-border px-3 py-2 hover:bg-muted/50 transition-colors"
              >
                <div className="text-sm font-medium">{u.label}</div>
                <div className="text-xs text-muted-foreground">{u.email} · senha 123456</div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 text-[11px] text-muted-foreground leading-relaxed">
          Login local apenas para validação de UX, permissões e rotina. Não representa autenticação real do CRM final.
        </div>
      </div>
    </div>
  );
}
