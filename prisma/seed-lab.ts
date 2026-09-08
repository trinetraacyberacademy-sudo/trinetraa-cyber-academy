import type { PrismaClient } from "../src/generated/prisma/client";

const DOMAIN = "fakecorp-demo.com";

const employees = [
  { name: "Priya Nair", department: "Finance", jobTitle: "Financial Analyst" },
  { name: "Robert Chen", department: "Finance", jobTitle: "Accounts Payable Specialist" },
  { name: "Meera Iyer", department: "Finance", jobTitle: "Finance Manager" },
  { name: "Sandra Wilson", department: "HR", jobTitle: "HR Generalist" },
  { name: "David Okafor", department: "HR", jobTitle: "Recruiter" },
  { name: "Linda Martinez", department: "HR", jobTitle: "HR Director" },
  { name: "James Patel", department: "IT", jobTitle: "IT Support Specialist" },
  { name: "Rachel Kim", department: "IT", jobTitle: "Systems Administrator" },
  { name: "Tom Bradley", department: "IT", jobTitle: "IT Manager" },
  { name: "Karan Mehta", department: "Sales", jobTitle: "Account Executive" },
  { name: "Sophie Turner", department: "Sales", jobTitle: "Sales Representative" },
  { name: "Alex Johnson", department: "Sales", jobTitle: "Sales Manager" },
  { name: "Michael Ross", department: "Executive", jobTitle: "Chief Executive Officer" },
  { name: "Angela Foster", department: "Executive", jobTitle: "Chief Financial Officer" },
  { name: "Daniel Wu", department: "Executive", jobTitle: "Chief Operating Officer" },
].map((e) => ({
  ...e,
  email: `${e.name.toLowerCase().replace(/\s+/g, ".")}@${DOMAIN}`,
}));

type TicketSeed = {
  ticketNumber: string;
  title: string;
  description: string;
  category: "PHISHING";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  reportedEmail: {
    fromAddress: string;
    toEmployeeEmail: string;
    subject: string;
    body: string;
    attachmentName?: string;
    linkUrl?: string;
  };
  logs: {
    timestamp: string;
    sourceType: "EMAIL_GATEWAY" | "ENDPOINT" | "AUTHENTICATION" | "NETWORK";
    employeeEmail?: string;
    eventSummary: string;
    rawLogLine: string;
  }[];
};

