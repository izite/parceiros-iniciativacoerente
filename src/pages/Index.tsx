import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentContracts } from "@/components/dashboard/recent-contracts";
import { Zap } from "lucide-react";

const Index = () => {
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  const dateString = today.toLocaleDateString('pt-PT', options);
  const formattedDate = `Hoje é ${dateString}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Simulador</h1>
          <p className="text-muted-foreground">
            {formattedDate}
          </p>
        </div>
      </div>

      <div className="text-center py-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/20 rounded-full mb-6">
          <Zap className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          <span className="text-orange-700 dark:text-orange-300 font-medium">CONTACTOS</span>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <StatsCards />
        </div>
      </div>

      <RecentContracts />
    </div>
  );
};

export default Index;
