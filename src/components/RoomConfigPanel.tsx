import { useState, useCallback, useEffect } from 'react';
import { Trash2, Plus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Hotel, RoomConfiguration, Room, Accommodation, RoomConfigurationPayload } from '@/types/hotel';
import { VALID_ACCOMMODATIONS, ROOM_TYPES } from '@/types/hotel';
import * as api from '@/services/api';

interface Props {
  hotel: Hotel;
  rooms: RoomConfiguration[];
  onAdd: (data: RoomConfigurationPayload) => void;
  onDelete: (roomId: number) => void;
  onBack: () => void;
  loading?: boolean;
}

/**
 * Panel para gestionar las configuraciones de habitación de un hotel.
 *
 * Implementa todas las reglas de negocio:
 * 1 Acomodaciones filtradas según tipo de habitación.
 * 2 No superar el máximo de habitaciones del hotel.
 * 3 No duplicar tipo y acomodación en el mismo hotel.
 */
export default function RoomConfigPanel({
  hotel,
  rooms,
  onAdd,
  onDelete,
  onBack,
  loading,
}: Props) {
  const [roomType, setRoomType] = useState<Room | null>(null);
  const [accommodation, setAccommodation] = useState<Accommodation | null>(null);

  const [roomTypes, setRoomTypes] = useState<Room[]>([]);
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);

  const [quantity, setQuantity] = useState<number>(0);
  const [error, setError] = useState('');
  const [loadingCatalogs, setLoadingCatalogs] = useState(true);

  const usedRooms = rooms.reduce((sum, r) => sum + r.quantity, 0);
  const available = hotel.total_rooms - usedRooms;

  useEffect(() => {
    const fetchCatalogs = async () => {
      setLoadingCatalogs(true);
      try {
        const [typesData, accommodationsData] = await Promise.all([
          api.getRoomTypes(),
          api.getAccommodations(),
        ]);
        setRoomTypes(typesData);
        setAccommodations(accommodationsData);
      } catch {
        setError('No se pudieron cargar los catálogos. Intenta de nuevo.');
      } finally {
        setLoadingCatalogs(false);
      }
    };

    fetchCatalogs();
  }, []);

  const handleAdd = () => {
    setError('');
    if (!roomTypes || !accommodation) {
      setError('Selecciona tipo de habitación y acomodación.');
      return;
    }
    if (quantity < 1) {
      setError('La cantidad debe ser al menos 1.');
      return;
    }
    if (quantity > available) {
      setError(`Solo quedan ${available} habitaciones disponibles.`);
      return;
    }
    // Verificar duplicado tipo y acomodación
    const dup = rooms.find(
      (r) => r.room_type?.name === roomType?.name && r.accommodation?.name === accommodation?.name
    );
    if (dup) {
      setError('Ya existe esa combinación tipo y acomodación en este hotel.');
      return;
    }

    onAdd({
      room_type_id: roomType.id,
      accommodation_id: accommodation.id,
      quantity,
    });
    setRoomType(null);
    setAccommodation(null);
    setQuantity(0);
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="mr-1 h-4 w-4" /> Volver
        </Button>
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground">
            {hotel.name}
          </h2>
          <p className="text-sm text-muted-foreground">
            {hotel.city} · {hotel.nit} · {hotel.total_rooms} hab. totales ·{' '}
            <span className={available === 0 ? 'text-destructive font-medium' : 'text-success font-medium'}>
              {available} disponibles
            </span>
          </p>
        </div>
      </div>

      {/* Form para agregar */}
      <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <h3 className="mb-4 font-display font-semibold text-foreground">
          Agregar configuración de habitación
        </h3>
        <div className="grid gap-4 sm:grid-cols-4">
          {/* Tipo */}
          <div className="space-y-1.5">
            <Label>Tipo de Habitación</Label>
            <Select
              value={roomType?.id.toString() ?? ''}
              onValueChange={(v) => {
                const selected = roomTypes.find((t) => t.id.toString() === v) ?? null;
                setRoomType(selected);
                setAccommodation(null);
              }}
              disabled={loadingCatalogs}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {roomTypes.map((t) => (
                  <SelectItem key={t.id} value={t.id.toString()}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Acomodación */}
          <div className="space-y-1.5">
            <Label>Acomodación</Label>
            <Select
              value={accommodation?.id.toString() ?? ''}
              onValueChange={(v) => {
                const selected = accommodations.find((a) => a.id.toString() === v) ?? null;
                setAccommodation(selected);
              }}
              disabled={!roomType || loadingCatalogs}
            >
              <SelectTrigger>
                <SelectValue placeholder={roomType ? 'Seleccionar' : 'Elige tipo primero'} />
              </SelectTrigger>
              <SelectContent>
                {accommodations.map((a) => (
                  <SelectItem key={a.id} value={a.id.toString()}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Cantidad */}
          <div className="space-y-1.5">
            <Label>Cantidad</Label>
            <Input
              type="number"
              min={1}
              max={available}
              value={quantity || ''}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              placeholder={`Máx: ${available}`}
            />
          </div>

          {/* Botón */}
          <div className="flex items-end">
            <Button onClick={handleAdd} disabled={loading || available === 0} className="w-full">
              <Plus className="mr-1 h-4 w-4" /> Agregar
            </Button>
          </div>
        </div>
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      </div>

      {/* Tabla de configuraciones */}
      {rooms.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-semibold text-foreground">Cantidad</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Tipo Habitación</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Acomodación</th>
                <th className="px-4 py-3 text-center font-semibold text-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-border last:border-0 hover:bg-accent/40 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-foreground">{r.quantity}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.room_type?.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.accommodation?.name}</td>
                  <td className="px-4 py-3 text-center">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => onDelete(r.id!)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">
            No hay habitaciones configuradas para este hotel.
          </p>
        </div>
      )}
    </div>
  );
}