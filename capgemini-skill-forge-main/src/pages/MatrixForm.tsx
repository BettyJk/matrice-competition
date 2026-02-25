import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AppHeader } from "@/components/AppHeader";
import { COMPETENCE_GROUPS } from "@/lib/competencies";
import { AddCompetenceDialog, type MatrixRow } from "@/components/AddCompetenceDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Save, Trash2, ArrowLeft, ChevronDown, ChevronRight } from "lucide-react";

const prioriteColor = (p: string) => {
  switch (p) {
    case "Haute": return "destructive";
    case "Moyenne": return "default";
    case "Basse": return "secondary";
    default: return "outline";
  }
};

const etatColor = (e: string) => {
  switch (e) {
    case "Terminé": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
    case "En cours": return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
    default: return "bg-muted text-muted-foreground";
  }
};

const MatrixForm = () => {
  const { activityId } = useParams<{ activityId: string }>();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState<MatrixRow[]>([]);
  const [activityName, setActivityName] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!activityId || !user) return;
    const load = async () => {
      const { data: act } = await supabase
        .from("activities")
        .select("name")
        .eq("id", activityId)
        .maybeSingle();
      if (act) setActivityName(act.name);

      const { data: entries } = await supabase
        .from("matrix_entries")
        .select("*")
        .eq("user_id", user.id)
        .eq("activity_id", activityId)
        .order("created_at");

      if (entries && entries.length > 0) {
        setRows(
          entries.map((e) => ({
            id: e.id,
            competence_cle: e.competence_cle,
            details: e.details || "",
            priorite: e.priorite || "",
            description: e.description || "",
            etapes: e.etapes || "",
            type_action: e.type_action || "",
            stockage: e.stockage || "",
            lieu_stockage: e.lieu_stockage || "",
            date_prevu: e.date_prevu || "",
            date_reelle: e.date_reelle || "",
            notation: e.notation || "",
            score: e.score || "",
            etat: e.etat || "",
          }))
        );
      } else {
        setRows([]);
      }
      setLoading(false);
    };
    load();
  }, [activityId, user]);

  const addRow = (row: MatrixRow) => {
    setRows((prev) => [...prev, row]);
    toast.success("Compétence ajoutée !");
  };

  const removeRow = (index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleGroup = (group: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      return next;
    });
  };

  const handleSave = async () => {
    if (!user || !activityId) return;
    setSaving(true);

    await supabase
      .from("matrix_entries")
      .delete()
      .eq("user_id", user.id)
      .eq("activity_id", activityId);

    const inserts = rows
      .filter((r) => r.competence_cle.trim())
      .map((r) => ({
        user_id: user.id,
        activity_id: activityId,
        competence_cle: r.competence_cle,
        details: r.details || null,
        priorite: r.priorite || null,
        description: r.description || null,
        etapes: r.etapes || null,
        type_action: r.type_action || null,
        stockage: r.stockage || null,
        lieu_stockage: r.lieu_stockage || null,
        date_prevu: r.date_prevu || null,
        date_reelle: r.date_reelle || null,
        notation: r.notation || null,
        score: r.score || null,
        etat: r.etat || null,
      }));

    const { error } = await supabase.from("matrix_entries").insert(inserts);
    setSaving(false);
    if (error) {
      toast.error("Erreur lors de la sauvegarde");
    } else {
      toast.success("Matrice sauvegardée !");
    }
  };

  // Group rows by competence_cle
  const grouped = COMPETENCE_GROUPS.filter((g) =>
    rows.some((r) => r.competence_cle === g)
  ).map((group) => ({
    group,
    items: rows
      .map((r, i) => ({ ...r, _index: i }))
      .filter((r) => r.competence_cle === group),
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/activities")}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              Retour
            </Button>
            <div>
              <h1 className="text-xl font-display font-bold text-foreground">
                Matrice — {activityName}
              </h1>
              <p className="text-sm text-muted-foreground">{rows.length} compétence{rows.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <AddCompetenceDialog onAdd={addRow} />
            <Button onClick={handleSave} disabled={saving}>
              <Save className="w-4 h-4 mr-1" />
              {saving ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Save className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">Aucune compétence ajoutée</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Cliquez sur "Ajouter une compétence" pour commencer à remplir votre matrice.
            </p>
            <AddCompetenceDialog onAdd={addRow} />
          </div>
        ) : (
          <div className="space-y-3">
            {grouped.map(({ group, items }) => {
              const isCollapsed = collapsedGroups.has(group);
              return (
                <div key={group} className="rounded-lg border border-border overflow-hidden">
                  {/* Group header */}
                  <button
                    onClick={() => toggleGroup(group)}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-primary/5 hover:bg-primary/10 transition-colors text-left"
                  >
                    {isCollapsed ? (
                      <ChevronRight className="w-4 h-4 text-primary shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-primary shrink-0" />
                    )}
                    <span className="font-semibold text-foreground">{group}</span>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {items.length} ligne{items.length > 1 ? "s" : ""}
                    </Badge>
                  </button>

                  {/* Group rows */}
                  {!isCollapsed && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-muted/50">
                            {[
                              "Détails",
                              "Priorité",
                              "Description",
                              "Étapes",
                              "Type d'action",
                              "Notation",
                              "Score",
                              "État",
                              "Date prévu",
                              "Date réelle",
                              ...(isAdmin ? [""] : []),
                            ].map((h, idx) => (
                              <th key={`${h}-${idx}`} className="px-3 py-2 text-left font-medium text-xs text-muted-foreground whitespace-nowrap">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((row) => (
                            <tr key={row._index} className="border-t border-border hover:bg-muted/30 transition-colors">
                              <td className="px-3 py-2 text-xs max-w-[250px]">
                                <span className="line-clamp-2">{row.details || "—"}</span>
                              </td>
                              <td className="px-3 py-2">
                                {row.priorite ? (
                                  <Badge variant={prioriteColor(row.priorite)} className="text-xs">
                                    {row.priorite}
                                  </Badge>
                                ) : (
                                  <span className="text-xs text-muted-foreground">—</span>
                                )}
                              </td>
                              <td className="px-3 py-2 text-xs">{row.description || "—"}</td>
                              <td className="px-3 py-2 text-xs">{row.etapes || "—"}</td>
                              <td className="px-3 py-2 text-xs">{row.type_action || "—"}</td>
                              <td className="px-3 py-2 text-xs">{row.notation || "—"}</td>
                              <td className="px-3 py-2 text-xs font-mono">{row.score || "—"}</td>
                              <td className="px-3 py-2">
                                {row.etat ? (
                                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${etatColor(row.etat)}`}>
                                    {row.etat}
                                  </span>
                                ) : (
                                  <span className="text-xs text-muted-foreground">—</span>
                                )}
                              </td>
                              <td className="px-3 py-2 text-xs whitespace-nowrap">{row.date_prevu || "—"}</td>
                              <td className="px-3 py-2 text-xs whitespace-nowrap">{row.date_reelle || "—"}</td>
                              {isAdmin && (
                                <td className="px-2 py-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeRow(row._index)}
                                    className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default MatrixForm;
