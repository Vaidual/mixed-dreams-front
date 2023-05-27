import { Visibility } from "enums/Visibility"

export interface CompanyProduct {
  id: string,
  name: string,
  price: number,
  amountInStock: number,
}

export interface PostPutProduct {
  name: string,
  description: string,
  price: number,
  amountInStock: number,
  visibility: Visibility,
  primaryImage: object,
  recommendedTemperature: number,
  recommendedHumidity: number,
  ingredients?: ProductIngredient[]
  productCategory: string
}

export interface ProductIngredient {
  id: string,
  hasAmount: boolean,
  amount?: number,
  unit?: number,
}

export interface ProductWithDetails {
  id: string,
  name: string,
  description: string,
  price: number | null,
  amountInStock: number,
  visibility: Visibility,
  primaryImage: string | null,
  recommendedTemperature: number | null,
  recommendedHumidity: number | null,
  ingredients: ProductIngredient[]
  productCategory: string | null
}