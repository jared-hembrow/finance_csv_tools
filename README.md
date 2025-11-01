# Finance CSV Tools

A TypeScript utility for compiling and converting CommBank bank statements into a standardized CSV format.

## What It Does

This tool reads multiple CommBank statement CSV files from a folder, converts them into a standardized transaction format, sorts them by date, and outputs a single combined CSV file with Excel-compatible date formulas.

## Features

- Reads multiple CSV files from a specified folder
- Converts CommBank statement format to standardized transaction format
- Sorts transactions by date (newest first)
- Outputs Excel-compatible CSV with DATE formulas
- Handles transaction details including dates, amounts, descriptions, and account updates

## Installation

```bash
npm install
```

## Usage

1. Place your CommBank statement CSV files in the `./raw` directory

2. Run the converter:

```bash
npm start
```

3. The combined and sorted transactions will be saved to `output.csv`

## Output Format

The generated CSV includes the following columns:

- Date - Transaction date (Excel DATE formula)
- WD/Date - Withdrawn/deposited date (Excel DATE formula)
- T Value - Transaction value
- Acc Update - Account balance update
- Description - Transaction description
- Additional - Additional information

## Project Structure

- [main.ts](main.ts) - Entry point that orchestrates the conversion process
- [src/csv.ts](src/csv.ts) - Handles CSV file compilation from a folder
- [src/commbank-statement-converter.ts](src/commbank-statement-converter.ts) - Converts CommBank format to standard transaction format
- [src/transaction-to-csv.ts](src/transaction-to-csv.ts) - Generates the output CSV file
- [src/types.d.ts](src/types.d.ts) - TypeScript type definitions

## Customization

To change the input folder path, modify the folder path in [main.ts:20](main.ts#L20):

```typescript
main("./your-folder-path");
```

To change the output file name or headers, modify the configuration in the `CreateCsv` class.

## License

ISC