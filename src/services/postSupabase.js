import { supabase } from "./supabaseClient";

export async function postSupabase(key, data) {
  try {
    const { error } = await supabase.from(key).insert(data);

    if (error) throw error;
  } catch (error) {
    console.error(`Gagal menyimpan data ${key}: ${error.message}`);
    alert(`Terjadi kesalahan saat menyimpan data ke database ${key}.`);
  }
}
