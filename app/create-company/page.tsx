"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Wrapper from "@/components/Wrapper";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

export interface Company {
  id: string;
  name: string;
}

const page = () => {
  const { user } = useKindeBrowserClient();
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState<Company[] | null>(null);
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);
  const [createdCompanies, setCreatedCompanies] = useState<Company[]>([]);
  const [employedCompanies, setEmployedCompanies] = useState<Company[]>([]);

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
      fetchCompanies();
      setCompanyName("");
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCompanies = async () => {
    try {
      if (user?.email) {
        const response = await fetch(`/api/companies?email=${user.email}`);

        if (!response.ok) {
          const { message } = await response.json();
          toast.info(message);
          return;
        }

        const data = await response.json();
        setCreatedCompanies(data.createdCompanies || []);
        setEmployedCompanies(data.employedCompanies || []);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors du chargement des entreprises.");
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [user]);

  const handleDelete = async (companyId: string) => {
    try {
      const response = await fetch("/api/companies", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: companyId,
        }),
      });

      if (!response.ok) {
        const { message } = await response.json();
        toast.info(message);
        return;
      }

      toast.error("Entreprise supprimée avec succès !");
      fetchCompanies();
    } catch (error) {
      console.error(error);
      toast.info("Erreur interne du serveur.");
    }
  };

  return (
    <Wrapper>
      <Dialog
        open={companyToDelete !== null}
        onOpenChange={() => setCompanyToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Voulez-vous vraiment supprimer l’entreprise
              <strong>{companyToDelete?.name}</strong> ? Cette action est
              irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompanyToDelete(null)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (!companyToDelete) return;
                await handleDelete(companyToDelete.id);
                setCompanyToDelete(null);
              }}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-10">
        {/* Création entreprise */}
        <form
          onSubmit={handleSubmit}
          className="border border-gray-200 rounded-xl p-6 shadow-sm bg-white"
        >
          <h2 className="text-2xl font-semibold mb-4">Créer une entreprise</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Nom de l'entreprise"
              className="flex-1"
              required
            />
            <Button type="submit" className="w-full md:w-auto">
              Créer l'entreprise
            </Button>
          </div>
        </form>

        <div className="grid grid-col s-2 gap-6">
          {/* Liste des entreprises créées */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">
              Mes entreprises créées
            </h2>
            {createdCompanies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {createdCompanies.map((company) => (
                  <div
                    key={company.id}
                    className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm flex flex-col justify-between"
                  >
                    <h3 className="text-lg font-semibold mb-4">
                      {company.name}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <Link href={`employees/${company.id}`}>
                        <Button variant="outline" size="sm">
                          Ajouter des employés
                        </Button>
                      </Link>
                      <Link href={`rooms/${company.id}`}>
                        <Button variant="outline" size="sm">
                          Ajouter des salles
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setCompanyToDelete(company)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Aucune entreprise créée.</p>
            )}
          </section>

          {/* Liste des entreprises employé */}
          <section className="flex flex-col">
            <h2 className="text-2xl font-semibold mb-6">
              Entreprises où je suis employé
            </h2>
            {employedCompanies.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {employedCompanies.map((company) => (
                  <div
                    key={company.id}
                    className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm flex justify-between items-start"
                  >
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        {company.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`rooms/${company.id}`}>
                        <Button variant="outline" size="sm">
                          Voir les salles
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                Vous n'êtes employé dans aucune entreprise.
              </p>
            )}
          </section>
        </div>
      </div>
    </Wrapper>
  );
};

export default page;
