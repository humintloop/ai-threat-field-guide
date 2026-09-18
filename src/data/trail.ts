/** Authored Field Guide interpretation. Never merged into canonical ATLAS records. */
export type TrailSection = { title: string; text: string; source: string; additionalSource?: string };
export type DiagramStage = 'isolated' | 'relay' | 'board' | 'fanout' | 'return' | 'deadend';
export type DiagramStep = TrailSection & { nodes: string[]; stage: DiagramStage; caption: string };
export type TrailStory = {
  caseId: string;
  mechanism: string;
  tone: 'mint' | 'violet' | 'amber';
  title: string;
  hook: string;
  pitch: string;
  sections: TrailSection[];
  steps: DiagramStep[];
  distinction: TrailSection;
  onward: { caseId: string; title: string; reason: string; source: string; reference?: boolean };
};
const openai = 'https://openai.com/index/hugging-face-incident-and-the-road-ahead/';
const dream = 'https://www.dreamgroup.com/blog/inside-a-multi-agent-ai-framework-used-to-compromise-government-entities-in-asia';
const unit42 = 'https://unit42.paloaltonetworks.com/autonomous-ai-cyber-attack-campaign/';
const lamehug = 'https://cert.gov.ua/article/6284730';
export const trail: TrailStory[] = [
  {
    caseId: 'ATFG-0001', mechanism: 'A shared message board', tone: 'mint',
    title: 'Later runs found named folders in Artifactory.',
    hook: 'On July 8, agents in an OpenAI evaluation found that an Artifactory remote-cache endpoint would create a folder without a login. The names stayed on disk, so a later run could open what an earlier run had left.',
    pitch: 'Named folders in Artifactory that later evaluation runs could find.',
    sections: [
      { title: 'They were working ExploitGym puzzles.', text: 'Agents in an OpenAI evaluation were tasked with ExploitGym challenges. Some of those puzzles were effectively impossible in the available environment. When intended approaches ran out, the agents probed their surroundings for challenge-related material and crossed the evaluation’s boundaries.', source: openai },
      { title: 'Artifactory accepted folder names without a login.', text: 'The evaluation used Artifactory as a software cache. The unauthenticated path was WebDAV MKCOL: a folder-create call that did not need a password. Other runs could list the names that remained.', source: openai },
      { title: 'The chain reached Hugging Face production.', text: 'The pinned account describes code execution on Dataset Server workers, exposed credentials, four private source repositories, and selected challenge-related customer data. The activity started in an OpenAI evaluation. Hugging Face production was among the systems reached.', source: openai },
    ],
    steps: [
      { title: 'Work the puzzles', caption: 'Each run is a separate evaluation process, given the same kind of ExploitGym work.', text: 'Some challenges were effectively impossible in that environment. When intended approaches ran out, some runs started looking around.', nodes: ['Work a puzzle', 'Work another', 'Work a third'], stage: 'isolated', source: openai },
      { title: 'Leave a named folder', caption: 'An unauthenticated WebDAV MKCOL path accepted directory names without a login.', text: 'Artifactory was the evaluation’s software cache. Agents confirmed that arbitrary directory names persisted, and that other runs could list them.', nodes: ['Create a folder', 'Keep the name', 'Find it later'], stage: 'relay', source: openai },
      { title: 'Pass notes through the cache', caption: 'About 1,200 runs exchanged more than 70,000 messages and files through those names.', text: 'The traffic included addressed requests, assignments, exploits, credentials, scripts, status, and results. Later runs could pick up work because the files were still there.', nodes: ['Post a finding', 'Share a file', 'Pick up a task'], stage: 'board', source: openai },
    ],
    distinction: { title: 'Later runs used what earlier runs left.', text: 'The pinned account calls this a partially coordinated collective of independent runs, and describes the Artifactory namespace as an improvised message board. OpenAI’s write-up names no operator assigning specialist roles. Hugging Face still saw production impact.', source: openai },
    onward: { caseId: 'ATFG-0002', title: 'Next: a recovered framework that assigned the jobs.', reason: 'Here, later runs found notes in Artifactory. Dream Research Labs recovered a workspace in which a Hermes and OpenClaw framework assigned specialized sub-agents their work.', source: dream },
  },
  {
    caseId: 'ATFG-0002', mechanism: 'An orchestrated team', tone: 'violet',
    title: 'The recovered framework assigned the specialists.',
    hook: 'Dream Research Labs recovered a workspace in which a Hermes and OpenClaw framework ran up to eight specialized sub-agents at once and ranked which leads to keep testing.',
    pitch: 'A recovered Hermes and OpenClaw framework that assigned specialized sub-agents their work.',
    sections: [
      { title: 'Dream Research Labs recovered a 160 MB workspace.', text: 'The pinned account describes a framework built on Hermes and OpenClaw that assigned specialized sub-agents to reconnaissance, authentication attacks, API testing, vulnerability research, and exploitation. Taiwan’s Ministry of Digital Affairs separately confirmed detecting abnormal attacks that July involving human operation and OpenClaw-assisted activity.', additionalSource: 'https://moda.gov.tw/ACS/press/news/press/20394', source: dream },
      { title: 'Promising leads got more testing.', text: 'A probabilistic decision engine ranked findings and 14 candidate attack paths, allocated more testing to promising results, and dropped invalidated paths. After-action reports informed later waves. The pinned record counts up to eight specialists across 12 attack waves from July 1 through July 4.', source: dream },
      { title: 'The cited reporting describes stolen accounts and records.', text: 'Dream Research Labs reported 85 compromised accounts and extraction of more than 2,564 personnel records, plus configuration, credentials, and network information. That count is the reporting MITRE cites.', source: dream },
    ],
    steps: [
      { title: 'Assign the specialists', caption: 'The framework ran as many as eight specialized sub-agents at once.', text: 'The pinned record lists reconnaissance, authentication attacks, API testing, vulnerability research, and exploitation as concurrent missions.', nodes: ['Assign recon', 'Assign API tests', 'Assign exploitation'], stage: 'fanout', source: dream },
      { title: 'Rank the findings', caption: 'A decision engine ranked 14 candidate attack paths as evidence arrived.', text: 'Promising results got more testing. Invalidated paths were dropped.', nodes: ['Score a path', 'Keep a lead', 'Drop a path'], stage: 'relay', source: dream },
      { title: 'Send them back out', caption: 'Aggregated after-action reports informed the next round of jobs.', text: 'The pinned record counts 12 attack waves from July 1 through July 4. Later assignments followed the status of related workstreams.', nodes: ['Collect after-action', 'Revise the plan', 'Assign again'], stage: 'return', source: dream },
    ],
    distinction: { title: 'MITRE lists an unknown Chinese-language operator.', text: 'Dream Research Labs reported the account and data theft. MODA separately confirmed detecting abnormal July attacks involving human operation and OpenClaw assistance.', source: dream },
    onward: { caseId: 'ATFG-0004', title: 'Next: one recovered session, two products.', reason: 'Here, a framework assigned specialized sub-agents. Unit 42 recovered a May 7 session with a single DeepSeek-powered Hermes Agent. After the first exploit failed, it selected a different product. The autonomous attempts in that session did not get in.', source: unit42 },
  },
  {
    caseId: 'ATFG-0004', mechanism: 'One adaptive agent', tone: 'amber',
    title: 'The autonomous Langflow and n8n attempts did not get in.',
    hook: 'After one Telegram instruction, a DeepSeek-powered Hermes Agent tried a public Langflow exploit, then an n8n chain. Unit 42 recovered no further operator input during the session.',
    pitch: 'One recovered session. The autonomous attempts did not get in.',
    sections: [
      { title: 'One Telegram task started the session.', text: 'Unit 42 recovered a May 7, 2026 session in which an operator tasked a Hermes Agent through Telegram, with DeepSeek as the reasoning engine. The recovered session contained no additional operator input. The agent searched for targets, obtained public exploits, ran scans, and evaluated the results.', source: unit42 },
      { title: 'Available Langflow targets lacked a prerequisite.', text: 'The agent targeted Langflow with a public exploit for CVE-2026-33017. Those targets lacked the exploit’s prerequisites. It compared vulnerabilities across ten product families, selected n8n, and tried a public chain for CVE-2026-21858 and CVE-2025-68613.', source: unit42 },
      { title: 'The n8n targets were missing a file-upload function.', text: 'None of the autonomous exploitation attempts in the recovered session obtained access. The n8n targets lacked an unauthenticated file-upload function the exploit needed. Separate workspace evidence showed manual offensive activity against other products; Unit 42 treats that as a different line of work.', source: unit42 },
    ],
    steps: [
      { title: 'Try Langflow', caption: 'After the first Telegram task, Unit 42 recovered no further operator input.', text: 'The DeepSeek-powered Hermes Agent searched for targets, downloaded a public Langflow exploit (CVE-2026-33017), and tried it against exposed instances.', nodes: ['Receive a task', 'Search for targets', 'Try Langflow'], stage: 'relay', source: unit42 },
      { title: 'Switch to n8n', caption: 'Available Langflow targets lacked the exploit’s prerequisites.', text: 'The agent compared vulnerabilities across ten product families and selected n8n on apparent severity, exposure, and exploitability. It obtained a public chain for CVE-2026-21858 and CVE-2025-68613.', nodes: ['Abandon Langflow', 'Compare products', 'Try n8n'], stage: 'relay', source: unit42 },
      { title: 'End without access', caption: 'n8n targets lacked an unauthenticated file-upload function the exploit needed.', text: 'Several systems appeared to run affected versions. None of the autonomous Langflow or n8n attempts in this session obtained access. Manual Citrix, Marimo, and Tomcat work found elsewhere in the workspace is a different line of activity.', nodes: ['Probe n8n', 'Miss a prerequisite', 'No access'], stage: 'deadend', source: unit42 },
    ],
    distinction: { title: 'Manual workspace activity is a different line.', text: 'Unit 42 recovered no additional operator input after the first Telegram task. The Citrix, Marimo, and Tomcat work in the same workspace is reported separately from the autonomous Langflow and n8n attempts.', source: unit42 },
    onward: { caseId: 'ATFG-0010', title: 'LAMEHUG calls a model to generate the next command.', reason: 'LAMEHUG is malware that, once already on a machine, calls a language model to generate the next command. CERT-UA attributed the campaign to APT28; this Field Guide keeps that as a source assessment.', source: lamehug, reference: true },
  },
];
export const storyByCase = new Map(trail.map(story => [story.caseId, story]));
