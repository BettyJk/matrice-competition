import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AppHeader } from "@/components/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Download, Users, ClipboardCheck, Filter } from "lucide-react";


const AdminDashboard = () => {
  const { isAdmin } = useAuth();
  const [entries, setEntries] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [filterUser, setFilterUser] = useState("all");
  const [filterActivity, setFilterActivity] = useState("all");

  useEffect(() => {
    if (!isAdmin) return;
    const load = async () => {
      const [{ data: e }, { data: p }, { data: a }] = await Promise.all([
        supabase.from("matrix_entries").select("*"),
        supabase.from("profiles").select("*"),
        supabase.from("activities").select("*"),
      ]);
      setEntries(e || []);
      setProfiles(p || []);
      setActivities(a || []);
    };
    load();
  }, [isAdmin]);

  const getUserName = (userId: string) => {
    const p = profiles.find((p) => p.user_id === userId);
    return p?.full_name || p?.email || userId;
  };

  const getActivityName = (id: string) => activities.find((a) => a.id === id)?.name || id;

  const filteredEntries = entries.filter((e) => {
    if (filterUser !== "all" && e.user_id !== filterUser) return false;
    if (filterActivity !== "all" && e.activity_id !== filterActivity) return false;
    return true;
  });

  // Charts data
  const prioriteCounts = filteredEntries.reduce((acc, e) => {
    const p = e.priorite || "Non défini";
    acc[p] = (acc[p] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const prioriteData = Object.entries(prioriteCounts).map(([name, value]) => ({ name, value }));

  const typeActionCounts = filteredEntries.reduce((acc, e) => {
    const t = e.type_action || "Non défini";
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const typeActionData = Object.entries(typeActionCounts).map(([name, count]) => ({ name, count }));

  const etatCounts = filteredEntries.reduce((acc, e) => {
    const s = e.etat || "Non commencé";
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const etatData = Object.entries(etatCounts).map(([name, value]) => ({ name, value }));

  const exportCSV = () => {
    const headers = [
      "Utilisateur", "Activité", "Compétence clé", "Détails", "Priorité",
      "Type d'action", "Notation", "Score", "État", "Date prévu", "Date réelle",
    ];
    const csvRows = [headers.join(",")];
    filteredEntries.forEach((e) => {
      csvRows.push(
        [
          `"${getUserName(e.user_id)}"`,
          `"${getActivityName(e.activity_id)}"`,
          `"${e.competence_cle}"`,
          `"${e.details || ""}"`,
          `"${e.priorite || ""}"`,
          `"${e.type_action || ""}"`,
          `"${e.notation || ""}"`,
          `"${e.score || ""}"`,
          `"${e.etat || ""}"`,
          `"${e.date_prevu || ""}"`,
          `"${e.date_reelle || ""}"`,
        ].join(",")
      );
    });
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "matrice_competences.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex items-center justify-center h-64">
          <p className="text-destructive font-medium">Accès non autorisé</p>
        </div>
      </div>
    );
  }

  const uniqueUsers = [...new Set(entries.map((e) => e.user_id))];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-display font-bold text-foreground">Administration</h1>
          <Button onClick={exportCSV} variant="outline">
            <Download className="w-4 h-4 mr-1" />
            Export CSV
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="shadow-card">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{uniqueUsers.length}</p>
                <p className="text-sm text-muted-foreground">Utilisateurs actifs</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <ClipboardCheck className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{entries.length}</p>
                <p className="text-sm text-muted-foreground">Total entrées</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-capgemini-amber/10 flex items-center justify-center">
                <Filter className="w-6 h-6 text-capgemini-amber" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{filteredEntries.length}</p>
                <p className="text-sm text-muted-foreground">Entrées filtrées</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="shadow-card mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Utilisateur</label>
                <Select value={filterUser} onValueChange={setFilterUser}>
                  <SelectTrigger className="w-[220px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les utilisateurs</SelectItem>
                    {uniqueUsers.map((uid) => (
                      <SelectItem key={uid} value={uid}>
                        {getUserName(uid)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Activité</label>
                <Select value={filterActivity} onValueChange={setFilterActivity}>
                  <SelectTrigger className="w-[220px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les activités</SelectItem>
                    {activities.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts - Per person: competences (x) vs priorité (y) */}
        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle className="text-base font-display">Compétences par priorité — par personne</CardTitle>
          </CardHeader>
          <CardContent>
            {uniqueUsers.map((uid) => {
              const userEntries = filteredEntries.filter((e) => e.user_id === uid);
              if (userEntries.length === 0) return null;
              
              const prioriteMap: Record<string, number> = { "Haute": 3, "Moyenne": 2, "Basse": 1 };
              const chartData = userEntries.map((e) => ({
                competence: e.competence_cle,
                priorite: prioriteMap[e.priorite] || 0,
                prioriteLabel: e.priorite || "Non défini",
              }));

              return (
                <div key={uid} className="mb-8">
                  <h3 className="text-sm font-medium text-foreground mb-2">{getUserName(uid)}</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 20%, 90%)" />
                      <XAxis dataKey="competence" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" height={80} />
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
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Data table */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base font-display">Détail des entrées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {["Utilisateur", "Activité", "Compétence", "Détails", "Priorité", "Type", "État", "Date prévu"].map((h) => (
                      <th key={h} className="px-3 py-2 text-left font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.slice(0, 50).map((e) => (
                    <tr key={e.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="px-3 py-2 text-xs">{getUserName(e.user_id)}</td>
                      <td className="px-3 py-2 text-xs">{getActivityName(e.activity_id)}</td>
                      <td className="px-3 py-2 text-xs font-medium">{e.competence_cle}</td>
                      <td className="px-3 py-2 text-xs max-w-[200px] truncate">{e.details}</td>
                      <td className="px-3 py-2">
                        {e.priorite && <Badge variant={e.priorite === "Haute" ? "destructive" : "secondary"} className="text-xs">{e.priorite}</Badge>}
                      </td>
                      <td className="px-3 py-2 text-xs">{e.type_action}</td>
                      <td className="px-3 py-2">
                        {e.etat && <Badge variant={e.etat === "Terminé" ? "default" : "outline"} className="text-xs">{e.etat}</Badge>}
                      </td>
                      <td className="px-3 py-2 text-xs">{e.date_prevu}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredEntries.length > 50 && (
                <p className="text-xs text-muted-foreground text-center py-3">
                  Affichage des 50 premières entrées sur {filteredEntries.length}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
