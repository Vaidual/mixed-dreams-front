import { instance } from "api/api.interceptor"
import {ICompanySettings} from "../../interfaces/company.interface";

export const CompanyService = {
	async getCompanySettings() {
		const response = await instance<ICompanySettings>({
			url: "/company/settings",
			method: "get"
		})

		return response.data
	},

	async updateCompanySettings(data: ICompanySettings) {
		const response = await instance<{}>({
			url: "/company/settings",
			method: "put",
			data: data
		})

		return response.data
	}
}
