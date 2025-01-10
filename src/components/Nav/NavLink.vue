<template>
  <q-item
    clickable
    tag="a"
    class="text-white"
    :to="props.link"
    >
    <q-item-section v-if="props.icon" avatar>
      <q-icon :name="props.icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ props.title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { useAuthStore } from 'src/stores/authStore';

export interface NavLinkProps{
  title:string,
  icon :string,
  link:string,
  role?: string,
}

defineOptions({
  name: 'NavLinks'
})

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: ''
  },
  link: {
    type: String,
    default: ""
  }
})
</script>
