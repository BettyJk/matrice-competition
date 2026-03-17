/**
 * User Dashboard Page
 * 
 * Displays personal competency statistics and analytics:
 * - Total competencies tracked
 * - Completed vs In-Progress items
 * - Visual charts showing competency distribution by priority
 * - Recent activity data
 * 
 * Data is fetched from Supabase in real-time on component mount.
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AppHeader } from "@/components/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ClipboardCheck, Clock, CheckCircle, RefreshCw } from "lucide-react";
import { ImportMatrixDialog } from "@/components/ImportMatrixDialog";


const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [reloading, setReloading] = useState(false);

  const loadData = async () => {
    if (!user) return;
    const [{ data: e }, { data: a }] = await Promise.all([
      supabase.from("matrix_entries").select("*").eq("user_id", user.id),
      supabase.from("activities").select("*"),
    ]);
    setEntries(e || []);
    setActivities(a || []);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleReload = async () => {
    setReloading(true);
    await loadData();
    setReloading(false);
  };

  const getActivityName = (id: string) => activities.find((a) => a.id === id)?.name || id;

  const prioriteMap: Record<string, number> = { "Haute": 3, "Moyenne": 2, "Basse": 1 };
  const competencePrioriteData = entries.map((e) => ({
    competence: e.competence_cle,
    priorite: prioriteMap[e.priorite] || 0,
  }));

  const totalEntries = entries.length;
  const completedEntries = entries.filter((e) => e.etat === "Terminé").length;
  const inProgressEntries = entries.filter((e) => e.etat === "En cours").length;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-display font-bold text-foreground">Mon Dashboard</h1>
          <div className="flex gap-2">
            {user && (
              <ImportMatrixDialog
                userId={user.id}
                activities={activities}
                onImportComplete={handleReload}
              />
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={handleReload}
              disabled={reloading}
            >
              <RefreshCw className={`w-4 h-4 ${reloading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="shadow-card">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <ClipboardCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalEntries}</p>
                <p className="text-sm text-muted-foreground">Total compétences</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{completedEntries}</p>
                <p className="text-sm text-muted-foreground">Terminées</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-capgemini-amber/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-capgemini-amber" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{inProgressEntries}</p>
                <p className="text-sm text-muted-foreground">En cours</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart: competences vs priorité */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base font-display">Compétences par priorité</CardTitle>
          </CardHeader>
          <CardContent>
            {competencePrioriteData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={competencePrioriteData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 20%, 90%)" />
                  <XAxis dataKey="competence" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" height={100} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    domain={[0, 3]}
                    ticks={[1, 2, 3]}
                    tickFormatter={(v) => ["", "Basse", "Moyenne", "Haute"][v] || ""}
                  />
                  <Tooltip formatter={(value: number) => ["", "Basse", "Moyenne", "Haute"][value] || "Non défini"} />
                  <Bar dataKey="priorite" fill="hsl(203, 100%, 34%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-sm text-center py-8">Aucune donnée</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
