import { useRouter } from "next/navigation";

export const fetchWithAuth = async (input: RequestInfo, init?: RequestInit) => {
    const router = useRouter()
    let res = await fetch(input, init);

    if(res.status === 401){
        // refresh access token
        const refreshRes = await fetch("/api/refresh-token", {
            method: "GET",
            credentials: "include",
        });
        if (refreshRes.status === 200) {
            // Retry the original request
            res = await fetch(input, init);
          } else {
            // Refresh also failed → logout or redirect
            router.push("/auth/sign-in");
            return;
          }
    }
    return res
}