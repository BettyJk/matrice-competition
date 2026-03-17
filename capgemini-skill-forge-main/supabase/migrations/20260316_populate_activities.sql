-- Insert activities from CSV data
DELETE FROM public.activities WHERE name NOT IN ('Packaging', 'AQ', 'Data Management', 'Analyse d''implantation', 'Remontage numérique', 'Other');

INSERT INTO public.activities (id, name, created_at) VALUES
  ('32b7e287-2d59-4fa5-b387-0d85d3e7cb17', 'Archi prestation', '2026-02-23 09:14:21.700587+00'),
  ('02b52c03-ee06-4c5a-ad16-902f221459e0', 'Assistant homologation', '2026-02-23 09:14:21.700587+00'),
  ('3f5b1665-f1a0-4c81-b469-3c5dc2eec66f', 'DMU analyst', '2026-02-23 09:14:21.700587+00'),
  ('21abc143-ef5f-4dc4-b820-c4344fba8589', 'GDL BVH', '2026-02-23 09:14:21.700587+00'),
  ('0455a83d-129b-4075-8fa1-10b2aca15be2', 'GDL SILH', '2026-02-23 09:14:21.700587+00'),
  ('a8485524-1720-44b4-baaf-f9b9b49d8266', 'GEO CHECK IVECO', '2026-02-23 09:14:21.700587+00'),
  ('a04de773-6def-4bfc-b313-57b1c61d3b72', 'PKL', '2026-02-23 09:14:21.700587+00'),
  ('b5d1ba72-1ff4-4b8d-9b3b-1fc9fb62bd8b', 'RSM', '2026-02-23 09:14:21.700587+00'),
  ('e1a1992b-3cf7-44d4-901e-5f6ec1f3949a', 'TA BVH', '2026-02-23 09:14:21.700587+00'),
  ('e85195bc-e496-44a1-97cc-9c9327d7b841', 'TA SILH', '2026-02-23 09:14:21.700587+00'),
  ('8fab0e8b-2b8b-4e1b-8fc9-4a3f17f42b3f', 'TI SILH', '2026-02-23 09:14:21.700587+00'),
  ('e254385e-00d1-4e79-b4d8-9b58943df64e', 'TI BVH', '2026-02-23 09:14:21.700587+00'),
  ('799f999b-cc80-4a3d-93a1-bfa8409375ae', 'TSM', '2026-02-23 09:14:21.700587+00')
ON CONFLICT (name) DO NOTHING;
