import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TaskProvider } from "./contexts/TaskContexts";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <TaskProvider>{children}</TaskProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
