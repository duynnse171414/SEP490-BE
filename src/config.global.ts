import { paths } from "./routers/paths";

// export const Backend_URL = "https://jsonplaceholder.typicode.com";
export const Backend_URL = import.meta.env.VITE_Backend_URL;
export const index_path = paths.Home;