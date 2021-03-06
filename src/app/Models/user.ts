export enum EMood {
  Neutral = 0,
  Happy = 1,
  Unhappy = 2,
}

export interface IUser {
  id: number;
  name: string;
  password: string;
  mood: EMood;
  language: string;
  profilePictureLink: string;
}

export class User implements IUser {
  public mood: EMood = EMood.Neutral;
  public profilePictureLink: string;
  public language: string = "de";
  constructor(public id: number, public name: string, public password: string) {

  }
}
