"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function RestorePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">Gegevens herstellen</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-muted-foreground mb-6">
            Deze functie wordt binnenkort beschikbaar.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="text-primary hover:underline"
          >
            Naar inloggen
          </button>
        </motion.div>
      </div>
    </div>
  );
}
