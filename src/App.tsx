import { AppRouter } from "./routers";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Tạo một instance của QueryClient
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class">
        <AppRouter />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
