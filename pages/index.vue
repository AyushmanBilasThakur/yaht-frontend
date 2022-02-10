<template>
<div>
    <div class="p-3 flex justify-between items-center max-w-[700px] mx-auto">
        <Html>
            <Head>
                <Title>YAHT | Dashboard | {{ name }}</Title>
            </Head>
        </Html>

        <h1 class=" text-2xl">Welcome, {{name}}</h1>

        <button class=" text-slate-500 active:text-slate-800 hover:text-slate-800" @click="settingsModalActivated = true">
            <svgIcon type="mdi" :path="mdiCog" />
        </button>

    </div>

    <div class=" mx-auto my-2 w-[300px] bg-transparent flex justify-center items-center">
        <p class="mr-2"><strong>Stats:</strong></p>
        xp - {{xp}}, level - {{level}}
    </div>

    <div class=" text-center font-bold text-2xl mb-4">
        {{todayFormatted}}
    </div>

    <h3 v-if="habits && habits.length == 0" class="text-center my-4">No habits added <button @click="addModalActivated = true" class=" bg-green-300 hover:bg-green-100 px-3 py-1 rounded-md"> Add One?</button></h3>

        
    <div v-if="habits && habits.length != 0">

        <div v-for="habit in habits" key="habit._id" class="flex justify-between items-center mx-auto p-4 my-2 max-w-[600px] cursor-pointer md:rounded-lg"
        :class="habit.isPositive? `bg-green-300 hover:bg-green-100` : `bg-red-700 hover:bg-red-900 text-white`"
        
        >
            <input type="checkbox" v-model="habit.isDoneToday" @change="() => updateStreak(habit._id, habit.streak + 1)" class="w-[20px] h-[20px]" :disabled="habit.isDoneToday"/>

            <div class="flex-1 ml-3" @click="() => focusOnAHabit(habit._id)">
                <p class="text-xl">{{habit.name}}</p>
                <p>{{habit.isPositive ? "Streak 🔥" : "Negetive Streak 👎"}} {{habit.streak}} day(s)</p>
            </div>
        </div>

    </div>

    <button class="fixed bottom-4 right-4 text-6xl bg-green-300 hover:bg-green-800 hover:text-white p-4 rounded-[100px]" @click="addModalActivated = true">
        <svgIcon type="mdi" :path="mdiPlus" />
    </button>


    <div class="modalContainer" v-if="detailsModalActivated">
        <div class="bg-white rounded-md w-[300px] p-4 relative">
            <h3 class="text-xl mb-2 font-bold">{{focusedHabit.name}}</h3>
            

            <div>
                <!-- <p><strong>Type:</strong> {{focusedHabit.isPositive? "positive" : "negetive"}}</p> -->

                <p><strong>Current Streak:</strong> {{focusedHabit.streak}} day(s)</p>


                <h3 class="mb-2"><strong>This week:</strong></h3>
                <!-- <div v-for="update,index in focusedHabit.updates" :key="index">

                    {{new Date(update).getDate()}}/{{(new Date(update).getMonth() + 1)}}/{{new Date(update).getFullYear()}}
                </div> -->


                <div class="grid grid-cols-7 gap-2">
                    <div v-for="day,i in days" :class="day.isToday ? `today` : ``" :key="i" class="flex flex-col justify-center items-center py-3 border-2 border-black">
                        <p>{{day.day[0]}}</p>
                        <h3 class="text-xl font-bold">{{day.date.getDate()}}</h3>

                        <p>{{habitDates.indexOf(day.date.toDateString()) != -1 ? "✅" : "&nbsp;"}}</p>
                    </div>
                </div>


                <button class="w-full bg-green-300 text-black rounded-lg mt-2 py-2 flex justify-center items-center" @click="editModalActivated = true; detailsModalActivated = false;"><svgIcon type="mdi" :path="mdiPencil"/>Edit Habit</button>

                <button class="w-full bg-red-600 text-white rounded-lg mt-2 py-2 flex justify-center items-center" @click="() => deleteHabit()"><svgIcon type="mdi" :path="mdiTrashCan"/>Delete Habit</button>

                

                <button @click="detailsModalActivated = false" class="text-red-500 w-full mt-2">close</button>
            </div>
        
        
        </div>


    </div>

    <div class="modalContainer" v-if="settingsModalActivated">
        <div class="bg-white rounded-md w-[300px] p-4 relative">
            <h3 class="text-xl mb-2 font-bold">Settings</h3>

            <form @submit.prevent="changeUsername" class="mb-4">
                <div class="mb-4">
                    <label 
                        for="username" 
                        class="block mb-1">
                        Change Name - {{usernameStatusCheck ? "✅" : "🚫"}}
                    </label>
                    <input 
                        type="text" 
                        class="input" 
                        placeholder="noobmaster69"
                        v-model="tempname"
                        required
                    />
                </div>
                <button @click.prevent="checkUsername" class="w-full text-center mb-2 p-2 border-2 border-green-800 rounded-md hover:font-bold">Check Username</button>
                <input type="submit" value="Change Username" class="w-full text-center bg-green-500 p-2 rounded-md cursor-pointer hover:bg-green-800 hover:text-white disabled:bg-gray-300 disabled:text-gray-800" :disabled="!usernameStatusCheck">
            </form>

            <hr class="mb-2">

            <h3 class="font-bold text-xl">Change Password</h3>

            <form @submit.prevent="updatePassword">
                <div class="mb-2">
                    <label 
                        for="password" 
                        class="mb-1 flex gap-1">
                        <p>Current Password</p> 
                        <svgIcon @click="currentPasswordVisible = !currentPasswordVisible" type="mdi" :path="currentPasswordVisible ? mdiEyeOff : mdiEye" class=" cursor-pointer"></svgIcon>  
                    </label>
                    <input 
                        :type="currentPasswordVisible ? `text` : `password`"
                        class="input" 
                        name="password"
                        placeholder="*************"
                        required
                        v-model="currentPassword"
                    />
                </div>

                <div class="mb-2">
                    <label 
                        for="passwordII" 
                        class="mb-1 flex gap-1">
                        <p>New Password</p> 
                        <svgIcon @click="newPasswordVisible = !newPasswordVisible" type="mdi" :path="newPasswordVisible ? mdiEyeOff : mdiEye" class=" cursor-pointer"></svgIcon>  
                    </label>
                    <input 
                        :type="newPasswordVisible ? `text` : `password`"
                        class="input" 
                        name="passwordII"
                        placeholder="*************"
                        required
                        v-model="newPassword"
                    />
                </div>

                <input type="submit" value="Change Password" class="w-full text-center bg-green-500 p-2 rounded-md cursor-pointer hover:bg-green-800 hover:text-white disabled:bg-gray-300 disabled:text-gray-800">
            </form>

            <button @click="settingsModalActivated = false" class="text-red-500 w-full mt-2">close</button>
        </div>
    </div>

    <div class="modalContainer" v-if="editModalActivated">
        <div class="bg-white rounded-md w-[300px] p-4 relative">
            <h3 class="text-xl mb-2 font-bold">Edit Habit</h3>

            <form @submit.prevent="editHabit">
                <div class="form-control mb-2">
                    <label for="name" class="font-bold">Habit Name</label>
                    <input class="w-full block bg-white mt-2 border-2 rounded-md border-black px-2 py-1" type="text" name="name" id="name" v-model="focusedHabit.name">
                </div>

                <input class="w-full block bg-green-300 mt-2 border-2 rounded-md border-black px-2 py-1 cursor-pointer" type="submit" value="Update Habit">

            </form>

            <button @click="editModalActivated = false" class="text-red-500 w-full mt-2">close</button>
        </div>
    </div>

    <div class="modalContainer" v-if="addModalActivated">
        <div class="bg-white rounded-md w-[300px] p-4 relative">
            <h3 class="text-2xl mb-2 ">Add new habit</h3>

            <button @click="addModalActivated = false" class="text-red-500 absolute top-4 right-5">X</button>

            <form @submit.prevent="() => {
                createNewHabit()
            }">

                <div class="form-control mb-2">
                    <label for="name" class="font-bold">Habit Name</label>
                    <input class="w-full block bg-white mt-2 border-2 rounded-md border-black px-2 py-1" type="text" name="name" id="name" v-model="habitName">
                </div>


                <p class="my-2">*Be sure before creating a habit. Because if you delete a tracked habit you automatically lose 500xp</p>


                <input class="bg-green-300 px-2 py-1 rounded-md w-full cursor-pointer hover:bg-green-100" type="submit" value="Add new Habit">
            </form>
        </div>
    </div>

    
    <div class="grid place-items-center mt-4 fixed left-0 right-0 bottom-4 text-lg">
        <button @click="logout" class="text-red-500 hover:text-red-800 font-bold">Log Out</button>
    </div>
