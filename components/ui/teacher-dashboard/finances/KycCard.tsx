import Link from "next/link";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

interface IBalanceInfo {
  amt: number | undefined | null;
}

const WithdrawDialog: React.FC<{
  setShowPayment: React.Dispatch<React.SetStateAction<boolean>>;
  showPayment: boolean;
  amt: number | undefined | null;
}> = ({ showPayment, setShowPayment, amt }) => {
  const [inputVal, setInputVal] = useState<string>();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["make-withdraw"],
    mutationFn: async () => {
      const response = await fetch("/api/teacher-get-bank/e-wallet", {
        method: "POST",
        body: JSON.stringify({ amt: Number(inputVal) }),
      });
      return response;
    },
    onSuccess: async (response) => {
      const result = await response.json();
      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ["get-account-balance"] });
        toast.success(result.message);
        setShowPayment(false);
      } else {
        toast.error(result.message);
      }
    },
  });
  // function to process withdrawals
  const makeWithdraw = () => {
    if (Number(inputVal) > amt!) {
      return toast.error("insufficint balance");
    }
    mutation.mutate();
  };
  return (
    <Dialog open={showPayment} onOpenChange={() => setShowPayment(false)}>
      <DialogContent className="sm:w-[500px] w-[380px] font-header">
        <DialogHeader>
          <DialogTitle className="text-2xl mt-6 font-bold flex items-center justify-center">
            <p>Withdraw Request</p>
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 font-header py-4">
          <p className="text-[14.5px] font-semibold">Account Balance</p>
          <div className="flex justify-between items-center gap-4">
            <div className="flex flex-col space-y-4">
              <p className="text-lightGreen font-bold text-[22px]">
                {" "}
                {amt?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="flex items-center">
              <Image
                src="/nairasign.webp"
                alt="usflag"
                width={100}
                height={100}
                className="w-[20px] h-[20px] inline rounded-full"
              />{" "}
              <p className=" font-semibold text-black">NGN</p>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="amount"
              type="number"
              placeholder="Amount"
              className="col-span-6 h-[60px] w-full"
              onChange={(e) => setInputVal(e.target.value)}
            />
          </div>
          <Button
            onClick={makeWithdraw}
            className=" bg-green-700 py-6 transform ease-in-out duration-500 hover:bg-green-800"
          >
            Withdraw
          </Button>
        </div>
        <DialogFooter className=""></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const KycCard: React.FC<IBalanceInfo> = ({ amt }) => {
  const { data } = useQuery({
    queryKey: ["getkyc"],
    queryFn: async () => {
      const response = await fetch("/api/kyc");
      const result = await response.json();
      return result;
    },
  });
  return (
    <div className="flex flex-2 h-fit  text-sm pl-4  pr-3 py-3  justify-between space-x-2  bg-white rounded-md">
      <div className="flex flex-col  justify-evenly">
        <h3 className="font-semibold text-slate-500 text-[13px] pb-3">
          Account Balance
        </h3>
        <p className="font-bold text-[22px] text-lightGreen pb-2 ">
          &#8358;{" "}
          {amt?.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
        {/* <p className="inline text-[11.5px] mt-2 font-subtext font-medium">
          <span className="text-red-500 ">15%</span> less than last month
        </p> */}
        {data === null ? (
          <p className="inline text-[13px] my-3   font-semibold">
            {" "}
            Complete Your
            <Link
              href={`/teacher-dashboard/finance/kyc`}
              className="text-lightGreen underline font-bold "
            >
              {" "}
              KYC
            </Link>
          </p>
        ) : (
          <p className="inline text-[13px] my-3 text-lightGreen  font-semibold">
            your kyc is{" "}
            <span className="text-[13px] px-2 py-1 bg-green-700 text-white rounded-md">
              {data?.status}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

const Balance: React.FC<IBalanceInfo> = ({ amt }) => {
  const [showPayment, setShowPayment] = useState<boolean>(false);
  const handleShowPayment = () => {
    if (amt! < 5000) {
      return toast.error("minimum withdraw request is &#8358;5000 ");
    }
    setShowPayment(true);
  };
  return (
    <div className="flex flex-3  text-sm  py-3 px-4  justify-between space-x-2  bg-white rounded-md">
      <div className="flex flex-col  justify-evenly">
        <h3 className="font-semibold text-slate-500 text-[13px] pb-2">
          Withdrawal
        </h3>

        <p className=" text-[11.5px] my-3 font-medium">
          Your earnings will be sent to the account details provided.
          Please,confirm your account details before proceeding.
        </p>
        <p className=" text-red-500 text-[10px]">
          You can only make withdrawal from &#8358;5,000
        </p>

        {amt && amt >= 5000 && (
          <div
            className=" px-3 py-2 rounded-md text-white bg-green-800 w-fit cursor-pointer"
            onClick={handleShowPayment}
          >
            Request withdrawal
          </div>
        )}
        {showPayment && (
          <WithdrawDialog
            showPayment={showPayment}
            setShowPayment={setShowPayment}
            amt={amt}
          />
        )}
      </div>
    </div>
  );
};

const AccountInfo = () => {
  const { data } = useQuery<{ amt: number | null | undefined }>({
    queryKey: ["get-account-balance"],
    queryFn: async () => {
      const response = await fetch("/api/teacher-get-bank/e-wallet");
      const result = await response.json();
      return result;
    },
  });
  return (
    <>
      <KycCard amt={data?.amt} />
      <Balance amt={data?.amt} />
    </>
  );
};

export default AccountInfo;
