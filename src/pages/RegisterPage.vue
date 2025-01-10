<template>
  <div class="row fit items-center justify-center content">
    <q-card class="my-card">
      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input filled v-model="name" label="Name" class="w-25" />
          <q-input filled v-model="lastname" label="Lastname" class="w-25" />
          <q-input filled v-model="email" label="Email" class="w-25" />
          <q-input filled v-model="password" label="Password" type="password" />
          <div class="row justify-evenly">
            <q-btn label="Register" type="submit" @click="onSubmit" color="primary" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { Notify } from 'quasar';
import { RegisterInput, RegisterResult } from 'src/models/auth/register.auth.model';
import { useAuthStore } from 'src/stores/authStore';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const name = ref<string>('');
const lastname = ref<string>('');
const email = ref<string>('');
const password = ref<string>('');

const onSubmit = async () => {
    if(name.value && lastname.value && email.value && password.value){
      await authStore
    .register(
      new RegisterInput({
        email: email.value,
        lastname: lastname.value,
        name: name.value,
        password: password.value,
      })
    )
    .then(() => {
      if (authStore.isAuthenticated) {
        router.push({ name: 'Entries' });
      }
    });
    }
    else{
      Notify.create({message:"Bilgileri Eksiksiz Girin",color:'warning', position:'top'})
    }
};
</script>

<style scoped>
.content {
  height: 100vh !important;
}
.my-card {
  width: 400px;
  max-width: 90%;
}
</style>
