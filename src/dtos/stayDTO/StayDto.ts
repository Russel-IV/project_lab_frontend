import type { AddressResponse } from './AddressResponse';
import type { RoomResponse } from './RoomResponse';
import type { StayPictureResponse } from './StayPictureResponse';

export type PropertyType = 'HOTEL' | 'HOME';

export interface StayResponse {
  id: number;
  name: string;
  about: string | null;
  propertyType: PropertyType;
  address: AddressResponse;
  isRefundable: boolean;
  starRating: number | null;
  daysFromBookingCancellationDeadline: number | null;
  policiesText: string | null;
  importantInformation: string | null;
  /** Pending backend fields — see plan synthetic-beaming-breeze. */
  checkInTimeFrom: string | null;
  checkInTimeUntil: string | null;
  checkOutTime: string | null;
  allowsPets: boolean | null;
  allowsSmoking: boolean | null;
  allowsParties: boolean | null;
  houseRulesText: string | null;
  hostId: number;
  propertyBrandId: number | null;
  viewIds: number[];
  amenityIds: number[];
  accessibilityIds: number[];
  mealPlanIds: number[];
  paymentTypeIds: number[];
  travelerExperienceIds: number[];
  rooms: RoomResponse[];
  pictures: StayPictureResponse[];
  startingFromPrice: number | null;
}

export type StayDto = StayResponse;
