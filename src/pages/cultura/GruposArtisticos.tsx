
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

const GruposArtisticos = () => {
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Users className="h-8 w-8 text-blue-600" />
              Grupos Artísticos
            </h1>
            <p className="text-muted-foreground">
              Gerencie os grupos artísticos do município
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Grupos Artísticos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Módulo em Desenvolvimento
              </h3>
              <p className="text-gray-500">
                O módulo de grupos artísticos estará disponível em breve.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default GruposArtisticos;
