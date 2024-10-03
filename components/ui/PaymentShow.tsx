import { closePaymentModal, FlutterWaveButton } from "flutterwave-react-v3";
import { useSession } from "next-auth/react";
import { PaystackButton } from "react-paystack";
import { toast } from "react-toastify";
import { GrFormCheckmark } from "react-icons/gr";
import Image from "next/image";
import { paymentMethods } from "@/constants/pricing/school";
import { IselectedDetails } from "../EachPricing";
import { useState } from "react";

interface Ipayments extends IselectedDetails {
  enroll: () => void;
}

// component that display a dialogue box for payment method based on the class selected
export const CheckoutMain: React.FC<Ipayments> = ({
  enroll,
  duration,
  amt,
  planName,
  expireIn,
  plan,
}) => {
  // this state manages the payment method the user has selected
  const [selected, setSelected] = useState<string | undefined>(undefined);
  // method to update the payment
  const updatePayMethod = (method: string) => {
    setSelected(method);
  };
  return (
    <div
      onClick={enroll}
      className=" fixed px-3 py-2 flex items-center justify-center w-full h-screen top-0 left-0 bottom-0 z-[999] bg-[rgba(0,0,0,0.1)] backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className=" bg-stone-100 w-full pt-5 sm:w-[400px] px-3 py-2 flex flex-col justify-center items-center "
      >
        <p className=" font-bold text-green-700">Payment</p>
        <p className=" text-[12px] font-bold mt-2">Select payment method</p>
        <div className=" w-[100px] aspect-square rounded-full border-2 border-green-700 flex items-center justify-center mt-4 mb-3">
          <p className=" font-bold text-green-700 ">{amt}</p>
        </div>
        {/* div showing the payment methods */}
        <div className=" mt-3 w-full flex flex-col gap-2">
          {paymentMethods.map((payment, index) => (
            <div
              key={index}
              className=" bg-white px-3 py-2 w-full flex items-start justify-between cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                updatePayMethod(payment.title);
              }}
            >
              <div>
                <Image
                  src={payment.image}
                  alt={payment.title}
                  width={200}
                  height={200}
                  className=" w-[30px]"
                />
              </div>
              <div className=" flex flex-col gap-1">
                <p className=" font-bold text-[14px]">{payment.title}</p>
                <p className=" text-[10px]">{payment.desc}</p>
              </div>
              <div
                className={` w-4 aspect-square ${
                  payment.title == selected ? "bg-green-700" : "bg-slate-300"
                } rounded-sm self-center flex items-center justify-center`}
              >
                {payment.title == selected && (
                  <GrFormCheckmark className=" text-[10px] text-white" />
                )}
              </div>
            </div>
          ))}
        </div>
        {/* div that shows the button to call for payment below here */}
        <div className=" w-full mt-5 ">
          {selected == undefined ? (
            <button
              className="w-full py-3 flex items-center justify-center bg-green-200 cursor-not-allowed rounded-sm text-gray-400"
              disabled={true}
            >
              {" "}
              Select payment method
            </button>
          ) : (
            <div>
              {selected === "Paystack" ? (
                <PayStackBtn
                  duration={duration}
                  amt={amt}
                  enroll={enroll}
                  planName={planName}
                  expireIn={expireIn}
                  plan={plan}
                />
              ) : (
                <FlutterWaveBtn
                  duration={duration}
                  amt={amt}
                  enroll={enroll}
                  planName={planName}
                  expireIn={expireIn}
                  plan={plan}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// component to make payment with paystack method
export const PayStackBtn: React.FC<{
  duration: string;
  amt: number;
  enroll: () => void;
  planName: string;
  expireIn: number;
  plan: string;
}> = ({ duration, amt, enroll, planName, expireIn, plan }) => {
  const { data } = useSession();
  const componentProps = {
    reference: new Date().getTime().toString(),
    email: data?.user.email as string,
    amount: amt * 100, //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
    publicKey: process.env.NEXT_PUBLIC_PAYSTACKPUBKEY!,
    text: "Pay with paystack",
    onSuccess: (reference: any) => {
      toast.success(`payment successful for ${duration} ${planName} plan`);
      enroll();
    },
    metadata: {
      custom_fields: [
        {
          display_name: data?.user.id as string, //students id
          variable_name: "", //class id
          value: `${amt}-teacherplan`, //for the price and class specified payment
        },
      ],
      plan: {
        duration,
        amt,
        userId: data?.user.id,
        expireIn,
        plan,
      },
    },
  };
  return (
    <PaystackButton
      {...componentProps}
      className="w-full py-3 flex items-center justify-center bg-green-600 cursor-pointer rounded-sm font-bold text-white"
    />
  );
};
// component to make payment with flutterwave method
export const FlutterWaveBtn: React.FC<{
  duration: string;
  amt: number;
  enroll: () => void;
  planName: string;
  expireIn: number;
  plan: string;
}> = ({ duration, amt, enroll, planName, expireIn, plan }) => {
  const { data } = useSession();
  const config = {
    public_key: process.env.NEXT_PUBLIC_FLUTTERPUBKEY!,
    tx_ref: Date.now().toString(),
    amount: amt,
    currency: "NGN",
    payment_options: "card",
    customer: {
      email: data?.user.email as string,
      phone_number: data?.user.id as string, //id of the student or user that want to make payment,
      name: `3333-teacherplan`, // field for id of the class and the payment type
    },
    customizations: {
      title: "school afrika",
      description: "payment for class enrollment",
      logo: "https://res.cloudinary.com/dfn0senip/image/upload/v1720127002/v5tp1e4dsjx5sidhxoud.png",
    },
    meta: {
      userId: data?.user.id,
      amt,
      duration,
      expireIn,
      plan,
    },
    //   onSuccess: () => {
    //     toast.success("payment successful, navigate to class in your dashboard");
    //     studentIDs?.push(data?.user.id!);
    //     setTimeout(() => {
    //       queryClient.invalidateQueries({
    //         queryKey: ["infiniteclass", "home-class"],
    //       });
    //       enroll();
    //     }, 5500);
    //   },
  };
  const fwConfig = {
    ...config,
    text: "Pay with flutterwave",
    callback: () => {
      closePaymentModal(); // this will close the modal programmatically
      toast.success(`payment successful for ${duration} ${planName} plan`);
      enroll();
    },
    onClose: () => {},
  };
  return (
    <div>
      <FlutterWaveButton
        className="w-full py-3 flex items-center justify-center bg-green-600 cursor-pointer rounded-sm font-bold text-white"
        {...fwConfig}
      />
    </div>
  );
};
