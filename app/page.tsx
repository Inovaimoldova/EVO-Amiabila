'use client';

import { useState } from "react";
import Image from "next/image";
import AccidentReportForm from "@/components/accident-report-form"

export default function Home() {
  const [showForm, setShowForm] = useState(false);

  return (
    <main className="relative min-h-screen bg-gray-50 py-4 px-3 sm:py-8 sm:px-6 flex items-center justify-center">
      {!showForm ? (
        <div onClick={() => setShowForm(true)} className="cursor-pointer">
          <Image
            src="/evo-menu.png"
            alt="EVO Menu"
            width={500}
            height={500}
            priority
          />
        </div>
      ) : (
        <>
          <div
            className="absolute top-[-5rem] right-[-5rem] w-96 h-96 bg-[url('/evo-pattern.png')] bg-no-repeat bg-cover bg-right-top opacity-30 z-0"
            aria-hidden="true"
          />
          <div className="max-w-sm mx-auto relative z-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-8 text-center">
              Constatare Amiabilă de Accident
            </h1>
            <AccidentReportForm />
          </div>
        </>
      )}
    </main>
  )
}
