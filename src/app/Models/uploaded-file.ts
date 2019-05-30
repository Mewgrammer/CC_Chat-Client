
export interface IUploadedFile {
  id: string;
  pathToFile: string;
  displayName: string;
  data?: Buffer;
}

export class UploadedFile implements  IUploadedFile{
  public id: string;

  constructor(public pathToFile: string, public displayName: string, public data: any) {

  }
}
