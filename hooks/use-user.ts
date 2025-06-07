import { fetchWithAuth } from "@/lib/fetchWithAuth";
import useSWR from "swr";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
const fetcher = async ( url: string ) => {
    const res = await fetchWithAuth(url, {
        credentials: "include",
    });
    if(!res)return;
    
    if(!res.ok){
        const errorData = await res.json();
        throw new Error(errorData.message || "Something went wrong");
    }

    return res.json();
};

export const useUser = () => {
    const { data, error, isLoading, mutate } = useSWR(`${baseUrl}/api/user-info`, fetcher, {
        revalidateOnFocus: false,
        revalidateIfStale: false,     
        revalidateOnReconnect: false,
        dedupingInterval: 1000,       
        shouldRetryOnError: false,    
        focusThrottleInterval: 5000,   
    });

    const firstLetter = data?.userDetails?.firstName.slice(0,1);

    return {
        user: data,
        firstLetter,
        isLoading,
        isError: error,
        mutate
    }
}