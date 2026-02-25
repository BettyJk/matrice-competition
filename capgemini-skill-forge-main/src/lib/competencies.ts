export interface CompetencyTemplate {
  competence_cle: string;
  details: string;
}

export const COMPETENCY_TEMPLATES: CompetencyTemplate[] = [
  { competence_cle: "Remontage numérique", details: "Faire formation Phase 1b : Initiation Remontage numérique" },
  { competence_cle: "Remontage numérique", details: "Faire un remontage numérique sous PLM : gestion de groupe" },
  { competence_cle: "Remontage numérique", details: "Faire un remontage numérique sous PLM : Filtre Avec Configuration" },
  { competence_cle: "Remontage numérique", details: "Faire un remontage numérique sous PLM : Cumule de filtre" },
  { competence_cle: "Remontage numérique", details: "Faire un Remontage 3 DCOM gestion de groupe" },
  { competence_cle: "Remontage numérique", details: "Faire un Remontage 3 DCOM avec configuration" },
  { competence_cle: "Analyse d'implantation", details: "Faire formation Phase 1a : Initiation à l'outil CAO" },
  { competence_cle: "Analyse d'implantation", details: "Faire formation Phase 3 : Connaissances propres au métier SCIL SLH" },
  { competence_cle: "Analyse d'implantation", details: "Faire formation Phase 4 : Connaissance métier partenaire automobile" },
  { competence_cle: "Analyse d'implantation", details: "Analyse de 1 Pièce REC dans environnement local d'une variante" },
  { competence_cle: "Analyse d'implantation", details: "Analyse de 1 pièce nouvelle vs environnement local d'une variante" },
  { competence_cle: "Formalisme robustesse", details: "Faire formation Phase 3 : module Connaissance des Règles Robustesse" },
  { competence_cle: "Formalisme robustesse", details: "Faire formation Phase 5 : Grille comportementale" },
  { competence_cle: "Formalisme robustesse", details: "1ère Robustesse : LA/ECR" },
  { competence_cle: "Formalisme robustesse", details: "2ème Robustesse : LA/ECR" },
  { competence_cle: "Formalisme robustesse", details: "1ère Robustesse FM" },
  { competence_cle: "Volumétrie robustesse", details: "Capacité à réaliser 3 robustesses en semaine N" },
  { competence_cle: "Volumétrie robustesse", details: "Capacité à réaliser 5 robustesses en semaine N" },
  { competence_cle: "Volumétrie robustesse", details: "Capacité à réaliser 8 robustesses en semaine N" },
  { competence_cle: "Proposition technique", details: "Repositionner une pièce respectant environnements et contraintes métiers" },
  { competence_cle: "Proposition technique", details: "Proposer une interface" },
  { competence_cle: "Animation RZ/HH", details: "Assister à une réunion RZ et HH" },
  { competence_cle: "Animation RZ/HH", details: "Animer avec chef de fil 1er sujet en RZ" },
  { competence_cle: "Animation RZ/HH", details: "Animer avec chef de fil 1er sujet en HH" },
  { competence_cle: "Rédaction des CR", details: "Rédiger le CR de toutes les formations" },
  { competence_cle: "Rédaction des CR", details: "Rédiger le CR de point hebdo Equipe en interne" },
  { competence_cle: "Connaissance zone", details: "Faire formation Phase 2 : Connaissances gammes véhicules" },
  { competence_cle: "Connaissance zone", details: "Connaissance zone FACE AVANT" },
  { competence_cle: "Connaissance zone", details: "Connaissance zone HABITACLE" },
  { competence_cle: "Connaissance zone", details: "Connaissance MULTI-ZONE" },
  { competence_cle: "Connaissance partenaire", details: "Créer son réseau métier" },
  { competence_cle: "Convergence zone", details: "Assimiler le synoptique de communication et d'escalade" },
  { competence_cle: "Connaissance boite à outils", details: "Faire formation Phase 6 : Boite à outil TI" },
  { competence_cle: "Connaissance boite à outils", details: "Faire sa semaine type avec rituels" },
];

export const COMPETENCE_GROUPS = [...new Set(COMPETENCY_TEMPLATES.map(t => t.competence_cle))];
