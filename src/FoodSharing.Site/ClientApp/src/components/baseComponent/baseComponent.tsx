import { Component } from 'react';

export default class BaseComponent<P = any, S = any> extends Component<Readonly<P>, S> implements Component<Readonly<P>, S> {

    setStateAsync = async <K extends keyof S>(
        state: ((prevState: Readonly<S>, props: Readonly<P>) => (Pick<S, K> | S | null)) | (Pick<S, K> | S | null)
    ) => {
        return new Promise((resolve: (value?: unknown) => void) => { this.setState(state, () => { resolve(undefined) }) });
    }

}
