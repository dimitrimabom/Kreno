"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Wrapper from "@/components/Wrapper";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { SquareArrowOutUpRight, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const page = () => {
  const { user } = useKindeBrowserClient();

  const [companies, setCompanies] = useState<any[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      if (user?.email) {
        try {
          const res = await fetch(`/api/company?email=${user.email}`);
          const data = await res.json();

          if (!res.ok) {
            toast.error(data.message || "Erreur lors de la récupération.");
            return;
          }

          setCompanies(data.company);
          // Si tu veux auto-sélectionner la première entreprise :
          if (data.company.length > 0) {
            setSelectedCompanyId(data.company[0].id);
          }
        } catch (error) {
          console.error(error);
          toast.error("Une erreur est survenue.");
        }
      }
    };

    fetchCompanies();
  }, [user?.email]);

  useEffect(() => {
    const fetchRooms = async () => {
      if (!selectedCompanyId) return;

      try {
        const res = await fetch("/api/rooms");
        if (!res.ok) throw new Error("Erreur lors du chargement des salles");

        const data = await res.json();
        setRooms(data.rooms);
        console.log(data.rooms);
      } catch (err) {
        console.error(err);
        toast.error("Impossible de charger les salles.");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [selectedCompanyId]);

  console.log(rooms);
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
      {companies.map((company) => {
        // On filtre les salles qui appartiennent à cette entreprise
        const companyRooms = rooms.filter(
          (room) => room.companyId === company.id
        );

        return (
          <div key={company.id} className="mb-12">
            {/* Nom de l'entreprise */}
            {company.name && (
              <h1 className="text-4xl font-extrabold mb-6 text-gray-900">
                {company.name}
              </h1>
            )}

            <h2 className="text-3xl font-semibold mb-6 text-gray-800">
              Réserver une salle
            </h2>

            {loading ? (
              <div className="flex flex-col space-y-5">
                <Skeleton className="h-32 w-full max-w-sm rounded-3xl shadow-md" />
                <div className="space-y-3 max-w-sm">
                  <Skeleton className="h-5 w-full rounded" />
                  <Skeleton className="h-5 w-4/5 rounded" />
                </div>
              </div>
            ) : companyRooms.length === 0 ? (
              <p className="text-gray-500 text-lg italic">
                Aucune salle disponible pour{" "}
                <span className="font-semibold">{company.name}</span>.
              </p>
            ) : (
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {companyRooms.map((room) => (
                  <li
                    key={room.id}
                    className="flex flex-col bg-white border border-gray-200 rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    <Image
                      src={room.imgUrl || "/placeholder.jpg"}
                      alt={room.name}
                      width={400}
                      height={400}
                      quality={100}
                      className="w-full h-56 object-cover rounded-t-3xl"
                    />
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center mb-4">
                        <Badge className="flex items-center gap-2 bg-indigo-100 text-indigo-800 font-medium px-3 py-1 rounded-full">
                          <Users className="w-5 h-5" />
                          {room.capacity}
                        </Badge>
                        <h3 className="ml-4 text-2xl font-semibold text-gray-900">
                          {room.name}
                        </h3>
                      </div>
                      <p className="text-gray-600 flex-grow leading-relaxed">
                        {room.description?.length > 120
                          ? `${room.description.slice(0, 120)}...`
                          : room.description}
                      </p>
                      <div className="mt-6">
                        <Link
                          href={`/reservations/${room.id}`}
                          className="inline-block w-full"
                        >
                          <Button
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2"
                          >
                            <SquareArrowOutUpRight className="w-5 h-5" />
                            Réserver
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </Wrapper>
  );
};

export default page;
