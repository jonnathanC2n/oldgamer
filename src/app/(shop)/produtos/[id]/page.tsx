"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, ArrowLeft, Gamepad2, ShieldCheck, Truck, Loader2 } from "lucide-react";
import { supabase, type Product } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  const router = useRouter();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase
        .from("products")
        .select("*, category:categories(*)")
        .eq("id", productId)
        .single();

      if (!error && data) {
        setProduct(data);
      }
      setLoading(false);
    }

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary-red" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-black uppercase tracking-tighter">Jogo não encontrado</h1>
        <Link href="/" className="rounded-full bg-primary-blue px-6 py-2 text-sm font-bold text-white transition-transform hover:scale-105 uppercase tracking-widest">
          Voltar para Início
        </Link>
      </div>
    );
  }

  const whatsappUrl = `https://wa.me/5521972770037?text=Olá! Tenho interesse no título: ${product.name} (Ref: ${product.id})`;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-8">
        <button 
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-foreground/40 hover:text-primary-blue transition-colors outline-none"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden rounded-3xl border bg-muted shadow-2xl flex items-center justify-center">
            {product.image_url ? (
              <Image 
                src={product.image_url} 
                alt={product.name} 
                fill 
                className="object-cover transition-transform hover:scale-105 duration-700"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-foreground/10 italic font-black text-4xl uppercase tracking-tighter">
                OldGamer
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <div className="mb-6">
              <span className="rounded-md bg-primary-blue/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary-blue">
                {product.category?.name || "Clássico Retrô"}
              </span>
              <h1 className="mt-4 text-4xl font-black tracking-tighter text-foreground md:text-5xl lg:text-7xl uppercase">
                {product.name}
              </h1>
              <p className="mt-6 text-3xl font-black text-primary-red">
                R$ {product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>
            
            <div className="mb-10 space-y-4">
              <p className="text-lg leading-relaxed text-foreground/60 italic font-medium border-l-4 border-primary-teal pl-6">
                "{product.description}"
              </p>
            </div>
            
            <div className="flex flex-col gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-3 rounded-full bg-primary-teal py-5 text-lg font-black uppercase tracking-widest text-white shadow-xl shadow-primary-teal/20 transition-all hover:scale-[1.02] hover:bg-primary-teal/90 active:scale-95"
              >
                <MessageCircle className="h-6 w-6" />
                Tenho Interesse
              </a>
              <p className="text-center text-[10px] font-black uppercase tracking-widest text-foreground/40">
                Resgate imediato via WhatsApp
              </p>
            </div>

            {/* Features Section */}
            <div className="mt-12 grid grid-cols-1 gap-6 border-t pt-10 sm:grid-cols-3">
              <div className="flex items-center gap-3">
                <Gamepad2 className="h-6 w-6 text-primary-blue flex-shrink-0" />
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/60 leading-tight">Original & Testado</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-primary-red flex-shrink-0" />
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/60 leading-tight">Garantia de Funcionamento</span>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="h-6 w-6 text-primary-teal flex-shrink-0" />
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/60 leading-tight">Envio Nacional Rápido</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
