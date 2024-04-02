import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import ReactDOM from 'react-dom/client';
import { BlockUi } from '../components/blockUi/blockUi';
import { Notifications } from '../components/notifications/notifications';
import '../tools/extensions/enumUtils';
import '../tools/extensions/numberUtils';
import '../tools/extensions/stringConstructor';
import { Container } from './container';
import { MainRouter } from './mainRouter';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <>
        <Container>
            <BlockUi>
                <Notifications />
                <MainRouter />
            </BlockUi>
        </Container>
    </>
);

