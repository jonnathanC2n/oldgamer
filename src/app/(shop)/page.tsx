import { Hero } from "@/components/hero";
import { ProductGrid } from "@/components/product-grid";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <ProductGrid />
      
      {/* Newsletter / Contact Promo */}
      <section className="bg-primary-red py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-extrabold md:text-5xl">
            Inicie sua Experiência <span className="text-primary-yellow underline">Premium</span>
          </h2>
          <p className="mb-8 text-white/80 max-w-2xl mx-auto">
            Produtos selecionados com garantia e suporte total. Entre em contato diretamente pelo WhatsApp para garantir o melhor preço.
          </p>
          <a 
            href="https://wa.me/5521972770037" 
            target="_blank"
            className="inline-flex items-center justify-center rounded-full bg-white px-10 py-4 text-sm font-black text-primary-red transition-transform hover:scale-110 shadow-2xl"
          >
            FALAR COM VENDEDOR
          </a>
        </div>
      </section>
    </div>
  );
}
