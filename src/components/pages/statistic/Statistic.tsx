import {FC, useState} from 'react'
import {useQuery} from "@tanstack/react-query";
import {ICompanySettings} from "../../../interfaces/company.interface";
import {CompanyService} from "../../../services/company/company.service";
import {QueryKeys} from "../../../enums/QueryKeys";
import {OrdersService} from "../../../services/orders/orders.service";
import {StatisticInterval} from "../../../types/StatiscticInterval";
import {IGetOrdersStatisticResponse} from "../../../interfaces/orders.interface";
import {Line} from "react-chartjs-2";
import {CategoryScale, Chart, LinearScale, PointElement, LineElement} from "chart.js";

Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(PointElement);
Chart.register(LineElement);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};

const Statistic: FC = () => {

  const [interval, setInterval] = useState<StatisticInterval>("d1");

  const getOrdersIncomeStatisticQuery = useQuery<IGetOrdersStatisticResponse[]>([QueryKeys.getCompanySettings, interval], () => {
    return OrdersService.getIncomeStatistic(interval);
  });



  console.log(getOrdersIncomeStatisticQuery?.data?.map(x => x.income))

  return (
      !getOrdersIncomeStatisticQuery.isLoading ? (
          <>
            <Line options={options} data={{
              datasets: [
                {
                  label: 'Orders',
                  data: getOrdersIncomeStatisticQuery?.data?.map(x => x.income),
                  borderColor: 'rgb(255, 99, 132)',
                  backgroundColor: 'rgba(255, 99, 132, 0.5)',
                },
              ],
            }} />;
            <div>Statistic</div>
          </>
      ) : null
  )
}

export default Statistic