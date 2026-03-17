/**
 * Matrix Import Dialog
 * 
 * Allows users to import matrix entries from Excel/CSV files.
 * Works with the exact format exported from matrix_entries table.
 */

import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import * as XLSX from "xlsx";

interface ImportMatrixDialogProps {
  userId: string;
  activities: Array<{ id: string; name: string }>;
  onImportComplete: () => void;
}

  const mapColumnNames = (row: any) => {
    // Map French Excel column names to database column names
    const columnMap: Record<string, string> = {
      "Compétences clés": "competence_cle",
      "Compétence clé": "competence_cle",
      "competence_cle": "competence_cle",
      "Priorité": "priorite",
      "priorite": "priorite",
      "Détails": "details",
      "details": "details",
      "Description": "description",
      "description": "description",
      "Etapes": "etapes",
      "Étapes": "etapes",
      "etapes": "etapes",
      "État": "etat",
      "Etat": "etat",
      "etat": "etat",
      "Type d'action ": "type_action",
      "Type d'action": "type_action",
      "type_action": "type_action",
      "Stockage": "stockage",
      "stockage": "stockage",
      "Lieu de stockage": "lieu_stockage",
      "lieu_stockage": "lieu_stockage",
      "Date prévue": "date_prevu",
      "date_prevu": "date_prevu",
      "Date réelle": "date_reelle",
      "date_reelle": "date_reelle",
      "Notation": "notation",
      "notation": "notation",
      "Score": "score",
      "Score générique": "score",
      "score": "score",
      "activity_name": "activity_name",
      "activity_id": "activity_id",
      "Activité": "activity_name",
      "Activité ": "activity_name",
    };

    const mappedRow: any = {};
    
    for (const [excelCol, value] of Object.entries(row)) {
      const dbCol = columnMap[excelCol as string] || excelCol;
      mappedRow[dbCol] = value;
    }

    return mappedRow;
  };

export function ImportMatrixDialog({
  userId,
  activities,
  onImportComplete,
}: ImportMatrixDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);

  const parseCSVData = (content: string) => {
    // Split by newlines - handle both \n and \r\n
    const lines = content
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length < 2) {
      console.error("Not enough lines");
      return [];
    }

    // Detect delimiter
    const headerLine = lines[0];
    const delimiter = headerLine.includes(";") ? ";" : ",";

    // Parse headers
    const headers = headerLine.split(delimiter).map((h) => h.trim());
    console.log("Headers:", headers);

    // Parse data rows
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const values = line.split(delimiter).map((v) => v.trim());

      // Create object mapping headers to values
      const row: any = {};
      headers.forEach((header, idx) => {
        row[header] = values[idx] || null;
      });

      // Only add if has competence_cle or id
      if (row.competence_cle || row.id) {
        rows.push(row);
      }
    }

    console.log(`Parsed ${rows.length} rows from CSV`);
    return rows;
  };

  const parseExcelFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: "array" });
          
          // Get first sheet
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          
          // Convert to JSON
          const rows = XLSX.utils.sheet_to_json(sheet) as any[];
          
          console.log(`Parsed ${rows.length} rows from Excel`);
          console.log("First row:", rows[0]);
          
          resolve(rows);
        } catch (error) {
          console.error("Excel parse error:", error);
          reject(error);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const parseFile = async (file: File): Promise<any[]> => {
    const fileName = file.name.toLowerCase();
    
    if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
      return parseExcelFile(file);
    } else {
      // CSV file
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string;
            const rows = parseCSVData(content);
            resolve(rows);
          } catch (error) {
            reject(error);
          }
        };
        reader.readAsText(file);
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    parseFile(selectedFile)
      .then((rows) => {
        if (rows.length > 0) {
          setPreview(rows.slice(0, 5));
          toast.success(`${rows.length} lignes détectées`);
        } else {
          toast.error("Aucune donnée valide trouvée");
        }
      })
      .catch((error) => {
        toast.error("Erreur lors de la lecture du fichier");
        console.error(error);
      });
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Sélectionnez un fichier");
      return;
    }

    setLoading(true);

    try {
      const rows = await parseFile(file);

      if (rows.length === 0) {
        toast.error("Aucune donnée à importer");
        setLoading(false);
        return;
      }

      // Map activity names to IDs
      const activityMap: Record<string, string> = {};
      activities.forEach((a) => {
        activityMap[a.name.toLowerCase()] = a.id;
      });

      // Transform rows for insertion
      const entriesToInsert = rows.map((row) => {
        // Use the activity_id from the file, or map by name
        let activityId = row.activity_id;

        if (!activityId && row.activity_name) {
          activityId = activityMap[row.activity_name.toLowerCase()];
        }

        // Default to first activity
        if (!activityId && activities.length > 0) {
          activityId = activities[0].id;
        }

        const entry: any = {
          user_id: userId, // Always use current logged-in user
          activity_id: activityId,
          competence_cle: row.competence_cle,
          priorite: row.priorite || null,
          description: row.description || null,
          etapes: row.etapes || null,
          details: row.details || null,
          type_action: row.type_action || null,
          stockage: row.stockage || null,
          lieu_stockage: row.lieu_stockage || null,
          date_prevu: row.date_prevu || null,
          date_reelle: row.date_reelle || null,
          notation: row.notation || null,
          score: row.score || null,
          etat: row.etat || "En cours",
        };

        // Remove null values
        Object.keys(entry).forEach(
          (key) => entry[key] === null && delete entry[key]
        );

        return entry;
      });

      console.log("Inserting entries:", entriesToInsert);

      // Insert data
      const { error } = await supabase
        .from("matrix_entries")
        .insert(entriesToInsert);

      if (error) {
        console.error("Error:", error);
        toast.error(`Erreur: ${error.message}`);
      } else {
        toast.success(`✅ ${rows.length} compétences importées!`);
        setOpen(false);
        setFile(null);
        setPreview([]);
        onImportComplete();
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erreur lors du traitement: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="w-4 h-4" />
          Importer Excel
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Importer des données</DialogTitle>
          <DialogDescription>
            Uploadez votre fichier CSV ou Excel exporté
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="file-upload">Fichier</Label>
            <Input
              id="file-upload"
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              disabled={loading}
              className="mt-2"
            />
          </div>

          {preview.length > 0 && (
            <div className="border rounded-lg p-4 bg-slate-50">
              <h4 className="font-semibold mb-3 text-sm">
                Aperçu ({preview.length} lignes)
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-white border-b">
                      <th className="text-left p-2 border-r">Compétence</th>
                      <th className="text-left p-2 border-r">Priorité</th>
                      <th className="text-left p-2 border-r">Type</th>
                      <th className="text-left p-2 border-r">État</th>
                      <th className="text-left p-2">Détails</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((row, idx) => (
                      <tr key={idx} className="border-b hover:bg-white">
                        <td className="p-2 border-r">{row.competence_cle}</td>
                        <td className="p-2 border-r">{row.priorite || "-"}</td>
                        <td className="p-2 border-r">{row.type_action || "-"}</td>
                        <td className="p-2 border-r">{row.etat || "En cours"}</td>
                        <td className="p-2 max-w-xs truncate text-gray-600">
                          {row.details || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button onClick={handleImport} disabled={!file || loading}>
              {loading ? "Import..." : "Importer"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
