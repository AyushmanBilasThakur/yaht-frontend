<template>
    <div class="body">          
        <slot></slot>
    </div>  
</template>


<script setup lang="ts">
import { storeToRefs } from 'pinia';
import axiosClient from '~~/axios/axiosClient';
import { useAuthStore } from '~~/store/authStore';
import { useUserStore } from '~~/store/userStore';

const {addAccessToken,changeAuthStatus, } = useAuthStore();
const {setUserDetails} = useUserStore();
const {isAuthenticated} = storeToRefs(useAuthStore());


await onBeforeMount(async() => {
    if(!isAuthenticated.value){
        try {
            const {data} = await axiosClient.get("/user/refresh")
            changeAuthStatus(true);
            addAccessToken(data.accessToken);
            setUserDetails(data.data);
        } catch (error) {
            console.log(error);
            useRouter().push("/login")
        }
    }
});
</script>