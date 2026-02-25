import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AppHeader } from "@/components/AppHeader";
import { ClipboardList, ArrowRight } from "lucide-react";

const ActivitySelection = () => {
  const [activities, setActivities] = useState<{ id: string; name: string }[]>([]);
  const [selectedActivity, setSelectedActivity] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchActivities = async () => {
      const { data } = await supabase.from("activities").select("id, name").order("name");
      if (data) setActivities(data);
    };
    fetchActivities();
  }, []);

  const handleContinue = () => {
    if (selectedActivity) {
      navigate(`/matrix/${selectedActivity}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto max-w-2xl py-12 px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-hero mb-4">
            <ClipboardList className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Sélectionner une activité
          </h1>
          <p className="text-muted-foreground mt-1">
            Choisissez l'activité pour laquelle vous souhaitez remplir la matrice.
          </p>
        </div>

        <Card className="shadow-elevated">
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Activité</label>
              <Select value={selectedActivity} onValueChange={setSelectedActivity}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une activité..." />
                </SelectTrigger>
                <SelectContent>
                  {activities.map((activity) => (
                    <SelectItem key={activity.id} value={activity.id}>
                      {activity.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleContinue}
              disabled={!selectedActivity}
              className="w-full"
            >
              Continuer vers la matrice
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ActivitySelection;
