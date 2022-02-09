import { defineStore } from "pinia";

export const useUserStore = defineStore({
    id: "user",
    state(){
        return {
            name: "",
            xp: 0,
            level: 0
        }
    },
    actions: {
        setUserDetails(user: any){
            this.name = user.name;
            this.xp = user.xp;
            this.level = user.level;
        }
    }
})