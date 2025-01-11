<template>
  <div class="flex justify-center items-center q-pa-md" style="height: 100vh">
    <q-card class="my-card" style="width: 50%">
      <q-card-section>
        <q-form ref="formRef" @submit="generateCustomer" class="q-gutter-md">
          <div>
            <q-input
              class="q-ma-md"
              filled
              v-model="firstname"
              label="Firstname"
              type="text"
              lazy-rules

              :rules="[() => !Boolean(errors.error?.format().firstname?._errors.length)]"
              :error-message="errors.error?.format().firstname?._errors[0]"
            />
            <q-input
              class="q-ma-md"
              filled
              v-model="lastname"
              label="Lastname"
              type="text"
              lazy-rules

              :rules="[() => !Boolean(errors.error?.format().lastname?._errors.length)]"
              :error-message="errors.error?.format().lastname?._errors[0]"
            />
            <q-input
              class="q-ma-md"
              filled
              v-model="email"
              label="Email"
              type="email"
              lazy-rules

              :rules="[() => !Boolean(errors.error?.format().email?._errors.length)]"
              :error-message="errors.error?.format().email?._errors[0]"
            />
            <q-input
              class="q-ma-md"
              filled
              v-model="address"
              label="Address"
              type="text"
            />
            <q-input
              class="q-ma-md"
              filled
              v-model="phone"
              label="Phone"
              unmasked-value
              type="tel"
              mask="(###) ### - ####"
              hint="(###) ### - ####"
              lazy-rules
              :rules="[() => !Boolean(errors.error?.format().phone?._errors.length)]"
              :error-message="errors.error?.format().phone?._errors[0]"
            />
            <q-select
              class="q-ma-md"
              v-model="userId"
              :options="options"
              map-options
              emit-value
              label="User"
              filled
              lazy-rules
              :rules="[() => !Boolean(errors.error?.format().userId?._errors.length)]"
              :error-message="errors.error?.format().userId?._errors[0]"

            />
          </div>
          <div class="flex justify-center q-mt-md">
            <q-btn
              label="Submit"
              type="submit"
              color="primary"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { Notify, QForm, QSelectOption } from 'quasar';
import { CustomerInput } from 'src/models/customer/customer-input.customer.model';
import { User } from 'src/models/user/user.user.model';
import { useUserStore } from 'src/stores/userStore';
import { computed, onMounted, reactive, ref } from 'vue';
import { z } from 'zod';

const userStore = useUserStore();

const userList = ref<User[]>([]);

const firstname = ref<string | null>(null);
const lastname = ref<string | null>(null);
const email = ref<string | null>(null);
const address = ref<string | null>(null);
const phone = ref<string | null>(null);
const userId = ref<string | null>(null);
const options = ref<QSelectOption[]>([]);

const formRef = ref<InstanceType<typeof QForm> | null>(null);

const customerFormSchema = z.object({
  firstname: z
    .string({ message: 'Firstname Required' })
    .min(2, { message: 'must be minimum 2 characters' }),
  lastname: z
    .string({ message: 'Lastname Required' })
    .min(2, { message: 'must be minimum 2 characters' }),
  email: z.string({ message: 'Email Required' }).email({ message: 'Invalid Email' }),
  address: z.string(),
  phone: z
    .string({ message: 'Phone Required' })
    .length(10, { message: 'must be 10 characters' }),
  userId: z.string({ message: 'User Required' }).min(1, { message: 'Select User' }),
});

const errors = computed(() => {
  return customerFormSchema.safeParse({
    firstname: firstname.value,
    lastname: lastname.value,
    email: email.value,
    address: address.value,
    phone: phone.value,
    userId: userId.value,
  });
});

const clearInput = () => {
  firstname.value = '';
  lastname.value = '';
  email.value = '';
  address.value = '';
  phone.value = '';
  userId.value = '';
};


// const validate = async (): Promise<boolean> => {
//   await formRef.value?.validate();
//   console.log('errors ', errors.value);
//   return errors.value.success;
// };

const generateCustomer = async () => {
  // const validationResponse = validate();
  // console.log('validationResponse', validationResponse);
  // if (!validate()) {
  //   Notify.create({
  //     message: 'Gerekli Bilgileri eksiksiz doldurun.',
  //     color: 'warning',
  //     position: 'top',
  //   });
  // }


  const customerInput: CustomerInput = new CustomerInput({
    firstName: firstname.value!,
    lastName: lastname.value!,
    email: email.value!,
    address: address.value,
    phone: phone.value,
    userId: Number(userId.value),
  });

  const result = await userStore.generateCustomer(customerInput);
  if (result?.success) {
    Notify.create({ message: 'Customer added', color: 'primary', position: 'top' });
    formRef.value?.reset();
    clearInput();
  } else {
    Notify.create({
      message: result?.message ?? 'Error',
      color: 'warning',
      position: 'top',
    });
  }
};

onMounted(async () => {
  userList.value = await userStore.getAllUser();
  userList.value.forEach((user) => {
    options.value.push({ label: user.email, value: user.id.toString() });
  });

});
</script>

<style scoped></style>
