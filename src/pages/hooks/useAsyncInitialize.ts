import { useEffect, useState } from "react";

export function useAsyncInitialize<T>(func: () => Promise<T>, deps: any[] = []) {
    const [state, setState] = useState<T | undefined>();
    
    useEffect(() => {
        (async () => {
            try {
                const result = await func();
                setState(result);
            } catch (error) {
                console.error("Error in useAsyncInitialize:", error);
                setState(undefined);
            }
        })();
    }, deps);

    return state;
}