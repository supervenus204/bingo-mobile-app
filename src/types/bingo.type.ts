export interface BingoCard {
  id: string;
  name: string;
  color: string;
  count: number;
  type?: string;
  status?: 'mark' | 'unmark' | 'check' | undefined;
}
