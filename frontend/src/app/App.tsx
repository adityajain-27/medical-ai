import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from 'sonner';
import { ThemeProvider } from './components/ThemeProvider';
import { AuthProvider } from './hooks/useAuth';
import { CreditProvider } from './hooks/useCredits';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CreditProvider>
          <RouterProvider router={router} />
          <Toaster position="top-right" richColors />
        </CreditProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}