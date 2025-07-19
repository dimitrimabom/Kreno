"use client";
import { Button } from "@/components/ui/button";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

const page = () => {
  const { user } = useKindeBrowserClient();

  return (
    <div>
      Dashboard
      <div>{user?.email}</div>
      <LogoutLink>
        <Button>Se Deconnecter</Button>
      </LogoutLink>
    </div>
  );
};

export default page;
