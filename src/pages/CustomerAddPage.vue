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
              :rules="[() => !Boolean(errors.error?.format().firstname?._errors.length)]"
              :error-message="errors.error?.format().firstname?._errors[0]"
            />
            <q-input
              class="q-ma-md"
              filled
              v-model="lastname"
              label="Lastname"
              type="text"
              :rules="[() => !Boolean(errors.error?.format().lastname?._errors.length)]"
              :error-message="errors.error?.format().lastname?._errors[0]"
            />
            <q-input
              class="q-ma-md"
              filled
              v-model="email"
              label="Email"
              type="email"
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
              :rules="[() => !Boolean(errors.error?.format().userId?._errors.length)]"
              :error-message="errors.error?.format().userId?._errors[0]"
            />
          </div>
          <div class="flex justify-center q-mt-md">
            <q-btn label="Submit" type="submit" color="primary" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { event, Notify, QForm, QSelectOption } from 'quasar';
import { CustomerInput } from 'src/models/customer/customer-input.customer.model';
import { User } from 'src/models/user/user.user.model';
import { useUserStore } from 'src/stores/userStore';
import { computed, onMounted, ref } from 'vue';
import { z } from 'zod';

const userStore = useUserStore();

const formRef = ref<InstanceType<typeof QForm> | null>(null);
const firstname = ref<string | null>(null);
const lastname = ref<string | null>(null);
const email = ref<string | null>(null);
const address = ref<string | null>(null);
const phone = ref<string | null>(null);
const userId = ref<string | null>(null);
const options = ref<QSelectOption[]>([]);

const errors = computed(() => {
  return customerSchema.safeParse({
    firstname: firstname.value,
    lastname: lastname.value,
    email: email.value,
    address: address.value,
    phone: phone.value,
    userId: userId.value,
  });
});


const userList = ref<User[]>([]);

const customerSchema = z.object({
  firstname: z
    .string({ message: 'Firstname is required' })
    .min(2, { message: 'Must be at least 2 characters' }),
  lastname: z
    .string({ message: 'Lastname is required' })
    .min(2, { message: 'Must be at least 2 characters' }),
  email: z
    .string({ message: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  address: z.string(),
  phone: z
    .string({ message: 'Phone is required' })
    .min(10, { message: 'Must be exactly 10 digits' }),
  userId: z
    .string({ message: 'User is required' })
    .min(1, { message: 'Must be user selected' }),
});



const validate = (): boolean => {
  formRef.value?.validate();
  console.log(errors.value);
  return errors.value.success;
};

const clearInput = () => {
  firstname.value = '';
  lastname.value = '';
  email.value = '';
  address.value = '';
  phone.value = '';
  userId.value = '';
};


const generateCustomer = async () => {
  if (!validate()) {
    Notify.create({
      message: 'Gerekli Bilgileri eksiksiz doldurun.',
      color: 'warning',
      position: 'top',
    });
    return;
  }

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
