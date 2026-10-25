import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export function useSupabase(key, initialValue) {
  const [storedValue, setStoredValue] = useState(initialValue);

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      const { data, error } = await supabase.from(key).select();

      if (error) {
        console.error(error);
        return;
      }

      setStoredValue(data);
    } catch (error) {
      console.error(`Gagal memuat data ${key}: ${error.message}`);
      alert(`Terjadi kesalahan saat memuat data dari database ${key}.`);
    }
  }

  return [storedValue, setStoredValue];
}
