<template>
  <div class="row fit items-center justify-center content">
    <q-card class="my-card">
      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input filled v-model="email" label="Email" class="w-25" />
          <q-input filled v-model="password" label="Password" type="password" />
          <div class="row justify-evenly">
            <q-btn label="Login" type="submit" color="primary" />
            <q-btn label="Register" type="submit" color="primary" :to="'/register'" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { Notify } from 'quasar';
import { LoginInput } from 'src/models/auth/login.auth.model';
import { useAuthStore } from 'src/stores/authStore';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();

const router = useRouter();

const email = ref<string>("");
const password = ref<string>("");

const onSubmit = async () => {
  if(email.value && password.value){
    await authStore.login(
    new LoginInput({ email: email.value, password: password.value }
    ))
    .then(() => {
      if(authStore.isAuthenticated){
        router.push({name:'Entries'})
      }
    })
  }
  else{
    Notify.create({message:"Email ve Password girin",color:'warning', position:'top'})
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
