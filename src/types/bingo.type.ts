export interface BingoCard {
  id: string;
  name: string;
  color: string;
  font_color: string;
  font_name: string;
  count: number;
  type?: string;
  status?: 'mark' | 'unmark' | 'check' | undefined;
}
