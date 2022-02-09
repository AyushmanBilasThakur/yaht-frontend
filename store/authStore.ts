import {defineStore} from 'pinia'


export const useAuthStore = defineStore({
    id: "authStore",
    state(){
        return ({
            isAuthenticated: false,
            accessToken: "",
        })
    },

    actions: {
        changeAuthStatus(status: boolean) {
            this.isAuthenticated = status
        },
        addAccessToken(token: string){
            this.accessToken = token;
        }
    }
})