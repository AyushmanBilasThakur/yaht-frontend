import axios from "axios"

const axiosClient = axios.create({
    baseURL: "https://yaht-backend.herokuapp.com/",
    withCredentials: true,
})

const interceptor = axiosClient.interceptors.response.use(
    (response) => response, 
    async (error) => {
        if(error.response.status != 401){
            return Promise.reject(error)
        }
        axios.interceptors.response.eject(interceptor);

        try {
            const response = await axios.get('/auth/refresh')
    
            error.response.config.headers["Authorization"] = `Auth ${response.data.access_token}`

            return axios(error.response.config)
            
        } catch (error) {
            return Promise.reject(error)
        }

    }    
    
)

export default axiosClient;