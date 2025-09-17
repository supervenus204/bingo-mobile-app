export interface Challenge {
  id: string;
  organizer_id: string;
  title: string;
  plan: string;
  is_organizer_participant: boolean;
  duration: number;
  card_size: number;
  status: string;
  image?: string | null;
  category_id: string;
  invitation_code: string;
  payment_id?: string | null;
  createdAt: string;
  updatedAt: string;
  is_organizer: boolean;
  current_week: number;
  organizer?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  category?: {
    id: string;
    name: string;
  };
}
