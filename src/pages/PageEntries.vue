<template>
  <q-page>
    <div class="q-pa-md">
      <q-list separator bordered>
        <q-item v-for="entry in entries" :key="entry.id">
          <q-item-section> {{ entry.name }}</q-item-section>
          <q-item-section side>{{ useCurrencify(entry.amount) }} </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useCurrencify } from "src/use/userCurrencify";
import { ref } from "vue";

const entries = ref([
  {
    id: "id1",
    name: "Salary",
    amount: 4999.99,
  },
  {
    id: "id2",
    name: "Rent",
    amount: -999,
  },
  {
    id: "id3",
    name: "Phone",
    amount: -14.99,
  },
  {
    id: "id4",
    name: "Unknow",
    amount: 0,
  },
]);


</script>
