// Types for Tour Split Expense Feature

export type TourMember = {
  id: string;
  name: string;
};

export type TourExpense = {
  id: string;
  description: string;
  amount: number;
  paidBy: string; // member id
  participants: string[]; // member ids
  date: string;
};

export type Tour = {
  id: string;
  name: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  createDate: string;
  members: TourMember[];
  expenses: TourExpense[];
};

export type TourBalance = {
  memberId: string;
  balance: number;
};
