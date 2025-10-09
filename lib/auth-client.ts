import { createAuthClient } from "better-auth/client";

export const authClientt=createAuthClient({
    baseURL:process.env.NEXT_PUBLIC_BASE_URL!
})