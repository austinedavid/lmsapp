import TransactionTable from "@/components/TransactionTable";
import React from "react";

const page = () => {
  return (
    <div className="my-[80px] md:my-6">
      <TransactionTable text="All transaction" brief={false} />
    </div>
  );
};

export default page;
