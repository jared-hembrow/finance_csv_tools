type Transaction = {
  date: Date;
  withdrawnDate: Date;
  accountUpdate: string;
  transactionValue: string;
  description: string;
  additional: string;
};

type CreateCsvConfig = {
  outputFileName: string;
  headers: string[];
};

export type { Transaction, CreateCsvConfig };
