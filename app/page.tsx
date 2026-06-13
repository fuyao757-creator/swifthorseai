import { redirect } from "next/navigation";
import { defaultLocale } from "@/lib/i18n";

/** 根路径进入默认语言首页 */
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
