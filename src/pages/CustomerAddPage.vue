<template>
  <div class="flex justify-center items-center q-pa-md" style="height: 100vh">
    <q-card class="my-card" style="width: 50%">
      <q-card-section>
        <q-form @submit="generateCustomer" class="q-gutter-md" ref="formRef">
          <div>
            <q-input
              class="q-ma-md"
              filled
              v-model="firstname"
              label="Firstname"
              type="text"
              :rules="[
                (val) => !!val || 'Firstname is required',
                (val) => val.length >= 2 || 'Must be at least 2 characters',
              ]"
              lazy-rules
            />
            <q-input
              class="q-ma-md"
              filled
              v-model="lastname"
              label="Lastname"
              type="text"
              :rules="[
                (val) => !!val || 'Lastname is required',
                (val) => val.length >= 2 || 'Must be at least 2 characters',
              ]"
              lazy-rules
            />
            <q-input
              class="q-ma-md"
              filled
              v-model="email"
              label="Email"
              type="email"
              :rules="[
                (val) => !!val || 'Email is required',
                (val) => /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(val) || 'Invalid email',
              ]"
              lazy-rules
            />
            <q-input
              class="q-ma-md"
              filled
              v-model="address"
              label="Address"
              lazy-rules
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
              :rules="[
                (val) => !!val || 'Phone is required',
                (val) => val.length === 10 || 'Must be exactly 10 digits',
              ]"
              lazy-rules
            />
            <q-select
              class="q-ma-md"
              v-model="userId"
              :options="options"
              map-options
              emit-value
              label="User"
              filled
              :rules="[(val) => !!val || 'User is required']"
              lazy-rules
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
import { Notify, QForm, QSelectOption } from 'quasar';
import { CustomerInput } from 'src/models/customer/customer-input.customer.model';
import { User } from 'src/models/user/user.user.model';
import { useUserStore } from 'src/stores/userStore';
import { onMounted, ref } from 'vue';

const userStore = useUserStore();

const firstname = ref<string>('');
const lastname = ref<string>('');
const email = ref<string>('');
const address = ref<string>('');
const phone = ref<string>('');
const userId = ref<number | null>(null);

const options = ref<QSelectOption[]>([]);
const userList = ref<User[]>([]);

const formRef = ref<QForm | null>(null);

const clearInput = () => {
  firstname.value = '';
  lastname.value = '';
  email.value = '';
  address.value = '';
  phone.value = '';
  userId.value = null;
};

const generateCustomer = async () => {
  if (formRef.value && (await formRef.value.validate())) {
    const customerInput: CustomerInput = new CustomerInput({
      firstName: firstname.value,
      lastName: lastname.value,
      email: email.value,
      address: address.value,
      phone: phone.value,
      userId: Number(userId.value),
    });
    console.log('input ', customerInput);

    const result = await userStore.generateCustomer(customerInput);
    if (result?.success) {
      Notify.create({ message: 'Customer eklendi', color: 'primary', position: 'top' });
      clearInput();
    } else {
      Notify.create({
        message: result?.message ?? 'Hata',
        color: 'warning',
        position: 'top',
      });
    }
  } else {
    Notify.create({
      message: 'Please fix the errors in the form.',
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
