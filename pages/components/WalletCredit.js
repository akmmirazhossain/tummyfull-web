import Link from "next/link";
import { Button } from "@nextui-org/react";
import { useUser } from "../contexts/UserContext";

export default function WalletCredit() {
  const { user, loading, error, isLoggedIn, refreshUser } = useUser();
  return (
    <div
      className={
        user?.data?.mrd_user_due > 0 ? "[color:#FF7A00]" : "text-green-600"
      }
    >
      {loading
        ? "..."
        : user?.data?.mrd_user_due > 0
        ? `৳-${user.data.mrd_user_due}`
        : `৳${user?.data?.mrd_user_credit ?? 0}`}
    </div>
  );
}
