<template>
    <div class="container" v-if="!abc">
        <h1>Add Task</h1>
        <form class="form" @submit.prevent="addTask">
            <div class="form-group">
                <label for="taskName">Task Name:</label>
                <input type="text" v-model="taskName" id="taskName" placeholder="Enter task name" class="input" />
            </div>
            <div class="form-group">
                <label for="taskDescription">Task Description:</label>
                <input v-model="taskDescription" id="taskDescription" placeholder="Enter task details" class="input">
            </div>
            <div class="form-group">
                <label for="taskStatus">Task Status:</label>
                <select v-model="taskStatus" id="taskStatus">
                    <option value="pending">Pending</option>
                    <option value="inprogress">Inprogress</option>
                    <option value="completed">Completed</option>
                </select>
            </div>
            <button class="btn">Add Task</button>
        </form>
    </div>
    <div class="container" v-else>
        <h1>Edit Data</h1>
        <form class="form" @submit.prevent="updateTask">
            <div class="form-group">
                <label for="taskName">Task Name:</label>
                <input type="text" v-model="taskName" id="taskName" placeholder="Enter task name" class="input" />
            </div>
            <div class="form-group">
                <label for="taskDescription">Task Description:</label>
                <input v-model="taskDescription" id="taskDescription" placeholder="Enter task details" class="input">
            </div>
            <div class="form-group">
                <label for="taskStatus">Task Status:</label>
                <select v-model="taskStatus" id="taskStatus">
                    <option value="pending">Pending</option>
                    <option value="inprogress">Inprogress</option>
                    <option value="completed">Completed</option>
                </select>
            </div>
            <button class="btn">Save Changes</button>
        </form>
    </div>
</template>
<script setup>
import router from '@/router';
import { useTaskStore } from '@/stores/taskStore';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import {useToast} from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

const toast = useToast()
const taskStore = useTaskStore()
const taskName = ref()
const taskDescription = ref()
const taskStatus = ref('pending')
const taskId = ref()
const userId = ref()

const addTask = async () => {
    if (!taskName.value || !taskDescription.value || !taskStatus.value) {
        toast.warning("Enter details");
    } else {
        const userId = localStorage.getItem('currentUser')
        const obj = {
            "taskName": taskName.value,
            "taskDescription": taskDescription.value,
            "taskStatus": taskStatus.value,
            "userId": userId
        }
        await axios.post('http://localhost:5500/usersData', obj)
            .then(() => {
                getTask();
                toast.success(`New Task "${taskName.value}" added Successfully`)
                taskName.value = '';
                taskDescription.value = '';
                taskStatus.value = 'pending';
            })
            .catch((error) => {
                toast.error(`Error: ${error}`);
            })
    }
}
const data = ref()
const getTask = async () => {
    const userId = localStorage.getItem('currentUser'); // Assuming user ID is stored in localStorage
    try {
        const response = await axios.get(`http://localhost:5500/usersData?userId=${userId}`);
        data.value = response.data;
    } catch (error) {
        toast.error(`Error: ${error}`);
    }
};
const abc = ref()
onMounted(async () => {
    await getTask(),
        abc.value = taskStore?.getCurrentTask()
    if (abc.value) {
        taskName.value = abc.value.taskName
        taskDescription.value = abc.value.taskDescription
        taskStatus.value = abc.value.taskStatus
        taskId.value = abc.value._id
        userId.value = abc.value.userId
    }
})

const updateTask = async () => {
    if (!taskName.value || !taskDescription.value || !taskStatus.value) {
        toast.warning("Enter details");
        return;
    }
    if (!userId.value || !taskId.value) {
        toast.warning("User ID or Task ID missing");
        return;
    }
    const taskUpdateObj = {
        taskName: taskName.value,
        taskDescription: taskDescription.value,
        taskStatus: taskStatus.value,
        userId: userId.value,
        _id: taskId.value
    };
    const url = `http://localhost:5500/usersData?_id=${taskId.value}`;

    try {
        const response = await axios.put(url, taskUpdateObj);
        abc.value = '';
        toast.success(`Task updated successfully`);
        console.log(response.data);
        getTask();
        taskName.value = '';
        taskDescription.value = '';
        taskStatus.value = 'pending';
    } catch (error) {
        toast.error(`Failed to update task: ${error}`);
    }
};

router.beforeEach((to,from) => {
    if(from.name == 'todolist' && to.name != 'todolist'){
        taskStore.emptyTask()
    }
})
</script>

<style scoped>
.container {
    width: 100%;
    max-width: 450px;
    margin: 8% auto;
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

input,
textarea,
select {
    width: 100%;
    padding: 12px 10PX;
    border-radius: 8px;
    border: 1px solid #444;
    background-color: #3a3a3a;
    color: #f5f5f5;
    transition: border-color 0.3s, box-shadow 0.3s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input:focus,
textarea:focus,
select:focus {
    border-color: #3498db;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

button.btn {
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

button.btn:hover {
    background-color: #2980b9;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

select option {
    text-align: center;
    font-size: 1rem;
}
</style>