const tickets: TicketSeed[] = [
  {
    ticketNumber: "TRQ-1001",
    title: "Suspicious Password Reset Email Reported by Sales Rep",
    description:
      "Sophie Turner (Sales) reported an email urging her to verify her password via a link before it \"expires.\" She says she may have clicked the link and entered her credentials.",
    category: "PHISHING",
    severity: "HIGH",
    reportedEmail: {
      fromAddress: "it-helpdesk@fakecorp-support-verify.com",
      toEmployeeEmail: "sophie.turner@fakecorp-demo.com",
      subject: "Urgent: Your Password Will Expire in 24 Hours – Verify Now",
      body: "Dear Sophie Turner,\n\nOur records indicate that your FakeCorp network password is set to expire within 24 hours. To avoid disruption to your account access, please verify your credentials immediately using the secure link below.\n\n[Verify My Password Now]\n\nFailure to verify within 24 hours will result in temporary suspension of your account and email access.\n\nThank you for your prompt attention.\n\nIT Helpdesk Team\nFakeCorp Industries",
      linkUrl: "http://fakecorp-portal-verify.com/reset-password",
    },
    logs: [
      {
        timestamp: "2026-09-01T08:14:22Z",
        sourceType: "EMAIL_GATEWAY",
        employeeEmail: "sophie.turner@fakecorp-demo.com",
        eventSummary:
          "Email from spoofed IT helpdesk domain delivered to Sophie Turner's inbox (SPF/DKIM failed)",
        rawLogLine:
          '2026-09-01 08:14:22 UTC EMAIL_GATEWAY action=DELIVERED from=it-helpdesk@fakecorp-support-verify.com to=sophie.turner@fakecorp-demo.com subject="Urgent: Your Password Will Expire in 24 Hours - Verify Now" spf=FAIL dkim=FAIL dmarc=FAIL spam_score=7.8/10 msg_id=<a1f92c3d@fakecorp-support-verify.com>',
      },
      {
        timestamp: "2026-09-01T08:22:51Z",
        sourceType: "AUTHENTICATION",
        employeeEmail: "sophie.turner@fakecorp-demo.com",
        eventSummary:
          "Successful sign-in for Sophie Turner from an unrecognized external IP shortly after the email was delivered",
        rawLogLine:
          '2026-09-01T08:22:51Z AUTH_EVENT user=sophie.turner@fakecorp-demo.com result=SUCCESS auth_method=PASSWORD ip=185.220.101.47 geo="Bucharest, Romania" device=Unknown-Windows-Chrome mfa_status=NOT_CHALLENGED risk_level=HIGH session_id=8f3e2a1c9b',
      },
      {
        timestamp: "2026-09-01T08:23:04Z",
        sourceType: "AUTHENTICATION",
        employeeEmail: "sophie.turner@fakecorp-demo.com",
        eventSummary:
          "MFA challenge triggered on the same session and was denied — login could not complete",
        rawLogLine:
          '2026-09-01T08:23:04Z AUTH_EVENT user=sophie.turner@fakecorp-demo.com result=BLOCKED auth_method=MFA_PUSH ip=185.220.101.47 geo="Bucharest, Romania" mfa_status=DENIED reason="User did not approve MFA push" risk_level=HIGH session_id=8f3e2a1c9b',
      },
      {
        timestamp: "2026-09-01T08:31:40Z",
        sourceType: "AUTHENTICATION",
        employeeEmail: "sophie.turner@fakecorp-demo.com",
        eventSummary:
          "Sophie Turner's own device completed a legitimate sign-in minutes later from her normal location",
        rawLogLine:
          '2026-09-01T08:31:40Z AUTH_EVENT user=sophie.turner@fakecorp-demo.com result=SUCCESS auth_method=PASSWORD+MFA ip=74.125.21.9 geo="Austin, TX, US" device=Known-Windows-Edge mfa_status=APPROVED risk_level=LOW session_id=3d7c1f4e22',
      },
    ],
  },
  {
    ticketNumber: "TRQ-1002",
    title: "Malicious Invoice Attachment Reported – Endpoint Activity Suspected",
    description:
      "Robert Chen (Accounts Payable) received an \"overdue invoice\" email with a .docx attachment. His workstation has been behaving unusually since he opened it.",
    category: "PHISHING",
    severity: "CRITICAL",
    reportedEmail: {
      fromAddress: "billing@fakecorp-invoices-net.com",
      toEmployeeEmail: "robert.chen@fakecorp-demo.com",
      subject: "Overdue Invoice #48291 - Immediate Action Required",
      body: "Dear Robert,\n\nPlease find attached the overdue invoice (#48291) for services rendered last quarter. Our records show this invoice remains unpaid and is now 45 days past due.\n\nKindly review the attached document and process payment at your earliest convenience to avoid late fees and service interruption.\n\nPlease confirm receipt of this email.\n\nRegards,\nBilling Department",
      attachmentName: "Invoice_48291_Overdue.docx",
    },
    logs: [
      {
        timestamp: "2026-09-02T10:47:03Z",
        sourceType: "EMAIL_GATEWAY",
        employeeEmail: "robert.chen@fakecorp-demo.com",
        eventSummary:
          "Email with .docx attachment from spoofed billing domain delivered to Robert Chen",
        rawLogLine:
          '2026-09-02 10:47:03 UTC EMAIL_GATEWAY action=DELIVERED from=billing@fakecorp-invoices-net.com to=robert.chen@fakecorp-demo.com subject="Overdue Invoice #48291 - Immediate Action Required" attachment="Invoice_48291_Overdue.docx" spf=FAIL dkim=NONE spam_score=6.2/10 msg_id=<7b2e9f01@fakecorp-invoices-net.com>',
      },
      {
        timestamp: "2026-09-02T11:03:15Z",
        sourceType: "ENDPOINT",
        employeeEmail: "robert.chen@fakecorp-demo.com",
        eventSummary:
          "WINWORD.EXE spawned PowerShell with an encoded command shortly after Robert opened the attachment",
        rawLogLine:
          'EndpointID=WKS-RC-0847 EventID=1(ProcessCreate) Time=2026-09-02T11:03:15Z ParentImage=C:\\Program Files\\Microsoft Office\\root\\Office16\\WINWORD.EXE Image=C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe CommandLine="powershell.exe -nop -w hidden -enc JABzAD0ATgBlAHcALQBPAGIAagBlAGMAdAA..." User=FAKECORP\\robert.chen',
      },
      {
        timestamp: "2026-09-02T11:03:22Z",
        sourceType: "ENDPOINT",
        employeeEmail: "robert.chen@fakecorp-demo.com",
        eventSummary:
          "Outbound connection from the spawned PowerShell process to a known-bad external IP",
        rawLogLine:
          "EndpointID=WKS-RC-0847 EventID=3(NetworkConnect) Time=2026-09-02T11:03:22Z Image=C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe DestinationIp=91.219.237.44 DestinationPort=443 Protocol=TCP Direction=OUTBOUND ThreatIntel=MATCH(C2_INFRASTRUCTURE) User=FAKECORP\\robert.chen",
      },
      {
        timestamp: "2026-09-02T11:04:01Z",
        sourceType: "ENDPOINT",
        employeeEmail: "robert.chen@fakecorp-demo.com",
        eventSummary: "Registry Run key created for persistence on Robert Chen's workstation",
        rawLogLine:
          'EndpointID=WKS-RC-0847 EventID=13(RegistryEvent) Time=2026-09-02T11:04:01Z TargetObject=HKU\\S-1-5-21-...\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\\UpdateSvc Details="C:\\Users\\robert.chen\\AppData\\Roaming\\svchost32.exe" Image=C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe User=FAKECORP\\robert.chen',
      },
    ],
  },
  {
    ticketNumber: "TRQ-1003",
    title: "Suspected CEO Fraud / Wire Transfer Request",
    description:
      "Priya Nair (Finance) received an email appearing to be from CEO Michael Ross requesting an urgent, confidential wire transfer or gift card purchase. She held off and reported it instead.",
    category: "PHISHING",
    severity: "HIGH",
    reportedEmail: {
      fromAddress: "michael.ross.ceo@fakecorp-demo.co",
      toEmployeeEmail: "priya.nair@fakecorp-demo.com",
      subject: "Quick Task – Confidential",
      body: "Priya,\n\nI need you to handle something for me quickly and confidentially. I'm currently in back-to-back meetings and can't take calls right now.\n\nWe're finalizing an urgent vendor payment that needs to go out today — I'll explain the details when I'm free, but for now I need you to process a wire transfer of $18,500 to the account I'll send separately, or alternatively purchase $2,000 in Amazon gift cards if the transfer can't be processed in time.\n\nPlease keep this between us for now until the deal is publicly announced. Let me know once it's done.\n\nThanks,\nMichael Ross\nCEO, FakeCorp Industries\nSent from my iPhone",
    },
    logs: [
      {
        timestamp: "2026-09-03T09:02:11Z",
        sourceType: "EMAIL_GATEWAY",
        employeeEmail: "priya.nair@fakecorp-demo.com",
        eventSummary:
          "Email impersonating CEO Michael Ross delivered to Financial Analyst Priya Nair from a lookalike domain",
        rawLogLine:
          '2026-09-03 09:02:11 UTC EMAIL_GATEWAY action=DELIVERED from=michael.ross.ceo@fakecorp-demo.co to=priya.nair@fakecorp-demo.com subject="Quick Task - Confidential" spf=FAIL dkim=NONE dmarc=FAIL spam_score=4.1/10 reply_to=m.rossceo1972@protonmail.com msg_id=<c93a1e02@fakecorp-demo.co>',
      },
      {
        timestamp: "2026-09-03T09:02:15Z",
        sourceType: "EMAIL_GATEWAY",
        eventSummary:
          "Threat intel check: sender domain fakecorp-demo.co registered 6 days ago, flagged as a lookalike of the company's real domain",
        rawLogLine:
          "2026-09-03 09:02:15 UTC EMAIL_GATEWAY event=DOMAIN_REPUTATION_CHECK domain=fakecorp-demo.co registered=2026-08-28 registrar=NameCheap age_days=6 lookalike_of=fakecorp-demo.com similarity_score=0.94 verdict=SUSPICIOUS",
      },
    ],
  },
  {
    ticketNumber: "TRQ-1004",
    title: "Phishing Link Leads to Confirmed Account Compromise",
    description:
      "David Okafor (HR Recruiter) clicked a link to a fake careers portal to \"review a resume.\" He later noticed an unexpected MFA prompt and reported it.",
    category: "PHISHING",
    severity: "CRITICAL",
    reportedEmail: {
      fromAddress: "careers-portal-notify@fakecorp-jobs-verify.net",
      toEmployeeEmail: "david.okafor@fakecorp-demo.com",
      subject: "New Candidate Application - Action Required to View Resume",
      body: "Hi David,\n\nA new candidate has submitted an application for the Senior Analyst position and included additional documents that require your review through our secure candidate portal.\n\nPlease log in using the link below to view the full application and resume before the position closes.\n\n[View Candidate Application]\n\nThis link will expire in 48 hours.\n\nBest,\nFakeCorp Careers Team",
      linkUrl: "http://fakecorp-careers-secure.net/portal/login",
    },
    logs: [
      {
        timestamp: "2026-09-04T14:12:40Z",
        sourceType: "EMAIL_GATEWAY",
        employeeEmail: "david.okafor@fakecorp-demo.com",
        eventSummary: "Email with fake careers portal link delivered to Recruiter David Okafor",
        rawLogLine:
          '2026-09-04 14:12:40 UTC EMAIL_GATEWAY action=DELIVERED from=careers-portal-notify@fakecorp-jobs-verify.net to=david.okafor@fakecorp-demo.com subject="New Candidate Application - Action Required to View Resume" spf=FAIL dkim=FAIL spam_score=6.9/10 msg_id=<55d1a8b3@fakecorp-jobs-verify.net>',
      },
      {
        timestamp: "2026-09-04T14:19:52Z",
        sourceType: "AUTHENTICATION",
        employeeEmail: "david.okafor@fakecorp-demo.com",
        eventSummary:
          "Successful sign-in for David Okafor from an unusual location shortly after the email arrived, MFA relayed and approved (adversary-in-the-middle pattern)",
        rawLogLine:
          '2026-09-04T14:19:52Z AUTH_EVENT user=david.okafor@fakecorp-demo.com result=SUCCESS auth_method=PASSWORD+MFA ip=103.75.190.22 geo="Lagos, Nigeria" device=Unknown-Android-Chrome mfa_status=APPROVED risk_level=HIGH session_id=1a9f8e3c02',
      },
      {
        timestamp: "2026-09-04T14:20:10Z",
        sourceType: "AUTHENTICATION",
        employeeEmail: "david.okafor@fakecorp-demo.com",
        eventSummary:
          "New mail forwarding rule silently created on David Okafor's mailbox immediately after the suspicious sign-in",
        rawLogLine:
          '2026-09-04T14:20:10Z AUTH_EVENT event=MAILBOX_RULE_CREATED user=david.okafor@fakecorp-demo.com rule_name="Inbox Rule 1" forward_to=d.okafor.backup@protonmail.com session_id=1a9f8e3c02 risk_level=CRITICAL',
      },
      {
        timestamp: "2026-09-04T15:45:33Z",
        sourceType: "AUTHENTICATION",
        employeeEmail: "david.okafor@fakecorp-demo.com",
        eventSummary:
          "David Okafor's own device triggers an unexpected MFA prompt and denies it, prompting him to report the incident",
        rawLogLine:
          '2026-09-04T15:45:33Z AUTH_EVENT user=david.okafor@fakecorp-demo.com result=CHALLENGED auth_method=PASSWORD+MFA ip=74.125.21.44 geo="Austin, TX, US" device=Known-iPhone mfa_status=USER_DENIED_UNEXPECTED_PROMPT risk_level=HIGH session_id=902bcd7710',
      },
    ],
  },
  {
    ticketNumber: "TRQ-1005",
    title: "Reported Attachment from External Vendor – Review Requested",
    description:
      "Alex Johnson (Sales) received a PDF proposal from an external partner he'd recently spoken with and reported it out of caution since the sender was unfamiliar to the mail system.",
    category: "PHISHING",
    severity: "LOW",
    reportedEmail: {
      fromAddress: "accounts@partnersupplyco-demo.com",
      toEmployeeEmail: "alex.johnson@fakecorp-demo.com",
      subject: "Q3 Partnership Proposal - Attached for Review",
      body: "Hello Alex,\n\nThank you for your time on our call last week. As discussed, please find attached our Q3 partnership proposal for your review.\n\nWe'd welcome the opportunity to discuss this further at your convenience. Please let us know if you have any questions.\n\nBest regards,\nJennifer Osei\nPartner Supply Co.",
      attachmentName: "Q3_Partnership_Proposal.pdf",
    },
    logs: [
      {
        timestamp: "2026-09-05T13:20:05Z",
        sourceType: "EMAIL_GATEWAY",
        employeeEmail: "alex.johnson@fakecorp-demo.com",
        eventSummary:
          "Email with PDF attachment from an external partner delivered to Sales Manager Alex Johnson, passed standard filtering",
        rawLogLine:
          '2026-09-05 13:20:05 UTC EMAIL_GATEWAY action=DELIVERED from=accounts@partnersupplyco-demo.com to=alex.johnson@fakecorp-demo.com subject="Q3 Partnership Proposal - Attached for Review" attachment="Q3_Partnership_Proposal.pdf" spf=PASS dkim=PASS dmarc=PASS spam_score=0.4/10 msg_id=<f02b8a11@partnersupplyco-demo.com>',
      },
      {
        timestamp: "2026-09-05T13:41:52Z",
        sourceType: "ENDPOINT",
        employeeEmail: "alex.johnson@fakecorp-demo.com",
        eventSummary:
          "PDF opened normally in the default viewer on Alex Johnson's workstation — no child process spawned",
        rawLogLine:
          'EndpointID=WKS-AJ-0392 EventID=1(ProcessCreate) Time=2026-09-05T13:41:52Z ParentImage=C:\\Windows\\explorer.exe Image=C:\\Program Files\\Adobe\\Acrobat DC\\Acrobat\\Acrobat.exe CommandLine="Acrobat.exe \\"Q3_Partnership_Proposal.pdf\\"" User=FAKECORP\\alex.johnson',
      },
      {
        timestamp: "2026-09-05T14:15:00Z",
        sourceType: "ENDPOINT",
        employeeEmail: "alex.johnson@fakecorp-demo.com",
        eventSummary:
          "Scheduled antivirus scan completed with no threats detected on Alex Johnson's workstation",
        rawLogLine:
          "EndpointID=WKS-AJ-0392 EventID=AV_SCAN_COMPLETE Time=2026-09-05T14:15:00Z result=CLEAN files_scanned=48213 threats_found=0 engine=FakeDefender-v12.4 User=FAKECORP\\alex.johnson",
      },
    ],
  },
];

