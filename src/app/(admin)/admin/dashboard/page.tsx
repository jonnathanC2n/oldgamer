"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, LayoutDashboard, LogOut, Search, Loader2, Image as ImageIcon, Tags } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase, type Product, type Category } from "@/lib/supabase";

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Category Form State
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryLoading, setCategoryLoading] = useState(false);

  // Hero URL State
  const [heroUrl, setHeroUrl] = useState("");
  const [heroLoading, setHeroLoading] = useState(false);

  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("admin_is_logged_in");
    if (!isLoggedIn) {
      router.push("/admin/login");
    } else {
      setAuthLoading(false);
      fetchData();
    }
  }, [router]);

  async function fetchData() {
    setLoading(true);
    const [productsRes, categoriesRes] = await Promise.all([
      supabase
        .from("products")
        .select("*, category:categories(*)")
        .order("created_at", { ascending: false }),
      supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true })
    ]);

    if (!productsRes.error && productsRes.data) {
      setProducts(productsRes.data);
    }
    if (!categoriesRes.error && categoriesRes.data) {
      setCategories(categoriesRes.data);
    }
    setLoading(false);
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (!error) {
        setProducts(products.filter(p => p.id !== id));
      } else {
        alert("Erro ao excluir: " + error.message);
      }
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName) return;

    setCategoryLoading(true);
    const slug = newCategoryName.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    
    const { data, error } = await supabase
      .from("categories")
      .insert([{ name: newCategoryName, slug }])
      .select()
      .single();

    if (error) {
      alert("Erro ao adicionar categoria: " + (error?.message || "Erro desconhecido"));
    } else if (data) {
      setCategories([...categories, data].sort((a, b) => a.name.localeCompare(b.name)));
      setNewCategoryName("");
    }
    setCategoryLoading(false);
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm("Excluir esta categoria? Produtos vinculados perderão a categoria.")) {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (!error) {
        setCategories(categories.filter(c => c.id !== id));
      } else {
        alert("Erro ao excluir: " + error.message);
      }
    }
  };

  const handleHeroUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroUrl) return;

    setHeroLoading(true);
    const { error } = await supabase
      .from("settings")
      .update({ value: heroUrl })
      .eq("key", "hero_image_url");

    if (!error) {
      alert("URL do Hero atualizada com sucesso!");
      setHeroUrl("");
    } else {
      alert("Erro ao atualizar URL do Hero: " + error.message);
    }
    setHeroLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_is_logged_in");
    router.push("/");
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <Loader2 className="h-10 w-10 animate-spin text-primary-red" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="hidden w-64 border-r bg-card lg:block shrink-0 px-4 py-8">
        <div className="mb-8 px-2">
          <span className="text-xl font-black uppercase tracking-tighter">
            Old<span className="text-primary-blue">Gamer</span> <span className="text-primary-red">Admin</span>
          </span>
        </div>
        <nav className="space-y-1">
          <Link href="/admin/dashboard" className="flex items-center gap-3 rounded-lg bg-primary-blue/10 px-3 py-2 text-primary-blue font-bold transition-colors">
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-foreground/60 hover:bg-muted hover:text-foreground font-medium transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Sair (Logout)
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase">Painel de <span className="text-primary-red">Gestão</span></h1>
            <p className="text-foreground/60">Controle total da sua loja retrogamer.</p>
          </div>
          <Link 
            href="/admin/produtos/novo" 
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-red px-6 py-3 text-sm font-black uppercase tracking-widest text-white transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="h-5 w-5" />
            Novo Produto
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Quick Settings: Hero Upload */}
          <div className="lg:col-span-1 rounded-2xl border bg-card p-6 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-primary-blue" />
              Imagem de Destaque (Hero)
            </h3>
            <div className="flex flex-col gap-4">
              <form onSubmit={handleHeroUpdate} className="flex flex-col gap-3">
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-2.5 h-4 w-4 text-foreground/40" />
                  <input 
                    type="url" 
                    placeholder="URL da nova imagem (Ex: Unsplash, Reddit...)"
                    className="w-full rounded-lg border bg-background pl-10 pr-4 py-2 text-sm focus:border-primary-blue focus:outline-none"
                    value={heroUrl}
                    onChange={(e) => setHeroUrl(e.target.value)}
                    disabled={heroLoading}
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full rounded-lg bg-primary-blue px-4 py-2.5 text-xs font-black uppercase tracking-widest text-white hover:bg-primary-blue/90 disabled:opacity-50 transition-all active:scale-[0.98]"
                  disabled={heroLoading || !heroUrl}
                >
                  {heroLoading ? "Atualizando..." : "Atualizar Banner"}
                </button>
              </form>
              <p className="text-[10px] text-foreground/40 font-medium italic text-center">Aspecto recomendado: 21:9 para banners.</p>
            </div>
          </div>

          {/* Quick Settings: Categories */}
          <div className="lg:col-span-2 rounded-2xl border bg-card p-6 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <Tags className="h-4 w-4 text-primary-teal" />
              Gerenciar Categorias
            </h3>
            <div className="flex flex-col gap-6">
              <form onSubmit={handleAddCategory} className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Nova categoria (ex: Super Nintendo)"
                  className="flex-1 rounded-lg border bg-background px-4 py-2 text-sm focus:border-primary-blue focus:outline-none"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  disabled={categoryLoading}
                />
                <button 
                  type="submit" 
                  className="rounded-lg bg-primary-teal px-4 py-2 text-sm font-bold text-white hover:bg-primary-teal/90 disabled:opacity-50"
                  disabled={categoryLoading}
                >
                  Adicionar
                </button>
              </form>
              
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <div key={cat.id} className="group flex items-center gap-2 rounded-full border bg-muted/30 pl-4 pr-1 py-1 text-xs font-bold transition-all">
                    {cat.name}
                    <button 
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="p-1 rounded-full hover:bg-primary-red/10 text-foreground/30 hover:text-primary-red transition-all"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Table */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-black uppercase tracking-tighter text-foreground/80">Estoque de <span className="text-primary-blue">Produtos</span></h3>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-foreground/40" />
            <input 
              type="text" 
              placeholder="Buscar jogos..." 
              className="w-full rounded-lg border bg-card py-2 pl-10 pr-4 text-sm focus:border-primary-blue focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary-red" />
            <p className="font-bold text-foreground/40 uppercase tracking-widest text-xs">Sincronizando Acervo...</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
            <table className="w-full text-left">
              <thead className="border-b bg-muted/30">
                <tr>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Produto</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Plataforma</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Preço</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold">{product.name}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-primary-blue/10 px-3 py-1 text-[10px] font-black uppercase text-primary-blue tracking-tighter">
                        {product.category?.name || "Clássico"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-primary-red">
                      R$ {product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link 
                          href={`/admin/produtos/${product.id}/edit`}
                          className="p-2 text-primary-blue hover:bg-primary-blue/10 rounded-lg transition-colors"
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 text-primary-red hover:bg-primary-red/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredProducts.length === 0 && (
              <div className="py-20 text-center text-foreground/40 font-black uppercase tracking-widest italic text-xs">
                Nenhum título encontrado.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
