<template>
  <div class="q-pa-md">
    <q-input class="q-mb-md" v-model="search" filled placeholder="Customer Ara">
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>
    <q-table
      :class="['customer-table']"
      title="Customers"
      :rows="customerList!"
      :columns="columns"
      row-key="name"
      :rows-per-page-options="[0]"
      :loading="loading"
      no-results-label="Customer Yok"
      no-data-label="Customer Yok"
    >
      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { debounce } from 'quasar';
import { Customer } from 'src/models/customer/customer.customer.model';
import { useUserStore } from 'src/stores/userStore';
import { onMounted, ref, watch } from 'vue';

const userStore = useUserStore();
const customerList = ref<Customer[]>([]);
const tempCustomerList = ref<Customer[]>([]);

const search = ref<string>('');
const loading = ref<boolean>(false);
let filteredCustomers = ref<any>(null);


const updateCustomerList = debounce((value) => {
  loading.value = true;

  filteredCustomers.value = tempCustomerList.value.filter((customer) =>
    customer.email.toLowerCase().startsWith(value.toLowerCase())
  );
}, 900);

const loadingDebounce = debounce(() => {
  loading.value = false;
  customerList.value = filteredCustomers.value;
},3000);


watch(
  () => search.value,
  (value) => {
    updateCustomerList(value);
    loadingDebounce();
  }
);


onMounted(async () => {
  loadCustomerList();
});

const loadCustomerList = async () => {
  customerList.value = await userStore.getAllCustomers();
  tempCustomerList.value = customerList.value;
};

const columns: {
  name: string;
  field: string;
  label: string;
  align?: 'left' | 'right' | 'center';
}[] = [
  {
    name: 'id',
    field: 'id',
    align: 'left',
    label: 'Id',
  },

  {
    name: 'firstname',
    field: 'firstName',
    align: 'left',
    label: 'Firstname',
  },

  {
    name: 'lastname',
    field: 'lastName',
    align: 'left',
    label: 'Lastname',
  },

  {
    name: 'email',
    field: 'email',
    align: 'left',
    label: 'Email',
  },

  {
    name: 'phone',
    field: 'phone',
    align: 'left',
    label: 'Phone',
  },

  {
    name: 'address',
    field: 'address',
    align: 'left',
    label: 'Address',
  },

  {
    name: 'createdAt',
    field: 'createdAt',
    align: 'left',
    label: 'Created At',
  },

  {
    name: 'updatedAt',
    field: 'updatedAt',
    align: 'left',
    label: 'Update At',
  },
];
</script>

<style scoped>
.customer-table {
  height: calc(100vh - 10rem);
}
</style>
