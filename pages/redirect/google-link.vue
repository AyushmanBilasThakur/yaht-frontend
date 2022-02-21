<template>

    <div class="min-h-screen flex flex-col justify-center items-center">
        <h3 class="mb-5 text-4xl font-bold">Yet Another Habit Tracker</h3>
        <ClipLoader color="#1F398A" />
    </div>

    
</template>

<script setup lang="ts">
import axios from "axios";
import { storeToRefs } from "pinia";
import ClipLoader from "vue-spinner/src/ClipLoader.vue";
import axiosClient from "~~/axios/axiosClient";
import { useAuthStore } from "~~/store/authStore";
import { messageType, useMessageStore } from "~~/store/messageStore";
import { useUserStore } from "~~/store/userStore";

definePageMeta({
    layout: "main"
});

const {code} = useRoute().query;

const {addAccessToken,changeAuthStatus} = useAuthStore();
const {accessToken} = storeToRefs(useAuthStore());
const {addMessage} = useMessageStore();
const {setUserDetails} = useUserStore();

if(!code){
    useRouter().push("/");
}

const isProcessingRequest = ref(false);

watch(accessToken, async() => {
    if(accessToken.value != "" && !isProcessingRequest.value){
        try {
            isProcessingRequest.value = true;
            const {data} = await axiosClient.post("/user/linkwithgoogle", {
                code
            },{
                headers: {
                    "Authorization": `Auth ${accessToken.value}`
                }
            });
            addMessage(data.message, messageType.success);
            changeAuthStatus(true);
            addAccessToken(data.accessToken);
            setUserDetails(data.data);

            useRouter().push("/");
            
        } catch (error) {
            if (axios.isAxiosError(error)) {
                addMessage(error.response?.data?.message || "Something went wrong", messageType.error);
                
                
            }
            else {
                addMessage("Something went wrong", messageType.error);
            }
            useRouter().push("/");
        }
        finally{
            isProcessingRequest.value =false;
        }
    }
});

    


</script>