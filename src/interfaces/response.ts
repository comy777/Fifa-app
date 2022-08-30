export interface Response {
  items: number;
  page: number;
  players: Player[];
  totalItems: number;
  totalPages: number;
}

interface Player {
  club: string;
  nation: string;
  position: string;
  name: string;
  __typename: string;
}
