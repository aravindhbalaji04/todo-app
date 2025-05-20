import React, { useState, useEffect } from 'react';
import './Todo.css';
import { requestNotificationPermission, scheduleNotification } from '../utils/notifications';
import { FaPlus, FaTrash, FaCheck } from 'react-icons/fa';

const CATEGORIES = ['Work', 'Personal', 'Urgent'];

function Todo() {
    const [tasks, setTasks] = useState(() => {
        // Initialize tasks from localStorage
        const savedTasks = localStorage.getItem('tasks');
        return savedTasks ? JSON.parse(savedTasks) : [];
    });
    const [newTask, setNewTask] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Save tasks to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    // Calculate progress
    const progress = tasks.length > 0 ?
        Math.round((tasks.filter(task => task.completed).length / tasks.length) * 100) :
        0;

    // Inside the Todo component, add this effect
    useEffect(() => {
        requestNotificationPermission();
    }, []);

    const addTask = (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        const task = {
            id: Date.now(),
            text: newTask,
            completed: false,
            category: selectedCategory,
            createdAt: new Date(),
            dueDate: null
        };

        setTasks([...tasks, task]);
        setNewTask('');
    };

    const toggleTask = (taskId) => {
        setTasks(tasks.map(task =>
            task.id === taskId ? {...task, completed: !task.completed } : task
        ));
    };

    const deleteTask = (taskId) => {
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    // Add this function to set due date
    const setTaskDueDate = (taskId, dueDate) => {
        setTasks(tasks.map(task => {
            if (task.id === taskId) {
                const updatedTask = {...task, dueDate };
                scheduleNotification(updatedTask);
                return updatedTask;
            }
            return task;
        }));
    };

    const filteredTasks = selectedCategory === 'All' ?
        tasks :
        tasks.filter(task => task.category === selectedCategory);

    return ( <
            div className = "todo-container" > { /* Progress Bar */ } <
            div className = "progress-container" >
            <
            div className = "progress-bar" >
            <
            div className = "progress-fill"
            style = {
                { width: `${progress}%` }
            }
            /> < /
            div > <
            span className = "progress-text" > { progress } % Complete < /span> < /
            div >

            <
            form onSubmit = { addTask }
            className = "todo-form" >
            <
            input type = "text"
            value = { newTask }
            onChange = {
                (e) => setNewTask(e.target.value)
            }
            placeholder = "Add a new task..."
            className = "todo-input" /
            >
            <
            select value = { selectedCategory }
            onChange = {
                (e) => setSelectedCategory(e.target.value)
            }
            className = "category-select" >
            <
            option value = "All" > All Categories < /option> {
            CATEGORIES.map(category => ( <
                option key = { category }
                value = { category } > { category } < /option>
            ))
        } <
        /select> <
    button type = "submit"
    className = "add-button" >
        <
        FaPlus / > Add Task <
        /button> < /
    form >

        <
        div className = "tasks-container" > {
            filteredTasks.map(task => ( <
                div key = { task.id }
                className = { `task-item ${task.completed ? 'completed' : ''}` } >
                <
                input type = "checkbox"
                checked = { task.completed }
                onChange = {
                    () => toggleTask(task.id)
                }
                /> <
                span className = "task-text" > { task.text } < /span> <
                span className = "task-category" > { task.category } < /span> <
                button onClick = {
                    () => deleteTask(task.id)
                }
                className = "delete-button"
                title = "Delete task" >
                <
                FaTrash / >
                <
                /button> <
                input type = "datetime-local"
                onChange = {
                    (e) => setTaskDueDate(task.id, e.target.value)
                }
                value = { task.dueDate || '' }
                className = "due-date-input" /
                >
                {
                    task.completed && ( <
                        span className = "completion-indicator"
                        title = "Task completed" >
                        <
                        FaCheck / >
                        <
                        /span>
                    )
                } <
                /div >
            ))
        } <
        /div> < /
    div >
);
}

export default Todo;