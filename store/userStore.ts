import { defineStore } from "pinia";

export const useUserStore = defineStore({
    id: "user",
    state(){
        return {
            name: "",
            xp: 0,
            level: 0,
            googleId: ""
        }
    },
    actions: {
        setUserDetails(user: any){
            this.name = user.name;
            this.xp = user.xp;
            this.level = user.level;
            this.googleId = user.googleId ? user.googleId : "";
        }
    }
})