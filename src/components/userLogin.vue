<template>
    <meta name="google-signin-client_id"
        content="818610849122-kflueb7usdpa3uest8tvibf8kmkedcid.apps.googleusercontent.com">
    <div class="container">
        <h1>Login</h1>
        <form class="form" @submit.prevent="loginUser">
            <div class="form-group">
                <label for="email">Email: <span>*</span></label>
                <input type="email" v-model="loginEmail" id="email" placeholder="Enter your Email" />
                <p id="warnEmail" v-if="warnmail">Please Enter your Email.</p>
            </div>
            <div class="form-group">
                <label for="password" @click="abc">Password: <span>*</span></label>
                <input type="password" v-model="loginPassword" id="password" placeholder="Enter your Password" />
                <p id="warnPassword" v-if="warnpass">Please Enter your Password.</p>
            </div>
            <button class="btn">Login</button>
            <h5 @click="registerUser">Create an Account</h5>
            <!-- <a href="http://localhost:5500">Login With Google</a> -->

            <label id="socialLabel">Login with : </label>
            <div id="socialBtn">
                <button @click="loginWithGoogle" class="btn" id="google">Google</button>
                <button @click="loginWithFacebook" class="btn" id="facebook">Facebook</button>
            </div>
            <button @click="twitterLogin" class="btn" id="google">Login With Twitter</button>
            <!--     <a href="http://localhost:5501/auth/facebook">Login With Facebook</a> -->
        </form>
    </div>
    <!-- <GoogleLogin :callback="callback"/> -->
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
const loginEmail = ref('');
const loginPassword = ref('');
import * as Realm from 'realm-web';
import app from '@/realm/realm-app';
import router from '@/router/index';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

const toast = useToast()
const warnmail = ref(false)
const warnpass = ref(false)


import { googleOneTap } from "vue3-google-login"
import axios from 'axios';

// const realmApp = new Realm.App({
//   id: 'users-ekiix',
// });

// const googleLogin = async () => {
//     const credentials = Realm.Credentials.google();
//     console.log(credentials);
//     const user = await realmApp.logIn(credentials);
//     console.log(user);
// }



onMounted(() => {
  googleOneTap()
    .then((response) => {
      // This promise is resolved when user selects an account from the the One Tap prompt
      console.log("Handle the response", response)
    })
    .catch((error) => {
      console.log("Handle the error", error)
    })
})


watch(loginEmail, () => {
    if (loginEmail.value) {
        warnmail.value = false
    }
})

watch(loginPassword, () => {
    if (loginPassword.value) {
        warnpass.value = false
    }
})

const loginUser = async () => {
    if (!loginEmail.value || !loginPassword.value) {
        if (!loginEmail.value) {
            warnmail.value = true
        }
        if (!loginPassword.value) {
            warnpass.value = true
        }
    } else {
        app.logIn(Realm.Credentials.emailPassword(loginEmail.value, loginPassword.value))
            .then((res) => {
                localStorage.setItem("isLoggedIn", 'true')
                localStorage.setItem("currentUser", res.id)
                toast.success("User LoggedIn Successfully")
                router.push({ name: 'home' })
            })
            .catch(() => {
                toast.error('Invalid emailId/password')
            })
    }
    console.log('Login details:', {
        email: loginEmail.value,
        password: loginPassword.value,
    });
};
const registerUser = () => {
    localStorage.setItem('isRegistered', false)
    router.push({ name: 'register' })
}

const loginWithGoogle = () => {
    const width = 600;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    const facebookLoginWindow = window.open('http://localhost:5500/auth/google', 'Google Login', `width=${width},height=${height},left=${left},top=${top}`);
    window.addEventListener('storage', () => {
        if (JSON.parse(localStorage.getItem('isLoggedIn'))) {
            facebookLoginWindow.close();
                router.push({ name: 'home' });
        } else {
            toast.info('login')
        }
    })

};

const twitterLogin = async () => {
    const apiKey = 'EqJlnlQkKOXG6qVA6ICVBfgWe';
const apiSecretKey = 'BpoiBHQYzAprR1fLWKm6zDpYfkB1xQMdXD4MpWpdO645UBlqfs';
      const tokenUrl = 'https://api.twitter.com/oauth2/token';
      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');
      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(apiKey + ':' + apiSecretKey)
        }
      };
      const response = await axios.post(tokenUrl, params, config);
      const bearerToken = response.data.access_token;

      // Redirect user to Twitter authorization URL
      const twitterAuthUrl = 'https://api.twitter.com/oauth/authenticate?oauth_token=' + bearerToken;
      window.location.href = twitterAuthUrl;

};

const loginWithFacebook = () => {
    // Calculate the position to center the window
    const width = 600;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const facebookLoginWindow = window.open('http://localhost:5500/auth/facebook', 'Facebook Login', `width=${width},height=${height},left=${left},top=${top}`);
    window.addEventListener('storage', () => {
        if (JSON.parse(localStorage.getItem('isLoggedIn'))) {
            facebookLoginWindow.close();
            router.push({ name: 'home' });
        } else {
            toast.info('login')
        }
    })
};




// const callback = (response) => {
//   // This callback will be triggered when the user selects or login to
//   // his Google account from the popup
//   console.log("Handle the response", response)
// }
</script>

<style scoped>
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

#socialLabel {
    text-align: left;
    padding: 0px 2px;
}

#socialBtn {
    display: flex;
    justify-content: space-between;
}

#google {
    margin-right: 5px;
}

#facebook {
    margin-left: 5px;
}

h5 {
    cursor: pointer;
    margin: 10px 0 0 0;
}

h1 {
    margin-bottom: 20px;
    font-size: 28px;
    color: #f5f5f5;
}

.form {
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

input:focus {
    border-color: #3498db;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.btn {
    /* margin-top: 10px; */
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

#warnEmail {
    color: yellow;
    margin: 5px 0;
}

#warnPassword {
    color: yellow;
    margin: 5px 0;
}
</style>