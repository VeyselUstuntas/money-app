export class Customer {
  id!: number;
  firstName!: string;
  lastName!: string;
  email!: string;
  phone!: string | null;
  address!: string | null;
  userId!: number;
  createdAt!: Date;
  updatedAt!: Date | null;

  constructor(customer: Partial<Customer>) {
    Object.assign(this, customer);
  }
}

export class CustomerResponse {
  data!: Customer[];
  message!: string;
  success!: boolean;

  constructor(customerResponse: Partial<CustomerResponse>) {
    Object.assign(this, customerResponse);
  }
}
