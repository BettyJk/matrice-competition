# Guide d'import de matrices

## Fichiers acceptés
- CSV (valeurs séparées par des virgules ou des points-virgules)
- Excel (.xlsx, .xls)

## Format requis

Vous pouvez utiliser votre fichier Excel exactement comme il est ! L'import supporte automatiquement les colonnes suivantes:

### Colonnes standards:
- **competence_cle** : Le nom ou l'ID de la compétence (requis)
- **priorite** : "Haute", "Moyenne", ou "Basse"
- **description** : Description courte
- **etapes** : Étapes ou phases
- **details** : Détails supplémentaires
- **type_action** : Type d'action (ex: "Formation", "Pratique")
- **stockage** : Lieu de stockage des documents
- **lieu_stockage** : Lieu physique/numérique
- **date_prevu** : Date prévue (format: YYYY-MM-DD)
- **date_reelle** : Date réelle de réalisation (format: YYYY-MM-DD)
- **notation** : Notation (ex: "A", "B", "C")
- **score** : Score numérique
- **etat** : État ("En cours", "Terminé", etc.)
- **activity_id** : UUID de l'activité (sinon, utilisez activity_name)
- **activity_name** : Nom de l'activité
- **id** : UUID personnalisé (sinon, généré automatiquement)
- **created_at** : Date de création (optionnel, sinon utilisé maintenant)
- **updated_at** : Date de modification (optionnel)

### Colonnes supplémentaires
Toute colonne supplémentaire de votre Excel sera automatiquement ajoutée à votre base de données si elle n'existe pas déjà.

## Exemple - Format exact de votre Excel

Votre fichier CSV/Excel doit avoir cette structure:

```
id;user_id;activity_id;competence_cle;priorite;description;etapes;details;type_action;stockage;lieu_stockage;date_prevu;date_reelle;notation;score;etat;created_at;updated_at
869ef898-c996-4bc1-8381-a535842dc093;7d74b15c-ae63-4ca3-bbe3-be972ec8d5e5;a8485524-1720-44b4-baaf-f9b9b49d8266;Connaissance boite à outils;Moyenne;CVBNN;ASDFVB;Faire formation Phase 6 : Boite à outil TI;Formation;;;2026-03-04;2026-03-05;A;100;En cours;2026-02-23 09:32:01.939706+00;2026-02-23 09:32:01.939706+00
628f9a9e-6785-4567-99f4-b90e9df8c558;7d74b15c-ae63-4ca3-bbe3-be972ec8d5e5;a8485524-1720-44b4-baaf-f9b9b49d8266;Remontage numérique;Moyenne;;;Faire formation Phase 1b : Initiation Remontage numérique;;;;;;;;;2026-02-23 09:32:01.939706+00;2026-02-23 09:32:01.939706+00
```

## Procédure d'import

1. Exportez votre fichier depuis Excel en format CSV ou XLSX
2. Allez sur le Dashboard de l'app (après authentification)
3. Cliquez sur **"Importer depuis Excel"** (bouton en haut à droite)
4. Sélectionnez votre fichier
5. Vérifiez l'aperçu des premières lignes
6. Cliquez sur **"Importer"**
7. Les données seront ajoutées à votre matrice de compétences

## Activités disponibles

- Archi prestation
- Assistant homologation
- DMU analyst
- GDL BVH
- GDL SILH
- GEO CHECK IVECO
- PKL
- RSM
- TA BVH
- TA SILH
- TI SILH
- TI BVH
- TSM

## Notes importantes

- L'import utilise l'ID utilisateur de l'utilisateur connecté (pas besoin de le spécifier dans le fichier)
- Les dates doivent être au format YYYY-MM-DD (ex: 2026-03-16)
- Les noms d'activité sont insensibles à la casse
- Les délimiteurs (virgule ou point-virgule) sont détectés automatiquement
- Toute nouvelle colonne sera conservée pour utilisation future