export async function seedLabEnvironment(prisma: PrismaClient) {
  const employeeByEmail = new Map<string, string>();

  for (const emp of employees) {
    const created = await prisma.fakeEmployee.upsert({
      where: { email: emp.email },
      update: {
        name: emp.name,
        department: emp.department,
        jobTitle: emp.jobTitle,
      },
      create: emp,
    });
    employeeByEmail.set(emp.email, created.id);
  }
  console.log(`Fake employees ready: ${employeeByEmail.size}`);

  for (const t of tickets) {
    const toEmployeeId = employeeByEmail.get(t.reportedEmail.toEmployeeEmail);

    const ticket = await prisma.ticket.upsert({
      where: { ticketNumber: t.ticketNumber },
      update: {
        title: t.title,
        description: t.description,
        category: t.category,
        severity: t.severity,
      },
      create: {
        ticketNumber: t.ticketNumber,
        title: t.title,
        description: t.description,
        category: t.category,
        severity: t.severity,
      },
    });

    await prisma.reportedEmail.upsert({
      where: { ticketId: ticket.id },
      update: {
        fromAddress: t.reportedEmail.fromAddress,
        toEmployeeId,
        subject: t.reportedEmail.subject,
        body: t.reportedEmail.body,
        attachmentName: t.reportedEmail.attachmentName,
        linkUrl: t.reportedEmail.linkUrl,
      },
      create: {
        ticketId: ticket.id,
        fromAddress: t.reportedEmail.fromAddress,
        toEmployeeId,
        subject: t.reportedEmail.subject,
        body: t.reportedEmail.body,
        attachmentName: t.reportedEmail.attachmentName,
        linkUrl: t.reportedEmail.linkUrl,
      },
    });

    // Re-seedable without duplicating: clear this ticket's logs and re-insert.
    await prisma.logEvent.deleteMany({ where: { relatedTicketId: ticket.id } });
    await prisma.logEvent.createMany({
      data: t.logs.map((log) => ({
        timestamp: new Date(log.timestamp),
        sourceType: log.sourceType,
        employeeId: log.employeeEmail ? employeeByEmail.get(log.employeeEmail) : null,
        eventSummary: log.eventSummary,
        rawLogLine: log.rawLogLine,
        relatedTicketId: ticket.id,
      })),
    });
  }
  console.log(`Tickets ready: ${tickets.length} (with reported emails and correlated logs)`);
}
