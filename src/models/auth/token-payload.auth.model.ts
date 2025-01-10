export class TokenPayload{
  userId!: number;
  roles!: string;
  iat!: number;
  exp!: number;
  fullname!: string;
  scopes!: string;

  constructor(tokenPayload: Partial<TokenPayload>){
    Object.assign(this, tokenPayload);
  }
}
