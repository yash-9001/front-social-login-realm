import { createRouter, createWebHistory } from 'vue-router'
import userRegistration from '@/components/userRegistration.vue'
import userLogin from '@/components/userLogin.vue'
import homeComponent from '@/components/homeComponent.vue'
import TodoList from '@/components/todoList.vue'
import ViewTask from '@/components/viewTask.vue'
import { ref } from 'vue'
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

const toast = useToast()

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: userLogin
    }, {
      path: '/register',
      name: 'register',
      component: userRegistration
    },
    {
      path: '/home',
      name: 'home',
      component: homeComponent
    },
    {
      path: '/todolist',
      name: 'todolist',
      component: TodoList
    },
    {
      path: '/viewtask',
      name: 'viewtask',
      component: ViewTask
    }
  ]
})
export default router;

// const taskStore = useTaskStore();
const loggedIn = ref()
router.beforeEach((to) => {
  if (to.redirectedFrom) {
    loggedIn.value = to.redirectedFrom;
    if (loggedIn.value && !JSON.parse(localStorage.getItem('isLoggedIn'))) {
      // localStorage.setItem('token', loggedIn.value.query.token)
      
      if(loggedIn.value.query){
        if(loggedIn.value.query.gtoken){
      localStorage.setItem('isLoggedIn', true)
      localStorage.setItem('isRegistered', true)
      
      localStorage.setItem('gtoken', loggedIn.value.query.gtoken)
    }
    
    if(loggedIn.value.query.ftoken){
          localStorage.setItem('isRegistered', true)
      localStorage.setItem('isLoggedIn', true)

          localStorage.setItem('ftoken', loggedIn.value.query.ftoken)
        }
      }
      // console.log("-------------->.. loggedIn.value", loggedIn.value);
      // console.log("to", to);
      // console.log("--------------------------------->>>>>>>>>>.....loggedIn.value", loggedIn.value.query?.pictureUrl + "&access_token=" + loggedIn.value.query?.access_token[0]);
      // const userObj = {};
      // userObj.userId = loggedIn.value.query.userId;
      // userObj.name = loggedIn.value.query.name;
      // userObj.email = loggedIn.value.query.email;
      if(loggedIn.value.query.pictureUrl){
        // userObj.pictureUrl = loggedIn.value?.query?.pictureUrl + "&access_token=" + loggedIn.value?.query?.access_token[0];
        // localStorage.setItem('fbProfile', JSON.stringify(userObj))
      }else{
        // localStorage.setItem('fbProfile', JSON.stringify(userObj))
      }
      // console.log("userObj", userObj);
    }
  }
  // let currentUser = localStorage.getItem('token');
  // if (!currentUser || currentUser == 'undefined') {
  //   localStorage.setItem('isLoggedIn', false)
  // }

  let isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn'))
  let isRegistered = JSON.parse(localStorage.getItem('isRegistered'))

  if (!isLoggedIn && isRegistered) {
    if (to.name != 'login') {
      return { name: 'login' }
    }
  }

  if (!isLoggedIn && !isRegistered) {
    if (to.name != 'register') {
      return { name: 'register' }
    }
  }

  if (isLoggedIn && isRegistered) {
    if (to.name == 'login' || to.name == 'register') {
      toast.success("User Logged In Successfully")
      return{ name: 'home' }
    }
  }
})