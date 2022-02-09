import { defineStore } from "pinia";

export enum messageType{
    success,
    error,
    warning
}

export interface message{
    text: string,
    type: messageType
}

export const useMessageStore = defineStore({
    id: "message",
    state(){
        return({
            messages: Array<message>()
        })
    },
    actions: {
        addMessage(message: string, type: messageType){
            this.messages = [{text: message, type}, ...this.messages]
        },
        removeMessage(index: number){
            this.messages = this.messages.filter((e,i) => i !== index)
        }
    }
})