"use client";

import { Skeleton } from "@/components/ui/skeleton";
import Wrapper from "@/components/Wrapper";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useEffect, useState } from "react";

const page = () => {
  const { user } = useKindeBrowserClient();
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fethCompanyId = async () => {
    if (user) {
      try {
        const response = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
            famillyName: user.family_name,
            givenName: user.given_name,
          }),
        });

        const data = await response.json();
        setCompanyId(data.companyId || null);
        setLoading(false);
      } catch (error) {
        console.error("erreur", error);
        setCompanyId(null);
      }
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      await fethCompanyId();
    };

    initializeData();
  }, [user]);

  if (loading) {
    return (
      <Wrapper>
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div>
        <div>
          CompanyName
          {companyId}
        </div>
      </div>
    </Wrapper>
  );
};

export default page;
