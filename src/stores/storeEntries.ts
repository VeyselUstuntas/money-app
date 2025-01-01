import { defineStore } from "pinia";
import { Notify } from "quasar";
import { db } from "src/firebase/firebase";
import { Entry } from "src/types/Entry";
import { computed, reactive, ref } from "vue";
import { addDoc, collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { AddEntry } from "src/types/AddEntry";


const entriesCollectionRefs = collection(db, "entries");

export const useStoreEntries = defineStore("entries", () => {


  const entries = ref<Entry[]>([])

  const entryLoaded = ref(false);

  const options = reactive({
    sort: false
  });

  const balance = computed(() => {
    return entries.value.reduce((acc: number, { amount }) => {
      return acc + amount!;
    }, 0);
  })

  // actions

  const loadEntries = async () => {
    entryLoaded.value = false;
    onSnapshot(entriesCollectionRefs, (querySnapshot) => {
      const entriesFB: any[] = [];
      querySnapshot.forEach((doc) => {
        let entry = doc.data();
        entry.id = doc.id;
        entriesFB.push(entry)
      });
      entryLoaded.value = true
      entries.value = entriesFB;
    });
  }

  const addEntry = async (addEntryForm: AddEntry) => {
    const newEntry = Object.assign({}, addEntryForm, { paid: false })
    if (newEntry.amount === null) newEntry.amount = 0
    await addDoc(entriesCollectionRefs, newEntry);
  }

  const deleteEntry = async (entryId: string) => {
    await deleteDoc(doc(entriesCollectionRefs, entryId));
    Notify.create({
      message: "Entry Deleted",
      position: "top",
      color: "negative"

    })
  };


  return {
    entries,
    options,
    entryLoaded,
    balance,

    // actions
    loadEntries,
    addEntry,
    deleteEntry
  }
});
