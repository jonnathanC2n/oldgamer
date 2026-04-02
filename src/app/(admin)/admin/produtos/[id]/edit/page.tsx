"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { supabase, type Category, type Product } from "@/lib/supabase";

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    category_id: "",
  });

  useEffect(() => {
    async function fetchData() {
      // 1. Fetch categories
      const { data: catData } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });

      if (catData) setCategories(catData);

      // 2. Fetch product
      const { data: prodData, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && prodData) {
        setFormData({
          name: prodData.name,
          description: prodData.description,
          price: prodData.price.toString(),
          image_url: prodData.image_url,
          category_id: prodData.category_id,
        });
      } else {
        alert("Produto não encontrado");
        router.push("/admin/dashboard");
      }
      setFetching(false);
    }
    fetchData();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("products")
      .update({
        ...formData,
        price: parseFloat(formData.price),
      })
      .eq("id", id);

    if (error) {
      alert("Erro ao atualizar: " + error.message);
      setLoading(false);
    } else {
      router.push("/admin/dashboard");
      router.refresh();
    }
  };

  if (fetching) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <Loader2 className="h-10 w-10 animate-spin text-primary-red" />
      </div>
    );
  }

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
            <h1 className="text-3xl font-black tracking-tighter uppercase">Editar <span className="text-primary-blue">Título</span></h1>
            <p className="text-foreground/60">Atualize as informações do jogo no catálogo.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-foreground/40 px-1">Título do Jogo</label>
                <input
                  required
                  type="text"
                  placeholder="Ex: Sonic the Hedgehog"
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
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
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

            <div className="pt-4 flex gap-4">
              <Link
                href="/admin/dashboard"
                className="flex-1 flex items-center justify-center rounded-xl border py-4 font-black uppercase tracking-widest text-foreground/60 transition-all hover:bg-muted active:scale-95"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] flex items-center justify-center gap-2 rounded-xl bg-primary-blue py-4 font-black uppercase tracking-widest text-white shadow-lg shadow-primary-blue/20 transition-all hover:bg-primary-blue/90 active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Salvar Alterações
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
