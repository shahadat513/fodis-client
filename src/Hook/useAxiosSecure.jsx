import axios from 'axios';
import { useContext } from 'react';


import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';

const axiosSecure = axios.create({
    baseURL: 'https://fodis-server.vercel.app',
    withCredentials: true
});

const useAxiosSecure = () => {
    const { handleLogOut } = useContext(AuthContext)
    const navigate = useNavigate()
    // interseptors
    axiosSecure.interceptors.response.use(
        res => {

            return res;
        },
        async error => {

            if (error.response.status === 401 || error.response.status === 403) {
                await handleLogOut();
                navigate('/logIn')
            }
            return Promise.reject(error)
        }
    )

    return axiosSecure; // Return the customized axios instance
};

export default useAxiosSecure;