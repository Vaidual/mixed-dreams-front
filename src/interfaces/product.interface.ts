import { Visibility } from "enums/Visibility"

export interface CompanyProduct {
  id: string,
  name: string,
  price: number,
  amountInStock: number,
}

export interface PostProduct {
  name: string,
  description: string,
  price: number,
  amountInStock: number,
  visibility: Visibility,
  primaryImage: File | null,
  recommendedTemperature: number,
  recommendedHumidity: number,
  ingredients?: PostProductIngredient[]
  productCategoryId: string
}

export interface PutProduct {
  name: string,
  changeImage: boolean,
  description: string,
  price: number,
  amountInStock: number,
  visibility: Visibility,
  primaryImage: File | null,
  recommendedTemperature: number,
  recommendedHumidity: number,
  ingredients?: PostProductIngredient[]
  productCategoryId: string
}

export interface GetProductIngredient {
  id: string,
  name: string,
  hasAmount: boolean,
  amount?: number | null,
  unit?: number | null,
}

export interface PostProductIngredient {
  id: string,
  hasAmount: boolean,
  amount?: number | null,
  unit?: number | null,
}

export interface ProductWithDetails {
	id: string
	name: string
	description: string
	price: number | null
	amountInStock: number | null
	visibility: Visibility
	primaryImage: string | null
	recommendedTemperature: number | null
	recommendedHumidity: number | null
	ingredients: GetProductIngredient[]
	productCategory: string | null
	preparationTime: number | null
}

export interface ProductCategory {
  id: string,
  name: string,
}