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

export default function TransactionTable() {
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
        {TransactionType.map((Transaction) => (
          <TableRow key={Transaction.id} className="py-2">
            <TableCell className="font-semibold md:w-[200px]  text-[13px] py-2 flex  mr-1"></TableCell>
            <TableCell className="text-[12px] font-semibold"></TableCell>
            <TableCell className="text-[12px]   font-semibold"></TableCell>
            <TableCell className=""></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
