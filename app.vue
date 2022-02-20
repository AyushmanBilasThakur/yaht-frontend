<template>
  <div>
    <Html>
      <Head>
        <Script data-ad-client="ca-pub-3135078613883761" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></Script>
      </Head>
    </Html>
    <NuxtLayout>
      <div class="absolute top-3 left-0 right-0 block z-40">
        <div v-for="(message, index) in messages" :class="`message message-${message.type}`" :key="index" @animationend="(e) => callAnimEnd(e, index)">
          {{message.text}}
          <button @click="(e) => delMessage(e)">
            X
          </button>
        </div>
      </div>
      <NuxtPage></NuxtPage>
    </NuxtLayout>
  </div>
</template>

<script lang="ts">
import { storeToRefs } from "pinia";
import { defineComponent } from "vue";
import { useAuthStore } from "./store/authStore";
import { useMessageStore } from "./store/messageStore";

export default defineComponent({
    setup() {
      const {messages} = storeToRefs(useMessageStore());
      const {removeMessage} = useMessageStore();
  
      const delMessage = (e:any) => {
          e.target.parentElement.classList.add("delete")
      }

      const callAnimEnd = (e: AnimationEvent, i: number) => {
        if(e.animationName === "delete"){
          removeMessage(i)
        }
      }

      return {
        messages,
        delMessage,
        callAnimEnd,
      }
    }
})
</script>


<style lang="css">
.input{
    @apply block;
    @apply rounded-md;
    @apply px-2;
    @apply py-1;
    @apply outline-none;
    @apply bg-slate-100;
    @apply border-gray-500;
    @apply border-2;
    @apply focus:bg-blue-100;
    @apply w-full;
    transition: background-color 0.3s ease;
}

.link{
  @apply underline;
  @apply text-blue-500;
  @apply hover:text-blue-900;
}

.message{
  @apply px-4;
  @apply py-2;
  @apply font-bold;
  @apply flex;
  @apply justify-between;
  @apply border-2;
  @apply rounded-md;
  @apply mb-2;
  width: 300px;
  @apply mx-auto;
  animation: popup 0.4s ease forwards;
}

@keyframes popup {
  0%{
    transform: translateY(100px);
    opacity: 0;
  }
  100%{
    opacity: 1;
    transform: translateY(0);
  }
}

.delete{
  animation: delete 0.4s forwards;
}

@keyframes delete {
  0%{
    opacity: 1;
    transform: translateY(0);
  }
  100%{
    transform: translateY(100px);
    opacity: 0;
  }
}

.message-0{
  @apply bg-green-300;
  @apply text-green-800;
  @apply border-green-800;
}

.message-1{
  @apply bg-red-300;
  @apply text-red-800;
  @apply border-red-800;
}

.message-2{
  @apply bg-yellow-300;
  @apply text-yellow-800;
  @apply border-yellow-800;
}

nav{
  @apply p-4;
    @apply flex;
  @apply justify-between;
  @apply bg-blue-300;
}

nav h3{
  @apply text-2xl;
  @apply block;
}

.logout-button{
  @apply px-4;
  @apply py-2;
  @apply block;
  @apply bg-red-600;
  @apply rounded-md;
  @apply text-white;
  @apply hover:bg-red-800;
  transition: background-color 0.3s ease;
}

.body{
  @apply min-h-screen;
  @apply bg-slate-200;
}
</style>