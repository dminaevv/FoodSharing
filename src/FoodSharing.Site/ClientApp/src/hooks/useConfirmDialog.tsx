import { Confirm } from '../components/confirm/confirm';

export function useConfirmDialog() {
    async function showConfirmDialog(title: string) {
        return await Confirm.dialog(title)
    }

    return showConfirmDialog;
}
