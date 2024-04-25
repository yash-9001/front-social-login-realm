import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useTaskStore = defineStore('tasks', () => {
  const fbUser = ref();

  const fbUserData = (user) => {
    fbUser.value = user
  }

  const getFbUser = () => {
    if(fbUser.value){
      return fbUser.value
    }
  }

  const tasks = ref()
  const getTasks = async () => {
    try {
      const userId = localStorage.getItem('currentUser');
      const response = await axios.get(`http://localhost:5500/usersData?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.log('Failed to fetch tasks:', error);
    }
  };

  const currentTask = (taskName,taskDescription,taskStatus,taskId, userId) => {
    tasks.value = {
      taskName: taskName,
      taskDescription: taskDescription,
      taskStatus: taskStatus,
      _id: taskId,
      userId: userId
    }
  }

  const emptyTask = () => {
    tasks.value = ''
    return tasks.value
  }

  const getCurrentTask = () => {
    return tasks?.value
  }

  return {
    getTasks,
    currentTask,
    emptyTask,
    getCurrentTask,
    getFbUser,
    fbUserData
  };
});