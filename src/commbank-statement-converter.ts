import { Transaction } from "./types";

class CommBankStatmentConverter {
  constructor() {}

  /**
   * parse a raw csv statement from commbank netbank download
   * Headers:  Date`, `debit/credit`, `description`, `balance`
   * Format: `dd/mm/yyyy`, `+/- num`, `description`, `+/- num`
   * @param {string} rawStatement
   * @returns {string[]} array of string (data)
   */
  private parseRawStatement(rawStatement: string): string[][] {
    // Split raw text into lines
    const lines: string[] = rawStatement
      .split("\n")
      .map((line) => line.replace("\r", ""));

    // Split lines into there parts (columns/data)
    const lineParts: string[][] = lines.map((line) => line.trim().split(","));

    // parse/format text
    // remove extra double quotes (")
    const parsedLines: string[][] = lineParts.map((line) =>
      line.map((d) => d.replace('"', "").replace('"', ""))
    );

    // Filter empty lines
    const filteredLines = parsedLines.filter((l) => {
      if (l.length < 1) return false;
      if (!l.join("")) return false;
      return true;
    });

    return filteredLines;
  }

  /**
   * create date object from string
   * Format: dd/mm/yyyy
   * @param {string} dateString
   * @returns {Date} Date object created from string
   */
  private createDate(dateString: string): Date {
    // Split string into its units from format "dd/mm/yyyy"
    const dateParts = dateString.split("/");

    // Create ISO string
    const day = dateParts[0];
    const month = dateParts[1];
    const year = dateParts[2];
    const isoDateString = `${year}-${month}-${day}T00:00:00.000Z`;

    // create date object from ISO string
    const date = new Date(isoDateString);

    return date;
  }

  /**
   * Parse raw description string into its components
   * @param str
   * @returns {string[]} array of strings [description, additional-infomation, value date]
   */
  private parseDescrition(str: string): string[] {
    // Split raw string at the beginning of the additional infomation
    const strParts = str.split("Card");

    // Create resulting array and add parsed description
    const result = [strParts[0].trim()];

    // Add additional text if it exists
    if (strParts.length > 1) {
      result.push(`Card${strParts[1]}`);

      // extract the value date if it exists
      const dateString = strParts[1].split("Value Date: ");
      if (dateString.length > 1) {
        result.push(dateString[1]);
      }
    }

    return result;
  }

  /**
   * transform a line from a bank statement into a object
   * @param {string[]} statementLine line of a statement
   * @returns {Transaction} Object containing key/value pairs of data taken from a line of a bank statement
   */
  private transformLine(statementLine: string[]): Transaction {
    console.log("statementLine:", statementLine);
    // Initial Transaction objetc
    const trans: Transaction = {
      date: null,
      withdrawnDate: null,
      accountUpdate: statementLine[3],
      transactionValue: statementLine[1],
      description: "",
      additional: "",
    };

    // Parse description string into components
    const strParts = this.parseDescrition(statementLine[2]);

    // Add description extractions to the transaction object
    trans.description = strParts[0];

    if (strParts.length > 1) {
      trans.additional = strParts[1];
    }
    if (strParts.length > 2) {
      trans.date = this.createDate(strParts[2]);
    } else {
      trans.date = this.createDate(statementLine[0]);
    }
    trans.withdrawnDate = this.createDate(statementLine[0]);

    return trans;
  }

  /**
   * Convert commbank statement into an array of transaction objects
   * @param {string} rawInput raw file text
   * @returns {Transaction[]} list of transactions
   */
  public convert(rawInput: string): Transaction[] {
    const lines = this.parseRawStatement(rawInput);

    const transactionList = lines.map((line) => this.transformLine(line));

    return transactionList;
  }
}

export { CommBankStatmentConverter };
