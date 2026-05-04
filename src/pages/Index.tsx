import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import HotelTable from '@/components/HotelTable';
import HotelForm from '@/components/HotelForm';
import RoomConfigPanel from '@/components/RoomConfigPanel';
import type { Hotel, HotelPayload, RoomConfiguration, RoomConfigurationPayload } from '@/types/hotel';
import * as api from '@/services/api';

/**
 * Página principal — CRUD de hoteles + gestión de habitaciones.
 *
 * Estados de vista:
 *  - list:  tabla de hoteles
 *  - form:  crear/editar hotel
 *  - rooms: gestión de configuración de habitaciones
 */
type View = 'list' | 'form' | 'rooms';

export default function Index() {
  const { toast } = useToast();

  const [view, setView] = useState<View>('list');
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<RoomConfiguration[]>([]);
  const [loading, setLoading] = useState(false);

  // ── Cargar hoteles ────────────────────────────────
  const loadHotels = useCallback(async () => {
    try {
      const data = await api.getHotels();
      setHotels(data);
    } catch {
      toast({ title: 'Error', description: 'No se pudieron cargar los hoteles.', variant: 'destructive' });
    }
  }, [toast]);

  useEffect(() => {
    loadHotels();
  }, [loadHotels]);

  // ── Hotel CRUD ────────────────────────────────────
  const handleCreateOrUpdate = async (data: HotelPayload) => {
    setLoading(true);
    try {
      // Validar hotel no repetido (por nombre + ciudad)
      const duplicate = hotels.find(
        (h) =>
          h.id !== selectedHotel?.id &&
          h.name.toLowerCase() === data.name.toLowerCase() &&
          h.city.toLowerCase() === data.city.toLowerCase()
      );
      if (duplicate) {
        toast({ title: 'Error', description: 'Ya existe un hotel con ese nombre en esa ciudad.', variant: 'destructive' });
        return;
      }

      if (selectedHotel) {
        await api.updateHotel(selectedHotel.id!, data);
        toast({ title: 'Éxito', description: 'Hotel actualizado correctamente.' });
      } else {
        await api.createHotel(data);
        toast({ title: 'Éxito', description: 'Hotel creado correctamente.' });
      }
      await loadHotels();
      setView('list');
      setSelectedHotel(null);
    } catch {
      toast({ title: 'Error', description: 'No se pudo guardar el hotel.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este hotel?')) return;
    try {
      await api.deleteHotel(id);
      toast({ title: 'Éxito', description: 'Hotel eliminado.' });
      await loadHotels();
    } catch {
      toast({ title: 'Error', description: 'No se pudo eliminar.', variant: 'destructive' });
    }
  };

  // ── Rooms ─────────────────────────────────────────
  const openRooms = async (hotel: Hotel) => {
    setSelectedHotel(hotel);
    try {
      const r = await api.getRoomConfigurations(hotel.id!);
      setRooms(r);
      setView('rooms');
    } catch {
      toast({ title: 'Error', description: 'No se pudieron cargar las habitaciones.', variant: 'destructive' });
    }
  };

  const handleAddRoom = async (data: RoomConfigurationPayload) => {
    setLoading(true);
    try {
      await api.addRoomConfiguration(selectedHotel!.id!, data);
      const r = await api.getRoomConfigurations(selectedHotel!.id!);
      setRooms(r);
      toast({ title: 'Éxito', description: 'Configuración agregada.' });
    } catch {
      toast({ title: 'Error', description: 'No se pudo agregar.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = async (roomId: number) => {
    try {
      await api.deleteRoomConfiguration(selectedHotel!.id!, roomId);
      const r = await api.getRoomConfigurations(selectedHotel!.id!);
      setRooms(r);
      toast({ title: 'Éxito', description: 'Configuración eliminada.' });
    } catch {
      toast({ title: 'Error', description: 'No se pudo eliminar.', variant: 'destructive' });
    }
  };

  // ── Render ────────────────────────────────────────
  return (
    <Layout>
      {view === 'list' && (
        <>
          <div className="mb-6 flex items-center justify-between">
            <h1 className="font-display text-2xl font-bold text-foreground">
              Hoteles
            </h1>
            <Button
              onClick={() => {
                setSelectedHotel(null);
                setView('form');
              }}
            >
              <Plus className="mr-1 h-4 w-4" /> Nuevo Hotel
            </Button>
          </div>
          <HotelTable
            hotels={hotels}
            onEdit={(h) => {
              setSelectedHotel(h);
              setView('form');
            }}
            onDelete={handleDelete}
            onManageRooms={openRooms}
          />
        </>
      )}

      {view === 'form' && (
        <HotelForm
          hotel={selectedHotel}
          onSubmit={handleCreateOrUpdate}
          onCancel={() => {
            setView('list');
            setSelectedHotel(null);
          }}
          loading={loading}
        />
      )}

      {view === 'rooms' && selectedHotel && (
        <RoomConfigPanel
          hotel={selectedHotel}
          rooms={rooms}
          onAdd={handleAddRoom}
          onDelete={handleDeleteRoom}
          onBack={() => {
            setView('list');
            setSelectedHotel(null);
          }}
          loading={loading}
        />
      )}
    </Layout>
  );
}
