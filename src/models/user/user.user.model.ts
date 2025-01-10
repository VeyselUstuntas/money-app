export class User {
  id!: number;
  name!: string;
  lastname!: string;
  email!: string;
  role!: string;
  createdAt!: Date;
  updatedAt!: Date | null;

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}

export class UserResponse {
  data!: User[];
  message!: string;
  success!: boolean;

  constructor(userResponse: Partial<UserResponse>) {
    Object.assign(this, userResponse);
  }
}
