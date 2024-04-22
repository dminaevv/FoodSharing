import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import BaseComponent from '../baseComponent/baseComponent';
import store from './confirmStore';

interface IProps { }

interface IState {
    isOpen: boolean;
    title: string;
}

export class Confirm extends BaseComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        store.register(this.show, this.hide);

        this.state = {
            isOpen: false,
            title: ''
        }
    }

    static dialog = async (title: string) => store.confirm(title);

    show = async (title: string) => await this.setStateAsync({ isOpen: true, title })
    hide = async () => await this.setStateAsync({ isOpen: false });

    yes = async () => await store.resolve(true);
    no = async () => await store.resolve(false);


    render() {
        const { title, isOpen } = this.state;

        return (
            <Dialog
                open={isOpen}
                onClose={this.no}
            >
                <DialogTitle>
                    {title}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={this.yes} autoFocus>Да</Button>
                    <Button onClick={this.no}> Нет </Button>
                </DialogActions>
            </Dialog>
        )
    }
}
