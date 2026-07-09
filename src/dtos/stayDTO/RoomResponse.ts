export interface RoomPictureResponse {
  id: number;
  roomId: number;
  url: string;
  caption: string | null;
  isPrimary: boolean;
  displayOrder: number;
}

export interface RoomResponse {
  id: number;
  stayId: number;
  name: string;
  price: number;
  sleeps: number;
  bedroomAmount: number;
  bathrooms: number;
  size: number | null;
  pictures: RoomPictureResponse[];
}
