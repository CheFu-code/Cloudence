import { redirect } from "next/navigation";
import { accountAppUrl } from "@/lib/account-app";

export default function SignIn() {
	redirect(
		accountAppUrl("/login", {
			app: "cloudence",
			returnTo: "https://cloudence.chefu.co.za/dashboard",
		}),
	);
}
