import { Providers } from './providers';
import { AppRoutes } from './routes';
import '../index.css';

function App() {
    return (
        <Providers>
            <AppRoutes />
        </Providers>
    );
}

export default App;
