import { defineStore } from 'pinia';
import { authenticatedApi } from 'src/boot/authenticated-api';
import { CustomerInput } from 'src/models/customer/customer-input.customer.model';
import { Customer, CustomerResponse } from 'src/models/customer/customer.customer.model';
import { User, UserResponse } from 'src/models/user/user.user.model';

interface State {

}

export const useUserStore = defineStore('user', {
  state: (): State => ({

  }),

  actions: {
    async getAllCustomers(): Promise<Customer[]> {
      try {
        const result: CustomerResponse = await authenticatedApi.get('Customers');
        if (result.success) {
          if (Array.isArray(result.data))
            return result.data;
          else
            return [result.data];
        }
        else {
          console.error("API başarısız oldu:", result.message);
          return [];
        }
      }
      catch (error) {
        console.log(error);
        return [];
      }
    },

    async generateCustomer(customerInput: CustomerInput): Promise<CustomerResponse | null> {
      try {
        const result: CustomerResponse = await authenticatedApi.post('Customers/add-customer', customerInput);
        if (result.success) {
          return result;
        }
        else {
          console.error("API başarısız oldu:", result.message);
          return null;
        }
      } catch (error) {
        console.log(error);
        return null;
      }

    },

    async getAllUser(): Promise<User[]>{
      try{
        const result : UserResponse= await authenticatedApi.get('Users');
        if (result.success) {
          if (Array.isArray(result.data))
            return result.data;
          else
            return [result.data];
        }
        else {
          console.error("API başarısız oldu:", result.message);
          return [];
        }

      }catch(error){
        console.log(error);
        return [];
      }
    }

  }

})
