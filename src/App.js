import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Todo from './components/Todo';
import Login from './components/Login';
import './App.css';
import { FaPlus, FaTrash, FaCheck } from 'react-icons/fa';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const session = supabase.auth.session();
        setUser(session?.user ?? null);

        const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    return ( <
        div className = "app" >
            <header className = "app-header" > 
                <h1> DoItASAP </h1> 
            </header > 
            <main className = "app-main" > 
                {user ? < Todo / > : < Login setUser = {setUser}/>} 
            </main> 
        </div>
    );
}
export default App;