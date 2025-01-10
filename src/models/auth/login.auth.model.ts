export class LoginInput {
  email!: string;
  password!: string;

  constructor(loginInput: Partial<LoginInput>) {
    Object.assign(this, loginInput);
  }
}

class LoginDataResult {
  accessToken!: string;
  refreshToken!: string;
  constructor(loginDataResult: Partial<LoginDataResult>) {
    Object.assign(this, loginDataResult);
  }
}

export class LoginResult {
  data!: LoginDataResult;
  message!: string;
  success!: boolean;

  constructor(loginResult: Partial<LoginResult>) {
    Object.assign(this, loginResult);
  }
}
