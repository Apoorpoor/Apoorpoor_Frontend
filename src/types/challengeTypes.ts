export type ChallengeLedger = {
  title: string;
  expenditureType: string;
  expenditure: number;
  date: string;
};

export type AccountHistoryType = {
  challengeLedgerHistoryList: ChallengeLedger[];
};
