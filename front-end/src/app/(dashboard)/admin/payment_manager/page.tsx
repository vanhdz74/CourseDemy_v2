"use client";

import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { queryKeys } from "@/services/queryKeys";

const PaymentManagermentPage = () => {
  const { data: transactions = [], refetch } = useQuery({
    queryKey: queryKeys.transactions.all,
    queryFn: api.transactions.getTransactions,
  });

  return (
    <div>
      <h1 className="text-center text-2xl font-bold mb-5">
        Quản lý thanh toán
      </h1>

      {/* Bảng dữ liệu */}
      <div>
        <DataTable
          data={transactions}
          reload={() => refetch()} // reload khi thực hiện các thao tác trên bảng
          columns={(reload) => columns(reload)}
        />
      </div>
    </div>
  );
};

export default PaymentManagermentPage;
