export class RegisterInput {
  name!: string;
  lastname!: string;
  email!: string;
  password!: string;

  constructor(registerInput: Partial<RegisterInput>) {
    Object.assign(this, registerInput);
  }
}

class RegisterDataResult {
  accessToken!: string;
  refreshToken!: string;
  constructor(registerDataResult: Partial<RegisterDataResult>) {
    Object.assign(this, registerDataResult);
  }
}

export class RegisterResult {
  data!: RegisterDataResult;
  message!: string;
  success!: boolean;

  constructor(registerResult: Partial<RegisterResult>) {
    Object.assign(this, registerResult);
  }
}
