import { CertificateTemplate } from '@/types';

export const DEFAULT_CERTIFICATE_TEMPLATE: CertificateTemplate = {
  id: 'tmpl-master-apex',
  school_id: 'school-apex-001',
  name: 'Apex Academy Official Royal Seal Master Template',
  template_data_url: '', // Empty means use the prestigious master vector certificate design
  mime_type: 'application/pdf',
  width: 841.89, // A4 Landscape points
  height: 595.28,
  is_active: true,
  fields_config: {
    student_name: {
      x: 421,
      y: 370,
      fontSize: 28,
      fontFamily: 'Times-Bold',
      fontWeight: 'bold',
      color: '#111F39',
      alignment: 'center'
    },
    student_code: {
      x: 421,
      y: 348,
      fontSize: 10,
      fontFamily: 'Helvetica-Bold',
      fontWeight: 'bold',
      color: '#64748B',
      alignment: 'center'
    },
    course_name: {
      x: 421,
      y: 273,
      fontSize: 16,
      fontFamily: 'Helvetica-Bold',
      fontWeight: 'bold',
      color: '#111F39',
      alignment: 'center'
    },
    completion_date: {
      x: 421,
      y: 250,
      fontSize: 11,
      fontFamily: 'Helvetica-Bold',
      fontWeight: 'bold',
      color: '#475569',
      alignment: 'center'
    },
    certificate_number: {
      x: 46,
      y: 46,
      fontSize: 9.5,
      fontFamily: 'Helvetica-Bold',
      fontWeight: 'bold',
      color: '#1E293B',
      alignment: 'left'
    },
    school_name: {
      x: 421,
      y: 521,
      fontSize: 21,
      fontFamily: 'Helvetica-Bold',
      fontWeight: 'bold',
      color: '#111F39',
      alignment: 'center'
    },
    instructor_name: {
      x: 90,
      y: 112,
      fontSize: 11,
      fontFamily: 'Times-Bold',
      fontWeight: 'bold',
      color: '#111F39',
      alignment: 'left'
    },
    qr_code: {
      x: 732,
      y: 42,
      size: 64
    }
  },
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
};
