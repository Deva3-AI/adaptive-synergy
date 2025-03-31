
import { Employee, LeaveRequest, PaySlip, Candidate, HRTask, Attendance } from '@/interfaces/hr';
import { Task } from '@/interfaces/tasks';
import { Campaign, MarketingMeeting, EmailOutreach, MarketingLead, MarketingPlan } from '@/interfaces/marketing';

// Mock HR Data
export const mockHRData = {
  employees: [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      position: 'Software Developer',
      department: 'Engineering',
      joinDate: '2021-03-15',
      status: 'active' as const,
      avatar: 'https://ui-avatars.com/api/?name=John+Doe'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      position: 'UI/UX Designer',
      department: 'Design',
      joinDate: '2020-11-01',
      status: 'active' as const,
      avatar: 'https://ui-avatars.com/api/?name=Jane+Smith'
    },
    {
      id: 3,
      name: 'Michael Johnson',
      email: 'michael.johnson@example.com',
      position: 'Project Manager',
      department: 'Management',
      joinDate: '2019-06-10',
      status: 'active' as const,
      avatar: 'https://ui-avatars.com/api/?name=Michael+Johnson'
    }
  ] as Employee[],
  
  attendance: [
    {
      id: 1,
      employee_id: 1,
      employee_name: 'John Doe',
      login_time: '2023-06-12T09:00:00Z',
      logout_time: '2023-06-12T17:30:00Z',
      work_date: '2023-06-12',
      status: 'present' as const,
      hours_worked: 8.5
    },
    {
      id: 2,
      employee_id: 2,
      employee_name: 'Jane Smith',
      login_time: '2023-06-12T08:45:00Z',
      logout_time: '2023-06-12T17:15:00Z',
      work_date: '2023-06-12',
      status: 'present' as const,
      hours_worked: 8.5
    },
    {
      id: 3,
      employee_id: 3,
      employee_name: 'Michael Johnson',
      login_time: '2023-06-12T09:15:00Z',
      logout_time: '2023-06-12T18:00:00Z',
      work_date: '2023-06-12',
      status: 'present' as const,
      hours_worked: 8.75
    }
  ] as Attendance[],
  
  attendanceSummary: {
    attendance_records: [],
    today_present: 3,
    total_employees: 5,
    average_hours: 8.2
  },
  
  leaveRequests: [
    {
      id: 1,
      employee_id: 1,
      employee_name: 'John Doe',
      start_date: '2023-07-15',
      end_date: '2023-07-20',
      days: 5,
      reason: 'Family vacation',
      status: 'approved' as const,
      leaveType: 'annual' as const,
      notes: 'Approved by manager'
    },
    {
      id: 2,
      employee_id: 2,
      employee_name: 'Jane Smith',
      start_date: '2023-06-25',
      end_date: '2023-06-27',
      days: 3,
      reason: 'Personal reasons',
      status: 'pending' as const,
      leaveType: 'personal' as const
    },
    {
      id: 3,
      employee_id: 3,
      employee_name: 'Michael Johnson',
      start_date: '2023-06-20',
      end_date: '2023-06-20',
      days: 1,
      reason: 'Doctor appointment',
      status: 'approved' as const,
      leaveType: 'sick' as const,
      document_url: '/documents/medical-note.pdf'
    }
  ] as LeaveRequest[],
  
  payslips: [
    {
      id: 1,
      employee_id: 1,
      employee_name: 'John Doe',
      payment_date: '2023-05-30',
      period_start: '2023-05-01',
      period_end: '2023-05-31',
      basic_salary: 5000,
      allowances: 500,
      deductions: 800,
      net_salary: 4700,
      status: 'paid' as const,
      month: 'May',
      year: 2023,
      paidDate: '2023-05-30'
    },
    {
      id: 2,
      employee_id: 2,
      employee_name: 'Jane Smith',
      payment_date: '2023-05-30',
      period_start: '2023-05-01',
      period_end: '2023-05-31',
      basic_salary: 4800,
      allowances: 400,
      deductions: 750,
      net_salary: 4450,
      status: 'paid' as const,
      month: 'May',
      year: 2023,
      paidDate: '2023-05-30'
    },
    {
      id: 3,
      employee_id: 3,
      employee_name: 'Michael Johnson',
      payment_date: '2023-05-30',
      period_start: '2023-05-01',
      period_end: '2023-05-31',
      basic_salary: 6000,
      allowances: 600,
      deductions: 1000,
      net_salary: 5600,
      status: 'paid' as const,
      month: 'May',
      year: 2023,
      paidDate: '2023-05-30'
    }
  ] as PaySlip[],
  
  hrTasks: [
    {
      id: 1,
      title: 'Review leave applications',
      description: 'Review and approve pending leave requests',
      status: 'pending' as const,
      priority: 'high' as const,
      due_date: '2023-06-20',
      assigned_to: 4,
      assigned_name: 'HR Manager',
      created_at: '2023-06-15',
      category: 'employee' as const
    },
    {
      id: 2,
      title: 'Prepare payroll for June',
      description: 'Calculate salaries, bonuses, and deductions for June',
      status: 'pending' as const,
      priority: 'high' as const,
      due_date: '2023-06-28',
      assigned_to: 4,
      assigned_name: 'HR Manager',
      created_at: '2023-06-15',
      category: 'payroll' as const
    },
    {
      id: 3,
      title: 'Process new hire documentation',
      description: 'Complete onboarding paperwork for new developers',
      status: 'in-progress' as const,
      priority: 'medium' as const,
      due_date: '2023-06-22',
      assigned_to: 5,
      assigned_name: 'HR Assistant',
      created_at: '2023-06-16',
      category: 'employee' as const
    }
  ] as HRTask[],
  
  recruitmentData: {
    openPositions: [
      {
        id: 1,
        title: 'Senior Frontend Developer',
        department: 'Engineering',
        location: 'Remote',
        description: 'We are looking for an experienced frontend developer...',
        requirements: ['5+ years of experience', 'React.js expertise', 'TypeScript knowledge'],
        posted_date: '2023-06-01',
        closing_date: '2023-07-01',
        status: 'open',
        applicants_count: 12
      },
      {
        id: 2,
        title: 'UI/UX Designer',
        department: 'Design',
        location: 'Remote',
        description: 'We are seeking a talented UI/UX designer...',
        requirements: ['3+ years of experience', 'Figma proficiency', 'Portfolio of work'],
        posted_date: '2023-06-05',
        closing_date: '2023-07-05',
        status: 'open',
        applicants_count: 8
      }
    ],
    
    candidates: [
      {
        id: 1,
        name: 'Alex Wilson',
        email: 'alex.wilson@example.com',
        phone: '+1234567890',
        job_id: 1,
        job_title: 'Senior Frontend Developer',
        resume_url: '/resumes/alex_wilson.pdf',
        application_date: '2023-06-05',
        skills: ['JavaScript', 'React', 'TypeScript', 'HTML/CSS'],
        experience: 6,
        education: 'BS in Computer Science',
        status: 'screening' as const,
        interview_date: '2023-06-15',
        notes: 'Strong technical background, good communication skills',
        rating: 4.5,
        salary_expectation: 95000,
        source: 'LinkedIn',
        last_contact: '2023-06-10'
      },
      {
        id: 2,
        name: 'Emma Davis',
        email: 'emma.davis@example.com',
        phone: '+1987654321',
        job_id: 2,
        job_title: 'UI/UX Designer',
        resume_url: '/resumes/emma_davis.pdf',
        application_date: '2023-06-07',
        skills: ['Figma', 'Sketch', 'Adobe XD', 'User Research'],
        experience: 4,
        education: 'BFA in Graphic Design',
        status: 'interview' as const,
        interview_date: '2023-06-20',
        notes: 'Excellent portfolio, especially mobile designs',
        rating: 4.8,
        salary_expectation: 85000,
        source: 'Dribbble',
        last_contact: '2023-06-12'
      }
    ] as Candidate[]
  }
};

