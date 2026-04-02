import Link from "next/link";
import { Phone, Mail, MapPin, ChevronRight, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-background pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary-red">
              E-Commerce<span className="text-primary-blue">.</span>
            </h3>
            <p className="text-sm text-foreground/60 leading-relaxed max-w-xs">
              Oferecemos os melhores produtos com os melhores preços. Qualidade e compromisso com o cliente.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-foreground/60 hover:text-primary-teal"><Globe className="h-5 w-5" /></Link>
              <Link href="#" className="text-foreground/60 hover:text-primary-teal"><ChevronRight className="h-5 w-5" /></Link>
              <Link href="#" className="text-foreground/60 hover:text-primary-teal"><Globe className="h-5 w-5" /></Link>
            </div>
          </div>
          
          <div>
            <h4 className="mb-6 font-bold uppercase tracking-wider text-sm">Links Rápidos</h4>
            <ul className="space-y-4 text-sm text-foreground/60">
              <li><Link href="/" className="hover:text-primary-teal">Início</Link></li>
              <li><Link href="/produtos" className="hover:text-primary-teal">Todos os Produtos</Link></li>
              <li><Link href="/sobre" className="hover:text-primary-teal">Sobre Nós</Link></li>
              <li><Link href="/contato" className="hover:text-primary-teal">Contato</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-6 font-bold uppercase tracking-wider text-sm">Categorias</h4>
            <ul className="space-y-4 text-sm text-foreground/60">
              <li><Link href="#" className="hover:text-primary-teal">Eletrônicos</Link></li>
              <li><Link href="#" className="hover:text-primary-teal">Moda</Link></li>
              <li><Link href="#" className="hover:text-primary-teal">Casa & Decor</Link></li>
              <li><Link href="#" className="hover:text-primary-teal">Esportes</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-6 font-bold uppercase tracking-wider text-sm">Contato</h4>
            <ul className="space-y-4 text-sm text-foreground/60">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary-teal shrink-0" />
                <span>Rio de Janeiro, Brasil</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary-teal shrink-0" />
                <span>(21) 97277-0037</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary-teal shrink-0" />
                <span>contato@ecommerce.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 border-t pt-8 text-center text-sm text-foreground/60">
          <p>&copy; {new Date().getFullYear()} E-Commerce. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
