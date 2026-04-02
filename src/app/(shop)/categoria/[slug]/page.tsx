"use client";

import { useEffect, useState, use } from "react";
import { supabase, type Product, type Category } from "@/lib/supabase";
import { ProductCard } from "@/components/product-card";
import { Loader2, ArrowLeft, Gamepad } from "lucide-react";
import Link from "next/link";

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategoryData() {
      setLoading(true);
      
      // 1. Fetch category by slug
      const { data: catData, error: catError } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", resolvedParams.slug)
        .single();

      if (catError || !catData) {
        setLoading(false);
        return;
      }

      setCategory(catData);

      // 2. Fetch products for this category
      const { data: prodData, error: prodError } = await supabase
        .from("products")
        .select("*, category:categories(*)")
        .eq("category_id", catData.id)
        .order("created_at", { ascending: false });

      if (!prodError && prodData) {
        setProducts(prodData);
      }
      
      setLoading(false);
    }

    fetchCategoryData();
  }, [resolvedParams.slug]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary-red" />
        <p className="text-sm font-black uppercase tracking-widest text-foreground/40">Sincronizando Acervo...</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-muted p-6">
            <Gamepad className="h-12 w-12 text-foreground/20" />
          </div>
        </div>
        <h1 className="mb-4 text-3xl font-black uppercase tracking-tighter">Categoria Não Encontrada</h1>
        <p className="mb-8 text-foreground/60">O console ou gênero que você procura ainda não foi catalogado.</p>
        <Link 
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-primary-blue px-8 py-3 text-sm font-black uppercase tracking-widest text-white transition-all hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Início
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 pt-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <Link 
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-foreground/40 transition-colors hover:text-primary-red"
          >
            <ArrowLeft className="h-3 w-3" />
            Início
          </Link>
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-black uppercase underline decoration-primary-red decoration-8 underline-offset-8 md:text-6xl">
                {category.name}
              </h1>
              <p className="mt-4 text-lg font-medium text-foreground/60">
                Explore nossa seleção exclusiva de títulos para {category.name}.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 rounded-2xl bg-muted/50 px-6 py-4 md:mt-0">
              <span className="text-4xl font-black text-primary-blue">{products.length}</span>
              <span className="text-[10px] font-black uppercase leading-tight tracking-widest text-foreground/40">
                Jogos<br />Disponíveis
              </span>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border-2 border-dashed py-24 text-center">
            <p className="text-sm font-black uppercase tracking-widest text-foreground/20 italic">
              Estoque esgotado para esta plataforma.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
