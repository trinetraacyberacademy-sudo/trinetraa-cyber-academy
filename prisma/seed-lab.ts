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

// Fake file hashes (SHA-256 shaped) reused across logs so students can pivot
// a hash found in a ticket into a SIEM search and find every machine it hit.
const MALWARE_SHA256 =
  "a3f5c9d8e1b2f4a6" + "7c2e9b4d1f6a8c05" + "3e7b1a9c5d2f8064" + "b6d4f2a0c8e6194b";
const BENIGN_SHA256 =
  "1a2b3c4d5e6f7081" + "9c8b7a6f5e4d3c2b" + "1a2b3c4d5e6f7081" + "9c8b7a6f5e4d3c2b";
const ESIGN_MALWARE_SHA256 =
  "c4e8b0d29a1f6357" + "8d2a6c0e4f81b3d5" + "047c9e1b3a5d7f60" + "82c4e6a80d2f4b6e";

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
    rawHeaders?: string;
    attachmentName?: string;
    attachmentHash?: string;
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
      "Sophie Turner (Sales) reported an email urging her to verify her password via a link before it \"expires.\" She says she may have clicked the link and entered her credentials. The same email was sent company-wide — check who else received or clicked it.",
    category: "PHISHING",
    severity: "HIGH",
    reportedEmail: {
      fromAddress: "it-helpdesk@fakecorp-support-verify.com",
      toEmployeeEmail: "sophie.turner@fakecorp-demo.com",
      subject: "Urgent: Your Password Will Expire in 24 Hours – Verify Now",
      body: "Dear Sophie Turner,\n\nOur records indicate that your FakeCorp network password is set to expire within 24 hours. To avoid disruption to your account access, please verify your credentials immediately using the secure link below.\n\n[Verify My Password Now]\n\nFailure to verify within 24 hours will result in temporary suspension of your account and email access.\n\nThank you for your prompt attention.\n\nIT Helpdesk Team\nFakeCorp Industries",
      rawHeaders:
        "Return-Path: <bounce@fakecorp-support-verify.com>\n" +
        "Received: from mail.fakecorp-support-verify.com (unknown [185.220.101.47])\n" +
        "\tby mx.fakecorp-demo.com (Postfix) with ESMTP id 4X1Qh2K9\n" +
        "\tfor <sophie.turner@fakecorp-demo.com>; Tue, 01 Sep 2026 08:14:20 +0000\n" +
        "Message-ID: <a1f92c3d@fakecorp-support-verify.com>\n" +
        'From: "IT Helpdesk" <it-helpdesk@fakecorp-support-verify.com>\n' +
        "To: sophie.turner@fakecorp-demo.com\n" +
        "Subject: Urgent: Your Password Will Expire in 24 Hours - Verify Now\n" +
        "Date: Tue, 01 Sep 2026 08:14:19 +0000\n" +
        "MIME-Version: 1.0\n" +
        'Content-Type: text/html; charset="UTF-8"\n' +
        "X-Originating-IP: [185.220.101.47]\n" +
        "Authentication-Results: mx.fakecorp-demo.com;\n" +
        "  spf=fail (sender IP is 185.220.101.47) smtp.mailfrom=it-helpdesk@fakecorp-support-verify.com;\n" +
        "  dkim=fail (no signature) header.d=none;\n" +
        "  dmarc=fail (p=NONE sp=NONE dis=NONE) header.from=fakecorp-support-verify.com\n" +
        "Received-SPF: fail (mx.fakecorp-demo.com: domain of fakecorp-support-verify.com\n" +
        "  does not designate 185.220.101.47 as permitted sender)",
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
          '2026-09-01 08:14:22 UTC EMAIL_GATEWAY action=DELIVERED from=it-helpdesk@fakecorp-support-verify.com to=sophie.turner@fakecorp-demo.com subject="Urgent: Your Password Will Expire in 24 Hours - Verify Now" url=http://fakecorp-portal-verify.com/reset-password spf=FAIL dkim=FAIL dmarc=FAIL spam_score=7.8/10 msg_id=<a1f92c3d@fakecorp-support-verify.com>',
      },
      {
        timestamp: "2026-09-01T08:14:45Z",
        sourceType: "EMAIL_GATEWAY",
        employeeEmail: "karan.mehta@fakecorp-demo.com",
        eventSummary: "Same phishing email also delivered to Karan Mehta (Sales)",
        rawLogLine:
          '2026-09-01 08:14:45 UTC EMAIL_GATEWAY action=DELIVERED from=it-helpdesk@fakecorp-support-verify.com to=karan.mehta@fakecorp-demo.com subject="Urgent: Your Password Will Expire in 24 Hours - Verify Now" url=http://fakecorp-portal-verify.com/reset-password spf=FAIL dkim=FAIL dmarc=FAIL spam_score=7.8/10 msg_id=<a1f92c3d@fakecorp-support-verify.com>',
      },
      {
        timestamp: "2026-09-01T08:15:02Z",
        sourceType: "EMAIL_GATEWAY",
        employeeEmail: "rachel.kim@fakecorp-demo.com",
        eventSummary: "Same phishing email also delivered to Rachel Kim (IT)",
        rawLogLine:
          '2026-09-01 08:15:02 UTC EMAIL_GATEWAY action=DELIVERED from=it-helpdesk@fakecorp-support-verify.com to=rachel.kim@fakecorp-demo.com subject="Urgent: Your Password Will Expire in 24 Hours - Verify Now" url=http://fakecorp-portal-verify.com/reset-password spf=FAIL dkim=FAIL dmarc=FAIL spam_score=7.8/10 msg_id=<a1f92c3d@fakecorp-support-verify.com>',
      },
      {
        timestamp: "2026-09-01T08:15:18Z",
        sourceType: "EMAIL_GATEWAY",
        employeeEmail: "angela.foster@fakecorp-demo.com",
        eventSummary: "Same phishing email also delivered to Angela Foster (Executive)",
        rawLogLine:
          '2026-09-01 08:15:18 UTC EMAIL_GATEWAY action=DELIVERED from=it-helpdesk@fakecorp-support-verify.com to=angela.foster@fakecorp-demo.com subject="Urgent: Your Password Will Expire in 24 Hours - Verify Now" url=http://fakecorp-portal-verify.com/reset-password spf=FAIL dkim=FAIL dmarc=FAIL spam_score=7.8/10 msg_id=<a1f92c3d@fakecorp-support-verify.com>',
      },
      {
        timestamp: "2026-09-01T08:15:41Z",
        sourceType: "EMAIL_GATEWAY",
        employeeEmail: "meera.iyer@fakecorp-demo.com",
        eventSummary: "Same phishing email also delivered to Meera Iyer (Finance)",
        rawLogLine:
          '2026-09-01 08:15:41 UTC EMAIL_GATEWAY action=DELIVERED from=it-helpdesk@fakecorp-support-verify.com to=meera.iyer@fakecorp-demo.com subject="Urgent: Your Password Will Expire in 24 Hours - Verify Now" url=http://fakecorp-portal-verify.com/reset-password spf=FAIL dkim=FAIL dmarc=FAIL spam_score=7.8/10 msg_id=<a1f92c3d@fakecorp-support-verify.com>',
      },
      {
        timestamp: "2026-09-01T08:17:30Z",
        sourceType: "NETWORK",
        employeeEmail: "karan.mehta@fakecorp-demo.com",
        eventSummary:
          "Karan Mehta's workstation visited the phishing link but the session ended before any credentials were submitted",
        rawLogLine:
          '2026-09-01T08:17:30Z NETWORK_EVENT user=karan.mehta@fakecorp-demo.com src_ip=10.20.4.55 dest_url=http://fakecorp-portal-verify.com/reset-password action=ALLOWED category=UNCATEGORIZED http_method=GET status=200 user_agent="Mozilla/5.0 (Windows NT 10.0)"',
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
      "Robert Chen (Accounts Payable) received an \"overdue invoice\" email with a .docx attachment. His workstation has been behaving unusually since he opened it. The same file hash was seen elsewhere — check who else has it.",
    category: "PHISHING",
    severity: "CRITICAL",
    reportedEmail: {
      fromAddress: "billing@fakecorp-invoices-net.com",
      toEmployeeEmail: "robert.chen@fakecorp-demo.com",
      subject: "Overdue Invoice #48291 - Immediate Action Required",
      body: "Dear Robert,\n\nPlease find attached the overdue invoice (#48291) for services rendered last quarter. Our records show this invoice remains unpaid and is now 45 days past due.\n\nKindly review the attached document and process payment at your earliest convenience to avoid late fees and service interruption.\n\nPlease confirm receipt of this email.\n\nRegards,\nBilling Department",
      rawHeaders:
        "Return-Path: <bounce@fakecorp-invoices-net.com>\n" +
        "Received: from mail.fakecorp-invoices-net.com (unknown [91.219.237.40])\n" +
        "\tby mx.fakecorp-demo.com (Postfix) with ESMTP id 8B3Fk1L2\n" +
        "\tfor <robert.chen@fakecorp-demo.com>; Wed, 02 Sep 2026 10:47:01 +0000\n" +
        "Message-ID: <7b2e9f01@fakecorp-invoices-net.com>\n" +
        'From: "Billing Department" <billing@fakecorp-invoices-net.com>\n' +
        "To: robert.chen@fakecorp-demo.com\n" +
        "Subject: Overdue Invoice #48291 - Immediate Action Required\n" +
        "Date: Wed, 02 Sep 2026 10:46:58 +0000\n" +
        "MIME-Version: 1.0\n" +
        'Content-Type: multipart/mixed; boundary="=_boundary_invoice48291"\n' +
        "X-Originating-IP: [91.219.237.40]\n" +
        "Authentication-Results: mx.fakecorp-demo.com;\n" +
        "  spf=fail (sender IP is 91.219.237.40) smtp.mailfrom=billing@fakecorp-invoices-net.com;\n" +
        "  dkim=none (no signature);\n" +
        "  dmarc=fail (p=NONE sp=NONE dis=NONE) header.from=fakecorp-invoices-net.com\n" +
        "Received-SPF: fail (mx.fakecorp-demo.com: domain of fakecorp-invoices-net.com\n" +
        "  does not designate 91.219.237.40 as permitted sender)",
      attachmentName: "Invoice_48291_Overdue.docx",
      attachmentHash: MALWARE_SHA256,
    },
    logs: [
      {
        timestamp: "2026-09-02T10:47:03Z",
        sourceType: "EMAIL_GATEWAY",
        employeeEmail: "robert.chen@fakecorp-demo.com",
        eventSummary:
          "Email with .docx attachment from spoofed billing domain delivered to Robert Chen",
        rawLogLine: `2026-09-02 10:47:03 UTC EMAIL_GATEWAY action=DELIVERED from=billing@fakecorp-invoices-net.com to=robert.chen@fakecorp-demo.com subject="Overdue Invoice #48291 - Immediate Action Required" attachment="Invoice_48291_Overdue.docx" attachment_hash=${MALWARE_SHA256} spf=FAIL dkim=NONE spam_score=6.2/10 msg_id=<7b2e9f01@fakecorp-invoices-net.com>`,
      },
      {
        timestamp: "2026-09-02T10:48:11Z",
        sourceType: "EMAIL_GATEWAY",
        employeeEmail: "sandra.wilson@fakecorp-demo.com",
        eventSummary: "Same attachment (identical hash) also delivered to Sandra Wilson (HR)",
        rawLogLine: `2026-09-02 10:48:11 UTC EMAIL_GATEWAY action=DELIVERED from=billing@fakecorp-invoices-net.com to=sandra.wilson@fakecorp-demo.com subject="Overdue Invoice #48291 - Immediate Action Required" attachment="Invoice_48291_Overdue.docx" attachment_hash=${MALWARE_SHA256} spf=FAIL dkim=NONE spam_score=6.2/10 msg_id=<7b2e9f01@fakecorp-invoices-net.com>`,
      },
      {
        timestamp: "2026-09-02T10:48:47Z",
        sourceType: "EMAIL_GATEWAY",
        employeeEmail: "tom.bradley@fakecorp-demo.com",
        eventSummary: "Same attachment also delivered to Tom Bradley (IT) — not opened",
        rawLogLine: `2026-09-02 10:48:47 UTC EMAIL_GATEWAY action=DELIVERED from=billing@fakecorp-invoices-net.com to=tom.bradley@fakecorp-demo.com subject="Overdue Invoice #48291 - Immediate Action Required" attachment="Invoice_48291_Overdue.docx" attachment_hash=${MALWARE_SHA256} spf=FAIL dkim=NONE spam_score=6.2/10 msg_id=<7b2e9f01@fakecorp-invoices-net.com>`,
      },
      {
        timestamp: "2026-09-02T10:49:20Z",
        sourceType: "EMAIL_GATEWAY",
        employeeEmail: "daniel.wu@fakecorp-demo.com",
        eventSummary: "Same attachment also delivered to Daniel Wu (Executive) — not opened",
        rawLogLine: `2026-09-02 10:49:20 UTC EMAIL_GATEWAY action=DELIVERED from=billing@fakecorp-invoices-net.com to=daniel.wu@fakecorp-demo.com subject="Overdue Invoice #48291 - Immediate Action Required" attachment="Invoice_48291_Overdue.docx" attachment_hash=${MALWARE_SHA256} spf=FAIL dkim=NONE spam_score=6.2/10 msg_id=<7b2e9f01@fakecorp-invoices-net.com>`,
      },
      {
        timestamp: "2026-09-02T11:03:15Z",
        sourceType: "ENDPOINT",
        employeeEmail: "robert.chen@fakecorp-demo.com",
        eventSummary:
          "WINWORD.EXE spawned PowerShell with an encoded command shortly after Robert opened the attachment",
        rawLogLine: `EndpointID=WKS-RC-0847 EventID=1(ProcessCreate) Time=2026-09-02T11:03:15Z ParentImage=C:\\Program Files\\Microsoft Office\\root\\Office16\\WINWORD.EXE Image=C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe CommandLine="powershell.exe -nop -w hidden -enc JABzAD0ATgBlAHcALQBPAGIAagBlAGMAdAA..." sha256=${MALWARE_SHA256} User=FAKECORP\\robert.chen`,
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
      {
        timestamp: "2026-09-02T11:12:08Z",
        sourceType: "ENDPOINT",
        employeeEmail: "sandra.wilson@fakecorp-demo.com",
        eventSummary:
          "WINWORD.EXE spawned the same PowerShell payload on Sandra Wilson's workstation after she also opened the attachment",
        rawLogLine: `EndpointID=WKS-SW-0512 EventID=1(ProcessCreate) Time=2026-09-02T11:12:08Z ParentImage=C:\\Program Files\\Microsoft Office\\root\\Office16\\WINWORD.EXE Image=C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe CommandLine="powershell.exe -nop -w hidden -enc JABzAD0ATgBlAHcALQBPAGIAagBlAGMAdAA..." sha256=${MALWARE_SHA256} User=FAKECORP\\sandra.wilson`,
      },
      {
        timestamp: "2026-09-02T11:12:15Z",
        sourceType: "ENDPOINT",
        employeeEmail: "sandra.wilson@fakecorp-demo.com",
        eventSummary:
          "Endpoint AV quarantined the payload on Sandra Wilson's machine before it could establish persistence",
        rawLogLine: `EndpointID=WKS-SW-0512 EventID=AV_DETECTION Time=2026-09-02T11:12:15Z result=QUARANTINED threat_name=Trojan.PowerShell.Downloader sha256=${MALWARE_SHA256} engine=FakeDefender-v12.4 User=FAKECORP\\sandra.wilson`,
      },
    ],
  },
  {
    ticketNumber: "TRQ-1003",
    title: "Suspected CEO Fraud / Wire Transfer Request",
    description:
      "Priya Nair (Finance) received an email appearing to be from CEO Michael Ross requesting an urgent, confidential wire transfer or gift card purchase. She held off and reported it instead. This one is a targeted spear-phish, not a mass campaign — check whether anyone else received it before you conclude scope.",
    category: "PHISHING",
    severity: "HIGH",
    reportedEmail: {
      fromAddress: "michael.ross.ceo@fakecorp-demo.co",
      toEmployeeEmail: "priya.nair@fakecorp-demo.com",
      subject: "Quick Task – Confidential",
      body: "Priya,\n\nI need you to handle something for me quickly and confidentially. I'm currently in back-to-back meetings and can't take calls right now.\n\nWe're finalizing an urgent vendor payment that needs to go out today — I'll explain the details when I'm free, but for now I need you to process a wire transfer of $18,500 to the account I'll send separately, or alternatively purchase $2,000 in Amazon gift cards if the transfer can't be processed in time.\n\nPlease keep this between us for now until the deal is publicly announced. Let me know once it's done.\n\nThanks,\nMichael Ross\nCEO, FakeCorp Industries\nSent from my iPhone",
      rawHeaders:
        "Return-Path: <bounce@fakecorp-demo.co>\n" +
        "Received: from vps-22-104.hosting-provider.net (unknown [172.104.22.9])\n" +
        "\tby mx.fakecorp-demo.com (Postfix) with ESMTP id 1A9c3D7e\n" +
        "\tfor <priya.nair@fakecorp-demo.com>; Thu, 03 Sep 2026 09:02:09 +0000\n" +
        "Message-ID: <c93a1e02@fakecorp-demo.co>\n" +
        'From: "Michael Ross" <michael.ross.ceo@fakecorp-demo.co>\n' +
        "Reply-To: m.rossceo1972@protonmail.com\n" +
        "To: priya.nair@fakecorp-demo.com\n" +
        "Subject: Quick Task - Confidential\n" +
        "Date: Thu, 03 Sep 2026 09:02:07 +0000\n" +
        "MIME-Version: 1.0\n" +
        'Content-Type: text/plain; charset="UTF-8"\n' +
        "X-Originating-IP: [172.104.22.9]\n" +
        "Authentication-Results: mx.fakecorp-demo.com;\n" +
        "  spf=fail (sender IP is 172.104.22.9) smtp.mailfrom=michael.ross.ceo@fakecorp-demo.co;\n" +
        "  dkim=none (no signature);\n" +
        "  dmarc=fail (p=NONE sp=NONE dis=NONE) header.from=fakecorp-demo.co\n" +
        "Received-SPF: fail (mx.fakecorp-demo.com: domain of fakecorp-demo.co\n" +
        "  does not designate 172.104.22.9 as permitted sender)",
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
      "David Okafor (HR Recruiter) clicked a link to a fake careers portal to \"review a resume.\" He later noticed an unexpected MFA prompt and reported it. Same campaign hit other inboxes — check who else clicked and whether any of those attempts succeeded.",
    category: "PHISHING",
    severity: "CRITICAL",
    reportedEmail: {
      fromAddress: "careers-portal-notify@fakecorp-jobs-verify.net",
      toEmployeeEmail: "david.okafor@fakecorp-demo.com",
      subject: "New Candidate Application - Action Required to View Resume",
      body: "Hi David,\n\nA new candidate has submitted an application for the Senior Analyst position and included additional documents that require your review through our secure candidate portal.\n\nPlease log in using the link below to view the full application and resume before the position closes.\n\n[View Candidate Application]\n\nThis link will expire in 48 hours.\n\nBest,\nFakeCorp Careers Team",
      rawHeaders:
        "Return-Path: <bounce@fakecorp-jobs-verify.net>\n" +
        "Received: from mail.fakecorp-jobs-verify.net (unknown [194.5.250.18])\n" +
        "\tby mx.fakecorp-demo.com (Postfix) with ESMTP id 2E7bA0c1\n" +
        "\tfor <david.okafor@fakecorp-demo.com>; Fri, 04 Sep 2026 14:12:38 +0000\n" +
        "Message-ID: <55d1a8b3@fakecorp-jobs-verify.net>\n" +
        'From: "FakeCorp Careers Team" <careers-portal-notify@fakecorp-jobs-verify.net>\n' +
        "To: david.okafor@fakecorp-demo.com\n" +
        "Subject: New Candidate Application - Action Required to View Resume\n" +
        "Date: Fri, 04 Sep 2026 14:12:35 +0000\n" +
        "MIME-Version: 1.0\n" +
        'Content-Type: text/html; charset="UTF-8"\n' +
        "X-Originating-IP: [194.5.250.18]\n" +
        "Authentication-Results: mx.fakecorp-demo.com;\n" +
        "  spf=fail (sender IP is 194.5.250.18) smtp.mailfrom=careers-portal-notify@fakecorp-jobs-verify.net;\n" +
        "  dkim=fail (body hash did not verify) header.d=fakecorp-jobs-verify.net;\n" +
        "  dmarc=fail (p=NONE sp=NONE dis=NONE) header.from=fakecorp-jobs-verify.net\n" +
        "Received-SPF: fail (mx.fakecorp-demo.com: domain of fakecorp-jobs-verify.net\n" +
        "  does not designate 194.5.250.18 as permitted sender)",
      linkUrl: "http://fakecorp-careers-secure.net/portal/login",
    },
    logs: [
      {
        timestamp: "2026-09-04T14:12:40Z",
        sourceType: "EMAIL_GATEWAY",
        employeeEmail: "david.okafor@fakecorp-demo.com",
        eventSummary: "Email with fake careers portal link delivered to Recruiter David Okafor",
        rawLogLine:
          '2026-09-04 14:12:40 UTC EMAIL_GATEWAY action=DELIVERED from=careers-portal-notify@fakecorp-jobs-verify.net to=david.okafor@fakecorp-demo.com subject="New Candidate Application - Action Required to View Resume" url=http://fakecorp-careers-secure.net/portal/login spf=FAIL dkim=FAIL spam_score=6.9/10 msg_id=<55d1a8b3@fakecorp-jobs-verify.net>',
      },
      {
        timestamp: "2026-09-04T14:13:02Z",
        sourceType: "EMAIL_GATEWAY",
        employeeEmail: "james.patel@fakecorp-demo.com",
        eventSummary: "Same email also delivered to James Patel (IT)",
        rawLogLine:
          '2026-09-04 14:13:02 UTC EMAIL_GATEWAY action=DELIVERED from=careers-portal-notify@fakecorp-jobs-verify.net to=james.patel@fakecorp-demo.com subject="New Candidate Application - Action Required to View Resume" url=http://fakecorp-careers-secure.net/portal/login spf=FAIL dkim=FAIL spam_score=6.9/10 msg_id=<55d1a8b3@fakecorp-jobs-verify.net>',
      },
      {
        timestamp: "2026-09-04T14:13:35Z",
        sourceType: "EMAIL_GATEWAY",
        employeeEmail: "linda.martinez@fakecorp-demo.com",
        eventSummary: "Same email also delivered to Linda Martinez (HR) — not clicked",
        rawLogLine:
          '2026-09-04 14:13:35 UTC EMAIL_GATEWAY action=DELIVERED from=careers-portal-notify@fakecorp-jobs-verify.net to=linda.martinez@fakecorp-demo.com subject="New Candidate Application - Action Required to View Resume" url=http://fakecorp-careers-secure.net/portal/login spf=FAIL dkim=FAIL spam_score=6.9/10 msg_id=<55d1a8b3@fakecorp-jobs-verify.net>',
      },
      {
        timestamp: "2026-09-04T14:14:01Z",
        sourceType: "EMAIL_GATEWAY",
        employeeEmail: "tom.bradley@fakecorp-demo.com",
        eventSummary: "Same email also delivered to Tom Bradley (IT) — not clicked",
        rawLogLine:
          '2026-09-04 14:14:01 UTC EMAIL_GATEWAY action=DELIVERED from=careers-portal-notify@fakecorp-jobs-verify.net to=tom.bradley@fakecorp-demo.com subject="New Candidate Application - Action Required to View Resume" url=http://fakecorp-careers-secure.net/portal/login spf=FAIL dkim=FAIL spam_score=6.9/10 msg_id=<55d1a8b3@fakecorp-jobs-verify.net>',
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
        timestamp: "2026-09-04T14:25:10Z",
        sourceType: "AUTHENTICATION",
        employeeEmail: "james.patel@fakecorp-demo.com",
        eventSummary:
          "A login attempt for James Patel from the same suspicious Lagos IP was blocked when he denied the MFA push",
        rawLogLine:
          '2026-09-04T14:25:10Z AUTH_EVENT user=james.patel@fakecorp-demo.com result=BLOCKED auth_method=PASSWORD+MFA ip=103.75.190.22 geo="Lagos, Nigeria" device=Unknown-Android-Chrome mfa_status=DENIED reason="User did not approve MFA push" risk_level=HIGH session_id=7d2f9a1c44',
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
      "Alex Johnson (Sales) received a PDF proposal from an external partner he'd recently spoken with and reported it out of caution since the sender was unfamiliar to the mail system. This is a genuine 1:1 business email, not a campaign — searching its hash elsewhere should come back clean.",
    category: "PHISHING",
    severity: "LOW",
    reportedEmail: {
      fromAddress: "accounts@partnersupplyco-demo.com",
      toEmployeeEmail: "alex.johnson@fakecorp-demo.com",
      subject: "Q3 Partnership Proposal - Attached for Review",
      body: "Hello Alex,\n\nThank you for your time on our call last week. As discussed, please find attached our Q3 partnership proposal for your review.\n\nWe'd welcome the opportunity to discuss this further at your convenience. Please let us know if you have any questions.\n\nBest regards,\nJennifer Osei\nPartner Supply Co.",
      rawHeaders:
        "Return-Path: <bounce@partnersupplyco-demo.com>\n" +
        "Received: from mail-eastus.outbound.protection.partnersupplyco-demo.com (unknown [40.107.220.34])\n" +
        "\tby mx.fakecorp-demo.com (Postfix) with ESMTPS id 9F2dC4b6\n" +
        "\tfor <alex.johnson@fakecorp-demo.com>; Sat, 05 Sep 2026 13:20:03 +0000\n" +
        "Message-ID: <f02b8a11@partnersupplyco-demo.com>\n" +
        'From: "Jennifer Osei" <accounts@partnersupplyco-demo.com>\n' +
        "To: alex.johnson@fakecorp-demo.com\n" +
        "Subject: Q3 Partnership Proposal - Attached for Review\n" +
        "Date: Sat, 05 Sep 2026 13:19:58 +0000\n" +
        "MIME-Version: 1.0\n" +
        'Content-Type: multipart/mixed; boundary="=_boundary_q3proposal"\n' +
        "X-Originating-IP: [40.107.220.34]\n" +
        "Authentication-Results: mx.fakecorp-demo.com;\n" +
        "  spf=pass (sender IP is 40.107.220.34) smtp.mailfrom=accounts@partnersupplyco-demo.com;\n" +
        "  dkim=pass header.d=partnersupplyco-demo.com;\n" +
        "  dmarc=pass (p=REJECT sp=REJECT dis=NONE) header.from=partnersupplyco-demo.com\n" +
        "Received-SPF: pass (mx.fakecorp-demo.com: domain of partnersupplyco-demo.com\n" +
        "  designates 40.107.220.34 as permitted sender)",
      attachmentName: "Q3_Partnership_Proposal.pdf",
      attachmentHash: BENIGN_SHA256,
    },
    logs: [
      {
        timestamp: "2026-09-05T13:20:05Z",
        sourceType: "EMAIL_GATEWAY",
        employeeEmail: "alex.johnson@fakecorp-demo.com",
        eventSummary:
          "Email with PDF attachment from an external partner delivered to Sales Manager Alex Johnson, passed standard filtering",
        rawLogLine: `2026-09-05 13:20:05 UTC EMAIL_GATEWAY action=DELIVERED from=accounts@partnersupplyco-demo.com to=alex.johnson@fakecorp-demo.com subject="Q3 Partnership Proposal - Attached for Review" attachment="Q3_Partnership_Proposal.pdf" attachment_hash=${BENIGN_SHA256} spf=PASS dkim=PASS dmarc=PASS spam_score=0.4/10 msg_id=<f02b8a11@partnersupplyco-demo.com>`,
      },
      {
        timestamp: "2026-09-05T13:41:52Z",
        sourceType: "ENDPOINT",
        employeeEmail: "alex.johnson@fakecorp-demo.com",
        eventSummary:
          "PDF opened normally in the default viewer on Alex Johnson's workstation — no child process spawned",
        rawLogLine: `EndpointID=WKS-AJ-0392 EventID=1(ProcessCreate) Time=2026-09-05T13:41:52Z ParentImage=C:\\Windows\\explorer.exe Image=C:\\Program Files\\Adobe\\Acrobat DC\\Acrobat\\Acrobat.exe CommandLine="Acrobat.exe \\"Q3_Partnership_Proposal.pdf\\"" sha256=${BENIGN_SHA256} User=FAKECORP\\alex.johnson`,
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
  {
    ticketNumber: "TRQ-1006",
    title: "Password Expiration Notice Reported by Finance Manager",
    description:
      "Meera Iyer (Finance) reported an automated password-expiration email as suspicious because of its urgent tone. Verify whether this is genuine IT communication before treating it as an incident.",
    category: "PHISHING",
    severity: "LOW",
    reportedEmail: {
      fromAddress: "it-support@fakecorp-demo.com",
      toEmployeeEmail: "meera.iyer@fakecorp-demo.com",
      subject: "Password Expiration Notice - Action Required Within 5 Days",
      body: "Hello Meera,\n\nOur records show that your FakeCorp network password will expire in 5 days. To avoid any interruption to your account access, please update your password using the internal self-service portal below.\n\nhttps://portal.fakecorp-demo.com/password-reset\n\nIf you have any trouble accessing the portal, contact the IT Helpdesk at extension 4400.\n\nThank you,\nIT Support\nFakeCorp Industries",
      rawHeaders:
        "Return-Path: <it-support-bounce@fakecorp-demo.com>\n" +
        "Received: from mail-internal-02.fakecorp-demo.com (mail-internal-02.fakecorp-demo.com [10.10.5.12])\n" +
        "\tby mx.fakecorp-demo.com (Postfix) with ESMTPS id 6C1eF9a3\n" +
        "\tfor <meera.iyer@fakecorp-demo.com>; Sun, 06 Sep 2026 09:00:11 +0000\n" +
        "Message-ID: <8f4a2c11@fakecorp-demo.com>\n" +
        'From: "IT Support" <it-support@fakecorp-demo.com>\n' +
        "To: meera.iyer@fakecorp-demo.com\n" +
        "Subject: Password Expiration Notice - Action Required Within 5 Days\n" +
        "Date: Sun, 06 Sep 2026 09:00:08 +0000\n" +
        "MIME-Version: 1.0\n" +
        'Content-Type: text/plain; charset="UTF-8"\n' +
        "X-Originating-IP: [10.10.5.12]\n" +
        "Authentication-Results: mx.fakecorp-demo.com;\n" +
        "  spf=pass (sender IP is 10.10.5.12) smtp.mailfrom=it-support@fakecorp-demo.com;\n" +
        "  dkim=pass header.d=fakecorp-demo.com;\n" +
        "  dmarc=pass (p=REJECT sp=REJECT dis=NONE) header.from=fakecorp-demo.com\n" +
        "Received-SPF: pass (mx.fakecorp-demo.com: domain of fakecorp-demo.com\n" +
        "  designates 10.10.5.12 as permitted sender)",
      linkUrl: "https://portal.fakecorp-demo.com/password-reset",
    },
    logs: [
      {
        timestamp: "2026-09-06T09:00:11Z",
        sourceType: "EMAIL_GATEWAY",
        employeeEmail: "meera.iyer@fakecorp-demo.com",
        eventSummary:
          "Automated password-expiration notice delivered from the real internal IT-support mailer (SPF/DKIM/DMARC all pass)",
        rawLogLine:
          '2026-09-06 09:00:11 UTC EMAIL_GATEWAY action=DELIVERED from=it-support@fakecorp-demo.com to=meera.iyer@fakecorp-demo.com subject="Password Expiration Notice - Action Required Within 5 Days" url=https://portal.fakecorp-demo.com/password-reset spf=PASS dkim=PASS dmarc=PASS spam_score=0.2/10 msg_id=<8f4a2c11@fakecorp-demo.com>',
      },
      {
        timestamp: "2026-09-06T09:00:22Z",
        sourceType: "EMAIL_GATEWAY",
        employeeEmail: "tom.bradley@fakecorp-demo.com",
        eventSummary: "Same automated notice also delivered to Tom Bradley (IT)",
        rawLogLine:
          '2026-09-06 09:00:22 UTC EMAIL_GATEWAY action=DELIVERED from=it-support@fakecorp-demo.com to=tom.bradley@fakecorp-demo.com subject="Password Expiration Notice - Action Required Within 5 Days" url=https://portal.fakecorp-demo.com/password-reset spf=PASS dkim=PASS dmarc=PASS spam_score=0.2/10 msg_id=<8f4a2c11@fakecorp-demo.com>',
      },
      {
        timestamp: "2026-09-06T09:00:31Z",
        sourceType: "EMAIL_GATEWAY",
        employeeEmail: "angela.foster@fakecorp-demo.com",
        eventSummary: "Same automated notice also delivered to Angela Foster (Executive)",
        rawLogLine:
          '2026-09-06 09:00:31 UTC EMAIL_GATEWAY action=DELIVERED from=it-support@fakecorp-demo.com to=angela.foster@fakecorp-demo.com subject="Password Expiration Notice - Action Required Within 5 Days" url=https://portal.fakecorp-demo.com/password-reset spf=PASS dkim=PASS dmarc=PASS spam_score=0.2/10 msg_id=<8f4a2c11@fakecorp-demo.com>',
      },
      {
        timestamp: "2026-09-06T09:00:44Z",
        sourceType: "EMAIL_GATEWAY",
        employeeEmail: "karan.mehta@fakecorp-demo.com",
        eventSummary: "Same automated notice also delivered to Karan Mehta (Sales)",
        rawLogLine:
          '2026-09-06 09:00:44 UTC EMAIL_GATEWAY action=DELIVERED from=it-support@fakecorp-demo.com to=karan.mehta@fakecorp-demo.com subject="Password Expiration Notice - Action Required Within 5 Days" url=https://portal.fakecorp-demo.com/password-reset spf=PASS dkim=PASS dmarc=PASS spam_score=0.2/10 msg_id=<8f4a2c11@fakecorp-demo.com>',
      },
      {
        timestamp: "2026-09-06T09:00:58Z",
        sourceType: "EMAIL_GATEWAY",
        employeeEmail: "sandra.wilson@fakecorp-demo.com",
        eventSummary: "Same automated notice also delivered to Sandra Wilson (HR)",
        rawLogLine:
          '2026-09-06 09:00:58 UTC EMAIL_GATEWAY action=DELIVERED from=it-support@fakecorp-demo.com to=sandra.wilson@fakecorp-demo.com subject="Password Expiration Notice - Action Required Within 5 Days" url=https://portal.fakecorp-demo.com/password-reset spf=PASS dkim=PASS dmarc=PASS spam_score=0.2/10 msg_id=<8f4a2c11@fakecorp-demo.com>',
      },
      {
        timestamp: "2026-09-06T09:14:02Z",
        sourceType: "NETWORK",
        employeeEmail: "meera.iyer@fakecorp-demo.com",
        eventSummary:
          "Meera Iyer's workstation loaded the internal password-reset portal normally (200 OK, internal domain)",
        rawLogLine:
          '2026-09-06T09:14:02Z NETWORK_EVENT user=meera.iyer@fakecorp-demo.com src_ip=10.20.3.41 dest_url=https://portal.fakecorp-demo.com/password-reset action=ALLOWED category=INTERNAL_IT http_method=GET status=200 user_agent="Mozilla/5.0 (Windows NT 10.0)"',
      },
      {
        timestamp: "2026-09-06T09:15:10Z",
        sourceType: "AUTHENTICATION",
        employeeEmail: "meera.iyer@fakecorp-demo.com",
        eventSummary:
          "Meera Iyer completed a normal, self-initiated password change from her usual device and location",
        rawLogLine:
          '2026-09-06T09:15:10Z AUTH_EVENT event=PASSWORD_CHANGED user=meera.iyer@fakecorp-demo.com result=SUCCESS ip=10.20.3.41 geo="Austin, TX, US" device=Known-Windows-Edge mfa_status=APPROVED risk_level=LOW',
      },
    ],
  },
  {
    ticketNumber: "TRQ-1007",
    title: "Fake Document-Share Link Leads to Confirmed Credential Compromise",
    description:
      "Rachel Kim (IT) reported a \"document shared with you\" email with a link to review it. She's not sure whether she entered her password on the page that opened. Same campaign hit several other employees — establish who clicked, who entered credentials, and whether any account was actually compromised.",
    category: "PHISHING",
    severity: "CRITICAL",
    reportedEmail: {
      fromAddress: "notifications@fakecorp-docshare-online.com",
      toEmployeeEmail: "rachel.kim@fakecorp-demo.com",
      subject: "A document has been shared with you: Q4_Budget_Review.xlsx",
      body: "Hi Rachel,\n\nA colleague has shared a document with you via SecureDocs Online.\n\nDocument: Q4_Budget_Review.xlsx\nShared by: Finance Team\n\nClick below to view the document. You may be asked to sign in with your company email to confirm access.\n\n[View Document]\n\nThis link is valid for 24 hours.\n\nSecureDocs Online",
      rawHeaders:
        "Return-Path: <bounce@fakecorp-docshare-online.com>\n" +
        "Received: from mail.fakecorp-docshare-online.com (unknown [45.148.10.22])\n" +
        "\tby mx.fakecorp-demo.com (Postfix) with ESMTP id 3D8gH2j5\n" +
        "\tfor <rachel.kim@fakecorp-demo.com>; Mon, 07 Sep 2026 10:05:14 +0000\n" +
        "Message-ID: <e91b4f22@fakecorp-docshare-online.com>\n" +
        'From: "SecureDocs Online" <notifications@fakecorp-docshare-online.com>\n' +
        "To: rachel.kim@fakecorp-demo.com\n" +
        "Subject: A document has been shared with you: Q4_Budget_Review.xlsx\n" +
        "Date: Mon, 07 Sep 2026 10:05:11 +0000\n" +
        "MIME-Version: 1.0\n" +
        'Content-Type: text/html; charset="UTF-8"\n' +
        "X-Originating-IP: [45.148.10.22]\n" +
        "Authentication-Results: mx.fakecorp-demo.com;\n" +
        "  spf=fail (sender IP is 45.148.10.22) smtp.mailfrom=notifications@fakecorp-docshare-online.com;\n" +
        "  dkim=fail (no signature) header.d=none;\n" +
        "  dmarc=fail (p=NONE sp=NONE dis=NONE) header.from=fakecorp-docshare-online.com\n" +
        "Received-SPF: fail (mx.fakecorp-demo.com: domain of fakecorp-docshare-online.com\n" +
        "  does not designate 45.148.10.22 as permitted sender)",
      linkUrl: "http://fakecorp-docshare-online.com/view?doc=8827",
    },
    logs: [
      {
        timestamp: "2026-09-07T10:05:14Z",
        sourceType: "EMAIL_GATEWAY",
        employeeEmail: "rachel.kim@fakecorp-demo.com",
        eventSummary:
          "Fake document-share email delivered to Systems Administrator Rachel Kim from a lookalike domain",
        rawLogLine:
          '2026-09-07 10:05:14 UTC EMAIL_GATEWAY action=DELIVERED from=notifications@fakecorp-docshare-online.com to=rachel.kim@fakecorp-demo.com subject="A document has been shared with you: Q4_Budget_Review.xlsx" url=http://fakecorp-docshare-online.com/view?doc=8827 spf=FAIL dkim=FAIL dmarc=FAIL spam_score=6.5/10 msg_id=<e91b4f22@fakecorp-docshare-online.com>',
      },
      {
        timestamp: "2026-09-07T10:05:29Z",
        sourceType: "EMAIL_GATEWAY",
        employeeEmail: "james.patel@fakecorp-demo.com",
        eventSummary: "Same campaign also delivered to James Patel (IT)",
        rawLogLine:
          '2026-09-07 10:05:29 UTC EMAIL_GATEWAY action=DELIVERED from=notifications@fakecorp-docshare-online.com to=james.patel@fakecorp-demo.com subject="A document has been shared with you: Q4_Budget_Review.xlsx" url=http://fakecorp-docshare-online.com/view?doc=8827 spf=FAIL dkim=FAIL dmarc=FAIL spam_score=6.5/10 msg_id=<e91b4f22@fakecorp-docshare-online.com>',
      },
      {
        timestamp: "2026-09-07T10:05:41Z",
        sourceType: "EMAIL_GATEWAY",
        employeeEmail: "daniel.wu@fakecorp-demo.com",
        eventSummary: "Same campaign also delivered to Daniel Wu (Executive) — not clicked",
        rawLogLine:
          '2026-09-07 10:05:41 UTC EMAIL_GATEWAY action=DELIVERED from=notifications@fakecorp-docshare-online.com to=daniel.wu@fakecorp-demo.com subject="A document has been shared with you: Q4_Budget_Review.xlsx" url=http://fakecorp-docshare-online.com/view?doc=8827 spf=FAIL dkim=FAIL dmarc=FAIL spam_score=6.5/10 msg_id=<e91b4f22@fakecorp-docshare-online.com>',
      },
      {
        timestamp: "2026-09-07T10:05:53Z",
        sourceType: "EMAIL_GATEWAY",
        employeeEmail: "sophie.turner@fakecorp-demo.com",
        eventSummary: "Same campaign also delivered to Sophie Turner (Sales) — not clicked",
        rawLogLine:
          '2026-09-07 10:05:53 UTC EMAIL_GATEWAY action=DELIVERED from=notifications@fakecorp-docshare-online.com to=sophie.turner@fakecorp-demo.com subject="A document has been shared with you: Q4_Budget_Review.xlsx" url=http://fakecorp-docshare-online.com/view?doc=8827 spf=FAIL dkim=FAIL dmarc=FAIL spam_score=6.5/10 msg_id=<e91b4f22@fakecorp-docshare-online.com>',
      },
      {
        timestamp: "2026-09-07T10:06:05Z",
        sourceType: "EMAIL_GATEWAY",
        employeeEmail: "linda.martinez@fakecorp-demo.com",
        eventSummary: "Same campaign also delivered to Linda Martinez (HR)",
        rawLogLine:
          '2026-09-07 10:06:05 UTC EMAIL_GATEWAY action=DELIVERED from=notifications@fakecorp-docshare-online.com to=linda.martinez@fakecorp-demo.com subject="A document has been shared with you: Q4_Budget_Review.xlsx" url=http://fakecorp-docshare-online.com/view?doc=8827 spf=FAIL dkim=FAIL dmarc=FAIL spam_score=6.5/10 msg_id=<e91b4f22@fakecorp-docshare-online.com>',
      },
      {
        timestamp: "2026-09-07T10:11:20Z",
        sourceType: "NETWORK",
        employeeEmail: "rachel.kim@fakecorp-demo.com",
        eventSummary:
          "Rachel Kim's workstation loaded the fake login page while the phishing site was still live (200 OK)",
        rawLogLine:
          '2026-09-07T10:11:20Z NETWORK_EVENT user=rachel.kim@fakecorp-demo.com src_ip=10.20.6.18 dest_url=http://fakecorp-docshare-online.com/view?doc=8827 action=ALLOWED category=UNCATEGORIZED http_method=GET status=200 user_agent="Mozilla/5.0 (Windows NT 10.0)"',
      },
      {
        timestamp: "2026-09-07T10:12:40Z",
        sourceType: "AUTHENTICATION",
        employeeEmail: "rachel.kim@fakecorp-demo.com",
        eventSummary:
          "Successful sign-in for Rachel Kim from an unrecognized external IP minutes after she loaded the fake login page — no MFA challenge",
        rawLogLine:
          '2026-09-07T10:12:40Z AUTH_EVENT user=rachel.kim@fakecorp-demo.com result=SUCCESS auth_method=PASSWORD ip=45.148.10.22 geo="Amsterdam, Netherlands" device=Unknown-Linux-Chrome mfa_status=NOT_ENROLLED risk_level=CRITICAL session_id=6f1c8e2a90',
      },
      {
        timestamp: "2026-09-07T10:19:07Z",
        sourceType: "NETWORK",
        employeeEmail: "james.patel@fakecorp-demo.com",
        eventSummary:
          "James Patel's workstation also loaded the fake login page (200 OK) but he closed the tab without entering anything",
        rawLogLine:
          '2026-09-07T10:19:07Z NETWORK_EVENT user=james.patel@fakecorp-demo.com src_ip=10.20.4.62 dest_url=http://fakecorp-docshare-online.com/view?doc=8827 action=ALLOWED category=UNCATEGORIZED http_method=GET status=200 user_agent="Mozilla/5.0 (Windows NT 10.0)"',
      },
      {
        timestamp: "2026-09-07T14:02:51Z",
        sourceType: "NETWORK",
        employeeEmail: "linda.martinez@fakecorp-demo.com",
        eventSummary:
          "Linda Martinez clicked the same link hours later, after the phishing site had already been taken down (404)",
        rawLogLine:
          '2026-09-07T14:02:51Z NETWORK_EVENT user=linda.martinez@fakecorp-demo.com src_ip=10.20.7.09 dest_url=http://fakecorp-docshare-online.com/view?doc=8827 action=ALLOWED category=UNCATEGORIZED http_method=GET status=404 user_agent="Mozilla/5.0 (Windows NT 10.0)"',
      },
    ],
  },
  {
    ticketNumber: "TRQ-1008",
    title: "Unfamiliar Vendor Newsletter Reported by CFO",
    description:
      "Angela Foster (CFO) reported a product-update newsletter from a budgeting tool the company subscribes to, because she didn't personally recognize the sender. Confirm whether this is a legitimate vendor communication.",
    category: "PHISHING",
    severity: "LOW",
    reportedEmail: {
      fromAddress: "newsletter@realbudgetsoft-demo.com",
      toEmployeeEmail: "angela.foster@fakecorp-demo.com",
      subject: "New Features in Your March Release: Automated Expense Reports",
      body: "Hi Angela,\n\nWe've just shipped a new feature we think your team will love: fully automated expense report generation, available now on your plan.\n\nRead the full release notes on our blog to see what's new and how to enable it for your workspace.\n\n[Read More]\n\nAs always, thank you for being a RealBudgetSoft customer.\n\nThe RealBudgetSoft Team\n\nYou're receiving this because you're subscribed to product updates. Unsubscribe anytime from your account settings.",
      rawHeaders:
        "Return-Path: <bounce@realbudgetsoft-demo.com>\n" +
        "Received: from mail-outbound-3.realbudgetsoft-demo.com (mail-outbound-3.realbudgetsoft-demo.com [52.14.22.8])\n" +
        "\tby mx.fakecorp-demo.com (Postfix) with ESMTPS id 7A2eD8f4\n" +
        "\tfor <angela.foster@fakecorp-demo.com>; Mon, 07 Sep 2026 16:30:02 +0000\n" +
        "Message-ID: <d02f7a19@realbudgetsoft-demo.com>\n" +
        'From: "The RealBudgetSoft Team" <newsletter@realbudgetsoft-demo.com>\n' +
        "To: angela.foster@fakecorp-demo.com\n" +
        "Subject: New Features in Your March Release: Automated Expense Reports\n" +
        "Date: Mon, 07 Sep 2026 16:29:58 +0000\n" +
        "MIME-Version: 1.0\n" +
        'Content-Type: text/html; charset="UTF-8"\n' +
        "List-Unsubscribe: <https://realbudgetsoft-demo.com/unsubscribe?id=9182>\n" +
        "X-Originating-IP: [52.14.22.8]\n" +
        "Authentication-Results: mx.fakecorp-demo.com;\n" +
        "  spf=pass (sender IP is 52.14.22.8) smtp.mailfrom=newsletter@realbudgetsoft-demo.com;\n" +
        "  dkim=pass header.d=realbudgetsoft-demo.com;\n" +
        "  dmarc=pass (p=QUARANTINE sp=QUARANTINE dis=NONE) header.from=realbudgetsoft-demo.com\n" +
        "Received-SPF: pass (mx.fakecorp-demo.com: domain of realbudgetsoft-demo.com\n" +
        "  designates 52.14.22.8 as permitted sender)",
      linkUrl: "https://realbudgetsoft-demo.com/blog/march-release",
    },
    logs: [
      {
        timestamp: "2026-09-07T16:30:02Z",
        sourceType: "EMAIL_GATEWAY",
        employeeEmail: "angela.foster@fakecorp-demo.com",
        eventSummary:
          "Product newsletter from the company's actual budgeting vendor delivered to CFO Angela Foster (SPF/DKIM/DMARC all pass)",
        rawLogLine:
          '2026-09-07 16:30:02 UTC EMAIL_GATEWAY action=DELIVERED from=newsletter@realbudgetsoft-demo.com to=angela.foster@fakecorp-demo.com subject="New Features in Your March Release: Automated Expense Reports" url=https://realbudgetsoft-demo.com/blog/march-release spf=PASS dkim=PASS dmarc=PASS spam_score=0.6/10 msg_id=<d02f7a19@realbudgetsoft-demo.com>',
      },
      {
        timestamp: "2026-09-07T16:30:15Z",
        sourceType: "EMAIL_GATEWAY",
        employeeEmail: "michael.ross@fakecorp-demo.com",
        eventSummary: "Same newsletter also delivered to CEO Michael Ross (also subscribed)",
        rawLogLine:
          '2026-09-07 16:30:15 UTC EMAIL_GATEWAY action=DELIVERED from=newsletter@realbudgetsoft-demo.com to=michael.ross@fakecorp-demo.com subject="New Features in Your March Release: Automated Expense Reports" url=https://realbudgetsoft-demo.com/blog/march-release spf=PASS dkim=PASS dmarc=PASS spam_score=0.6/10 msg_id=<d02f7a19@realbudgetsoft-demo.com>',
      },
      {
        timestamp: "2026-09-07T16:41:33Z",
        sourceType: "NETWORK",
        employeeEmail: "angela.foster@fakecorp-demo.com",
        eventSummary:
          "Angela Foster's workstation loaded the vendor's blog post normally (200 OK, legitimate vendor domain)",
        rawLogLine:
          '2026-09-07T16:41:33Z NETWORK_EVENT user=angela.foster@fakecorp-demo.com src_ip=10.20.2.05 dest_url=https://realbudgetsoft-demo.com/blog/march-release action=ALLOWED category=BUSINESS_SOFTWARE http_method=GET status=200 user_agent="Mozilla/5.0 (Windows NT 10.0)"',
      },
    ],
  },
  {
    ticketNumber: "TRQ-1009",
    title: "Fake E-Signature Request Leads to Malware Execution",
    description:
      "Karan Mehta (Sales) reported an email asking him to review and sign a contract, either via a link or an attached preview copy. He downloaded the attachment after the link looked wrong. Same campaign hit several other employees — figure out who interacted with the link, who opened the attachment, and whether the link still works.",
    category: "PHISHING",
    severity: "CRITICAL",
    reportedEmail: {
      fromAddress: "esign-notify@fakecorp-esignature-verify.com",
      toEmployeeEmail: "karan.mehta@fakecorp-demo.com",
      subject: "Action Required: Please Review and Sign Contract #77452",
      body: "Hello,\n\nYou have a document waiting for your electronic signature.\n\nContract #77452 — Vendor Services Agreement\n\nClick below to review and sign online, or open the attached preview copy if you'd prefer to review it offline first.\n\n[Review & Sign Document]\n\nThis request will expire in 72 hours.\n\nRegards,\nDocument Services",
      rawHeaders:
        "Return-Path: <bounce@fakecorp-esignature-verify.com>\n" +
        "Received: from mail.fakecorp-esignature-verify.com (unknown [185.220.102.15])\n" +
        "\tby mx.fakecorp-demo.com (Postfix) with ESMTP id 5F9hJ3k7\n" +
        "\tfor <karan.mehta@fakecorp-demo.com>; Tue, 08 Sep 2026 11:20:04 +0000\n" +
        "Message-ID: <2b7d9e44@fakecorp-esignature-verify.com>\n" +
        'From: "Document Services" <esign-notify@fakecorp-esignature-verify.com>\n' +
        "To: karan.mehta@fakecorp-demo.com\n" +
        "Subject: Action Required: Please Review and Sign Contract #77452\n" +
        "Date: Tue, 08 Sep 2026 11:20:01 +0000\n" +
        "MIME-Version: 1.0\n" +
        'Content-Type: multipart/mixed; boundary="=_boundary_contract77452"\n' +
        "X-Originating-IP: [185.220.102.15]\n" +
        "Authentication-Results: mx.fakecorp-demo.com;\n" +
        "  spf=fail (sender IP is 185.220.102.15) smtp.mailfrom=esign-notify@fakecorp-esignature-verify.com;\n" +
        "  dkim=fail (no signature) header.d=none;\n" +
        "  dmarc=fail (p=NONE sp=NONE dis=NONE) header.from=fakecorp-esignature-verify.com\n" +
        "Received-SPF: fail (mx.fakecorp-demo.com: domain of fakecorp-esignature-verify.com\n" +
        "  does not designate 185.220.102.15 as permitted sender)",
      linkUrl: "http://fakecorp-esignature-verify.com/sign/77452",
      attachmentName: "Contract_77452_Preview.pdf",
      attachmentHash: ESIGN_MALWARE_SHA256,
    },
    logs: [
      {
        timestamp: "2026-09-08T11:20:04Z",
        sourceType: "EMAIL_GATEWAY",
        employeeEmail: "karan.mehta@fakecorp-demo.com",
        eventSummary:
          "Fake e-signature request with both a link and an attachment delivered to Karan Mehta (Sales)",
        rawLogLine: `2026-09-08 11:20:04 UTC EMAIL_GATEWAY action=DELIVERED from=esign-notify@fakecorp-esignature-verify.com to=karan.mehta@fakecorp-demo.com subject="Action Required: Please Review and Sign Contract #77452" url=http://fakecorp-esignature-verify.com/sign/77452 attachment="Contract_77452_Preview.pdf" attachment_hash=${ESIGN_MALWARE_SHA256} spf=FAIL dkim=FAIL dmarc=FAIL spam_score=7.1/10 msg_id=<2b7d9e44@fakecorp-esignature-verify.com>`,
      },
      {
        timestamp: "2026-09-08T11:20:19Z",
        sourceType: "EMAIL_GATEWAY",
        employeeEmail: "alex.johnson@fakecorp-demo.com",
        eventSummary: "Same campaign also delivered to Alex Johnson (Sales)",
        rawLogLine: `2026-09-08 11:20:19 UTC EMAIL_GATEWAY action=DELIVERED from=esign-notify@fakecorp-esignature-verify.com to=alex.johnson@fakecorp-demo.com subject="Action Required: Please Review and Sign Contract #77452" url=http://fakecorp-esignature-verify.com/sign/77452 attachment="Contract_77452_Preview.pdf" attachment_hash=${ESIGN_MALWARE_SHA256} spf=FAIL dkim=FAIL dmarc=FAIL spam_score=7.1/10 msg_id=<2b7d9e44@fakecorp-esignature-verify.com>`,
      },
      {
        timestamp: "2026-09-08T11:20:33Z",
        sourceType: "EMAIL_GATEWAY",
        employeeEmail: "priya.nair@fakecorp-demo.com",
        eventSummary: "Same campaign also delivered to Priya Nair (Finance) — no interaction",
        rawLogLine: `2026-09-08 11:20:33 UTC EMAIL_GATEWAY action=DELIVERED from=esign-notify@fakecorp-esignature-verify.com to=priya.nair@fakecorp-demo.com subject="Action Required: Please Review and Sign Contract #77452" url=http://fakecorp-esignature-verify.com/sign/77452 attachment="Contract_77452_Preview.pdf" attachment_hash=${ESIGN_MALWARE_SHA256} spf=FAIL dkim=FAIL dmarc=FAIL spam_score=7.1/10 msg_id=<2b7d9e44@fakecorp-esignature-verify.com>`,
      },
      {
        timestamp: "2026-09-08T11:20:47Z",
        sourceType: "EMAIL_GATEWAY",
        employeeEmail: "sandra.wilson@fakecorp-demo.com",
        eventSummary: "Same campaign also delivered to Sandra Wilson (HR) — no interaction",
        rawLogLine: `2026-09-08 11:20:47 UTC EMAIL_GATEWAY action=DELIVERED from=esign-notify@fakecorp-esignature-verify.com to=sandra.wilson@fakecorp-demo.com subject="Action Required: Please Review and Sign Contract #77452" url=http://fakecorp-esignature-verify.com/sign/77452 attachment="Contract_77452_Preview.pdf" attachment_hash=${ESIGN_MALWARE_SHA256} spf=FAIL dkim=FAIL dmarc=FAIL spam_score=7.1/10 msg_id=<2b7d9e44@fakecorp-esignature-verify.com>`,
      },
      {
        timestamp: "2026-09-08T11:21:02Z",
        sourceType: "EMAIL_GATEWAY",
        employeeEmail: "tom.bradley@fakecorp-demo.com",
        eventSummary: "Same campaign also delivered to Tom Bradley (IT) — no interaction",
        rawLogLine: `2026-09-08 11:21:02 UTC EMAIL_GATEWAY action=DELIVERED from=esign-notify@fakecorp-esignature-verify.com to=tom.bradley@fakecorp-demo.com subject="Action Required: Please Review and Sign Contract #77452" url=http://fakecorp-esignature-verify.com/sign/77452 attachment="Contract_77452_Preview.pdf" attachment_hash=${ESIGN_MALWARE_SHA256} spf=FAIL dkim=FAIL dmarc=FAIL spam_score=7.1/10 msg_id=<2b7d9e44@fakecorp-esignature-verify.com>`,
      },
      {
        timestamp: "2026-09-08T11:26:40Z",
        sourceType: "NETWORK",
        employeeEmail: "karan.mehta@fakecorp-demo.com",
        eventSummary:
          "Karan Mehta's workstation loaded the fake signing page while it was still live (200 OK); he did not enter credentials",
        rawLogLine:
          '2026-09-08T11:26:40Z NETWORK_EVENT user=karan.mehta@fakecorp-demo.com src_ip=10.20.4.71 dest_url=http://fakecorp-esignature-verify.com/sign/77452 action=ALLOWED category=UNCATEGORIZED http_method=GET status=200 user_agent="Mozilla/5.0 (Windows NT 10.0)"',
      },
      {
        timestamp: "2026-09-08T11:29:55Z",
        sourceType: "ENDPOINT",
        employeeEmail: "karan.mehta@fakecorp-demo.com",
        eventSummary:
          "Karan Mehta instead opened the attached \"preview\" PDF, which spawned a script host process",
        rawLogLine: `EndpointID=WKS-KM-0663 EventID=1(ProcessCreate) Time=2026-09-08T11:29:55Z ParentImage=C:\\Program Files\\Adobe\\Acrobat DC\\Acrobat\\Acrobat.exe Image=C:\\Windows\\System32\\wscript.exe CommandLine="wscript.exe //B //NoLogo C:\\Users\\karan.mehta\\AppData\\Local\\Temp\\contract_open.vbs" sha256=${ESIGN_MALWARE_SHA256} User=FAKECORP\\karan.mehta`,
      },
      {
        timestamp: "2026-09-08T11:30:03Z",
        sourceType: "ENDPOINT",
        employeeEmail: "karan.mehta@fakecorp-demo.com",
        eventSummary:
          "The spawned script process beaconed out to a known-bad external IP shortly after",
        rawLogLine:
          "EndpointID=WKS-KM-0663 EventID=3(NetworkConnect) Time=2026-09-08T11:30:03Z Image=C:\\Windows\\System32\\wscript.exe DestinationIp=185.220.102.31 DestinationPort=443 Protocol=TCP Direction=OUTBOUND ThreatIntel=MATCH(C2_INFRASTRUCTURE) User=FAKECORP\\karan.mehta",
      },
      {
        timestamp: "2026-09-08T15:47:18Z",
        sourceType: "NETWORK",
        employeeEmail: "alex.johnson@fakecorp-demo.com",
        eventSummary:
          "Alex Johnson clicked the same link hours later, after the signing page had already been taken down (404)",
        rawLogLine:
          '2026-09-08T15:47:18Z NETWORK_EVENT user=alex.johnson@fakecorp-demo.com src_ip=10.20.4.88 dest_url=http://fakecorp-esignature-verify.com/sign/77452 action=ALLOWED category=UNCATEGORIZED http_method=GET status=404 user_agent="Mozilla/5.0 (Windows NT 10.0)"',
      },
    ],
  },
  {
    ticketNumber: "TRQ-1010",
    title: "Automated VPN Certificate Renewal Notice Reported by Recruiter",
    description:
      "David Okafor (HR) reported an automated VPN certificate renewal notice as suspicious because of its terse, robotic tone. Confirm whether this is genuine automated IT communication before treating it as an incident.",
    category: "PHISHING",
    severity: "LOW",
    reportedEmail: {
      fromAddress: "vpn-automation@fakecorp-demo.com",
      toEmployeeEmail: "david.okafor@fakecorp-demo.com",
      subject: "[Automated] Your VPN Certificate Expires in 7 Days - Renewal Required",
      body: "VPN CERTIFICATE RENEWAL NOTICE\n\nUser: david.okafor@fakecorp-demo.com\nCertificate expires: 7 days\nAction required: Renew via the self-service portal below.\n\nhttps://vpn.fakecorp-demo.com/renew\n\nThis is an automated message. Do not reply to this email.\n\n- FakeCorp IT Operations",
      rawHeaders:
        "Return-Path: <vpn-automation-bounce@fakecorp-demo.com>\n" +
        "Received: from mail-internal-04.fakecorp-demo.com (mail-internal-04.fakecorp-demo.com [10.10.5.40])\n" +
        "\tby mx.fakecorp-demo.com (Postfix) with ESMTPS id 4B6cK1e9\n" +
        "\tfor <david.okafor@fakecorp-demo.com>; Wed, 09 Sep 2026 06:00:03 +0000\n" +
        "Message-ID: <a01c8f36@fakecorp-demo.com>\n" +
        'From: "FakeCorp IT Operations" <vpn-automation@fakecorp-demo.com>\n' +
        "To: david.okafor@fakecorp-demo.com\n" +
        "Subject: [Automated] Your VPN Certificate Expires in 7 Days - Renewal Required\n" +
        "Date: Wed, 09 Sep 2026 06:00:00 +0000\n" +
        "MIME-Version: 1.0\n" +
        'Content-Type: text/plain; charset="UTF-8"\n' +
        "X-Originating-IP: [10.10.5.40]\n" +
        "Authentication-Results: mx.fakecorp-demo.com;\n" +
        "  spf=pass (sender IP is 10.10.5.40) smtp.mailfrom=vpn-automation@fakecorp-demo.com;\n" +
        "  dkim=pass header.d=fakecorp-demo.com;\n" +
        "  dmarc=pass (p=REJECT sp=REJECT dis=NONE) header.from=fakecorp-demo.com\n" +
        "Received-SPF: pass (mx.fakecorp-demo.com: domain of fakecorp-demo.com\n" +
        "  designates 10.10.5.40 as permitted sender)",
      linkUrl: "https://vpn.fakecorp-demo.com/renew",
    },
    logs: [
      {
        timestamp: "2026-09-09T06:00:03Z",
        sourceType: "EMAIL_GATEWAY",
        employeeEmail: "david.okafor@fakecorp-demo.com",
        eventSummary:
          "Automated VPN certificate renewal notice delivered from the real internal automation mailer (SPF/DKIM/DMARC all pass)",
        rawLogLine:
          '2026-09-09 06:00:03 UTC EMAIL_GATEWAY action=DELIVERED from=vpn-automation@fakecorp-demo.com to=david.okafor@fakecorp-demo.com subject="[Automated] Your VPN Certificate Expires in 7 Days - Renewal Required" url=https://vpn.fakecorp-demo.com/renew spf=PASS dkim=PASS dmarc=PASS spam_score=0.3/10 msg_id=<a01c8f36@fakecorp-demo.com>',
      },
      {
        timestamp: "2026-09-09T06:00:14Z",
        sourceType: "EMAIL_GATEWAY",
        employeeEmail: "robert.chen@fakecorp-demo.com",
        eventSummary: "Same automated notice also delivered to Robert Chen (Finance)",
        rawLogLine:
          '2026-09-09 06:00:14 UTC EMAIL_GATEWAY action=DELIVERED from=vpn-automation@fakecorp-demo.com to=robert.chen@fakecorp-demo.com subject="[Automated] Your VPN Certificate Expires in 7 Days - Renewal Required" url=https://vpn.fakecorp-demo.com/renew spf=PASS dkim=PASS dmarc=PASS spam_score=0.3/10 msg_id=<a01c8f36@fakecorp-demo.com>',
      },
      {
        timestamp: "2026-09-09T06:00:26Z",
        sourceType: "EMAIL_GATEWAY",
        employeeEmail: "james.patel@fakecorp-demo.com",
        eventSummary: "Same automated notice also delivered to James Patel (IT)",
        rawLogLine:
          '2026-09-09 06:00:26 UTC EMAIL_GATEWAY action=DELIVERED from=vpn-automation@fakecorp-demo.com to=james.patel@fakecorp-demo.com subject="[Automated] Your VPN Certificate Expires in 7 Days - Renewal Required" url=https://vpn.fakecorp-demo.com/renew spf=PASS dkim=PASS dmarc=PASS spam_score=0.3/10 msg_id=<a01c8f36@fakecorp-demo.com>',
      },
      {
        timestamp: "2026-09-09T06:00:39Z",
        sourceType: "EMAIL_GATEWAY",
        employeeEmail: "linda.martinez@fakecorp-demo.com",
        eventSummary: "Same automated notice also delivered to Linda Martinez (HR)",
        rawLogLine:
          '2026-09-09 06:00:39 UTC EMAIL_GATEWAY action=DELIVERED from=vpn-automation@fakecorp-demo.com to=linda.martinez@fakecorp-demo.com subject="[Automated] Your VPN Certificate Expires in 7 Days - Renewal Required" url=https://vpn.fakecorp-demo.com/renew spf=PASS dkim=PASS dmarc=PASS spam_score=0.3/10 msg_id=<a01c8f36@fakecorp-demo.com>',
      },
      {
        timestamp: "2026-09-09T06:22:51Z",
        sourceType: "NETWORK",
        employeeEmail: "david.okafor@fakecorp-demo.com",
        eventSummary:
          "David Okafor's workstation loaded the internal VPN renewal portal normally (200 OK, internal domain)",
        rawLogLine:
          '2026-09-09T06:22:51Z NETWORK_EVENT user=david.okafor@fakecorp-demo.com src_ip=10.20.5.14 dest_url=https://vpn.fakecorp-demo.com/renew action=ALLOWED category=INTERNAL_IT http_method=GET status=200 user_agent="Mozilla/5.0 (Windows NT 10.0)"',
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
        rawHeaders: t.reportedEmail.rawHeaders,
        attachmentName: t.reportedEmail.attachmentName,
        attachmentHash: t.reportedEmail.attachmentHash,
        linkUrl: t.reportedEmail.linkUrl,
      },
      create: {
        ticketId: ticket.id,
        fromAddress: t.reportedEmail.fromAddress,
        toEmployeeId,
        subject: t.reportedEmail.subject,
        body: t.reportedEmail.body,
        rawHeaders: t.reportedEmail.rawHeaders,
        attachmentName: t.reportedEmail.attachmentName,
        attachmentHash: t.reportedEmail.attachmentHash,
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
