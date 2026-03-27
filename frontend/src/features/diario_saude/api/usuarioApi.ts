import http from "@/lib/http";
import type { Usuario } from "./types";

const base = "/api/diario_saude/usuario";

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const usuarioApi = {
  porId: async (id: number): Promise<Usuario> => {
    const { data } = await http.get(`${base}/${id}`, { headers: getAuthHeader() });
    return data;
  },

  atualizar: async (payload: Usuario): Promise<Usuario> => {
    const { data } = await http.put(base, payload, {
      headers: { ...getAuthHeader(), "Content-Type": "application/json" },
    });
    return data;
  },

  listarPacientes: async (): Promise<Usuario[]> => {
    const { data } = await http.get(`${base}/pacientes`, { headers: getAuthHeader() });
    return data;
  },
};