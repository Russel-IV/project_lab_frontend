export interface StayPictureResponse {
  id: number;
  stayId: number;
  url: string;
  caption: string | null;
  isPrimary: boolean;
  displayOrder: number;
}
