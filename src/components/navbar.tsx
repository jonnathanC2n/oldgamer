"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { Gamepad2, Search, LayoutDashboard, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase, type Category } from "@/lib/supabase";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });
      
      if (data) setCategories(data);
    }
    fetchCategories();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105 active:scale-95">
          <Gamepad2 className="h-8 w-8 text-primary-red" />
          <span className="text-2xl font-black uppercase tracking-tighter">
            Old<span className="text-primary-blue">Gamer</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          <Link
            href="/"
            className="rounded-full px-6 py-2 text-sm font-bold transition-all hover:bg-primary-blue/10 hover:text-primary-blue active:scale-95"
          >
            Novidades
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categoria/${category.slug}`}
              className="rounded-full px-6 py-2 text-sm font-bold transition-all hover:bg-primary-blue/10 hover:text-primary-blue active:scale-95"
            >
              {category.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button className="hidden p-2 hover:bg-muted rounded-full transition-colors sm:block">
            <Search className="h-5 w-5" />
          </button>
          
          <Link 
            href="/admin/login" 
            className="p-2 hover:bg-muted rounded-full transition-colors"
            title="Área Administrativa"
          >
            <LayoutDashboard className="h-5 w-5" />
          </Link>

          <ThemeToggle />

          {/* Mobile Menu Toggle */}
          <button 
            className="p-2 hover:bg-muted rounded-full lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t bg-background p-4 lg:hidden shadow-lg animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col gap-2">
            <Link
              href="/"
              className="rounded-lg px-4 py-3 text-sm font-bold hover:bg-muted transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Novidades
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categoria/${category.slug}`}
                className="rounded-lg px-4 py-3 text-sm font-bold hover:bg-muted transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
