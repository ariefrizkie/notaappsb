import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { supabase } from "./supabaseClient";

const SupabaseContext = createContext();

export function SupabaseProvider({ children }) {
  const [dbNota, setDbNota] = useState([]);
  const [dbItemsNota, setDbItemsNota] = useState([]);
  const [dbPembayaran, setDbPembayaran] = useState([]);
  const [dbPelanggan, setDbPelanggan] = useState([]);
  const [dbProduk, setDbProduk] = useState([]);

  const [loading, setLoading] = useState(false);
  const [dbError, setDbError] = useState(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setDbError(null);

      const [resNota, resItems, resPembayaran, resPelanggan, resProduk] =
        await Promise.all([
          supabase.from("db_nota").select("*"),
          supabase.from("db_items_nota").select("*"),
          supabase.from("db_pembayaran").select("*"),
          supabase.from("db_pelanggan").select("*"),
          supabase.from("db_produk").select("*"),
        ]);

      if (resNota.error) throw resNota.error;
      if (resItems.error) throw resItems.error;
      if (resPembayaran.error) throw resPembayaran.error;
      if (resPelanggan.error) throw resPelanggan.error;
      if (resProduk.error) throw resProduk.error;

      setDbNota(resNota.data || []);
      setDbItemsNota(resItems.data || []);
      setDbPembayaran(resPembayaran.data || []);
      setDbPelanggan(resPelanggan.data || []);
      setDbProduk(resProduk.data || []);
    } catch (error) {
      setDbError(error.message);
      console.error(`Gagal memuat data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const insertData = async (key, payLoad) => {
    try {
      setLoading(true);
      setDbError(null);

      const { error } = await supabase.from(key).insert(payLoad);

      if (error) {
        console.error(error);
        return;
      }

      await fetchAllData();
      return { success: true };
    } catch (error) {
      setDbError(error.message);
      console.error(`Gagal menyimpan data ${key}: ${error.message}`);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateData = async (key, id, payLoad, idUpdate) => {
    try {
      setLoading(true);
      setDbError(null);
      const { error } = await supabase
        .from(key)
        .update(payLoad)
        .eq(idUpdate, id);

      if (error) {
        console.error(error);
        return;
      }

      await fetchAllData();
      return { success: true };
    } catch (error) {
      setDbError(error.message);
      console.error(`Gagal update data ${key}: ${error.message}`);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteData = async (key, id, idDelete) => {
    try {
      setLoading(true);
      setDbError(null);
      const { error } = await supabase.from(key).delete().eq(idDelete, id);

      if (error) {
        console.error(error);
        return;
      }

      await fetchAllData();
      return { success: true };
    } catch (error) {
      setDbError(err.message);
      console.error(`Gagal delete data ${key}: ${error.message}`);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <SupabaseContext.Provider
      value={{
        dbNota,
        dbItemsNota,
        dbPembayaran,
        dbPelanggan,
        dbProduk,
        loading,
        dbError,
        fetchAllData,
        updateData,
        insertData,
        deleteData,
      }}
    >
      {children}
    </SupabaseContext.Provider>
  );
}

export const useSupabase = () => useContext(SupabaseContext);
