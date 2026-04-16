import { useEffect, useState } from "react";
import { fetchResource } from "../services/api";

export function useData(i) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchResource(i)
        .then(setData)
        .catch(setError)
        .finally(() => setLoading(false));
    }, []);

    return {data, loading, error}
}