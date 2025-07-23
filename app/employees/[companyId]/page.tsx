"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Wrapper from "@/components/Wrapper";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useParams } from "next/navigation.js";
import React, { use, useEffect, useState } from "react";
import { toast } from "sonner";

interface Employee {
  id: string;
  email: string;
  givenName: string | null;
  famillyName: string | null;
}

const page = () => {
  const params = useParams();

  const { user } = useKindeBrowserClient();
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/companies", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: params.companyId,
          creatorEmail: user?.email,
          employeeEmail: employeeEmail,
          action: "ADD",
        }),
      });
      const data = await response.json();

      if (response.ok) {
        toast.info("Employé ajouté avec succès !");
        fetchEmployees();
      } else {
        toast.info(`${data.message}`);
      }

      setEmployeeEmail("");
    } catch (error) {
      console.error(error);
      toast.info("Erreur interne du serveur");
    }
  };

  const handleRemoveEmployee = async (employeeEmail: string) => {
    try {
      const response = await fetch("/api/companies", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: params.companyId,
          creatorEmail: user?.email,
          employeeEmail: employeeEmail,
          action: "DELETE",
        }),
      });
      const data = await response.json();

      if (response.ok) {
        toast.info("Employé supprimé avec succès !");
        fetchEmployees();
      } else {
        toast.info(`${data.message}`);
      }

      setEmployeeEmail("");
    } catch (error) {
      console.error(error);
      toast.info("Erreur interne du serveur");
    }
  };

  useEffect(() => {
    if (!params?.companyId) return;
    fetchEmployees();
  }, [params?.companyId]);

  const fetchEmployees = async () => {
    if (!params.companyId) return;
    try {
      const response = await fetch(
        `/api/employees?companyId=${params.companyId}`
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      const data = await response.json();
      setEmployees(data.employees);
      setCompanyName(data.companyName);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Wrapper>
      {loading ? (
        <div className="container mx-auto p-4">
          {/* Header skeleton */}
          <Skeleton className="h-9 w-24 mb-6" />

          {/* Add employee form skeleton - using basic form instead of Card */}
          <div className="mb-8 border rounded-lg p-4 shadow-sm">
            <div className="mb-4">
              <Skeleton className="h-6 w-48" />
            </div>
            <div className="flex gap-4">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-36" />
            </div>
          </div>

          {/* Employee list title skeleton */}
          <Skeleton className="h-8 w-40 mb-4" />

          {/* Employee list skeleton */}
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b pb-4"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="w-3 h-3 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <Skeleton className="h-9 w-16" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-3xl font-bold mb-4">{companyName}</h1>

          <form
            onSubmit={handleAddEmployee}
            className="mb-8 border rounded-lg p-4 shadow-sm"
          >
            <h1 className="text-2xl mb-4">Ajouter un Nouvel Employé</h1>
            <div className="mb-4 flex flex-row">
              <Input
                type="email"
                placeholder="Email de l'employé"
                id="employeeEmail"
                value={employeeEmail}
                onChange={(e) => setEmployeeEmail(e.target.value)}
                required
              />
              <Button type="submit" className="ml-2">
                Ajouter l'employé
              </Button>
            </div>
          </form>

          <h1 className="text-2xl mb-4">Liste des Employés</h1>
          <div className="mt-4">
            {employees.length > 0 ? (
              <ol className="divide-base-200 divide-y">
                {employees.map((employee) => {
                  const hasFullname =
                    employee.givenName && employee.famillyName;
                  return (
                    <li
                      key={employee.id}
                      className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between"
                    >
                      <div className="flex items-center md:mb-0">
                        <span
                          className={`relative flex size-3 mr-2 rounded-full ${
                            hasFullname ? "bg-green-500" : "bg-red-500"
                          }`}
                        >
                          <span
                            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75  ${
                              hasFullname ? "bg-green-500" : "bg-red-500"
                            }`}
                          ></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 "></span>
                        </span>

                        <div>
                          <span className="font-bold ml-2">
                            {employee.email}
                          </span>
                          <div className="md:mb-0 italic mt-1 text-accent-400 ml-2">
                            {hasFullname
                              ? `${employee.givenName} ${employee.famillyName}`
                              : "Pas encore inscrit"}
                          </div>
                          <Button
                            className="mt-2 md:mt-0 flex md:hidden"
                            variant={"outline"}
                            onClick={() => handleRemoveEmployee(employee.email)}
                          >
                            Enlever
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Button
                          className="mt-2 md:mt-0  hidden md:flex"
                          variant={"outline"}
                          onClick={() => handleRemoveEmployee(employee.email)}
                        >
                          Enlever
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center bg-accent-50 rounded-lg border border-dashed border-accent-200">
                <span
                  className="text-5xl mb-4"
                  role="img"
                  aria-label="No employees"
                >
                  👥
                </span>
                <p className="text-lg font-semibold mb-2">
                  Aucun employé trouvé
                </p>
                <p className="text-accent-500 mb-4">
                  Ajoutez votre premier employé pour commencer à collaborer !
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </Wrapper>
  );
};

export default page;
