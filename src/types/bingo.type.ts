export interface BingoCard {
  id: string;
  name: string;
  color: string;
  count: number;
  _count?: number;
  type?: string;
  status?: 'mark' | 'unmark' | 'check' | undefined;
}
