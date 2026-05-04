import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Hotel, HotelPayload } from '@/types/hotel';

interface Props {
  hotel?: Hotel | null;
  onSubmit: (data: HotelPayload) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function HotelForm({ hotel, onSubmit, onCancel, loading }: Props) {
  const [form, setForm] = useState<HotelPayload>({
    name: hotel?.name ?? '',
    address: hotel?.address ?? '',
    city: hotel?.city ?? '',
    nit: hotel?.nit ?? '',
    total_rooms: hotel?.total_rooms ?? 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'El nombre es obligatorio';
    if (!form.address.trim()) e.address = 'La dirección es obligatoria';
    if (!form.city.trim()) e.city = 'La ciudad es obligatoria';
    if (!form.nit.trim()) e.nit = 'El NIT es obligatorio';
    if (form.total_rooms < 1) e.total_rooms = 'Debe tener al menos 1 habitación';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  const set = (field: keyof HotelPayload, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in space-y-5">
      <h2 className="font-display text-xl font-semibold text-foreground">
        {hotel ? 'Editar Hotel' : 'Nuevo Hotel'}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Nombre */}
        <div className="space-y-1.5">
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="Ej: Decameron Cartagena"
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>

        {/* Ciudad */}
        <div className="space-y-1.5">
          <Label htmlFor="city">Ciudad</Label>
          <Input
            id="city"
            value={form.city}
            onChange={(e) => set('city', e.target.value)}
            placeholder="Ej: Cartagena"
          />
          {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
        </div>

        {/* Dirección */}
        <div className="space-y-1.5">
          <Label htmlFor="address">Dirección</Label>
          <Input
            id="address"
            value={form.address}
            onChange={(e) => set('address', e.target.value)}
            placeholder="Ej: Calle 23 58-25"
          />
          {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
        </div>

        {/* NIT */}
        <div className="space-y-1.5">
          <Label htmlFor="nit">NIT</Label>
          <Input
            id="nit"
            value={form.nit}
            onChange={(e) => set('nit', e.target.value)}
            placeholder="Ej: 12345678-9"
          />
          {errors.nit && <p className="text-sm text-destructive">{errors.nit}</p>}
        </div>

        {/* Número de habitaciones */}
        <div className="space-y-1.5">
          <Label htmlFor="total_rooms">Número de Habitaciones</Label>
          <Input
            id="total_rooms"
            type="number"
            min={1}
            value={form.total_rooms || ''}
            onChange={(e) => set('total_rooms', parseInt(e.target.value) || 0)}
            placeholder="Ej: 42"
          />
          {errors.total_rooms && (
            <p className="text-sm text-destructive">{errors.total_rooms}</p>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : hotel ? 'Actualizar' : 'Crear Hotel'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}