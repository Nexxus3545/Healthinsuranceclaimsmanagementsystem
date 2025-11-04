import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Create Supabase clients
const createSupabaseClient = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );
};

// Initialize storage buckets
const initializeStorage = async () => {
  const supabase = createSupabaseClient();
  const bucketName = 'make-a0384ac7-medical-documents';
  
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
  
  if (!bucketExists) {
    await supabase.storage.createBucket(bucketName, { public: false });
    console.log('Created medical documents bucket');
  }
};

initializeStorage();

// Auth Middleware
const requireAuth = async (c: any, next: any) => {
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  const supabase = createSupabaseClient();
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  
  if (!user || error) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  c.set('userId', user.id);
  c.set('userEmail', user.email);
  await next();
};

// ===== AUTH ROUTES =====

// Sign up new user
app.post('/make-server-a0384ac7/signup', async (c) => {
  try {
    const { email, password, name, role } = await c.req.json();
    
    if (!email || !password || !name || !role) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    const supabase = createSupabaseClient();
    let patientId = null;
    
    // If role is patient, create a patient record first
    if (role === 'patient') {
      patientId = `patient:${crypto.randomUUID()}`;
      const patient = {
        id: patientId,
        firstName: name.split(' ')[0] || name,
        lastName: name.split(' ').slice(1).join(' ') || '',
        email,
        phoneNumber: '',
        dateOfBirth: '',
        bloodType: '',
        address: '',
        emergencyContact: {},
        currentPregnancy: {
          lmp: '',
          edd: '',
          riskLevel: 'low',
          pregnancyStatus: 'active'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        linkedUserId: '' // Will be updated after user creation
      };
      await kv.set(patientId, patient);
    }
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role, patientId },
      email_confirm: true // Auto-confirm since email server not configured
    });
    
    if (error) {
      console.log(`Error creating user: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }
    
    // Update patient record with user ID
    if (role === 'patient' && patientId) {
      const patient = await kv.get(patientId);
      if (patient) {
        patient.linkedUserId = data.user.id;
        await kv.set(patientId, patient);
      }
    }
    
    // Store additional user info in KV
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email,
      name,
      role,
      patientId,
      createdAt: new Date().toISOString()
    });
    
    return c.json({ success: true, user: data.user });
  } catch (error) {
    console.log(`Signup error: ${error}`);
    return c.json({ error: 'Signup failed' }, 500);
  }
});

// ===== PATIENT ROUTES =====

// Register new patient
app.post('/make-server-a0384ac7/patients', requireAuth, async (c) => {
  try {
    const patientData = await c.req.json();
    const patientId = `patient:${crypto.randomUUID()}`;
    
    const patient = {
      id: patientId,
      ...patientData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: c.get('userId')
    };
    
    await kv.set(patientId, patient);
    
    return c.json({ success: true, patient });
  } catch (error) {
    console.log(`Error creating patient: ${error}`);
    return c.json({ error: 'Failed to create patient' }, 500);
  }
});

// Get all patients
app.get('/make-server-a0384ac7/patients', requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const userRecord = await kv.get(`user:${userId}`);
    
    // If user is a patient, only return their own record
    if (userRecord?.role === 'patient' && userRecord?.patientId) {
      const patient = await kv.get(userRecord.patientId);
      return c.json({ patients: patient ? [patient] : [] });
    }
    
    // Staff can see all patients
    const patients = await kv.getByPrefix('patient:');
    return c.json({ patients: patients || [] });
  } catch (error) {
    console.log(`Error fetching patients: ${error}`);
    return c.json({ error: 'Failed to fetch patients' }, 500);
  }
});

// Get current user's patient profile
app.get('/make-server-a0384ac7/my-profile', requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const userRecord = await kv.get(`user:${userId}`);
    
    if (userRecord?.role === 'patient' && userRecord?.patientId) {
      const patient = await kv.get(userRecord.patientId);
      return c.json({ patient });
    }
    
    return c.json({ error: 'Not a patient account' }, 404);
  } catch (error) {
    console.log(`Error fetching profile: ${error}`);
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});

// Get single patient
app.get('/make-server-a0384ac7/patients/:id', requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    const patient = await kv.get(`patient:${id}`);
    
    if (!patient) {
      return c.json({ error: 'Patient not found' }, 404);
    }
    
    return c.json({ patient });
  } catch (error) {
    console.log(`Error fetching patient: ${error}`);
    return c.json({ error: 'Failed to fetch patient' }, 500);
  }
});

// Update patient
app.put('/make-server-a0384ac7/patients/:id', requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    const patientKey = `patient:${id}`;
    
    const existing = await kv.get(patientKey);
    if (!existing) {
      return c.json({ error: 'Patient not found' }, 404);
    }
    
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(patientKey, updated);
    return c.json({ success: true, patient: updated });
  } catch (error) {
    console.log(`Error updating patient: ${error}`);
    return c.json({ error: 'Failed to update patient' }, 500);
  }
});

// ===== APPOINTMENT ROUTES =====

// Create appointment
app.post('/make-server-a0384ac7/appointments', requireAuth, async (c) => {
  try {
    const appointmentData = await c.req.json();
    const appointmentId = `appointment:${crypto.randomUUID()}`;
    
    const appointment = {
      id: appointmentId,
      ...appointmentData,
      createdAt: new Date().toISOString(),
      createdBy: c.get('userId')
    };
    
    await kv.set(appointmentId, appointment);
    return c.json({ success: true, appointment });
  } catch (error) {
    console.log(`Error creating appointment: ${error}`);
    return c.json({ error: 'Failed to create appointment' }, 500);
  }
});

// Get appointments
app.get('/make-server-a0384ac7/appointments', requireAuth, async (c) => {
  try {
    const appointments = await kv.getByPrefix('appointment:');
    return c.json({ appointments: appointments || [] });
  } catch (error) {
    console.log(`Error fetching appointments: ${error}`);
    return c.json({ error: 'Failed to fetch appointments' }, 500);
  }
});

// ===== MEDICAL RECORDS ROUTES =====

// Create medical record
app.post('/make-server-a0384ac7/medical-records', requireAuth, async (c) => {
  try {
    const recordData = await c.req.json();
    const recordId = `medical-record:${crypto.randomUUID()}`;
    
    const record = {
      id: recordId,
      ...recordData,
      createdAt: new Date().toISOString(),
      createdBy: c.get('userId')
    };
    
    await kv.set(recordId, record);
    return c.json({ success: true, record });
  } catch (error) {
    console.log(`Error creating medical record: ${error}`);
    return c.json({ error: 'Failed to create medical record' }, 500);
  }
});

// Get medical records for patient
app.get('/make-server-a0384ac7/medical-records/:patientId', requireAuth, async (c) => {
  try {
    const patientId = c.req.param('patientId');
    const allRecords = await kv.getByPrefix('medical-record:');
    const patientRecords = allRecords.filter((r: any) => r.patientId === patientId);
    
    return c.json({ records: patientRecords || [] });
  } catch (error) {
    console.log(`Error fetching medical records: ${error}`);
    return c.json({ error: 'Failed to fetch medical records' }, 500);
  }
});

// ===== LABOR & DELIVERY ROUTES =====

// Create labor case
app.post('/make-server-a0384ac7/labor-cases', requireAuth, async (c) => {
  try {
    const caseData = await c.req.json();
    const caseId = `labor-case:${crypto.randomUUID()}`;
    
    const laborCase = {
      id: caseId,
      ...caseData,
      createdAt: new Date().toISOString(),
      createdBy: c.get('userId')
    };
    
    await kv.set(caseId, laborCase);
    return c.json({ success: true, laborCase });
  } catch (error) {
    console.log(`Error creating labor case: ${error}`);
    return c.json({ error: 'Failed to create labor case' }, 500);
  }
});

// ===== VACCINATION ROUTES =====

// Create vaccination record
app.post('/make-server-a0384ac7/vaccinations', requireAuth, async (c) => {
  try {
    const vaccinationData = await c.req.json();
    const vaccinationId = `vaccination:${crypto.randomUUID()}`;
    
    const vaccination = {
      id: vaccinationId,
      ...vaccinationData,
      createdAt: new Date().toISOString(),
      createdBy: c.get('userId')
    };
    
    await kv.set(vaccinationId, vaccination);
    return c.json({ success: true, vaccination });
  } catch (error) {
    console.log(`Error creating vaccination record: ${error}`);
    return c.json({ error: 'Failed to create vaccination record' }, 500);
  }
});

// Get vaccinations for baby
app.get('/make-server-a0384ac7/vaccinations/:babyId', requireAuth, async (c) => {
  try {
    const babyId = c.req.param('babyId');
    const allVaccinations = await kv.getByPrefix('vaccination:');
    const babyVaccinations = allVaccinations.filter((v: any) => v.babyId === babyId);
    
    return c.json({ vaccinations: babyVaccinations || [] });
  } catch (error) {
    console.log(`Error fetching vaccinations: ${error}`);
    return c.json({ error: 'Failed to fetch vaccinations' }, 500);
  }
});

// ===== DOCUMENT UPLOAD ROUTES =====

// Upload document
app.post('/make-server-a0384ac7/documents/upload', requireAuth, async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const patientId = formData.get('patientId') as string;
    const documentType = formData.get('documentType') as string;
    
    if (!file || !patientId) {
      return c.json({ error: 'Missing file or patient ID' }, 400);
    }
    
    const supabase = createSupabaseClient();
    const bucketName = 'make-a0384ac7-medical-documents';
    const fileName = `${patientId}/${Date.now()}-${file.name}`;
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file);
    
    if (error) {
      console.log(`Error uploading file: ${error.message}`);
      return c.json({ error: 'Failed to upload file' }, 500);
    }
    
    // Create signed URL
    const { data: urlData } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, 60 * 60 * 24 * 365); // 1 year
    
    // Save document metadata
    const documentId = `document:${crypto.randomUUID()}`;
    const document = {
      id: documentId,
      patientId,
      documentType,
      fileName: file.name,
      filePath: fileName,
      fileUrl: urlData?.signedUrl,
      createdAt: new Date().toISOString(),
      createdBy: c.get('userId')
    };
    
    await kv.set(documentId, document);
    
    return c.json({ success: true, document });
  } catch (error) {
    console.log(`Error in document upload: ${error}`);
    return c.json({ error: 'Failed to upload document' }, 500);
  }
});

// Get documents for patient
app.get('/make-server-a0384ac7/documents/:patientId', requireAuth, async (c) => {
  try {
    const patientId = c.req.param('patientId');
    const allDocuments = await kv.getByPrefix('document:');
    const patientDocuments = allDocuments.filter((d: any) => d.patientId === patientId);
    
    return c.json({ documents: patientDocuments || [] });
  } catch (error) {
    console.log(`Error fetching documents: ${error}`);
    return c.json({ error: 'Failed to fetch documents' }, 500);
  }
});

// ===== ANALYTICS ROUTES =====

// Get dashboard analytics
app.get('/make-server-a0384ac7/analytics/dashboard', requireAuth, async (c) => {
  try {
    const patients = await kv.getByPrefix('patient:');
    const appointments = await kv.getByPrefix('appointment:');
    const laborCases = await kv.getByPrefix('labor-case:');
    
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments.filter((a: any) => 
      a.date?.startsWith(today)
    );
    
    const activePregnancies = patients.filter((p: any) => 
      p.pregnancyStatus === 'active'
    );
    
    return c.json({
      totalPatients: patients.length,
      activePregnancies: activePregnancies.length,
      todayAppointments: todayAppointments.length,
      totalDeliveries: laborCases.length,
      recentAppointments: appointments.slice(0, 10)
    });
  } catch (error) {
    console.log(`Error fetching analytics: ${error}`);
    return c.json({ error: 'Failed to fetch analytics' }, 500);
  }
});

// ===== INVENTORY ROUTES =====

// Get inventory items
app.get('/make-server-a0384ac7/inventory', requireAuth, async (c) => {
  try {
    const items = await kv.getByPrefix('inventory:');
    return c.json({ items: items || [] });
  } catch (error) {
    console.log(`Error fetching inventory: ${error}`);
    return c.json({ error: 'Failed to fetch inventory' }, 500);
  }
});

// Update inventory item
app.put('/make-server-a0384ac7/inventory/:id', requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    const itemKey = `inventory:${id}`;
    
    const existing = await kv.get(itemKey);
    if (!existing) {
      return c.json({ error: 'Item not found' }, 404);
    }
    
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(itemKey, updated);
    return c.json({ success: true, item: updated });
  } catch (error) {
    console.log(`Error updating inventory: ${error}`);
    return c.json({ error: 'Failed to update inventory' }, 500);
  }
});

// Health check
app.get('/make-server-a0384ac7/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);
