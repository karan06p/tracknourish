import useSWR from "swr";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
const fetcher = async ( url: string ) => {
    const res = await fetch(url, {
        credentials: "include",
    });

    if(!res.ok){
        const errorData = await res.json();
        throw new Error(errorData.message || "Something went wrong");
    }

    return res.json();
};

export const useUser = () => {
    const { data, error, isLoading, mutate } = useSWR(`${baseUrl}/api/user-info`, fetcher);

    return {
        user: data,
        isLoading,
        isError: error,
        mutate
    }
}