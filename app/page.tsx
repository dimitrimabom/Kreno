import { Step } from "@/components/Step";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  RegisterLink,
  LoginLink,
} from "@kinde-oss/kinde-auth-nextjs/components";

const steps = [
  { label: "Créer un compte" },
  { label: "Réservez votre salle" },
  { label: "Gérez vos réservations" },
];

export default function Home() {
  return (
    <div className="relative h-full w-full">
      <section
        className="w-full bg-background"
        style={{
          backgroundColor: "#ffffff",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%233975e2' fill-opacity='0.37'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        <div className="relative text-center lg:mx-[15%]v py-20 flex flex-col items-center justify-center">
          <div className="max-w-lg">
            <h1 className="text-3xl md:text-6xl pb-4 flex flex-row items-center justify-center">
              <div className="flex items-center justify-center">
                <Image
                  src="/icon.png"
                  width={500}
                  height={500}
                  alt="Kreno logo"
                  className="w-8 h-8 md:w-16 md:h-16"
                />
              </div>
              <span className="">Kreno</span>
            </h1>
            <h2 className="py-4 md:py-8 text-xl md:text-4xl font-semibold">
              Gerer la reservation de vos{" "}
              <span className="text-primary">salles de reunion</span>{" "}
              simplement.
            </h2>
            <Step steps={steps} orientation="horizontal" />

            <div className="flex gap-4 my-6 items-center justify-center">
              <LoginLink>
                <Button>Se Connecter</Button>
              </LoginLink>
              <RegisterLink>
                <Button variant={"outline"}>S'inscrire</Button>
              </RegisterLink>
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-center items-center">
        <div className="p-5">
          <div className="relative rounded-xl bg-gray-900/5 p-2 ring-1 ring-gray-900/10 lg:rounded-2xl lg:p-4 w-full md:w-[1200px] md:h-[990px]">
            <Image
              src="/img.png"
              alt="Aperçu de l'app"
              width={1600}
              height={500}
              quality={100}
              className=" rounded-md shadow-2xl ring-1 ring-gray-900/10 object-cover filter contra  saturate-100 w-full h-full"
            />
          </div>
        </div>
      </div>

      <footer className="text-center items-center bg-base-200 text-base-conte  mt-20 py-5 px-10">
        <h1>Kreno &copy; 2025 - Tous droits réservés</h1>
      </footer>
    </div>
  );
}
