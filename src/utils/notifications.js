export const requestNotificationPermission = async() => {
    try {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    } catch (error) {
        console.error('Error requesting notification permission:', error);
        return false;
    }
};

export const scheduleNotification = (task) => {
    if (!('Notification' in window)) {
        console.log('This browser does not support notifications');
        return;
    }

    if (Notification.permission === 'granted' && task.dueDate) {
        const dueDate = new Date(task.dueDate);
        const now = new Date();

        if (dueDate > now) {
            const timeUntilDue = dueDate.getTime() - now.getTime();

            // Schedule notification 1 hour before due date
            setTimeout(() => {
                new Notification('Task Due Soon!', {
                    body: `Your task "${task.text}" is due in 1 hour!`,
                    icon: '/logo192.png'
                });
            }, timeUntilDue - 3600000); // 3600000ms = 1 hour
        }
    }
};