// Mock Finance Data
export const mockFinanceData = {
  invoices: [
    {
      id: 1,
      invoice_number: 'INV-2023-001',
      client_id: 1,
      client_name: 'Acme Corp',
      amount: 5000,
      status: 'paid',
      issue_date: '2023-05-15',
      due_date: '2023-06-15',
      payment_date: '2023-06-10'
    },
    {
      id: 2,
      invoice_number: 'INV-2023-002',
      client_id: 2,
      client_name: 'Tech Solutions',
      amount: 7500,
      status: 'pending',
      issue_date: '2023-06-01',
      due_date: '2023-07-01'
    },
    {
      id: 3,
      invoice_number: 'INV-2023-003',
      client_id: 3,
      client_name: 'Global Media',
      amount: 3200,
      status: 'overdue',
      issue_date: '2023-05-01',
      due_date: '2023-06-01'
    }
  ],
  
  financialRecords: [
    {
      record_id: 1,
      record_type: 'income',
      amount: 5000,
      description: 'Payment for website design - Acme Corp',
      record_date: '2023-06-10'
    },
    {
      record_id: 2,
      record_type: 'expense',
      amount: 1200,
      description: 'Office rent - June',
      record_date: '2023-06-05'
    },
    {
      record_id: 3,
      record_type: 'expense',
      amount: 800,
      description: 'Software subscriptions',
      record_date: '2023-06-01'
    }
  ]
};

