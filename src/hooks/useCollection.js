import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../lib/firebase";
export function useCollection(name) {
  const [data, setData] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    try {
      const q = query(collection(db, name));
      const unsubscribe = onSnapshot(
        q,
        (s) => {
          if (active) {
            const records = s.docs.map((d) => ({ id: d.id, ...d.data() }));
            records.sort((a, b) => {
              const time = (record) => record.createdAt?.toMillis?.() ?? 0;
              return time(b) - time(a);
            });
            setData(records);
            setLoading(false);
          }
        },
        (snapshotError) => {
          if (active) {
            setError(snapshotError.message || "Could not load records.");
            setLoading(false);
          }
        },
      );
      return () => {
        active = false;
        unsubscribe();
      };
    } catch {
      setError("Could not connect to the content collection.");
      setLoading(false);
    }
    return () => { active = false; };
  }, [name]);
  return { data, loading, error };
}
