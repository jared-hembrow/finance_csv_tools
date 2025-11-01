import * as fs from "fs/promises";
import { Transaction, CreateCsvConfig } from "./types";

const DEFAULT_CONFIG: CreateCsvConfig = {
  outputFileName: "output",
  headers: [
    "Date",
    "WD/Date",
    "T Value",
    "Acc Update",
    "Description",
    "Additional",
  ],
};

class CreateCsv {
  private transactionList: Transaction[];
  private config: CreateCsvConfig;
  constructor(
    transactionList: Transaction[],
    config: CreateCsvConfig = DEFAULT_CONFIG
  ) {
    this.transactionList = transactionList;
    this.config = config;
  }
  async writeCsv(fileName: string, data: string): Promise<void> {
    // Write to file
    await fs.writeFile(`${fileName}.csv`, data, "utf-8");
  }

  private createGoogleSheetsDate(date: Date): string {
    return `"=DATE(${date.getFullYear()}, ${date.getMonth() + 1}, ${
      date.getDay() + 1
    })"`;
  }
  private createCsvLine(transaction: Transaction): string {
    const colA = this.createGoogleSheetsDate(transaction.date);
    const colB = this.createGoogleSheetsDate(transaction.withdrawnDate);
    const colC = transaction.transactionValue;
    const colD = transaction.accountUpdate;
    const colE = transaction.description;
    const colF = transaction.additional;
    return `${colA}, ${colB}, ${colC}, ${colD}, ${colE}, ${colF}`;
  }

  private transformTransaction(
    transactions: Transaction[],
    headers: string[] = []
  ): string {
    let result = `${headers.join(",")}\n`;

    transactions.forEach((t) => {
      result += `${this.createCsvLine(t)}\n`;
    });

    return result;
  }

  public generate(): void {
    const data = this.transformTransaction(
      this.transactionList,
      this.config.headers
    );
    this.writeCsv(this.config.outputFileName, data);
  }
}

export { CreateCsv };