// Mock Task Data
export const mockTasksData = {
  tasks: [
    {
      task_id: 1,
      title: 'Design homepage mockup',
      description: 'Create wireframes and mockups for the new homepage design',
      client_id: 1,
      client_name: 'Acme Corp',
      assigned_to: 2,
      assignee_name: 'Jane Smith',
      status: 'in_progress',
      estimated_time: 8,
      actual_time: null,
      start_time: '2023-06-10T09:00:00Z',
      end_time: null,
      created_at: '2023-06-09T14:30:00Z',
      updated_at: '2023-06-10T09:00:00Z',
      priority: 'high',
      progress: 35,
      due_date: '2023-06-17'
    },
    {
      task_id: 2,
      title: 'Develop API integration',
      description: 'Implement the API integration for the e-commerce platform',
      client_id: 2,
      client_name: 'Tech Solutions',
      assigned_to: 1,
      assignee_name: 'John Doe',
      status: 'pending',
      estimated_time: 12,
      actual_time: null,
      start_time: null,
      end_time: null,
      created_at: '2023-06-08T10:15:00Z',
      updated_at: '2023-06-08T10:15:00Z',
      priority: 'medium',
      progress: 0,
      due_date: '2023-06-20'
    },
    {
      task_id: 3,
      title: 'Create content calendar',
      description: 'Develop a content calendar for social media posts',
      client_id: 3,
      client_name: 'Global Media',
      assigned_to: 3,
      assignee_name: 'Michael Johnson',
      status: 'completed',
      estimated_time: 5,
      actual_time: 4.5,
      start_time: '2023-06-05T11:00:00Z',
      end_time: '2023-06-06T16:30:00Z',
      created_at: '2023-06-04T15:45:00Z',
      updated_at: '2023-06-06T16:30:00Z',
      priority: 'low',
      progress: 100,
      due_date: '2023-06-09'
    }
  ] as Task[],
  
  taskComments: [
    {
      id: 1,
      task_id: 1,
      user_id: 2,
      user_name: 'Jane Smith',
      user_avatar: 'https://ui-avatars.com/api/?name=Jane+Smith',
      content: 'Starting work on the wireframes now.',
      created_at: '2023-06-10T09:05:00Z'
    },
    {
      id: 2,
      task_id: 1,
      user_id: 3,
      user_name: 'Michael Johnson',
      user_avatar: 'https://ui-avatars.com/api/?name=Michael+Johnson',
      content: 'Make sure to include the new logo in the design.',
      created_at: '2023-06-10T10:30:00Z'
    },
    {
      id: 3,
      task_id: 3,
      user_id: 3,
      user_name: 'Michael Johnson',
      user_avatar: 'https://ui-avatars.com/api/?name=Michael+Johnson',
      content: 'Completed the calendar and shared it with the client.',
      created_at: '2023-06-06T16:25:00Z'
    }
  ]
};

