import { redirect } from "next/navigation";
import { accountAppUrl } from "@/lib/account-app";

export default function SignUp() {
	redirect(
		accountAppUrl("/register", {
			app: "cloudence",
			returnTo: "https://cloudence.chefu.co.za/",
		}),
	);
}
