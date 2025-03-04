import { StudentSideBarType } from "./studentSidebar";
import {
  MdInsertChartOutlined,
  MdOutlineCalendarMonth,
  MdOutlineDisplaySettings,
} from "react-icons/md";
import { SiGoogleclassroom } from "react-icons/si";
import {
  LiaChalkboardTeacherSolid,
  LiaClipboardListSolid,
  LiaMoneyCheckAltSolid,
} from "react-icons/lia";
import { PiCirclesFour } from "react-icons/pi";

export const ParentSideBar: StudentSideBarType[] = [
  { path: "", name: "Overview", icon: MdInsertChartOutlined },
  { path: "sessions", name: "Sessions", icon: SiGoogleclassroom },
  { path: "teachers", name: "Teacher", icon: LiaChalkboardTeacherSolid },
  {
    path: "assessment",
    name: "Assessment",
    icon: LiaClipboardListSolid,
  },
  { path: "courses", name: "Courses", icon: PiCirclesFour },
  { path: "transactions", name: "Transactions", icon: LiaMoneyCheckAltSolid },
  {
    path: "parent-settings",
    name: "Settings",
    icon: MdOutlineDisplaySettings,
  },
];
