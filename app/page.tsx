import AccidentReportForm from "@/components/accident-report-form"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-4 px-3 sm:py-8 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-8 text-center">
          Constatare Amiabilă de Accident
        </h1>
        <AccidentReportForm />
      </div>
    </main>
  )
}
