import { toast } from 'react-toastify';

export function useNotifications() {
    function addErrorNotification(error: string) {
        toast.error(error);
    }

    function addSuccessNotification(message: string) {
        toast.success(message);
    }

    function clearNotifications() {
        return toast.clearWaitingQueue()

    }

    return {
        addErrorNotification, addSuccessNotification, clearNotifications
    }
}
