import { ISessionStudentSub } from "./StudentBookDetails";
import Image from "next/image";
import { MdVerified } from "react-icons/md";
import { paymentMethods } from "@/constants/pricing/school";
import { useConversion } from "@/data-access/conversion";

const PaymentByStudentSession: React.FC<ISessionStudentSub> = ({
  method,
  setmethod,
  getValues,
  tutorImg,
  tutorLang,
  tutorName,
}) => {
  // custom hook below
  const { totalSessionPayment } = useConversion();
  return (
    <div className=" w-full ">
      <div className="">
        <div className="flex justify-between">
          <h3 className="text-xl ml-3 font-bold">Book Session</h3>
        </div>

        <div className="flex   mt-6 mb-8 flex-col gap-3">
          <p className="text-lightGreen  text-[15px] ml-3 font-semibold">
            Payment
          </p>
          <p className="text-[14px]  ml-3 font-semibold">
            Select a payment method.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
          <div className="gap-4 md:mb-0 w-full flex flex-col">
            {paymentMethods.map((item, index) => (
              <div
                onClick={() => setmethod && setmethod(item.title)}
                key={index}
                className="border cursor-pointer md:ml-3 px-4 bg-white justify-between md:pl-4 md:pr-6 flex py-3  rounded-md "
              >
                <div className="flex space-x-6">
                  <Image
                    src={item.image}
                    alt="paystack"
                    width={100}
                    height={100}
                    className="w-[35px] h-[35px]"
                  />
                  <div className="flex space-y-1 flex-col">
                    <p className="text-[13px] font-semibold">{item.title}</p>
                    <p className="text-[11px]">{item.desc}</p>
                  </div>
                </div>

                <input
                  checked={method === item.title}
                  className="w-4 ml-4 accent-lightGreen"
                  type="checkbox"
                />
              </div>
            ))}
          </div>
          <div className="bg-white rounded-md ml-3 mb-2 pt-3 pb-6 px-6">
            <h3 className="font-semibold pb-3 text-[14px]">Summary</h3>
            <div className="flex text-[12.5px] justify-between">
              <div className="flex flex-col space-y-4">
                <p>1 on 1 Session type: {getValues("sessionTypes")}</p>
                {getValues("sessionTypes") === "Private Session" && (
                  <p>Duration: {getValues("hours")}hour/per session</p>
                )}
                <div className=" flex items-center gap-1">
                  <p>Subjects:</p>
                  {getValues("subject").map((items, index) => (
                    <p key={index}>{items}</p>
                  ))}
                </div>
                <p>Tutor&apos;s Language: {tutorLang}</p>
              </div>
              <p className="text-lightGreen text-[13px] font-semibold">
                {totalSessionPayment(
                  getValues("days"),
                  getValues("length"),
                  getValues("hours"),
                  getValues("sessionTypes")
                ).toFixed(2)}
              </p>
            </div>

            <div className="flex py-3 space-x-3 items-center">
              <Image
                src={tutorImg!}
                alt=""
                width={100}
                height={100}
                className="w-[40px] h-[40px] rounded-md"
              />
              <h3 className="inline  font-bold text-[12px]">
                {tutorName!}{" "}
                <MdVerified className="inline text-lightGreen text-[15px]  md:mr-8" />{" "}
              </h3>
            </div>
            <hr className="text-slate-600" />
            <div className="flex justify-between mt-3 font-semibold">
              <p className="text-[17px] font-bold">Total</p>
              <p className="text-[15px] text-lightGreen">
                &#8358;
                {totalSessionPayment(
                  getValues("days"),
                  getValues("length"),
                  getValues("hours"),
                  getValues("sessionTypes")
                ).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentByStudentSession;
