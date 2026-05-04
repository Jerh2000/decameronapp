import { Building2 } from 'lucide-react';

/**
 * Layout principal de la aplicación.
 * Header con branding Decameron + contenedor para el contenido.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container flex h-16 items-center gap-3">
          <div className="flex items-center gap-2 text-primary">
            <Building2 className="h-7 w-7" />
            <span className="font-display text-xl font-bold tracking-tight">
              Decameron
            </span>
          </div>
          <span className="text-sm text-muted-foreground">
            Sistema de Gestión Hotelera
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="container py-8">{children}</main>
    </div>
  );
}