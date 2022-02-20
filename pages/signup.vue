<template>

    <div class="px-5 py-4 rounded-lg shadow-md bg-white min-w-[200px]">
        
        <Html>
        <Head>
            <Title>Yet Another Habit Tracker | Sign up</Title>
        </Head>
        </Html>
        
        
        <h3 class="text-3xl mb-4">Sign Up</h3>

        <form class="w-[300px]" @submit.prevent="() => signUp()">

            <div class="mb-4">
                <label 
                    for="name" 
                    class="block mb-1">
                    Name {{usernameStatusCheck ? "✅" : "🚫"}}
                </label>
                
                <input 
                    type="text" 
                    class="input"
                    name="name" 
                    placeholder="noobmaster69"
                    required
                    v-model="name"
                />

                <button v-if="!usernameStatusCheck && !isCheckingUsernameStatus" @click.prevent="checkUsername"  class="mt-1 text-blue-500 w-full text-center">Check if username is available</button>

                <div class="mt-2" v-if="isCheckingUsernameStatus">
                    <ClipLoader color="#1F398A"/>
                </div>
            </div>

            <div class="mb-4">
                <label 
                    for="email" 
                    class="block mb-1">
                    Email
                </label>
                <input 
                    type="email" 
                    class="input"
                    name="email"
                    placeholder="abc@gmail.com"
                    required
                    v-model="email"
                />
            </div>

            <div class="mb-4">
                <label 
                    for="password" 
                    class="mb-1 flex gap-1">
                    <p>Password</p> 
                    <SvgIcon @click="passwordVisible = !passwordVisible" type="mdi" :path="passwordVisible ? mdiEyeOff : mdiEye" class=" cursor-pointer"></SvgIcon>  
                </label>
                <input 
                    :type="passwordVisible ? `text` : `password`"
                    class="input" 
                    name="password"
                    placeholder="A strong password"
                    required
                    v-model="password"
                />
            </div>

            <div class="mb-4">
                <label 
                    for="repeatPassword" 
                    class="mb-1 flex gap-1">
                    <p>Repeat Password</p>
                    <SvgIcon @click="repeatPasswordVisible = !repeatPasswordVisible" type="mdi" :path="repeatPasswordVisible ? mdiEyeOff : mdiEye" class=" cursor-pointer"></SvgIcon>   
                </label>
                <input 
                    :type="repeatPasswordVisible ? `text` : `password`" 
                    class="input" 
                    name="repeatPassword"
                    placeholder="Repeat the Strong Password"
                    required
                    v-model="repeatPassword"
                />
            </div>

            <div>
                <input 
                    type="submit" 
                    value="Sign Up"
                    class="block w-full rounded-md bg-blue-300 py-2 cursor-pointer hover:bg-blue-600 transition-all hover:text-white disabled:bg-gray-400 disabled:text-gray-900"
                    :disabled="!usernameStatusCheck"
                    v-if="!isSignUpFormSubmitting"
                />

                <ClipLoader color="#1F398A" v-else/>
            </div>

        </form>

        <p class="mt-2 text-center">Have an account? 
            <NuxtLink to="/login" class="link">Log in</NuxtLink>
        </p>

    </div>
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent } from 'vue';
import axiosClient from '~~/axios/axiosClient';
import { messageType, useMessageStore } from '~~/store/messageStore';
import SvgIcon from '@jamescoyle/vue-icon';
import {mdiEye, mdiEyeOff} from '@mdi/js';
import ClipLoader from "vue-spinner/src/ClipLoader.vue";

definePageMeta({
    layout: "registration",
})

export default defineComponent({
    components: {SvgIcon, ClipLoader},
    setup() {
        useMeta({
            title: "Sign Up | YAHT"
        })
        const {addMessage} = useMessageStore();

        let usernameStatusCheck = ref(false);
        let isCheckingUsernameStatus = ref(false);

        let email = ref("");
        let name = ref("");
        let password = ref("");
        let repeatPassword = ref("");
        const passwordVisible = ref(false);
        const repeatPasswordVisible = ref(false);

        const isSignUpFormSubmitting = ref(false);

        watch(name, () => {
            usernameStatusCheck.value = false;
        })

        const checkUsername = async() => {
            if(name.value == ""){
                addMessage("Enter a proper non empty username", messageType.warning)
            }
            try {
                isCheckingUsernameStatus.value = true;
                const { data } = await axiosClient.post(`/user/checkname`, {
                    name: name.value,
                });

                usernameStatusCheck.value = !data.data;
                addMessage(data.message, messageType.success)
            } catch (error) {
                if(axios.isAxiosError(error)){
                    addMessage(error.response.data.message, messageType.error);
                }
                else{
                    console.log(error);
                    addMessage("Something went wrong", messageType.error);
                }
            } finally{
                isCheckingUsernameStatus.value = false;
            }
        }   

        const signUp = async() => {
            if(password.value !== repeatPassword.value){
                return addMessage("Passwords do not match", messageType.error);
            }
            
            if(password.value.length < 6){
                return addMessage("Please choose a password with 6 characters", messageType.error);
            }

            try {
                isSignUpFormSubmitting.value = true;
                const { data } = await axiosClient.post(`/user/create`, {
                    name: name.value,
                    email: email.value,
                    password: password.value
                });

                let finalData: any = data;
            
                addMessage(finalData.message, messageType.success);
                name.value = ""
                email.value = ""
                password.value = ""
                repeatPassword.value = ""

                useRouter().push("/login");
                
            } catch (error) {
                if(axios.isAxiosError(error)){
                    addMessage(error.response.data.message, messageType.error);
                }
                else{
                    console.log(error);
                    addMessage("Something went wrong", messageType.error);
                }
            }
            finally{
                isSignUpFormSubmitting.value = false
            }
        }

        return {
            email,
            name,
            password,
            repeatPassword,
            usernameStatusCheck,
            checkUsername,
            signUp,
            passwordVisible,
            repeatPasswordVisible,
            mdiEye,
            mdiEyeOff,
            isCheckingUsernameStatus,
            isSignUpFormSubmitting
        } 
    },
})
</script>


