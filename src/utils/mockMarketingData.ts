
export const mockMarketingData = {
  campaigns: [
    {
      id: 1,
      title: 'Summer Promotion',
      platform: 'Email',
      status: 'Active',
      startDate: '2023-06-01',
      endDate: '2023-06-30',
      budget: 5000,
      spent: 3200,
      leads: 45,
      conversions: 12
    },
    {
      id: 2,
      title: 'Product Launch',
      platform: 'Social Media',
      status: 'Planned',
      startDate: '2023-07-15',
      endDate: '2023-08-15',
      budget: 8000,
      spent: 0,
      leads: 0,
      conversions: 0
    },
    {
      id: 3,
      title: 'Brand Awareness',
      platform: 'Display Ads',
      status: 'Completed',
      startDate: '2023-04-01',
      endDate: '2023-05-30',
      budget: 10000,
      spent: 9800,
      leads: 125,
      conversions: 28
    }
  ],
  meetings: [
    {
      id: 1,
      title: 'Client Onboarding',
      client: 'Acme Inc',
      date: '2023-06-22',
      time: '10:00 AM',
      duration: 60,
      participants: ['John Smith', 'Sarah Wilson'],
      agenda: 'Discuss project scope, timeline, and deliverables',
      status: 'scheduled'
    },
    {
      id: 2,
      title: 'Strategy Session',
      client: 'TechStart',
      date: '2023-06-24',
      time: '2:00 PM',
      duration: 90,
      participants: ['Mike Johnson', 'Emily Brown', 'David Lee'],
      agenda: 'Review marketing strategy for Q3',
      status: 'scheduled'
    },
    {
      id: 3,
      title: 'Campaign Review',
      client: 'Global Retail',
      date: '2023-06-20',
      time: '11:30 AM',
      duration: 45,
      participants: ['Sarah Wilson', 'James Martin'],
      agenda: 'Review campaign performance and next steps',
      status: 'completed',
      notes: 'Client was satisfied with the results. Requested proposal for Q3 campaigns.'
    }
  ],
  emailOutreach: [
    {
      id: 1,
      subject: 'Introduction to our services',
      recipient: 'john@acmeinc.com',
      recipientName: 'John Smith',
      company: 'Acme Inc',
      status: 'sent',
      sentDate: '2023-06-15',
      openDate: '2023-06-16',
      replyDate: '2023-06-17',
      followUpDate: '2023-06-24'
    },
    {
      id: 2,
      subject: 'Custom proposal for your needs',
      recipient: 'sarah@techstart.com',
      recipientName: 'Sarah Johnson',
      company: 'TechStart',
      status: 'drafted',
      followUpDate: '2023-06-26'
    },
    {
      id: 3,
      subject: 'Follow-up on our discussion',
      recipient: 'mike@globalretail.com',
      recipientName: 'Mike Wilson',
      company: 'Global Retail',
      status: 'sent',
      sentDate: '2023-06-10',
      openDate: '2023-06-10',
      replyDate: null,
      followUpDate: '2023-06-17'
    }
  ],
  leads: [
    {
      id: 1,
      name: 'John Smith',
      email: 'john@acmeinc.com',
      phone: '555-123-4567',
      company: 'Acme Inc',
      position: 'Marketing Director',
      source: 'Website Form',
      status: 'qualified',
      assignedTo: 'Sarah Wilson',
      lastContact: '2023-06-17',
      notes: 'Interested in our social media management services'
    },
    {
      id: 2,
      name: 'Emily Brown',
      email: 'emily@techstart.com',
      phone: '555-987-6543',
      company: 'TechStart',
      position: 'CEO',
      source: 'LinkedIn',
      status: 'new',
      assignedTo: 'James Martin',
      lastContact: '2023-06-15',
      notes: 'Looking for help with product launch'
    },
    {
      id: 3,
      name: 'David Lee',
      email: 'david@globalretail.com',
      phone: '555-456-7890',
      company: 'Global Retail',
      position: 'Digital Marketing Manager',
      source: 'Referral',
      status: 'in_discussion',
      assignedTo: 'Mike Johnson',
      lastContact: '2023-06-20',
      notes: 'Currently evaluating several agencies'
    }
  ],
  plans: [
    {
      id: 1,
      title: 'Q3 Growth Strategy',
      status: 'active',
      startDate: '2023-07-01',
      endDate: '2023-09-30',
      goals: [
        'Increase website traffic by 30%',
        'Generate 150 qualified leads',
        'Achieve 25 conversions'
      ],
      channels: ['Social Media', 'Email', 'Content Marketing'],
      budget: 25000,
      performance: {
        progression: 0,
        metrics: []
      }
    },
    {
      id: 2,
      title: 'Product Launch Campaign',
      status: 'planned',
      startDate: '2023-08-15',
      endDate: '2023-10-15',
      goals: [
        'Achieve 10,000 product page views',
        'Generate 500 trial signups',
        'Convert 100 paying customers'
      ],
      channels: ['PPC', 'Social Media', 'Email', 'PR'],
      budget: 50000,
      performance: {
        progression: 0,
        metrics: []
      }
    }
  ],
  analytics: {
    websiteTraffic: {
      total: 15200,
      organic: 8500,
      paid: 4200,
      social: 2100,
      direct: 400,
      byMonth: [
        { month: 'Jan', visitors: 12000 },
        { month: 'Feb', visitors: 12500 },
        { month: 'Mar', visitors: 13200 },
        { month: 'Apr', visitors: 13800 },
        { month: 'May', visitors: 14500 },
        { month: 'Jun', visitors: 15200 }
      ]
    },
    conversions: {
      total: 350,
      rate: 2.3,
      byChannel: [
        { channel: 'Organic', conversions: 180 },
        { channel: 'Paid', conversions: 90 },
        { channel: 'Social', conversions: 50 },
        { channel: 'Direct', conversions: 30 }
      ]
    },
    insights: [
      'Organic traffic has grown 20% month-over-month',
      'Email campaigns have the highest conversion rate at 3.8%',
      'Mobile users account for 65% of total traffic',
      'Average session duration has increased by 15 seconds'
    ]
  }
};

export default mockMarketingData;
