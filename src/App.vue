<script setup>
import { ref } from 'vue';
import HeaderComponent from './components/headerComponent.vue';
import router from './router/index';

const hideNavbar = ref(false);

router.beforeEach(() => {
  const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn'))
  const isRegistered = JSON.parse(localStorage.getItem('isRegistered'))


  if(isLoggedIn && isRegistered){
    hideNavbar.value = true
  }else{
    hideNavbar.value = false
  }
})
</script>
<template>
  <div class="main" v-if="hideNavbar">
    <HeaderComponent/>
  </div>
  <RouterView />
</template>