// Mock Marketing Data
export const mockMarketingData = {
  campaigns: [
    {
      id: 1,
      name: 'Summer Promotion',
      description: 'Special offers for summer season',
      status: 'active',
      type: 'email',
      start_date: '2023-06-01',
      end_date: '2023-08-31',
      budget: 5000,
      target_audience: 'Existing customers',
      created_at: '2023-05-15',
      metrics: {
        impressions: 12500,
        clicks: 1800,
        conversions: 320,
        cost_per_conversion: 15.62
      }
    },
    {
      id: 2,
      name: 'Product Launch',
      description: 'Campaign for new product release',
      status: 'draft',
      type: 'social',
      start_date: '2023-07-15',
      end_date: '2023-08-15',
      budget: 7500,
      target_audience: 'New and existing customers',
      created_at: '2023-06-10'
    }
  ] as Campaign[],
  
  meetings: [
    {
      id: 1,
      title: 'Initial Consultation',
      description: 'Discuss project requirements and timeline',
      date: '2023-06-20',
      time: '10:00',
      duration: 60,
      contact_name: 'John Smith',
      contact_email: 'john@example.com',
      contact_company: 'ABC Company',
      meeting_type: 'prospect',
      status: 'scheduled',
      location: 'Virtual',
      platform: 'Zoom',
      meeting_link: 'https://zoom.us/j/123456789',
      created_at: '2023-06-10',
      leadName: 'John Smith',
      leadCompany: 'ABC Company',
      scheduledTime: '2023-06-20T10:00:00'
    },
    {
      id: 2,
      title: 'Strategy Review',
      description: 'Review marketing strategy and results',
      date: '2023-06-22',
      time: '14:00',
      duration: 90,
      contact_name: 'Sarah Johnson',
      contact_email: 'sarah@example.com',
      contact_company: 'XYZ Corp',
      meeting_type: 'client',
      status: 'scheduled',
      notes: 'Prepare performance report',
      location: 'Virtual',
      platform: 'Google Meet',
      meeting_link: 'https://meet.google.com/abc-defg-hij',
      created_at: '2023-06-12',
      leadName: 'Sarah Johnson',
      leadCompany: 'XYZ Corp',
      scheduledTime: '2023-06-22T14:00:00'
    }
  ] as MarketingMeeting[],
  
  emailOutreach: [
    {
      id: 1,
      campaign_id: 1,
      subject: 'Introducing Our Services',
      content: 'Hello {{name}}, we wanted to introduce our services...',
      status: 'sent',
      sent_date: '2023-06-05',
      recipients: ['john@example.com', 'sarah@example.com'],
      open_rate: 68,
      click_rate: 25,
      response_rate: 10,
      created_at: '2023-06-01',
      updated_at: '2023-06-05',
      recipientCompany: 'ABC Company',
      source: 'LinkedIn',
      follow_up_scheduled: true,
      sentDate: '2023-06-05'
    },
    {
      id: 2,
      subject: 'Follow-up: Our Recent Conversation',
      content: 'Hello {{name}}, following up on our conversation...',
      status: 'draft',
      scheduled_date: '2023-06-25',
      recipients: ['michael@example.com'],
      created_at: '2023-06-15',
      recipientCompany: 'DEF Industries',
      source: 'Referral',
      follow_up_scheduled: false
    }
  ] as EmailOutreach[],
  
  leads: [
    {
      id: 1,
      name: 'Robert Brown',
      email: 'robert@example.com',
      company: 'Brown Enterprises',
      position: 'Marketing Director',
      phone: '+1234567890',
      source: 'website',
      status: 'contacted',
      assigned_to: 3,
      assigned_name: 'Michael Johnson',
      notes: 'Interested in website redesign',
      last_contact_date: '2023-06-12',
      next_follow_up: '2023-06-19',
      potential_value: 10000,
      created_at: '2023-06-10',
      interests: ['Website Design', 'SEO']
    },
    {
      id: 2,
      name: 'Lisa Williams',
      email: 'lisa@example.com',
      company: 'Williams & Co',
      position: 'CEO',
      phone: '+1987654321',
      source: 'referral',
      status: 'new',
      notes: 'Referred by John Smith',
      created_at: '2023-06-15',
      potential_value: 15000,
      interests: ['Branding', 'Marketing Strategy']
    }
  ] as MarketingLead[],
  
  plans: [
    {
      id: 1,
      title: 'Q3 Marketing Plan',
      description: 'Marketing strategy for Q3 2023',
      objectives: ['Increase web traffic by 20%', 'Generate 50 new leads', 'Improve conversion rate to 5%'],
      start_date: '2023-07-01',
      end_date: '2023-09-30',
      status: 'active',
      budget: 25000,
      target_audience: ['Small businesses', 'Tech startups'],
      key_strategies: ['Content marketing', 'Social media campaigns', 'Email outreach'],
      success_metrics: {
        'Web Traffic': { target: 20000, current: 12000, unit: 'visitors' },
        'New Leads': { target: 50, current: 15, unit: 'leads' },
        'Conversion Rate': { target: 5, current: 3.2, unit: '%' }
      },
      channels: ['Website', 'LinkedIn', 'Email', 'Twitter'],
      owner_id: 3,
      owner_name: 'Michael Johnson',
      created_at: '2023-06-01',
      updated_at: '2023-06-15'
    }
  ] as MarketingPlan[]
};

