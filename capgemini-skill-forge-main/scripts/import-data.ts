import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://essrtwgbkthrhxtcfsep.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY environment variable not set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Test users from the CSV data
const testUsers = [
  {
    id: '7d74b15c-ae63-4ca3-bbe3-be972ec8d5e5',
    email: 'user1.test@capgemini.com',
    password: 'TestPassword123!',
    fullName: 'User One'
  },
  {
    id: 'ffa1df0a-d488-4495-ac1c-5b853fca3657',
    email: 'user2.test@capgemini.com',
    password: 'TestPassword123!',
    fullName: 'User Two'
  }
];

// Matrix entries from CSV
const matrixEntries = [
  {
    id: '869ef898-c996-4bc1-8381-a535842dc093',
    user_id: '7d74b15c-ae63-4ca3-bbe3-be972ec8d5e5',
    activity_id: 'a8485524-1720-44b4-baaf-f9b9b49d8266',
    competence_cle: 'Connaissance boite à outils',
    priorite: 'Moyenne',
    description: 'CVBNN',
    etapes: 'ASDFVB',
    details: 'Faire formation Phase 6 : Boite à outil TI',
    type_action: 'Formation',
    stockage: null,
    lieu_stockage: null,
    date_prevu: '2026-03-04',
    date_reelle: '2026-03-05',
    notation: 'A',
    score: '100',
    etat: 'En cours',
    created_at: '2026-02-23 09:32:01.939706+00',
    updated_at: '2026-02-23 09:32:01.939706+00'
  },
  {
    id: '628f9a9e-6785-4567-99f4-b90e9df8c558',
    user_id: '7d74b15c-ae63-4ca3-bbe3-be972ec8d5e5',
    activity_id: 'a8485524-1720-44b4-baaf-f9b9b49d8266',
    competence_cle: 'Remontage numérique',
    priorite: 'Moyenne',
    description: null,
    etapes: null,
    details: 'Faire formation Phase 1b : Initiation Remontage numérique',
    type_action: null,
    stockage: null,
    lieu_stockage: null,
    date_prevu: null,
    date_reelle: null,
    notation: null,
    score: null,
    etat: null,
    created_at: '2026-02-23 09:32:01.939706+00',
    updated_at: '2026-02-23 09:32:01.939706+00'
  },
  {
    id: '5f626476-5236-45f5-8055-a1df16aa2b8f',
    user_id: 'ffa1df0a-d488-4495-ac1c-5b853fca3657',
    activity_id: 'a04de773-6def-4bfc-b313-57b1c61d3b72',
    competence_cle: 'Analyse d\'implantation',
    priorite: 'Moyenne',
    description: 'vv',
    etapes: null,
    details: 'Faire formation Phase 4 : Connaissance métier partenaire automobile',
    type_action: 'Formation',
    stockage: null,
    lieu_stockage: null,
    date_prevu: '2026-03-12',
    date_reelle: '2026-03-15',
    notation: 'A',
    score: '50',
    etat: 'En cours',
    created_at: '2026-03-04 11:59:06.841001+00',
    updated_at: '2026-03-04 11:59:06.841001+00'
  },
  {
    id: 'e93beacc-bb65-4b6f-b1b1-16678f89efa0',
    user_id: 'ffa1df0a-d488-4495-ac1c-5b853fca3657',
    activity_id: 'a04de773-6def-4bfc-b313-57b1c61d3b72',
    competence_cle: 'Convergence zone',
    priorite: 'Moyenne',
    description: null,
    etapes: null,
    details: 'Assimiler le synoptique de communication et d\'escalade',
    type_action: 'Pratique',
    stockage: null,
    lieu_stockage: null,
    date_prevu: null,
    date_reelle: null,
    notation: null,
    score: '90',
    etat: 'En cours',
    created_at: '2026-03-04 11:59:06.841001+00',
    updated_at: '2026-03-04 11:59:06.841001+00'
  }
];

async function importData() {
  try {
    console.log('Starting data import...\n');

    // Step 1: Create test users
    console.log('📝 Creating test users...');
    for (const user of testUsers) {
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        user_metadata: {
          full_name: user.fullName
        }
      });

      if (error) {
        console.log(`ℹ️  User ${user.email} may already exist: ${error.message}`);
      } else {
        console.log(`✅ Created user: ${user.email}`);
      }
    }

    // Step 2: Import matrix entries
    console.log('\n📊 Importing matrix entries...');
    const { data: insertedData, error: insertError } = await supabase
      .from('matrix_entries')
      .insert(matrixEntries);

    if (insertError) {
      if (insertError.message.includes('duplicate')) {
        console.log('ℹ️  Some entries already exist, skipping duplicates...');
      } else {
        throw insertError;
      }
    } else {
      console.log(`✅ Imported ${matrixEntries.length} matrix entries`);
    }

    console.log('\n✨ Data import completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`  - Test Users: ${testUsers.length}`);
    console.log(`  - Matrix Entries: ${matrixEntries.length}`);
    console.log(`  - Activities: Already loaded via migration`);
    console.log('\n🔑 Test Credentials:');
    testUsers.forEach(user => {
      console.log(`  Email: ${user.email}`);
      console.log(`  Password: ${user.password}\n`);
    });

  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

importData();
