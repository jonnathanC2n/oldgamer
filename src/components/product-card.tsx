"use client";

import Image from "next/image";
import Link from "next/link";
import { type Product } from "@/lib/supabase";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link 
      href={`/produtos/${product.id}`} 
      className="group block transition-all duration-300 active:scale-[0.98]"
    >
      {/* 1:1 Square Image Container */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border-2 border-transparent transition-all duration-300 group-hover:border-primary-blue bg-muted">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-foreground/20 italic font-bold">
            OLD GAMER
          </div>
        )}
        
        {/* Retro Badge */}
        <div className="absolute left-3 top-3">
          <span className="rounded-md bg-black/60 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md">
            Retro
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 px-1">
        <p className="text-[10px] font-black uppercase tracking-widest text-primary-teal mb-1">
          {product.category?.name || "Clássico"}
        </p>
        <h3 className="line-clamp-1 text-sm font-bold text-foreground group-hover:text-primary-blue transition-colors">
          {product.name}
        </h3>
        <p className="mt-1 text-base font-black text-primary-red">
          R$ {product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </p>
      </div>
    </Link>
  );
}
