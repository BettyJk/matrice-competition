import { useState } from "react";
import { COMPETENCY_TEMPLATES, COMPETENCE_GROUPS } from "@/lib/competencies";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, CheckCircle2 } from "lucide-react";

export interface MatrixRow {
  id?: string;
  competence_cle: string;
  details: string;
  priorite: string;
  description: string;
  etapes: string;
  type_action: string;
  stockage: string;
  lieu_stockage: string;
  date_prevu: string;
  date_reelle: string;
  notation: string;
  score: string;
  etat: string;
}

const emptyRow = (): MatrixRow => ({
  competence_cle: "",
  details: "",
  priorite: "",
  description: "",
  etapes: "",
  type_action: "",
  stockage: "",
  lieu_stockage: "",
  date_prevu: "",
  date_reelle: "",
  notation: "",
  score: "",
  etat: "",
});

interface Props {
  onAdd: (row: MatrixRow) => void;
}

export const AddCompetenceDialog = ({ onAdd }: Props) => {
  const [open, setOpen] = useState(false);
  const [row, setRow] = useState<MatrixRow>(emptyRow());

  const update = (field: keyof MatrixRow, value: string) => {
    setRow((prev) => ({ ...prev, [field]: value }));
  };

  const filteredDetails = COMPETENCY_TEMPLATES.filter(
    (t) => t.competence_cle === row.competence_cle
  );

  const canSubmit = row.competence_cle && row.details;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onAdd(row);
    setRow(emptyRow());
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Ajouter une compétence
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-display">
            Nouvelle compétence
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Step 1: Competence */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-primary">
              1. Compétence clé
            </Label>
            <Select
              value={row.competence_cle}
              onValueChange={(v) => {
                update("competence_cle", v);
                update("details", "");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir une compétence..." />
              </SelectTrigger>
              <SelectContent className="z-[200]">
                {COMPETENCE_GROUPS.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Step 2: Details (dependent) */}
          {row.competence_cle && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <Label className="text-sm font-semibold text-primary">
                2. Détails
              </Label>
              <Select value={row.details} onValueChange={(v) => update("details", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un détail..." />
                </SelectTrigger>
                <SelectContent className="z-[200]">
                  {filteredDetails.map((t) => (
                    <SelectItem key={t.details} value={t.details}>
                      {t.details}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Step 3: Fill remaining fields */}
          {row.details && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 border-t border-border pt-4">
              <Label className="text-sm font-semibold text-primary">
                3. Compléter les informations
              </Label>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Priorité</Label>
                  <Select value={row.priorite} onValueChange={(v) => update("priorite", v)}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="—" />
                    </SelectTrigger>
                    <SelectContent className="z-[200]">
                      <SelectItem value="Haute">Haute</SelectItem>
                      <SelectItem value="Moyenne">Moyenne</SelectItem>
                      <SelectItem value="Basse">Basse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Type d'action</Label>
                  <Select value={row.type_action} onValueChange={(v) => update("type_action", v)}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="—" />
                    </SelectTrigger>
                    <SelectContent className="z-[200]">
                      <SelectItem value="Formation">Formation</SelectItem>
                      <SelectItem value="Pratique">Pratique</SelectItem>
                      <SelectItem value="Évaluation">Évaluation</SelectItem>
                      <SelectItem value="Autonomie">Autonomie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">État</Label>
                  <Select value={row.etat} onValueChange={(v) => update("etat", v)}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="—" />
                    </SelectTrigger>
                    <SelectContent className="z-[200]">
                      <SelectItem value="Non commencé">Non commencé</SelectItem>
                      <SelectItem value="En cours">En cours</SelectItem>
                      <SelectItem value="Terminé">Terminé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Notation</Label>
                  <Input
                    value={row.notation}
                    onChange={(e) => update("notation", e.target.value)}
                    className="h-9"
                    placeholder="Ex: A, B, C..."
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Score</Label>
                  <Input
                    value={row.score}
                    onChange={(e) => update("score", e.target.value)}
                    className="h-9"
                    placeholder="Ex: 85"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Description</Label>
                  <Input
                    value={row.description}
                    onChange={(e) => update("description", e.target.value)}
                    className="h-9"
                    placeholder="Description..."
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Étapes</Label>
                  <Input
                    value={row.etapes}
                    onChange={(e) => update("etapes", e.target.value)}
                    className="h-9"
                    placeholder="Étapes..."
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Date prévu</Label>
                  <Input
                    type="date"
                    value={row.date_prevu}
                    onChange={(e) => update("date_prevu", e.target.value)}
                    className="h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Date réelle</Label>
                  <Input
                    type="date"
                    value={row.date_reelle}
                    onChange={(e) => update("date_reelle", e.target.value)}
                    className="h-9"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit} className="gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Valider
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
