type Category = {
  id: string;
  name: string;
  isIncome: number;
  catGroup: string;
  sortOrder: number;
  tombstone: number;
  hidden: boolean;
  goalDef: string | null;
};

export type Schedule = {
  id: string;
  rule: string;
  active: number;
  completed: number;
  posts_transaction: number;
  tombstone: number;
  name: string | null;
};
