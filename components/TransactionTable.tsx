"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useConversion } from "@/data-access/conversion";

const TransactionType = [
  {
    id: "1",
    icon: "/teacher1.jpg",
    name: "Rotimi Wajabs",
    type: "Tuition Fee",
    student: "Student",
    date: "April 20, 2024",
    amount_add: "+$17.50",
  },
  {
    id: "2",
    icon: "/parent1.jpg",
    name: "Adeniran James",
    type: "Tuition Fee",
    parent: "Parent",
    date: "April 19, 2024",
    amount_add: "+$14.50",
  },
  {
    id: "3",
    icon: "/teacher1.jpg",
    name: "Rotimi Wajabs",
    type: "Withdrawal",
    user: "User",
    date: "April 20, 2024",
    amount_withdraw: "-$570.50",
  },
  {
    id: "4",
    icon: "/parent1.jpg",
    name: "Rotimi Wajabs",
    type: "Withdrawal",
    user: "User",
    date: "April 20, 2024",
    amount_withdraw: "-$570.50",
  },
];

// creating the type for the query made
interface ITransaction {
  id: string;
  type: string;
  debit: boolean;
  amount: number;
  userId: string;
  updatedAt: string;
}

export default function TransactionTable() {
  const { handleDate } = useConversion();
  const { data, isLoading, isError, error } = useQuery<ITransaction[]>({
    queryKey: ["transaction-show"],
    queryFn: async () => {
      const response = await fetch("/api/transaction-info");
      const result = await response.json();
      return result;
    },
  });

  if (isLoading) {
    return (
      <Table className="bg-white overflow-x-auto    rounded-md my-4">
        <TableCaption className="px-3  py-2 rounded-md bg-white">
          <div className="flex font-semibold  justify-between">
            <p>Recent Transactions</p>
            <Link
              href="/"
              className="text-[11.5px] font-semibold text-right text-lightGreen "
            >
              View More
            </Link>
          </div>
        </TableCaption>

        <TableHeader>
          <TableRow className="mt-0 text-[12.5px]">
            <TableHead className="w-[100px]">TxID</TableHead>
            <TableHead className="">Type</TableHead>
            <TableHead className="">Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
  }
  if (isError) {
    return <div>something went wrong</div>;
  }
  return (
    <Table className="bg-white overflow-x-auto    rounded-md my-4">
      <TableCaption className="px-3  py-2 rounded-md bg-white">
        <div className="flex font-semibold  justify-between">
          <p>Recent Transactions</p>
          <Link
            href="/"
            className="text-[11.5px] font-semibold text-right text-lightGreen "
          >
            View More
          </Link>
        </div>
      </TableCaption>

      <TableHeader>
        <TableRow className="mt-0 text-[12.5px]">
          <TableHead className="w-[100px]">TxID</TableHead>
          <TableHead className="">Type</TableHead>
          <TableHead className="">Date</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.isArray(data) &&
          data.map((tx, index) => (
            <TableRow key={index} className="py-2">
              <TableCell className="font-semibold md:w-[200px]  text-[13px] py-2 flex  mr-1">
                {tx.id}
              </TableCell>
              <TableCell className="text-[12px] font-semibold">
                {tx.type}
              </TableCell>
              <TableCell className="text-[12px]   font-semibold">
                {tx.amount}
              </TableCell>
              <TableCell className="">{handleDate(tx.updatedAt)}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
