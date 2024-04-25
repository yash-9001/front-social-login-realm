<template>
  <h1>Manage Task</h1>
  <table>
    <thead v-if="dataa != ''">
      <tr>
        <th>Name</th>
        <th>Description</th>
        <th>Status</th>
        <th colspan="2">Actions</th>
      </tr>
    </thead>
    <thead v-else>
      <p id="nowarn">No Data Found</p>
    </thead>
    <tbody>
      <tr v-for="task in dataa" :key="task">
        <td>{{ task.taskName }}</td>
        <td>{{ task.taskDescription }}</td>
        <td>{{ task.taskStatus }}</td>
        <td>
          <p @click="editTask(task.taskName, task.taskDescription, task.taskStatus, task._id, task.userId)" id="edit">
            Edit
          </p>
        </td>
        <td>
          <p @click="deleteTask(task._id)" id="delete">Delete</p>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script setup>
import router from '@/router';
import { useTaskStore } from '@/stores/taskStore';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

const toast = useToast()
const taskStore = useTaskStore()
const dataa = ref()

onMounted(async () => {
  dataa.value = await taskStore.getTasks()
})

const editTask = (taskName, taskDescription, taskStatus, taskId, userId) => {
  taskStore.currentTask(taskName, taskDescription, taskStatus, taskId, userId)
  toast.info(`Editing task -> "${taskName}"`)
  router.push({ name: 'todolist' })
}

const deleteTask = async (taskId) => {
  try {
    const res = await axios.delete(`http://localhost:5500/usersData?_id=${taskId}`);
    toast.success(`Deleted Successfully: ${res.status}`);
    dataa.value = await taskStore.getTasks();
  } catch (error) {
    toast.error(`Failed to delete task with ID ${taskId}: ${error.message}`);
  }
};
</script>

<style scoped>
h1{
  margin-bottom: 20px;
    font-size: 28px;
    color: #f5f5f5;
    text-align: center;
    text-shadow: 2px 5px 4px rgba(0, 0, 0, 1);
    padding: 10px; /* Optional: Add some padding for space around the text */
    border-radius: 8px;
}
table {
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
    border-collapse: collapse;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    /* background-color: rgba(100, 100, 100, 0.1); */
    color: #f5f5f5;
}

thead {
    background-color: #3a3a3a;
    color: #f5f5f5;
}

th, td {
    padding: 10px;
    text-align: center;
    border-bottom: 1px solid #444;
}

table:hover th{
  background-color: hsla(160, 100%, 37%, 0.3);
}

th {
    font-weight: bold;
    font-size: 16px;
}

td {
    font-size: 14px;
}

tr:hover {
    background-color: hsla(160, 100%, 37%, 0.3);
}

p {
    cursor: pointer;
    color: #3498db;
    font-weight: bold;
}

p:hover {
    color: #2980b9;
}

#edit:hover,
#delete:hover {
    text-decoration: underline;
}

#nowarn{
  text-align: center;
}

#edit {
  cursor: pointer;
  color: hsla(160, 100%, 37%, 1);
}

#delete {
  cursor: pointer;
  color: red;
}

</style>