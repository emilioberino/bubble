import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Upload } from "lucide-react";
import Link from "next/link";
import RenaissanceBackground from "@/components/RenaissanceBackground";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center font-serif">
      <RenaissanceBackground />
      <main className="flex flex-col items-start justify-center gap-6 p-8 relative z-10 max-w-2xl">
        <div className="title-container">
          <h1 className="text-5xl font-semibold tracking-tight text-stone-800 dark:text-stone-100 mb-3">
            Bubble Filter Simulator
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-400 leading-relaxed">
            Simulate the behavior of bubble filters in a Social Network
          </p>
        </div>
        <div className="buttons-container flex flex-col gap-3 w-full sm:w-auto">
          <Link href="/loader" className="w-full">
            <Button className="w-full sm:w-auto">Start Simulation</Button>
          </Link>
          <Button variant={"outline"} className="w-full sm:w-auto">
            Load Preset <Upload className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  );
}
