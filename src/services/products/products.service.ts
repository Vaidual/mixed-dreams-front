import { instance } from "api/api.interceptor"
import {
	CompanyProduct,
	PostProduct,
	PostProductIngredient,
	ProductCategory,
	ProductWithDetails,
	PutProduct
} from "interfaces/product.interface"

export const ProductService = {
	async getCompanyProducts() {
		const response = await instance<CompanyProduct[]>({
			url: "/company/products",
			method: "Get"
		})

		return response.data
	},

	async deleteProduct(id: string) {
		const response = await instance({
			url: `/products/${id}`,
			method: "delete"
		})

		return response.data
	},

	async getProductWithDetails(id: string) {
		const response = await instance<ProductWithDetails>({
			url: `/products/${id}/details`,
			method: "get"
		})

		return response.data
	},

	async getProductCategories() {
		const response = await instance<ProductCategory[]>({
			url: `/products/categories`,
			method: "get"
		})

		return response.data
	},

	async createProduct(product: PostProduct) {
		const data = new FormData()
		for (let [key, value] of Object.entries(product)) {
			if (key === "ingredients") {
        (value as Array<PostProductIngredient>).forEach((v, i) => {
          for (let [ingredientKey, ingredientValue] of Object.entries(v)) {
            data.append(`ingredients[${i}].${ingredientKey}`, ingredientValue);
            console.log(`ingredients[${i}].${ingredientKey}`, ingredientValue);
          };
        })
			} else {
        data.append(key, value)
      }
			
		}
		const response = await instance({
			url: `/products`,
			method: "post",
			data: data,
			headers: {
				"Content-Type": "multipart/form-data;"
			}
		})

		return response.data
	},

	async updateProduct(id: string, product: PutProduct) {
		const data = new FormData()
		for (let [key, value] of Object.entries(product)) {
			if (key === "ingredients") {
        (value as Array<PostProductIngredient>).forEach((v, i) => {
          for (let [ingredientKey, ingredientValue] of Object.entries(v)) {
            data.append(`ingredients[${i}].${ingredientKey}`, ingredientValue);
            console.log(`ingredients[${i}].${ingredientKey}`, ingredientValue);
          };
        })
			} else {
        data.append(key, value)
      }
		}
		const response = await instance<null>({
			url: `/products/${id}`,
			method: "put",
			data: data,
			headers: {
				"Content-Type": "multipart/form-data;"
			}
		})

		return response.data
	}
}
