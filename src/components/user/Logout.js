import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from "../../store"

const Logout = () => {

    const navigate = useNavigate();

    const dispatch = useDispatch();


    useEffect(() => {

        localStorage.clear();

        axios.post("/api/auth/logout");

        dispatch(logout());
        
        navigate("/user/login");
    }, []);
};

export default Logout;
