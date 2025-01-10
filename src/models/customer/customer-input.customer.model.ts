
export class CustomerInput {
  firstName!: string;
  lastName!: string;
  email!: string;
  phone!: string | null;
  address!: string | null;
  userId!: number;

  constructor(customer: Partial<CustomerInput>) {
    Object.assign(this, customer);
  }
}
