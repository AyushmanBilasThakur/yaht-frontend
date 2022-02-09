<template>

    <div class="px-5 py-4 rounded-lg shadow-md bg-white min-w-[200px]">
        
        <Html>
        <Head>
            <Title>YAHT | Forgot Password Reset</Title>
        </Head>
        </Html>
        
        <h3 class="text-3xl mb-4">Set new password</h3>

        <form class="w-[300px]" @submit.prevent="() => authenticate()">

            <div class="mb-4">
                <label 
                    for="password"
                    class="mb-1 flex gap-1">
                    Password
                    <SvgIcon @click="passwordVisible = !passwordVisible" type="mdi" :path="passwordVisible ? mdiEyeOff : mdiEye" class=" cursor-pointer"></SvgIcon>
                </label>
                <input 
                    :type="passwordVisible ? `text` : `password`" 
                    class="input" 
                    placeholder="*************"
                    v-model="password"
                    required
                />
            </div>

            <div class="mb-4">
                <label 
                    for="password"
                    class="mb-1 flex gap-1">
                    Repeat Password

                    <SvgIcon @click="repeatPasswordVisible = !repeatPasswordVisible" type="mdi" :path="repeatPasswordVisible ? mdiEyeOff : mdiEye" class=" cursor-pointer"></SvgIcon>
                </label>
                <input 
                    :type="repeatPasswordVisible ? `text` : `password`" 
                    class="input" 
                    placeholder="*************"
                    v-model="repeatPassword"
                    required
                />
            </div>

            <div>
                <input 
                    type="submit" 
                    value="Request for password request"
                    class="block w-full rounded-md bg-blue-300 py-2 cursor-pointer hover:bg-blue-600 transition-all hover:text-white"   
                />
            </div>

        </form>

        <p class="mt-2 text-center">Remember password? 
            <NuxtLink to="/login" class="link">Login</NuxtLink>
        </p>

    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useMessageStore, messageType } from '~~/store/messageStore';
import axiosClient from '~~/axios/axiosClient';
import axios from 'axios';
import SvgIcon from '@jamescoyle/vue-icon';
import {mdiEye, mdiEyeOff} from '@mdi/js';

definePageMeta({
    layout: "registration",
})

export default defineComponent({
    components: {
        SvgIcon
    },
    setup() {

        const password = ref("");
        const repeatPassword = ref("");
        const passwordVisible = ref(false);
        const repeatPasswordVisible = ref(false);
        const {addMessage} = useMessageStore();

        const authenticate = async() => {

            if(password.value !== repeatPassword.value){
                return addMessage("Passwords do not match", messageType.error)
            } 
            
            try {
                let { data } = await axiosClient.post("/user/reset-password", {
                    verificationCode: useRoute().params["id"],
                    password: password.value,
                })
                addMessage(data.message, messageType.success);

                useRouter().push("/login");

            } catch (error) {
                if(axios.isAxiosError(error)){
                    addMessage(error.response?.data?.message || "Something went wrong", messageType.error)


                }
                else{
                    addMessage("Something went wrong", messageType.error)
                }
            }





        }

        return {
            authenticate,
            password,
            repeatPassword,
            passwordVisible,
            repeatPasswordVisible,
            mdiEye,
            mdiEyeOff
        } 
    },
})
</script>


