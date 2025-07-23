"use client";
import Wrapper from "@/components/Wrapper";
import React, { useEffect, useRef, useState } from "react";
import { FileInput, Trash2, TriangleAlert, Users } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation.js";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FileUpload from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEdgeStore } from "@/lib/edgestore";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const page = () => {
  const params = useParams();
  const { edgestore } = useEdgeStore();

  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [description, setDescription] = useState("");
  const [progress, setProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState<any[]>([]);
  const [companyName, setCompanyName] = useState("");
  const [roomToDelete, setRoomToDelete] = useState<any>(null);

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!name || !capacity || !description) {
      toast.info("Tous les champs sont obligatoires");
      return;
    }
    try {
      const apiResponse = await fetch("/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "SAVE_DATA",
          name,
          capacity,
          description,
          companyId: params.companyId,
          imageUrl: "",
        }),
      });

      if (apiResponse.ok) {
        const room = await apiResponse.json();
        let imageUploadSuccess = false;
        if (file) {
          const res = await edgestore.publicFiles.upload({
            file,
            onProgressChange: (progress) => {
              setProgress(progress);
            },
          });

          console.log("File uploaded to EdgeStore:", res);

          const imageResponse = await fetch("/api/rooms", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              action: "SAVE_IMAGE",
              roomId: room.roomId,
              imageUrl: res.url,
            }),
          });

          if (imageResponse.ok) {
            imageUploadSuccess = true;
          }
        }

        if (imageUploadSuccess) {
          toast.info("Salle créée avec succès et image téléchargée !");
        } else if (file) {
          toast.info(
            "Salle créée avec succès, mais erreur lors du téléchargement de l'image."
          );
        }

        fetchRooms();
        setName("");
        setCapacity("");
        setDescription("");
        setFile(null);
        setProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        const result = await apiResponse.json();
        toast.info(`${result.message}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await fetch(`/api/rooms?companyId=${params.companyId}`);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des salles.");
      }
      const data = await response.json();
      setRooms(data.rooms);
      setCompanyName(data.companyName);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [params.companyId]);

  const handleDelete = async (roomId: string, imageUrl: string) => {
    try {
      if (imageUrl !== "/placeholder.jpg") {
        await edgestore.publicFiles.delete({
          url: imageUrl,
        });
      }

      const response = await fetch("/api/rooms", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId,
        }),
      });

      if (response.ok) {
        toast.info("Salle supprimées avec succès !");
        fetchRooms();
      } else {
        const errorData = await response.json();
        toast.info(
          `Erreur lors de la suppression de la salle: ${errorData.message}`
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Wrapper>
      <Dialog
        open={roomToDelete !== null}
        onOpenChange={() => setRoomToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Voulez-vous vraiment supprimerla salle
              <strong>{roomToDelete?.name}</strong> ? Cette action est
              irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoomToDelete(null)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (!roomToDelete) return;
                await handleDelete(roomToDelete.id, roomToDelete.imgUrl);
                setRoomToDelete(null);
              }}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {loading ? (
        <div className="container mx-auto p-6">
          {/* Header skeleton */}
          <Skeleton className="h-9 w-24 mb-8" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Liste des salles - Left side */}
            <div>
              <Skeleton className="h-8 w-32 mb-6" />

              <div className="space-y-6">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-sm border overflow-hidden"
                  >
                    <div className="flex">
                      {/* Image skeleton */}
                      <Skeleton className="w-64 h-32 flex-shrink-0" />

                      {/* Content skeleton */}
                      <div className="flex-1 p-4 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Skeleton className="h-6 w-8 rounded" />
                            <Skeleton className="h-6 w-40" />
                          </div>
                          <Skeleton className="h-4 w-48" />
                        </div>
                        <div className="flex justify-end mt-3">
                          <Skeleton className="h-8 w-8 rounded" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Créer une Salle - Right side */}
            <div>
              <Skeleton className="h-8 w-36 mb-6" />

              <div className="space-y-6">
                {/* Nom de la salle */}
                <Skeleton className="h-12 w-full" />

                {/* Capacité de la salle */}
                <Skeleton className="h-12 w-full" />

                {/* Description de la salle */}
                <Skeleton className="h-24 w-full" />

                {/* Image de la Salle */}
                <div>
                  <Skeleton className="h-4 w-32 mb-3" />
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                    <Skeleton className="h-12 w-12 mx-auto" />
                  </div>
                </div>

                {/* Créer une salle button */}
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-3xl font-bold mb-4">{companyName}</h1>

          <div className="flex flex-col-reverse md:flex-row">
            <section className="w-full">
              <h1 className="text-2xl mb-4">Liste des salles</h1>
              <ul>
                {rooms.length > 0 ? (
                  rooms.map((room) => (
                    <li
                      key={room.id}
                      className="flex flex-col md:flex-row md:items-center mb-5 border-base-300 border p-5 rounded-2xl w-full min-h-60"
                    >
                      <Image
                        src={room.imgUrl || "/placeholder.jpg"}
                        alt={room.name}
                        width={400}
                        height={400}
                        quality={100}
                        className="shadow-sm w-full min-h-60 max-h-60 mb-4 md:mb-0 md:w-1/3 md:max-h-42 md:min-h-42 object-cover rounded-lg ml-4"
                      />
                      <div className="md:ml-4 md:w-2/3">
                        <div className="flex items-center">
                          <Badge className="badge badge-secondary">
                            <Users className="mr-2 w-4" />
                            {room.capacity}
                          </Badge>
                          <h1 className="font-bold text-xl ml-2">
                            {room.name}
                          </h1>
                        </div>

                        <p className="text-sm my-2 text-gray-500">
                          {room.description}
                        </p>
                        <Button
                          onClick={() => setRoomToDelete(room)}
                          variant={"destructive"}
                        >
                          <Trash2 className="w-4" />
                        </Button>
                      </div>
                    </li>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 bg-secondary/10 rounded-xl border border-dashed border-base-300 my-8">
                    <TriangleAlert />
                    <p className="text-lg font-medium text-gray-600 mb-2">
                      Aucune salle de réunion trouvée pour cette entreprise.
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      Ajoutez votre première salle pour commencer à organiser
                      des réunions !
                    </p>
                  </div>
                )}
              </ul>
            </section>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="mt-2 w-fit mb-2 md:hidden flex">
                  Ajouter une salle
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle asChild>
                    <h1 className="text-4xl mb-4">Créer une Salle</h1>
                  </AlertDialogTitle>
                  <AlertDialogDescription asChild>
                    <section className="w-full">
                      <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nom de la salle"
                        className="w-full mb-4"
                      />

                      <Input
                        type="number"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                        placeholder="Capacité de la salle"
                        className="w-full mb-4"
                      />

                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description de la salle"
                        className="w-full mb-4"
                      ></Textarea>

                      <div>
                        <div className="p-5 rounded-lg bg-secondary/5 border border-base-300">
                          {/* file upload */}
                          <FileUpload
                            onFilechange={handleFileChange}
                            buttonLabel="Image de la Salle"
                          />
                          {file && (
                            <span className="border border-base-300 p-3 mt-4 rounded-lg">
                              <span className="text-sm">{file.name}</span>
                              {progress > 0 && <Progress value={progress} />}
                              <span className="text-sm">{progress}%</span>
                            </span>
                          )}
                        </div>
                      </div>
                      <Button className="w-full mt-4" onClick={handleUpload}>
                        Créer une salle
                      </Button>
                    </section>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <section className="w-[450px] ml-8 hidden md:block border rounded-lg p-4 shadow-sm h-fit">
              <h1 className="text-2xl mb-4">Créer une Salle</h1>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nom de la salle"
                className="w-full mb-4"
              />

              <Input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="Capacité de la salle"
                className="w-full mb-4"
              />

              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description de la salle"
                className="w-full mb-4"
              ></Textarea>

              <div>
                <div className="p-5 rounded-lg bg-secondary/5 border border-base-300">
                  {/* file upload */}
                  <FileUpload
                    onFilechange={handleFileChange}
                    buttonLabel="Image de la Salle"
                  />
                  {file && (
                    <span className="border border-base-300 p-3 mt-4 rounded-lg">
                      <span className="text-sm">{file.name}</span>
                      {progress > 0 && <Progress value={progress} />}
                      <span className="text-sm">{progress}%</span>
                    </span>
                  )}
                </div>
              </div>
              <Button className="w-full mt-4" onClick={handleUpload}>
                Créer une salle
              </Button>
            </section>
          </div>
        </div>
      )}
    </Wrapper>
  );
};

export default page;
