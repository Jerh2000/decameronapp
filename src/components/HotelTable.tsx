import { Pencil, Trash2, BedDouble } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Hotel } from '@/types/hotel';

interface Props {
  hotels: Hotel[];
  onEdit: (hotel: Hotel) => void;
  onDelete: (id: number) => void;
  onManageRooms: (hotel: Hotel) => void;
}

/**
 * Tabla de hoteles con acciones de editar, eliminar y gestionar habitaciones.
 */
export default function HotelTable({ hotels, onEdit, onDelete, onManageRooms }: Props) {
  if (hotels.length === 0) {
    return (
      <div className="animate-fade-in rounded-lg border border-border bg-card p-12 text-center">
        <p className="text-muted-foreground">No hay hoteles registrados.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Haz clic en "Nuevo Hotel" para comenzar.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in overflow-x-auto rounded-lg border border-border bg-card shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-4 py-3 text-left font-semibold text-foreground">Nombre</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Ciudad</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Dirección</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">NIT</th>
            <th className="px-4 py-3 text-center font-semibold text-foreground">Habitaciones</th>
            <th className="px-4 py-3 text-center font-semibold text-foreground">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {hotels.map((hotel) => (
            <tr
              key={hotel.id}
              className="border-b border-border last:border-0 hover:bg-accent/40 transition-colors"
            >
              <td className="px-4 py-3 font-medium text-foreground">{hotel.name}</td>
              <td className="px-4 py-3 text-muted-foreground">{hotel.city}</td>
              <td className="px-4 py-3 text-muted-foreground">{hotel.address}</td>
              <td className="px-4 py-3 text-muted-foreground">{hotel.nit}</td>
              <td className="px-4 py-3 text-center text-foreground">{hotel.total_rooms}</td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onManageRooms(hotel)}
                    title="Gestionar habitaciones"
                  >
                    <BedDouble className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(hotel)}
                    title="Editar hotel"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onDelete(hotel.id!)}
                    title="Eliminar hotel"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}