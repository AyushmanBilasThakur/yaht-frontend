<template>
    <div class="wrapper">
        <slot>
        </slot>
    </div>
</template>


<script setup lang="ts">
import axiosClient from '~~/axios/axiosClient';
import { useAuthStore } from '~~/store/authStore';
import { useUserStore } from '~~/store/userStore';

const {addAccessToken,changeAuthStatus} = useAuthStore();
const {setUserDetails} = useUserStore()

await onBeforeMount(async() => {
    try {
        const {data} = await axiosClient.get("/user/refresh")
        changeAuthStatus(true);
        addAccessToken(data.accessToken);
        useRouter().push("/");
        setUserDetails(data.data);
    } catch (error) {
        console.log(error)
    }
});
</script>

<style scoped>
.wrapper{
    background-color: aliceblue;
    min-height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>