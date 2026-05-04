import type { Hotel, HotelPayload, RoomConfiguration, ApiResponse, Accommodation, Room, RoomConfigurationPayload } from '@/types/hotel';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function request<T>(path: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    let message = body?.message || `Error ${res.status}`;

    if (body?.errors) {
      message = Object.values(body.errors)
        .flat()
        .join(', ');
    }

    throw new Error(message);
  }

  return body;
}

// ── Hoteles ──────────────────────────────────────────────────

/** Obtener todos los hoteles */
export async function getHotels(): Promise<Hotel[]> {
  const result = await request<Hotel[]>('/hotels');
  return result.data;
}

/** Obtener un hotel por ID */
export async function getHotel(id: number): Promise<Hotel> {
  const result = await request<Hotel>(`/hotels/${id}`);
  return result.data;
}

/** Crear un nuevo hotel */
export async function createHotel(data: HotelPayload): Promise<Hotel> {
  const result = await request<Hotel>('/hotels', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return result.data;
}

/** Actualizar un hotel existente */
export async function updateHotel(id: number, data: HotelPayload): Promise<Hotel> {
  const result = await request<Hotel>(`/hotels/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return result.data;
}

/** Eliminar un hotel */
export async function deleteHotel(id: number): Promise<void> {
  const result = await request(`/hotels/${id}`, { method: 'DELETE' });
}

// ── Habitaciones ─────────────────────────────────────────────

/** Obtener configuraciones de habitación de un hotel */
export async function getRoomConfigurations(hotelId: number): Promise<RoomConfiguration[]> {
  const result = await request<RoomConfiguration[]>(`/hotels/${hotelId}/rooms`);
  return result.data;
}

/** Agregar configuración de habitación a un hotel */
export async function addRoomConfiguration(
  hotelId: number,
  data: RoomConfigurationPayload
): Promise<RoomConfiguration> {
  const result = await request<RoomConfiguration>(`/hotels/${hotelId}/rooms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return result.data;
}

/** Eliminar configuración de habitación */
export async function deleteRoomConfiguration(
  hotelId: number,
  roomId: number
): Promise<void> {
  await request(`/hotels/${hotelId}/rooms/${roomId}`, { method: 'DELETE' });
}

/**Obtener todas las acomodaciones   */
export async function getAccommodations(): Promise<Accommodation[]> {
  const result = await request<Accommodation[]>('/catalogs/accommodations');
  return result.data;
}

/**Obtener todos los tipos de habitación */
export async function getRoomTypes(): Promise<Room[]> {
  const result = await request<Room[]>('/catalogs/room-types');
  return result.data;
}