<template>

    <div class="px-5 py-4 rounded-lg shadow-md bg-white min-w-[200px]">
        
        <Html>
        <Head>
            <Title>YAHT | Forgot Password Request</Title>
        </Head>
        </Html>
        
        <h3 class="text-3xl mb-4">Forgot Password</h3>

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
                    placeholder="abc@gmail.com"
                    v-model="email"
                    required
                />
            </div>

            <div>
                <input 
                    type="submit" 
                    value="Request for password request"
                    class="block w-full rounded-md bg-blue-300 py-2 cursor-pointer hover:bg-blue-600 transition-all hover:text-white" 
                    v-if="!isProcessing"  
                />

                <ClipLoader v-else color="#1F398A"/>
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
import ClipLoader from "vue-spinner/src/ClipLoader.vue";

definePageMeta({
    layout: "registration",
})

export default defineComponent({
    components: {
        ClipLoader
    },
    setup() {

        const email = ref("");
        const isProcessing = ref(false);

        const {addMessage} = useMessageStore();
        
        const authenticate = async() => {

            try {
                isProcessing.value = true
                let { data } = await axiosClient.post("/user/reset-request", {
                    email: email.value,
                })
                addMessage(data.message, messageType.success);

                setTimeout(() => {
                    useRouter().push("/login")
                }, 5000);

            } catch (error) {
                if(axios.isAxiosError(error)){
                    addMessage(error.response?.data?.message || "Something went wrong", messageType.error)


                }
                else{
                    addMessage("Something went wrong", messageType.error)
                }
            }
            finally{
                isProcessing.value = false;
            }
        }

        return {
            authenticate,
            email,
            isProcessing
        } 
    },
})
</script>


