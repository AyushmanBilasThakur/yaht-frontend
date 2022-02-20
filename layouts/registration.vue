<template>
    <div class="wrapper">
        <div v-if="isLoading">
             <h3 class="mb-5 text-4xl font-bold">Yet Another Habit Tracker</h3>
            <ClipLoader color="#1F398A" />
        </div>
        <div v-else>
            <slot>
            </slot>
        </div>
    </div>
</template>


<script setup lang="ts">
import axiosClient from '~~/axios/axiosClient';
import { useAuthStore } from '~~/store/authStore';
import { useUserStore } from '~~/store/userStore';
import ClipLoader from "vue-spinner/src/ClipLoader.vue";

const {addAccessToken,changeAuthStatus} = useAuthStore();
const {setUserDetails} = useUserStore()

const isLoading = ref(false);

await onBeforeMount(async() => {
    isLoading.value = true;
    try {
        const {data} = await axiosClient.get("/user/refresh")
        changeAuthStatus(true);
        addAccessToken(data.accessToken);
        useRouter().push("/");
        setUserDetails(data.data);
    } catch (error) {
        console.log(error)
    }
    finally{
        isLoading.value = false
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