</div>
</template>

<script lang="ts">
import { storeToRefs } from "pinia";
import axiosClient from "~~/axios/axiosClient"
import { useAuthStore } from "~~/store/authStore"
import { useUserStore } from "~~/store/userStore";
import svgIcon from "@jamescoyle/vue-icon";
import {mdiCog, mdiPlus, mdiTrashCan, mdiPencil, mdiEye, mdiEyeOff} from "@mdi/js";
import { months, weekdays } from "~~/constants";
import { messageType, useMessageStore } from "~~/store/messageStore";
import axios from "axios";

definePageMeta({
    layout: "main",
})

export default defineComponent({
    components: { svgIcon },
    setup(){
        const {changeAuthStatus, addAccessToken} = useAuthStore();
        const {addMessage} = useMessageStore();

        let {name, xp, level} = storeToRefs(useUserStore());
        let {setUserDetails} = useUserStore();

        let {accessToken} = storeToRefs(useAuthStore());

        const habits = ref<Array<any>>([]);
        let addModalActivated = ref<boolean>(false);
        let detailsModalActivated = ref<boolean>(false);
        let settingsModalActivated = ref<boolean>(false);
        let editModalActivated = ref<boolean>(false);


        let habitName = ref<string>();
        let habitIsPositive = ref<boolean>(true);
        
        let focusedHabit = ref<any>();

        const createNewHabit = async() => {

            try {
                const {data} = await axiosClient.post("/habits/create", {
                    name: habitName.value,
                    isPositive: true
                }, {
                    headers:{
                        "Authorization": `auth ${accessToken.value}`
                    }
                })

                data.data.isDoneToday = false;

                habits.value.push(data.data);

                addModalActivated.value = false;
                habitName.value = "";
                addMessage(data.message, messageType.success);
                
            } catch (error) {
                addMessage(error.toString(), messageType.error)
            }



        }

        const editHabit = async() => {
            try {
                const {data} = await axiosClient.post("/habits/update", {
                    id: focusedHabit.value._id,
                    name: focusedHabit.value.name
                }, {
                    headers: {
                        "Authorization": `Auth ${accessToken.value}`
                    }
                })

                addMessage(data.message, messageType.success);

                editModalActivated.value = false; 

            } catch (error) {
                if(axios.isAxiosError(error)){
                    addMessage(error.response.data.message, messageType.error)
                }
                else{
                    addMessage(error.toString(), messageType.error)
                }
            }
        }

        const deleteHabit = async() => {

            if(!confirm("You want to delete this habit? You will lose 500 xp for that")){
                return;
            }

            try {
                const {data} = await axiosClient.post("/habits/delete", {
                    id: focusedHabit.value._id
                }, {
                    headers: {
                        "Authorization": `Auth ${accessToken.value}`
                    }
                })

                habits.value = habits.value.filter(habit => habit._id !== focusedHabit.value._id);

                addMessage(data.message, messageType.success);
                setUserDetails(data.user);
                detailsModalActivated.value = false;
                
            } catch (error) {
                if(axios.isAxiosError(error)){
                    addMessage(error.response.data.message, messageType.error)
                }
                else{
                    addMessage(error.toString(), messageType.error)
                }
            }
        }

        const getHabits = async() => {
            if(accessToken.value != ""){
                try {
                const {data} = await axiosClient.get("/habits/all", {
                    headers: {
                        "Authorization": `Auth ${accessToken.value}`
                    }
                });
                
                habits.value = data.data.map(habit => {
                    
                    // console.log(new Date().getTime() - new Date(habit.lastStreakUpdate).getTime());
                
                    habit.isDoneToday = new Date().getTime() - new Date(habit.lastStreakUpdate).getTime() <= 86400000

                    habit.streak = new Date().getTime() - new Date(habit.lastStreakUpdate).getTime() <= 86400000 ? habit.streak : 0;

                    return habit
                })
                } catch (error) {
                    if(axios.isAxiosError(error)){
                        addMessage(error.response.data.message, messageType.error);
                        return;
                    }
                    addMessage(error.toString(), messageType.error);
                }
            }
        }

        const usernameStatusCheck = ref(false);
        const tempname = ref(name.value);
        const checkUsername = async() => {
            if(name.value == ""){
                addMessage("Enter a proper non empty username", messageType.warning)
            }
            try {
                const { data } = await axiosClient.post(`/user/checkname`, {
                    name: tempname.value,
                });

                usernameStatusCheck.value = !data.data;
                addMessage(data.message, messageType.success)
                name.value = tempname.value
            } catch (error) {
                if(axios.isAxiosError(error)){
                    addMessage(error.response.data.message, messageType.error);
                }
                else{
                    console.log(error);
                    addMessage("Something went wrong", messageType.error);
                }
            }
        }   

        const changeUsername = async() => {
            try {
                const {data} = await axiosClient.post("/user/update", {
                    name: name.value
                }, {
                    headers: {
                        "Authorization": `Auth ${accessToken.value}`
                    }
                })

                addMessage(data.message, messageType.success);
            } catch (error) {
                if(axios.isAxiosError(error)){
                    addMessage(error.response.data.message, messageType.error);
                }
                else{
                    console.log(error);
                    addMessage("Something went wrong", messageType.error);
                }
            }
        }
        

        const currentPassword = ref("");
        const currentPasswordVisible = ref(false);

        const newPassword = ref("")
        const newPasswordVisible = ref(false);

        const updatePassword = async() => {
            try {
                const {data} = await axiosClient.post("/user/update-password", {
                    oldPassword: currentPassword.value,
                    newPassword: newPassword.value
                }, {
                    headers: {
                        "Authorization": `Auth ${accessToken.value}`
                    }
                })

                addMessage(data.message, messageType.success);
                currentPassword.value = "";
                newPassword.value = "";
                
            } catch (error) {
                if(axios.isAxiosError(error)){
                    addMessage(error.response.data.message, messageType.error);
                }
                else{
                    console.log(error);
                    addMessage("Something went wrong", messageType.error);
                }
            }
        }

        onMounted(getHabits);

        watch(accessToken, getHabits)

        const updateStreak = async(habitId: string, streak: number) => {
            
            if(!confirm("Are you sure you have done this task todayx?")){
                habits.value = habits.value.map(habit => {
                    if(habit._id == habitId){
                        habit.isDoneToday = false;
                        return habit;
                    }
                    return habit
                })
                return
            }
            try {
                const {data} = await axiosClient.post("/habits/update-streak",{
                    id: habitId,
                }, {headers: {
                    "Authorization": `Auth ${accessToken.value}`
                }});

                data.data.isDoneToday = true;
                setUserDetails(data.user);
                habits.value = habits.value.map(habit => {
                    if(habit._id == data.data._id) return data.data
                    else return habit
                })
                
            } catch (error) {
                addMessage(error.toString(), messageType.error);
            }
        }

        const logout = async() => {
            try {
                const {data} = await axiosClient.get("/user/logout");
                console.log(data);
                changeAuthStatus(false);
                addAccessToken("");
                
                useRouter().push("/login");
                
                
            } catch (error) {
                console.log(error);
            }
        }

        const focusOnAHabit = (id: string) => {
            focusedHabit.value = habits.value.filter(habit => habit._id == id)[0];

            detailsModalActivated.value = true;
        }

        const today = new Date();
        const todayFormatted = today.getDate() + "th " + months[today.getMonth()] + ", " + today.getFullYear();


        const todayDay = today.getDay();

        
        let days = new Array<any>(7)

        for(let i = 1; i <= todayDay; i++){

            let dayInConsideration  = new Date()
            dayInConsideration.setDate(today.getDate() - i);

            days[todayDay - i] = {
                day: weekdays[todayDay - i],
                date: dayInConsideration,
                isToday: false
            }
        }

        days[todayDay] = {
            day: weekdays[todayDay],
            date: new Date(),
            isToday: true
        }

        for(let i = todayDay + 1; i <= 6; i++){

            let dayInConsideration  = new Date()
            dayInConsideration.setDate(today.getDate() - todayDay + i);

            days[i] = {
                day: weekdays[i],
                date: dayInConsideration,
                isToday: false
            }
        }

        const habitDates = ref<any>();

        watch(focusedHabit, () => {

            habitDates.value = focusedHabit.value.updates.map(d => new Date(d).toDateString())
        })


        return {
            name,
            xp,
            level,
            logout,
            mdiCog,
            mdiPlus,
            mdiTrashCan,
            mdiPencil,
            mdiEye,
            mdiEyeOff,
            todayFormatted,
            habits,
            updateStreak,
            addModalActivated,
            habitName,
            habitIsPositive,
            createNewHabit,
            detailsModalActivated,
            focusedHabit,
            focusOnAHabit,
            deleteHabit,
            days,
            habitDates,
            settingsModalActivated,
            editModalActivated,
            editHabit,
            usernameStatusCheck,
            checkUsername,
            changeUsername,
            tempname,
            currentPassword,
            currentPasswordVisible,
            newPassword,
            newPasswordVisible,
            updatePassword
        }
    }

})
</script>

<style scoped>

    .modalContainer{
        position: absolute;
        top: 0;
        left: 0;
        min-height: 100vh;
        min-width: 100vw;
        display: grid;
        place-items: center;
        background-color: rgba(0,0,0,0.5);
    }

    .today{
        @apply bg-green-300;
    }
</style>