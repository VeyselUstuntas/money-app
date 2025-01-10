<template>
  <q-layout view="hHh lpr lFf">
    <q-header elevated bordered>
      <q-toolbar>
        <div class="row fit justify-between items-center">
          <q-btn flat round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

          <div class="absolute-center">
            <q-toolbar-title>
              <q-icon name="savings"></q-icon>
              Moneyballs
            </q-toolbar-title>
          </div>

          <div>
            <q-btn-dropdown color="warning" :label="fullName" menu-self="top end">
              <q-list>
                <q-item clickable v-close-popup @click="logout">
                  <q-item-section>
                    <q-item-label>Logout</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
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
        <q-item-label header class="text-white"> Navigation </q-item-label>

        <template v-for="link in navLinks" :key="link.title">
          <template v-if="authStore.loadRole() === 'USER'">
            <NavLink v-bind="link" v-if="'ADMIN' !== link.role" />
          </template>
          <NavLink v-bind="link" v-else />
        </template>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import NavLink, { NavLinkProps } from 'src/components/Nav/NavLink.vue';
import { useAuthStore } from 'src/stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();

const fullName = ref<string>('');

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
    role: 'ADMIN',
  },
  {
    title: 'Customer List',
    link: '/customers',
    icon: 'group',
  },
  {
    title: 'Customer Add',
    link: '/customer-add',
    icon: 'person_add',
    role: 'ADMIN',
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const logout = async () => {
  await authStore.logout();
};

onMounted(() => {
  const userFullname = authStore.getFullName();
  if (authStore.isAuthenticated && userFullname) {
    fullName.value = userFullname;
  }
});

// const username = authStore.userName;
</script>
