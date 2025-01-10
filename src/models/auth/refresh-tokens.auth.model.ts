export class RefreshTokens{
  accessToken!:string;
  constructor(refreshToken:Partial<RefreshTokens>){
    Object.assign(this, refreshToken);
  }
}

export class RefreshTokensResult{
  data!:RefreshTokens;
  message!:string;
  success!:boolean;
  constructor(refreshTokenResult:Partial<RefreshTokensResult>){
    Object.assign(this, refreshTokenResult);
  }
}
