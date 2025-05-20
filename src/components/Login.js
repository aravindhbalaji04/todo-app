import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const Login = ({ setUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async(e) => {
        e.preventDefault();
        const { user, error } = await supabase.auth.signIn({ email, password });
        if (error) {
            alert(error.message);
        } else {
            setUser(user);
        }
    };

    return ( <
        form onSubmit = { handleLogin } >
        <
        input type = "email"
        placeholder = "Email"
        value = { email }
        onChange = {
            (e) => setEmail(e.target.value)
        }
        required /
        >
        <
        input type = "password"
        placeholder = "Password"
        value = { password }
        onChange = {
            (e) => setPassword(e.target.value)
        }
        required /
        >
        <
        button type = "submit" > Login < /button> < /
        form >
    );
};

export default Login;