
export const mockData = {
  users: [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'employee',
      department: 'Engineering',
      role_id: 2,
      roles: [{ role_id: 2, role_name: 'Employee' }]
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'hr',
      department: 'Human Resources',
      role_id: 3,
      roles: [{ role_id: 3, role_name: 'HR Manager' }]
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      role: 'admin',
      department: 'Administration',
      role_id: 1,
      roles: [{ role_id: 1, role_name: 'Administrator' }]
    }
  ],
  
  roles: [
    { role_id: 1, role_name: 'Administrator' },
    { role_id: 2, role_name: 'Employee' },
    { role_id: 3, role_name: 'HR Manager' },
    { role_id: 4, role_name: 'Finance Manager' },
    { role_id: 5, role_name: 'Marketing Manager' }
  ],
  
  clients: [
    {
      client_id: 1,
      client_name: 'ABC Corporation',
      description: 'Major technology company',
      contact_info: 'contact@abccorp.com'
    },
    {
      client_id: 2,
      client_name: 'XYZ Industries',
      description: 'Manufacturing industry leader',
      contact_info: 'info@xyzindustries.com'
    }
  ],
  
  tasks: [
    {
      task_id: 1,
      title: 'Implement login functionality',
      description: 'Create user login and authentication system',
      client_id: 1,
      assigned_to: 1,
      status: 'in_progress',
      estimated_time: 8,
      actual_time: 6,
      start_time: '2023-05-25T09:00:00Z',
      end_time: null,
      created_at: '2023-05-24T14:30:00Z',
      updated_at: '2023-05-25T10:15:00Z'
    },
    {
      task_id: 2,
      title: 'Design website homepage',
      description: 'Create responsive design for the company website',
      client_id: 2,
      assigned_to: 1,
      status: 'pending',
      estimated_time: 10,
      actual_time: null,
      start_time: null,
      end_time: null,
      created_at: '2023-05-26T08:45:00Z',
      updated_at: '2023-05-26T08:45:00Z'
    }
  ],
  
  attendance: [
    {
      attendance_id: 1,
      user_id: 1,
      login_time: '2023-05-25T09:00:00Z',
      logout_time: '2023-05-25T17:00:00Z',
      work_date: '2023-05-25'
    },
    {
      attendance_id: 2,
      user_id: 1,
      login_time: '2023-05-26T08:45:00Z',
      logout_time: '2023-05-26T17:30:00Z',
      work_date: '2023-05-26'
    },
    {
      attendance_id: 3,
      user_id: 1,
      login_time: '2023-05-29T09:15:00Z',
      logout_time: null,
      work_date: '2023-05-29'
    }
  ]
};
