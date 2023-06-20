import { instance } from "api/api.interceptor"
import {
    CompanyProduct,
    PostProduct,
    PostProductIngredient,
    ProductCategory,
    ProductWithDetails,
    PutProduct
} from "interfaces/product.interface"
import {IGetOrdersStatisticResponse} from "../../interfaces/orders.interface";
import {StatisticInterval} from "../../types/StatiscticInterval";

export const OrdersService = {
    async getIncomeStatistic(interval: StatisticInterval) {
        const response = await instance<IGetOrdersStatisticResponse[]>({
            url: `/company/orders/statistic`,
            method: "get",
            params: {
                period: interval
            }
        })

        return response.data
    },
}
