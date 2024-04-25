<template>
  <div class="container">
    <h1>Using MongoDB Realm</h1>
    <div class="right-nav">
      <li><router-link :to="{ name: 'home' }">Home</router-link></li>
      <li><router-link :to="{ name: 'todolist' }">To-do List</router-link></li>
      <li><router-link :to="{ name: 'viewtask' }">View Tasks</router-link></li>
      <li>
        <router-link :to="{ name: 'login' }" @click="logoutUser">LogOut</router-link>
      </li>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";

const toast = useToast();
const isLoggedIn = ref();
onMounted(() => {
  isLoggedIn.value = JSON.parse(localStorage.getItem("isLoggedIn"));
});

const logoutUser = () => {
  localStorage.setItem("isLoggedIn", false);
  localStorage.setItem("currentUser", "");
  localStorage.setItem("fbProfile", "");
  localStorage.removeItem("gtoken");
  localStorage.removeItem("ftoken");
  toast.success("User LoggedOut Successfully");

};
</script>

<style scoped>
.container {
  background-color: #3a3a3a;
  display: flex;
  align-items: center;
  padding: 0px 20px;
  justify-content: space-between;
}

.right-nav {
  display: flex;
}

.right-nav li {
  margin: 0px 15px;
  list-style-type: none;
}
</style>