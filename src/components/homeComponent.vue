<template>
    <h1>Home</h1>
    <!-- <div id="profile" v-if="fbUser">
        <img :src="fbUser.pictureUrl" alt="">
        <p>{{ fbUser.name }}</p>
    </div> -->
    <!-- <div id="profile" v-if="fbUser"> -->
    <!-- <img :src="fbUser.pictureUrl" alt=""> -->
    <p>{{ currentUser }}</p>
    <!-- </div> -->
</template>

<style scoped>
h1 {
    text-align: center;
}

#profile {
    text-align: center;
}

#profile img {
    border-radius: 50%;
}
</style>

<script setup>
import { onMounted, ref } from 'vue';
import { App, Credentials } from "realm-web"

const currentUser = ref()
// const users = ref()

// Initialize your Realm app
const app = new App({ id: "users-ekiix" });



onMounted(() => checklogin());



let token;
var aaa = ref()
const checklogin = async () => {

    if (localStorage.getItem('gtoken')) {
        token = localStorage.getItem('gtoken');
        const credential = Credentials.google({
            idToken: token,
        });
        // console.log("-------------------------------------------------------->>>>.............",google.auth.getAccessToken())
        aaa.value = await app.logIn(credential)
        currentUser.value = app.currentUser;
        if (currentUser?.value) {
            // User is authenticated, you can access their information
            console.log("Current user:", currentUser.value);
        } else {
            // User is not authenticated
            console.log("No current user, please authenticate.");
        }

    }
    else if (localStorage.getItem('ftoken')) {
        token = localStorage.getItem('ftoken');

        const credentials = Credentials.facebook(token);
        console.log("----->>>>...accesstoken", token);
        aaa.value = await app.logIn(credentials)
        currentUser.value = app.currentUser;
        if (currentUser?.value) {
            // User is authenticated, you can access their information
            console.log("Current user:", currentUser.value);
        } else {
            // User is not authenticated
            console.log("No current user, please authenticate.");
        }

    }




}





// onMounted(async () => {
//     await abc()
// })

// const abc = () => {
//     currentUser.value = app.currentUser
// }


// let fbUser = ref()
// if (localStorage.getItem('fbProfile')) {
//     fbUser.value = JSON.parse(localStorage?.getItem('fbProfile'))
// }
// console.log(fbUser?.value);


</script>