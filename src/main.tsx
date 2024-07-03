import  {createRoot}  from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import { QueryProvider } from "@/lib/react-query/QueryProvider";
import App from "./App";


const root = createRoot(document.getElementById("root") as HTMLDivElement);

root.render(
    <BrowserRouter>
        <QueryProvider>
            <AuthProvider>
                <App/>
            </AuthProvider>
        </QueryProvider>
    </BrowserRouter>
)
