-- Ensure all columns from the Excel export exist in matrix_entries table
-- Add index for better query performance on frequently searched columns
CREATE INDEX IF NOT EXISTS idx_matrix_entries_user_activity ON public.matrix_entries(user_id, activity_id);
CREATE INDEX IF NOT EXISTS idx_matrix_entries_competence ON public.matrix_entries(competence_cle);
CREATE INDEX IF NOT EXISTS idx_matrix_entries_etat ON public.matrix_entries(etat);

-- Add comment documenting supported import columns
COMMENT ON TABLE public.matrix_entries IS 'Matrix entries table. Supports importing from Excel with columns: id, user_id, activity_id, competence_cle, priorite, description, etapes, details, type_action, stockage, lieu_stockage, date_prevu, date_reelle, notation, score, etat, created_at, updated_at';
