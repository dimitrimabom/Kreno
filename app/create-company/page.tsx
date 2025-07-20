"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Wrapper from "@/components/Wrapper";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export interface Company {
  id: string;
  name: string;
}

const page = () => {
  const { user } = useKindeBrowserClient();
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState<Company[] | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName) {
      toast.info("Le nom de l entreprise est requis");
      return;
    }

    try {
      const response = await fetch("/api/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user?.email,
          companyName: companyName,
        }),
      });

      if (!response.ok) {
        const { message } = await response.json();
        toast.info(message);
        return;
      }

      toast.success("Entreprise créée avec succès !");
      setCompanyName("");
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCompanies = async () => {
    try {
      if (user?.email) {
        const response = await fetch(`/api/companies?email=${user.email}`, {
          method: "GET",
        });

        if (!response.ok) {
          const { message } = await response.json();
          throw new Error(message);
        }

        const data = await response.json();
        setCompanies(data.companies);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [user]);

  return (
    <Wrapper>
      <div>
        <h1 className="text-2xl mb-4">Créer une entreprise</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex flex-row">
            <Input
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Nom de l'entreprise"
              required
              className="maw-w-xs"
            />
            <Button type="submit" className="ml-2">
              Créer l'entreprise
            </Button>
          </div>
        </form>
        <h1 className=" text-2xl  mb-4 font*boald">Mes entreprises</h1>

        {loading ? (
          <div className="text-center mt-32">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : companies && companies.length > 0 ? (
          <ul className="list-decimal divide-base-200 divide-y">
            {companies.map((company) => (
              <li
                key={company.id}
                className="py-4 flex flex-col md:flex-row md:items-center justify-between"
              >
                <h1 className="text-xl md:2xl font-semibold mb-4">
                  {company.name}
                </h1>
                <div className="flex items-center">
                  <Link href={`employees/${company.id}`} className="mr-2">
                    <Button variant="outline">Ajouter des employés</Button>
                  </Link>
                  <Link href={`rooms/${company.id}`} className="mr-2">
                    <Button variant="outline">Ajouter des salles</Button>
                  </Link>
                  <Button
                    variant="destructive"
                    // onClick={() => handleDelete(company.id)}
                  >
                    <Trash2 className="w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="mb-4">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune entreprise trouvée
              </h3>
              <p className="text-gray-500 mb-6">
                Commencez par créer votre première entreprise pour organiser vos
                espaces de travail.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600 mb-2">
                  💡 <strong>Conseil :</strong> Utilisez le formulaire ci-dessus
                  pour créer votre première entreprise.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default page;
