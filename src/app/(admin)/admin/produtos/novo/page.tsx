"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { supabase, type Category } from "@/lib/supabase";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [fetchingCategories, setFetchingCategories] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    category_id: "",
  });

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });

      if (!error && data) {
        setCategories(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, category_id: data[0].id }));
        }
      }
      setFetchingCategories(false);
    }
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("products").insert([
      {
        ...formData,
        price: parseFloat(formData.price),
      },
    ]);

    if (error) {
      alert("Erro ao cadastrar: " + error.message);
      setLoading(false);
    } else {
      router.push("/admin/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-8">
      <div className="mx-auto max-w-3xl">
        <Link 
          href="/admin/dashboard" 
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-foreground/60 hover:text-primary-blue transition-colors uppercase tracking-widest"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Gestão
        </Link>
        
        <div className="rounded-3xl border bg-card p-6 md:p-10 shadow-xl">
          <div className="mb-10">
            <h1 className="text-3xl font-black tracking-tighter uppercase">Novo <span className="text-primary-red">Jogo</span></h1>
            <p className="text-foreground/60">Insira as informações do título no acervo.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-foreground/40 px-1">Título do Jogo</label>
                <input
                  required
                  type="text"
                  placeholder="Ex: Super Mario World"
                  className="w-full rounded-xl border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue/20 transition-all font-bold"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-foreground/40 px-1">Plataforma / Console</label>
                <select
                  required
                  className="w-full rounded-xl border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue/20 transition-all font-bold"
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  disabled={fetchingCategories}
                >
                  {fetchingCategories ? (
                    <option>Carregando consoles...</option>
                  ) : (
                    categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))
                  )}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-foreground/40 px-1">Preço Sugerido (R$)</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full rounded-xl border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue/20 transition-all font-bold"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-foreground/40 px-1">URL da Imagem</label>
                <input
                  required
                  type="url"
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="w-full rounded-xl border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue/20 transition-all font-bold"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-foreground/40 px-1">Descrição Detalhada</label>
              <textarea
                required
                rows={4}
                placeholder="Detalhes sobre estado de conservação, região, etc."
                className="w-full rounded-xl border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue/20 transition-all font-bold"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-blue py-4 font-black uppercase tracking-widest text-white shadow-lg shadow-primary-blue/20 transition-all hover:bg-primary-blue/90 active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Cadastrar no Acervo
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
