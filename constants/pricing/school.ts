export interface eachPrice {
  planName: string;
  amt: number;
  details: string[];
  key?: number;
}

export const monthlyPlans: eachPrice[] = [
  {
    planName: "Basic Bundle",
    amt: 0,
    details: [
      "1 teacher (exclusive owner)",
      "two classes",
      "15 students",
      "Email support",
    ],
  },
  {
    planName: "Bronze Bundle",
    amt: 10,
    details: ["2-5 teachers", "5 classes", "30 students", "Email support"],
  },
  {
    planName: "Silver Bundle",
    amt: 15,
    details: ["6-10 teachers", "20 classes", "50 students", "Email support"],
  },
  {
    planName: "Gold Bundle",
    amt: 25,
    details: ["11-20 teachers", "50 classes", "100 students", "Email support"],
  },
  {
    planName: "Diamond Bundle",
    amt: 35,
    details: [
      "21-100 teachers",
      "unlimited classes",
      "unlimited students",
      "Email support",
    ],
  },
];

// exporting an array that contains the payment methods for the class part
interface Ipay {
  desc: string;
  image: string;
  title: string;
}
export const paymentMethods: Ipay[] = [
  {
    title: "Paystack",
    desc: "Effortlessly pay with paystack, simplify your online transaction",
    image: "/paystack.png",
  },
  {
    title: "Flutter Wave",
    desc: "Effortlessly pay with flutterwave, simplify your online transaction",
    image: "/flutterwave.png",
  },
];
