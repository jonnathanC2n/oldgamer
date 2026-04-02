"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Hero() {
  const [heroImage, setHeroImage] = useState("https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHero() {
      const { data, error } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "hero_image_url")
        .single();

      if (!error && data) {
        setHeroImage(data.value);
      }
      setLoading(false);
    }
    fetchHero();
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-3xl shadow-2xl transition-all duration-700 hover:scale-[1.01]">
          {/* Background Image */}
          {loading ? (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <Loader2 className="h-10 w-10 animate-spin text-primary-red" />
            </div>
          ) : (
            <Image
              src={heroImage}
              alt="OldGamer Hero"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              priority
            />
          )}

          {/* Overlay & Content */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-16 lg:p-20">
            <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
              <h1 className="text-4xl font-black text-white md:text-6xl lg:text-7xl mb-4 tracking-tighter">
                RELEMBRE O <span className="text-primary-red">JOGO</span>
              </h1>
              <p className="text-lg font-medium text-white/80 md:text-xl lg:text-2xl mb-8 max-w-xl">
                Consoles originais, jogos clássicos e acessórios para sua coleção retrô.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="#produtos"
                  className="rounded-full bg-primary-red px-10 py-4 text-lg font-black text-white transition-all hover:scale-105 hover:bg-primary-red/90 shadow-lg shadow-primary-red/20 active:scale-95"
                >
                  Explorar Coleção
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
