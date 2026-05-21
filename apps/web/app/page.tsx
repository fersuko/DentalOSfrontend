import { redirect } from "next/navigation";

// Redirect root to dashboard (will bounce to login if not authenticated)
export default function HomePage() {
  redirect("/dashboard");
}
