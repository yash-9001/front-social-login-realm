<template>
  <div class="container">
    <h1>Register User</h1>
    <form class="formm" @submit.prevent="registerUser">
      <div class="form-group">
        <label for="email">Email: <span>*</span></label>
        <input type="email" v-model="regEmail" id="email" placeholder="Enter your Email" class="input"/>
        <p class="warn" v-if="warnEmail">Please enter your Email</p>
      </div>
      <div class="form-group">
        <label for="password">Password: <span>*</span></label>
        <input type="password" v-model="regPassword" id="password" placeholder="Enter your Password" class="input"/>
        <p class="warn" v-if="warnPassword">Please enter your Password</p>
      </div>
      <button type="submit" class="btn">Register</button>
      <h5 @click="loginUser">Login to Your Account</h5>
    </form>
  </div>
</template>

<script setup>
import app from '@/realm/realm-app';
import router from '@/router';
import { ref, watch } from 'vue';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

const regEmail = ref('');
const regPassword = ref('');
const toast = useToast()
const warnEmail = ref(false)
const warnPassword = ref(false)

watch(regEmail, () => {
  if(regEmail.value){
    warnEmail.value = false
  }
})

watch(regPassword, () => {
  if(regPassword.value){
    warnPassword.value = false
  }
})


const registerUser = async () => {
  try{
    if(regEmail.value == '' || regPassword.value == ''){
      if(!regEmail.value){
        warnEmail.value = true
      }
      if(!regPassword.value){
        warnPassword.value = true
      }

      toast.warn("Enter All Details")
    }else{
      const emailPasswordProvider = app.emailPasswordAuth;
      console.log("emailPasswordProvider", emailPasswordProvider);
      app.emailPasswordAuth.registerUser({
        "email": regEmail.value,
        "password": regPassword.value
      })
      .then(() => {
        localStorage.setItem('IsRegistered', true)
        toast.success("User Registered Successfully")
      })
    }
  }
  catch(error){
    console.log("error catched", error);
  }
  regEmail.value = '';
  regPassword.value = '';
};

const loginUser = () => {
        localStorage.setItem('isRegistered', true)
        router.push({name: 'login'})
    }
</script>

<style scoped>
.warn{
  margin: 10px 0;
  color: yellow;
}
.container {
  width: 100%;
  max-width: 450px;
  margin: 10% auto;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  background-color: #2a2a2a;
  text-align: center;
  color: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
}

h5{
    cursor: pointer;
    margin: 10px 0 0px;
}

h1 {
  margin-bottom: 20px;
  font-size: 28px;
  color: #f5f5f5;
}

.formm {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

label {
  font-size: 14px;
  font-weight: 500;
  color: #9b9b9b;
  margin-bottom: 6px;
}

input {
  width: 100%;
  padding: 12px 10px;
  border-radius: 8px;
  border: 1px solid #444;
  background-color: #3a3a3a;
  color: #f5f5f5;
  transition: border-color 0.3s, box-shadow 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.input{
  width: 100%;
}

input:focus {
  border-color: #3498db;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background-color: #3498db;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.btn:hover {
  background-color: #2980b9;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

label span {
    color: red;
}
</style>