// Mock Client Data
export const mockClientData = {
  clients: [
    {
      id: 1,
      name: 'Acme Corp',
      industry: 'Technology',
      contact_name: 'John Smith',
      contact_email: 'john@acmecorp.com',
      contact_phone: '+1234567890',
      address: '123 Tech Avenue, San Francisco, CA',
      logo_url: 'https://ui-avatars.com/api/?name=Acme+Corp&background=0D8ABC&color=fff',
      created_at: '2022-03-15',
      status: 'active'
    },
    {
      id: 2,
      name: 'Tech Solutions',
      industry: 'Software',
      contact_name: 'Sarah Johnson',
      contact_email: 'sarah@techsolutions.com',
      contact_phone: '+1987654321',
      address: '456 Innovation Way, Austin, TX',
      logo_url: 'https://ui-avatars.com/api/?name=Tech+Solutions&background=FF5733&color=fff',
      created_at: '2022-05-20',
      status: 'active'
    },
    {
      id: 3,
      name: 'Global Media',
      industry: 'Media & Entertainment',
      contact_name: 'Michael Brown',
      contact_email: 'michael@globalmedia.com',
      contact_phone: '+1122334455',
      address: '789 Media Blvd, Los Angeles, CA',
      logo_url: 'https://ui-avatars.com/api/?name=Global+Media&background=33A8FF&color=fff',
      created_at: '2022-07-10',
      status: 'active'
    }
  ]
};

// Mock User data
export const mockUserData = {
  users: [
    {
      user_id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role_id: 1,
      roles: [
        { role_name: 'employee' }
      ]
    },
    {
      user_id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role_id: 2,
      roles: [
        { role_name: 'hr' }
      ]
    },
    {
      user_id: 3,
      name: 'Michael Johnson',
      email: 'michael.johnson@example.com',
      role_id: 3,
      roles: [
        { role_name: 'finance' }
      ]
    },
    {
      user_id: 4,
      name: 'Sarah Williams',
      email: 'sarah.williams@example.com',
      role_id: 4,
      roles: [
        { role_name: 'marketing' }
      ]
    },
    {
      user_id: 5,
      name: 'Robert Brown',
      email: 'robert.brown@example.com',
      role_id: 5,
      roles: [
        { role_name: 'admin' }
      ]
    }
  ],
  roles: [
    { role_id: 1, role_name: 'employee' },
    { role_id: 2, role_name: 'hr' },
    { role_id: 3, role_name: 'finance' },
    { role_id: 4, role_name: 'marketing' },
    { role_id: 5, role_name: 'admin' }
  ]
};

// Mock AI responses
export const mockAIResponse = {
  content: "This is a simulated AI response to your query. I've analyzed the data and have several recommendations for you...",
  timestamp: new Date().toISOString()
};

export const mockInsights = {
  key_metrics: {
    client_satisfaction: '92%',
    project_completion_rate: '95%',
    average_delivery_time: '2.3 days ahead of schedule'
  },
  trends: [
    'Increasing demand for video content creation',
    'Higher client retention in Q2 compared to Q1',
    'Growing interest in AI integration services'
  ],
  recommendations: [
    'Consider expanding video production capabilities',
    'Implement structured client onboarding to improve early satisfaction',
    'Develop AI service offerings based on current client needs'
  ]
};
