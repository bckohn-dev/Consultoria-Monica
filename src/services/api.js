// src/services/api.js
import axios from 'axios';

/**
 * Se você NÃO definir VITE_API_BASE:
 * - em produção: usa window.location.origin + /api  (ex.: https://consultoria-monica.vercel.app/api)
 * - em dev: usa http://localhost:5173/api (Vite) e deixa o proxy do Vite encaminhar para as serverless (se configurado).
 *
 * Se você DEFINIR VITE_API_BASE (opcional):
 * - usa exatamente o valor (ex.: http://localhost:3000/api durante testes de funções).
 */
const API_BASE =
  import.meta?.env?.VITE_API_BASE ||
  (typeof window !== 'undefined' ? `${window.location.origin}/api` : '/api');

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});
