/** Respuesta de API   */
export type ApiResponse<T> = {
  success: boolean;
  data: T;
};

/** Tipos de habitación permitidos */
export type RoomType = 'Estándar' | 'Junior' | 'Suite';

/** Tipos de acomodación permitidos */
export type AccommodationType = 'Sencilla' | 'Doble' | 'Triple' | 'Cuádruple';

/** Mapa de acomodaciones válidas por tipo de habitación */
export const VALID_ACCOMMODATIONS: Record<RoomType, AccommodationType[]> = {
  'Estándar': ['Sencilla', 'Doble'],
  'Junior': ['Triple', 'Cuádruple'],
  'Suite': ['Sencilla', 'Doble', 'Triple'],
};

export const ROOM_TYPES: RoomType[] = ['Estándar', 'Junior', 'Suite'];

/** Configuración de habitación asignada a un hotel */
export interface RoomConfiguration {
  id?: number;
  hotelId: number;
  room_type: Room;
  accommodation: Accommodation;
  quantity: number;
}

export interface RoomConfigurationPayload {
  room_type_id: number;
  accommodation_id: number;
  quantity: number;
}

/** Datos del hotel */
export interface Hotel {
  id?: number;
  name: string;
  address: string;
  city: string;
  nit: string;
  total_rooms: number;
  rooms?: RoomConfiguration[];
}

export interface Accommodation {
  id?: number;
  name: AccommodationType;
}

export interface Room {
  id?: number;
  name: RoomType;
}

/** DTO para crear/actualizar hotel */
export type HotelPayload = Omit<Hotel, 'id' | 'rooms'>;

