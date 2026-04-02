"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ProductCard } from "./product-card";
import { supabase, type Product, type Category } from "@/lib/supabase";
import { Loader2, ChevronRight, ChevronLeft } from "lucide-react";

export function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
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

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary-red" />
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {categories.map((category) => {
        const categoryProducts = products.filter(p => p.category_id === category.id);
        
        if (categoryProducts.length === 0) return null;

        return (
          <section key={category.id} id={category.slug} className="container mx-auto px-4 overflow-hidden">
            <div className="mb-6 flex items-center justify-between">
              <Link href={`/categoria/${category.slug}`} className="flex items-center gap-2 group cursor-pointer">
                <h2 className="text-2xl font-black tracking-tighter uppercase transition-colors group-hover:text-primary-blue">
                  {category.name}
                </h2>
                <ChevronRight className="h-6 w-6 text-primary-red transition-transform group-hover:translate-x-1" />
              </Link>
              <Link 
                href={`/categoria/${category.slug}`}
                className="text-xs font-black uppercase tracking-widest text-primary-blue hover:text-primary-red transition-colors"
              >
                Ver Tudo
              </Link>
            </div>
            
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x">
              {categoryProducts.map((product) => (
                <div key={product.id} className="min-w-[180px] w-full max-w-[240px] snap-start">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {products.length === 0 && (
        <div className="text-center py-20 text-foreground/40 italic font-medium">
          Nenhum jogo cadastrado ainda. Explore nossa área admin para adicionar.
        </div>
      )}
    </div>
  );
}
