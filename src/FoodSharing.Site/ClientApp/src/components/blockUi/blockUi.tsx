import { PropsWithChildren, useEffect, useState } from 'react';
import store from './blockUiStore';

import { CircularProgress } from '@mui/material';
import styles from './blockUi.module.scss';

export function BlockUi(props: PropsWithChildren<{}>) {
    const [blockCount, setBlockCount] = useState<number>(0);
    const isBlocked = blockCount > 0;

    useEffect(() => store.register(show, hide), []);

    const show = async () => setBlockCount(blockCount => blockCount + 1);
    const hide = async () => setBlockCount(blockCount => (blockCount - 1).butNotLess(0));

    return (
        <div
            className={`${styles.block_ui} ${isBlocked ? styles.blocking : ''}`}
        >
            <div className={styles.block}>
                <div className={styles.overlay}></div>
                <div className={styles.content}>
                    <CircularProgress />
                </div>
            </div>
            <div style={{ width: '100%', height: '100%' }}>
                {props.children}
            </div>
        </div>
    )
}

BlockUi.block = async (operation: () => Promise<void> | void) => {
    store.block(operation);
}
