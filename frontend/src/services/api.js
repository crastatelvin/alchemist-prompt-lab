import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
const API_KEY = import.meta.env.VITE_API_KEY || "";

const client = axios.create({
  baseURL: BASE,
  timeout: 120000,
  headers: API_KEY ? { "x-api-key": API_KEY } : {},
});

export const runExperiment = async (payload) => (await client.post("/run", payload)).data;
export const getExperiments = async (limit = 20) => (await client.get(`/experiments?limit=${limit}`)).data;
export const getStats = async () => (await client.get("/stats")).data;
export const getTechniques = async () => (await client.get("/techniques")).data;
