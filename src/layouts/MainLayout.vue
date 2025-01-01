<template>
  <q-layout view="hHh lpr lFf">
    <q-header
      elevated
      bordered
      >
      <q-toolbar>
        <q-btn
          flat
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"

          />

        <div class="absolute-center">
          <q-toolbar-title>
            <q-icon name="savings"></q-icon>
            Moneyballs
          </q-toolbar-title>
        </div>
      </q-toolbar>

    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="200"
      :breakpoint="767"
      class="bg-primary text-white"
      >
      <q-list>
        <q-item-label
          header
          class="text-white">
          Navigation
        </q-item-label>

        <NavLink v-for="link in navLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import NavLink, { NavLinkProps } from 'src/components/Nav/NavLink.vue';

const navLinks: NavLinkProps[] = [
  {
    title: 'Entries',
    link: '/',
    icon: 'savings',
  },
  {
    title: 'Settings',
    link: '/settings',
    icon: 'settings',
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
