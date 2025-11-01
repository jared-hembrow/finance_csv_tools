import * as fs from "fs/promises";
import path from "path";

type CsvFile = {
  name: string;
  filePath: string;
  folderPath: string;
  contents: string;
};

class CompileStatements {
  private folderPath: string;
  constructor(folderPath: string) {
    this.folderPath = folderPath;
  }

  private async readFolder(folderPath: string): Promise<string[]> {
    const folderContents = await fs.readdir(folderPath);
    return folderContents;
  }
  private async readCsv(file: string, folderPath: string): Promise<CsvFile> {
    const filePath = path.join(folderPath, `${file}`);
    const fileString = await fs.readFile(filePath, "utf-8");
    return {
      name: file,
      filePath,
      folderPath,
      contents: fileString,
    };
  }

  private async readCsvList(
    fileList: string[],
    folderPath: string
  ): Promise<CsvFile[]> {
    const files: CsvFile[] = [];
    for (const f of fileList) {
      const csvFile = await this.readCsv(f, folderPath);
      files.push(csvFile);
    }
    return files;
  }

  public async compile(): Promise<CsvFile[]> {
    const folderContents = await this.readFolder(this.folderPath);

    const files = await this.readCsvList(folderContents, this.folderPath);

    return files;
  }
}

export { CompileStatements };
