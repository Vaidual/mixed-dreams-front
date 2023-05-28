import { standardHeaders } from "api/api.helper";
import { instance } from "api/api.interceptor";
import { Ingredient, PostIngredient } from "interfaces/ingredient.interface";

export const IngredientsService = {
  async get() {
    const response = await instance<Ingredient[]>({
      url: `/ingredients`,
      method: 'get',
    })

    return response.data
  },

  async post(data: PostIngredient) {
    const response = await instance<Ingredient>({
      url: `/ingredients`,
      method: 'post',
      data
    })

    return response.data
  },
}