export enum EMood {
  Neutral = 0,
  Happy = 1,
  Unhappy = 2,
}

export interface IUser {
  id: string;
  name: string;
  password: string;
  mood: EMood;
}

export class User implements IUser {

  public static _UserId: number = 0;
  public mood: EMood = EMood.Neutral;
  constructor(public id: string, public name: string, public password: string) {
  }
}
