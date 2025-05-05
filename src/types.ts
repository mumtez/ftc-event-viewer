export interface Team {
  number: string;
  name: string;
  opr: number;
  worldRank?: number;
  schoolName?: string;
  country?: string;
  state?: string;
  city?: string;
  rookieYear?: number;
  website?: string | null;
}

export interface Event {
  eventCode: string;
  teams: Team[];
} 