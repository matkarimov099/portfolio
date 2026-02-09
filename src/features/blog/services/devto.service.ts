import axios from "axios";
import type { DevToArticle } from "../types";

const devtoApi = axios.create({
  baseURL: "https://dev.to/api",
});

export const devtoService = {
  getArticles: async (username: string): Promise<DevToArticle[]> => {
    const { data } = await devtoApi.get<DevToArticle[]>("/articles", {
      params: { username, per_page: 100 },
    });
    return data;
  },
};
