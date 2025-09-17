export interface BingoCard {
  _id?: string;
  id: string;
  name: string;
  color: string;
  count: number;
  type?: string;
  status?: 'mark' | 'check' | 'unmark' | undefined;
}
