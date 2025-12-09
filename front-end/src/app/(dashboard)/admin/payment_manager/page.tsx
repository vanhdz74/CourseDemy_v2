"use client";

import { useApi } from "@/hooks/useApi";
import { useAppSelector } from "@/redux/hooks";
import React, { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";

const PaymentManagermentPage = () => {
  const { get } = useApi();
  const user = useAppSelector((state) => state.auth.user);
  const [transactions, setTransactions] = useState([]);

  const getTransaction = async () => {
    const data = await get(`/transaction`);
    setTransactions(data);
  };

  useEffect(() => {
    getTransaction();
  }, []);

  return (
    <div>
      <h1 className="text-center text-2xl font-bold mb-5">
        Quản lý thanh toán
      </h1>

      {/* Bảng dữ liệu */}
      <div>
        <DataTable
          data={transactions}
          reload={getTransaction} // reload khi thực hiện các thao tác trên bảng
          columns={(reload) => columns(reload)}
        />
      </div>
    </div>
  );
};

export default PaymentManagermentPage;
