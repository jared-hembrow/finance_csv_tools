import { CompileStatements, CommBankStatmentConverter, CreateCsv } from "./src";

async function main(folderPath: string) {
  const fileCompiler = new CompileStatements(folderPath);
  const csvFiles = await fileCompiler.compile();
  const converter = new CommBankStatmentConverter();

  const transactionList = csvFiles.map((f) => converter.convert(f.contents));
  const combinedList = transactionList.flatMap((l) => l);

  //   Sort by date
  const sortedList = combinedList.sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  const csvWriter = new CreateCsv(sortedList);
  csvWriter.generate();
}

main("./raw");
