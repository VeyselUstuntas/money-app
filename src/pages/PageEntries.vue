<template>
  <q-page>
    <div class="q-pa-md">
      <q-list separator bordered>
        <q-item v-for="entry in entries" :key="entry.id">
          <q-item-section
            :class="useAmountColorClass(entry.amount)"
            class="text-weight-bold"
            >{{ entry.name }}</q-item-section
          >

          <q-item-section
            :class="useAmountColorClass(entry.amount)"
            class="text-weight-bold"
            side
            >{{ useCurrencify(entry.amount) }}
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <q-footer class="bg-transparent">
      <div class="row q-mb-sm q-px-md q-py-sm shadow-up-3">
        <div class="col text-grey-7 text-h6">Balance: </div>
        <div class="col text-grey-7 text-h6 text-right">+ $ 3.999,90</div>
      </div>

      <div class="row q-px-sm q-pb-sm q-col-gutter-sm bg-primary">
        <div class="col-auto">
          <q-input placeholder="Name" bg-color="white" dense outlined />
        </div>
        <div class="col-auto ">
          <q-input
            placeholder="Amount"
            bg-color="white"
            input-class="text-right"
            type="number"
            step="0.01"
            dense
            outlined
          />
        </div>
        <div class="col-auto">
          <q-btn color="positive" icon="add" round />
        </div>
      </div>
    </q-footer>
  </q-page>
</template>

<script setup lang="ts">
import { useAmountColorClass } from "src/use/useAmountColorClass";
import { useCurrencify } from "src/use/useCurrencify";
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
