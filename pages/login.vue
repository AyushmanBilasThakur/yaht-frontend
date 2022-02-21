<template>

    <div class="px-5 py-4 rounded-lg shadow-md bg-white min-w-[200px]">
        
        <Html>
        <Head>
            <Title>Yet Another Habit Tracker | Login</Title>
        </Head>
        </Html>
        
        <h3 class="text-3xl mb-4">Login</h3>

        <form class="w-[300px]" @submit.prevent="() => authenticate()">

            <div class="mb-4">
                <label 
                    for="email" 
                    class="block mb-1">
                    Email
                </label>
                <input 
                    type="email" 
                    class="input" 
                    placeholder="abc@email.com"
                    v-model="email"
                    required
                />
            </div>

            <div class="mb-4">
                <label 
                    for="password" 
                    class="mb-1 flex justify-between">
                    <p class="flex gap-1">Password  <SvgIcon @click="passwordVisible = !passwordVisible" type="mdi" :path="passwordVisible ? mdiEyeOff : mdiEye" class=" cursor-pointer"></SvgIcon></p>   

                    <NuxtLink to="/forgot-password/request" class="link">Forgot Password?</NuxtLink>
                </label>
                <input 
                    :type="passwordVisible ? `text`: `password`" 
                    class="input" 
                    placeholder="Your Password"
                    v-model="password"
                    required
                />

                
            </div>

            <div>
                <input 
                    type="submit" 
                    value="Login"
                    class="block w-full rounded-md bg-blue-300 py-2 cursor-pointer hover:bg-blue-600 transition-all hover:text-white" 
                    v-if="!isProcessing"
                />

                <div v-else>
                    <ClipLoader color="#1F398A"/>
                </div>
                


            </div>

        </form>

        <p class=" mt-2 text-md text-center">Or,</p>

        <a :href="loginWithGoogleURL" class=" mt-2 border-2 border-black py-2 rounded-md w-full bg-white text-black hover:bg-gray-100 flex justify-center items-center gap-2">
            <SvgIcon type="mdi" :path="mdiGoogle" size="20px"/> Sign In With Google
        </a>

        <p class="mt-2 text-center">Don't have an account? 
            <NuxtLink to="/signup" class="link">Sign Up</NuxtLink>
        </p>

    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAuthStore } from '~~/store/authStore';
import { useMessageStore, messageType } from '~~/store/messageStore';
import axiosClient from '~~/axios/axiosClient';
import axios from 'axios';
import { useUserStore } from '~~/store/userStore';
import SvgIcon from '@jamescoyle/vue-icon';
import {mdiEye, mdiEyeOff, mdiGoogle} from "@mdi/js";
import ClipLoader from "vue-spinner/src/ClipLoader.vue";

definePageMeta({
    layout: "registration",
})

export default defineComponent({
    setup() {
        useMeta({
            title: "Login | YAHT"
        });
        const email = ref("");
        const password = ref("");
        const passwordVisible = ref(false);
        const isProcessing = ref(false);
        const { changeAuthStatus, addAccessToken } = useAuthStore();
        const { setUserDetails } = useUserStore();
        const { addMessage } = useMessageStore();
        const authenticate = async () => {
            try {
                isProcessing.value = true
                let { data } = await axiosClient.post("/user/login", {
                    email: email.value,
                    password: password.value
                });
                addMessage(data.message, messageType.success);
                changeAuthStatus(true);
                addAccessToken(data.accessToken);
                setUserDetails(data.data);
                useRouter().push("/");
            }
            catch (error) {
                if (axios.isAxiosError(error)) {
                    addMessage(error.response?.data?.message || "Something went wrong", messageType.error);
                }
                else {
                    addMessage("Something went wrong", messageType.error);
                }
            }
            finally{
                isProcessing.value = false;
            }
        };
        

        const loginWithGoogleURL = computed(() => {
            const params = {
                client_id: "632769304840-f2o4kubg5ajfgpmoqe1ejqqva4fo02hf.apps.googleusercontent.com",
                redirect_uri:
                "http://localhost:3000/redirect/google",
                response_type: "code",
                prompt: "select_account",
                scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile"
            }

            const url = new URL("https://accounts.google.com/o/oauth2/v2/auth")
            Object.keys(params).forEach(k => {
                const v = params[k];
                url.searchParams.append(k,v);
            })

            return url.toString();
        })

        return {
            authenticate,
            email,
            password,
            passwordVisible,
            mdiEye,
            mdiEyeOff,
            isProcessing,
            mdiGoogle,
            loginWithGoogleURL,
        };
    },
    components: { SvgIcon, ClipLoader,  }
})
</script>


