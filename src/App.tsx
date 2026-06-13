import { AppRoutes } from './routes/AppRoutes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app-container">
        <AppRoutes />
      </div>
    </QueryClientProvider>
  );
}

export default App;
