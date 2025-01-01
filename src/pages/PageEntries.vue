<template>
  <q-page>
    <div class="q-pa-md">
      <q-list separator bordered v-if="storeEntries.entryLoaded">
        <q-slide-item
          v-for="entry in storeEntries.entries"
          @right="onEntrySlideRight($event, entry)"
          :key="entry.id"
          right-color="negative"
        >
          <!-- <template v-slot:left>
            <q-icon name="done" />
          </template> -->
          <template v-slot:right>
            <q-icon name="delete" />
          </template>
          <q-item>
            <q-item-section
              :class="useAmountColorClass(entry.amount!)"
              class="text-weight-bold"
              >{{ entry.name }}</q-item-section
            >

            <q-item-section
              :class="useAmountColorClass(entry.amount!)"
              class="text-weight-bold"
              side
              >{{ useCurrencify(entry.amount!) }}
            </q-item-section>
          </q-item>
        </q-slide-item>
      </q-list>

      <div v-else class="text-center"><q-spinner color="primary" size="3em" /></div>
    </div>

    <q-footer class="bg-white">
      <div class="row q-mb-sm q-px-md q-py-sm shadow-up-3">
        <div class="col text-grey-7 text-h6">Balance:</div>
        <div
          class="col text-h6 text-right"
          :class="useAmountColorClass(storeEntries.balance)"
        >
          {{ useCurrencify(storeEntries.balance) }}
        </div>
      </div>

      <q-form @submit="addEntry" class="row q-px-sm q-pb-sm q-col-gutter-sm bg-primary">
        <div class="col-5">
          <q-input
            placeholder="Name"
            bg-color="white"
            dense
            outlined
            ref="nameRef"
            v-model="addEntryForm.name"
          />
        </div>
        <div class="col-5">
          <q-input
            placeholder="Amount"
            bg-color="white"
            input-class="text-right"
            type="number"
            step="0.01"
            dense
            outlined
            v-model.number="addEntryForm.amount"
          />
        </div>
        <div class="col-2">
          <q-btn color="positive" icon="add" round type="submit" />
        </div>
      </q-form>
    </q-footer>
  </q-page>
</template>

<script setup lang="ts">
import { useAmountColorClass } from "src/use/useAmountColorClass";
import { useCurrencify } from "src/use/useCurrencify";
import { computed, onMounted, reactive, ref } from "vue";
import { uid, useQuasar } from "quasar";
import { useStoreEntries } from "src/stores/storeEntries";
import { Entry } from "src/types/Entry";
import { AddEntry } from "src/types/AddEntry";

export interface IEntry {
  id: string;
  name: string;
  amount: number | null;
}

const $q = useQuasar();

const entries = ref<Entry[]>([]);

const nameRef = ref<HTMLInputElement | null>(null);

const storeEntries = useStoreEntries();

const addEntryFormDefault : AddEntry = {
  name:"",
  amount: null,
  paid: false,
};

const addEntryForm = reactive <AddEntry>({
  ...addEntryFormDefault
});

const addEntryFormReset = () => {
  Object.assign(addEntryForm, addEntryFormDefault);
  nameRef.value!.focus();
};

const loadEntries = async () => {
  await storeEntries.loadEntries();
};

const addEntry = async () => {
  await storeEntries.addEntry(addEntryForm);
  addEntryFormReset();
};

const onEntrySlideRight = ({ reset }: any, entry: IEntry) => {
  $q.dialog({
    title: "Delete Entry",
    message: `
      Delete this entry?
      <div class="text-weight-bold text-center q-mt-md ${useAmountColorClass(
        entry?.amount
      )}">
        ${entry?.name} : ${useCurrencify(Number(entry?.amount))}
      </div>
    `,
    persistent: false,
    html: true,
    ok: {
      label: "Delete",
      color: "negative",
      noCaps: true,
    },
    cancel: {
      color: "positive",
      noCaps: true,
    },
  })
    .onOk(() => {
      storeEntries.deleteEntry(entry.id);
    })
    .onCancel(() => {
      reset();
    });

};

onMounted(async () => {
  await loadEntries();
});
</script>
