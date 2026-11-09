#!/usr/bin/env node
// Completion check for a research idea folder. Exits 0 when the folder keeps the contract.
// Usage: node check.mjs <folder>   |   node check.mjs --self-test

import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { claims, firstTable, needsBar, parseFile, parseMarkdown, tableRows } from './parse.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUTPUTS = ['primary.md', 'industry.md', 'competitors.md', 'voice.md', 'affinity.md', 'cardsort.md', 'empathy.md', 'jobs.md', 'personas.md', 'journeys.md', 'validation.md', 'interview-script.md', 'usability-plan.md', 'diary-study.md', 'survey.md', 'summary.md', 'repository.md'];
const PROTO = ['jobs.md', 'personas.md', 'journeys.md', 'empathy.md'];
const KINDS = ['original', 'secondary', 'vendor', 'opinion', 'forum', 'first-party'];
const STATUSES = ['verified', 'unverified'];
const LEVELS = { low: 0, medium: 1, high: 2 };
const BAR_PEOPLE = 5;
const RECOMMENDS = ['Design implications', 'How we would know this is wrong', 'What this means for the idea', 'What this means for the structure', 'What this changes', 'Cards without a clear home'];

function templateFor(file) {
  const text = readFileSync(join(HERE, 'templates', file), 'utf8');
  const sections = [];
  let current = null;
  const lines = text.split('\n');
  lines.forEach((line, i) => {
    const words = (lines[i + 1] ?? '').match(/<!--\s*check:\s*([\w ]+?)\s*-->/)?.[1]?.split(' ') ?? [];
    const directive = words.includes('none') ? 'none' : words.includes('tags') ? 'tags' : 'full';
    if (line.startsWith('## ')) {
      current = { heading: line.slice(3).trim(), mode: line.slice(3).trim() === 'Run notes' ? 'none' : directive, optional: words.includes('optional'), subs: [] };
      sections.push(current);
    } else if (line.startsWith('### ') && current) {
      current.subs.push(line.slice(4).trim());
    }
  });
  return sections;
}

const matcher = (heading) => new RegExp(`^${heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/<[^>]+>/g, '.+')}$`);
const isPattern = (heading) => /<[^>]+>/.test(heading);

function ledger(folder, issues) {
  const path = join(folder, 'sources.md');
  const map = new Map();
  if (!existsSync(path)) return map;
  const table = parseMarkdown(`## x\n${readFileSync(path, 'utf8').replace(/^# .*$/m, '')}`).sections[0];
  const block = firstTable(table);
  if (!block) return map;
  tableRows(block).forEach((row, i) => {
    const line = block.rows[i].line;
    if (map.has(row.ID)) issues.push({ code: 'BAD_LEDGER', file: 'sources.md', line, msg: `duplicate id ${row.ID}` });
    if (!KINDS.includes(row.Kind)) issues.push({ code: 'BAD_LEDGER', file: 'sources.md', line, msg: `unknown kind "${row.Kind}"` });
    if (!STATUSES.includes(row.Status)) issues.push({ code: 'BAD_LEDGER', file: 'sources.md', line, msg: `unknown status "${row.Status}"` });
    if (/(^|\/)inbox\//.test(row.Where ?? '')) issues.push({ code: 'BAD_LEDGER', file: 'sources.md', line, msg: `${row.ID} points into inbox/, which holds raw material` });
    if (row.Kind === 'first-party' && !row.Where?.startsWith('evidence/')) issues.push({ code: 'BAD_LEDGER', file: 'sources.md', line, msg: `first-party source ${row.ID} must point into evidence/` });
    map.set(row.ID, row);
  });
  return map;
}

function participantIndex(path) {
  const orgs = new Map();
  const behaviour = new Map();
  if (!existsSync(path)) return { orgs, behaviour };
  const doc = parseFile(path);
  const people = doc.sections.find((s) => s.name === 'Participants');
  const peopleTable = people && firstTable(people);
  if (peopleTable) tableRows(peopleTable).forEach((row) => { if (!/^(not recorded|unknown)?$/i.test(row.Org ?? '')) orgs.set(row.Code, row.Org); });
  const excerpts = doc.sections.find((s) => s.name === 'Excerpts');
  const excerptTable = excerpts && firstTable(excerpts);
  if (excerptTable) tableRows(excerptTable).forEach((row, i) => {
    if (!['observed', 'reported'].includes(row.Grade?.toLowerCase()) || row.Prompted?.toLowerCase() === 'yes') return;
    const who = excerptTable.rows[i].tags.flatMap((t) => t.participants);
    if (who.length !== 1) return;
    for (const belief of row.Beliefs?.match(/B\d+/g) ?? []) {
      if (!behaviour.has(belief)) behaviour.set(belief, new Set());
      behaviour.get(belief).add(who[0]);
    }
  });
  return { orgs, behaviour };
}

function valueChecks(file, doc, add, people) {
  const section = (name) => doc.sections.filter((s) => matcher(name).test(s.name));
  const sub = (s, name) => s.subsections.find((x) => x.name === name);
  const each = (container, fn) => {
    const block = container && firstTable(container);
    if (block) tableRows(block).forEach((row, i) => fn(row, block.rows[i].line));
  };
  const inRange = (value, low, high) => /^\d+$/.test(value) && Number(value) >= low && Number(value) <= high;
  const ratedOrUnknown = (value, low, high) => value?.toLowerCase() === 'unknown' || inRange(value, low, high);
  const oneOf = (value, list, what, line) => { if (!list.includes((value ?? '').toLowerCase())) add('BAD_VALUE', line, `${what} "${value}" is not one of ${list.join(', ')}`); };
  if (file === 'journeys.md') {
    for (const journey of section('Journey: <x>')) {
      const phases = [];
      each(sub(journey, 'Stages'), (row, line) => {
        phases.push(row.Phase);
        if (!ratedOrUnknown(row.Emotion, 1, 5)) add('BAD_VALUE', line, `Emotion "${row.Emotion}" is not a whole number from 1 to 5, or unknown`);
      });
      for (const moment of sub(journey, 'Moments that matter')?.blocks ?? []) {
        const phase = moment.text.match(/^\*\*(.+?):?\*\*:?/)?.[1];
        if (moment.type === 'bullet' && !phases.includes(phase)) add('BAD_VALUE', moment.line, `moment "${phase}" is not a Phase in this journey`);
      }
    }
  }
  if (file === 'journeys.md') {
    for (const future of section('Future journey: <x>')) {
      each(sub(future, 'Stages'), (row, line) => {
        if (!ratedOrUnknown(row.Emotion, 1, 5)) add('BAD_VALUE', line, `Emotion "${row.Emotion}" is not a whole number from 1 to 5, or unknown`);
      });
    }
  }
  if (file === 'repository.md') {
    each(section('Insights')[0], (row, line) => oneOf(row.Strength, ['strong', 'some', 'hint'], 'Strength', line));
  }
  if (file === 'summary.md') {
    const block = section('What we found')[0] && firstTable(section('What we found')[0]);
    if (block) tableRows(block).forEach((row, i) => {
      const { line, tags } = block.rows[i];
      oneOf(row.Strength, ['strong', 'some', 'hint'], 'Strength', line);
      const orgs = new Set(tags.flatMap((t) => t.participants).map((p) => people.orgs.get(p)).filter(Boolean));
      const needed = { strong: BAR_PEOPLE, some: 2 }[row.Strength?.toLowerCase()] ?? 0;
      if (orgs.size < needed) add('BAD_VALUE', line, `Strength "${row.Strength}" needs ${needed} organisations cited, this row cites ${orgs.size}`);
    });
  }
  if (file === 'primary.md') {
    each(section('Participants')[0], (row, line) => {
      if (!/^(O\d+|not recorded|unknown)$/i.test(row.Org ?? '')) add('BAD_VALUE', line, `Org "${row.Org}" must be an anonymised code such as O1, because this table feeds a published page`);
    });
  }
  if (file === 'repository.md') {
    each(section('Studies')[0], (row, line) => {
      if (/(^|\/)inbox\//.test(row.Where ?? '')) add('BAD_VALUE', line, 'Where points into inbox/, which holds raw material');
    });
  }
  if (file === 'cardsort.md') {
    each(section('Pairs people keep together')[0], (row, line) => {
      if (Number.isNaN(Number(row.Together)) || Number(row.Together) > 1 || Number(row.Together) < 0) add('BAD_VALUE', line, `Together "${row.Together}" is not a share from 0 to 1`);
    });
    const type = section('Study')[0]?.blocks.find((b) => b.type === 'bullet' && b.text.startsWith('**Type:**'));
    if (type && !/\b(open|closed|hybrid)\b/i.test(type.text)) add('BAD_VALUE', type.line, 'Type is open, closed or hybrid');
  }
  if (file === 'personas.md') {
    const seg = section('Segmentation')[0];
    each(seg, (row, line) => { if (!ratedOrUnknown(row.Position, 0, 100)) add('BAD_VALUE', line, `Position "${row.Position}" is not 0 to 100 or unknown`); });
    if (seg && !seg.blocks.some((b) => b.type === 'bullet' && b.text.startsWith('**Primary:**'))) add('BAD_VALUE', seg.line, 'no **Primary:** bullet');
  }
  if (file === 'jobs.md') {
    const map = section('The job map')[0];
    const found = [];
    each(map, (row) => found.push(row.Stage));
    if (map && (found.length < 4 || found.length > 8)) add('BAD_VALUE', map.line, `the job map has ${found.length} stages, it needs 4 to 8`);
    each(section('Top underserved outcomes')[0], (row, line) => {
      if (!ratedOrUnknown(row.Importance, 1, 5) || !ratedOrUnknown(row.Satisfaction, 1, 5)) add('BAD_VALUE', line, 'Importance and Satisfaction are 1 to 5 or unknown');
    });
  }
  if (file === 'competitors.md') {
    each(section('Rings')[0], (row, line) => oneOf(row.Ring, ['direct', 'adjacent', 'workaround', 'nothing', 'could enter'], 'Ring', line));
    each(section('Comparison')[0], (row, line) => oneOf(row.Rating, ['strong', 'good', 'weak', 'absent', 'unknown'], 'Rating', line));
  }
  if (file === 'industry.md') {
    const size = section('Market size')[0];
    const kinds = [];
    each(size, (row, line) => {
      kinds.push(row.Kind);
      oneOf(row.Kind, ['bottom-up', 'published', 'forecast'], 'Kind', line);
      if (row.Value?.toLowerCase() !== 'unknown' && Number.isNaN(Number(row.Value))) add('BAD_VALUE', line, `Value "${row.Value}" is not a plain number or unknown`);
    });
    if (size && !kinds.includes('bottom-up')) add('BAD_VALUE', size.line, 'no bottom-up row');
  }
  if (file === 'validation.md') {
    const block = section('Assumptions')[0] && firstTable(section('Assumptions')[0]);
    if (block) tableRows(block).forEach((row, i) => {
      const { line, tags } = block.rows[i];
      oneOf(row.Impact, ['high', 'medium', 'low'], 'Impact', line);
      oneOf(row.Status, ['open', 'confirmed', 'refuted', 'mixed'], 'Status', line);
      const status = row.Status?.toLowerCase();
      const settled = tags.filter(needsBar).map((t) => t.verdict);
      const matches = status === 'open' ? settled.length === 0 : settled.includes(status);
      if (!matches) add('STATUS_MISMATCH', line, `Status "${row.Status}" does not match its evidence tag`);
    });
  }
}

function idsFromTable(path, heading) {
  if (!existsSync(path)) return new Set();
  const doc = parseMarkdown(heading ? readFileSync(path, 'utf8') : `## x\n${readFileSync(path, 'utf8').replace(/^# .*$/m, '')}`);
  const section = heading ? doc.sections.find((s) => s.name === heading) : doc.sections[0];
  const block = section && firstTable(section);
  return new Set(block ? block.rows.map((r) => r.cells[0]) : []);
}

// The confidence a single line can support, from the contract's definitions.
function levelOf(tags, sources, orgMap) {
  if (tags.length === 0 || tags.every((t) => t.kind === 'proposed')) return null;
  if (tags.some((t) => t.verdict === 'no evidence')) return 'low';
  if (tags.every((t) => t.kind === 'gap')) return 'medium';
  const isStrong = (s) => ['original', 'first-party'].includes(s.Kind);
  const cited = new Set(tags.flatMap((t) => t.sources));
  const people = new Set(tags.flatMap((t) => t.participants));
  const verified = [...cited].map((id) => sources.get(id)).filter((s) => s?.Status === 'verified');
  const count = (...kinds) => verified.filter((s) => kinds.includes(s.Kind)).length;
  const strong = count('original', 'first-party');
  let level = 'low';
  const orgs = new Set([...people].map((p) => orgMap.get(p) ?? p));
  if (strong >= 1 && (verified.length >= 2 || orgs.size >= 2)) level = 'high';
  else if (strong >= 1 || count('secondary') >= 2 || count('forum') >= 3) level = 'medium';
  if (tags.some((t) => t.kind === 'inference')) level = verified.length === cited.size && verified.every(isStrong) ? 'medium' : 'low';
  else if (level === 'high' && tags.some((t) => t.kind === 'gap')) level = 'medium';
  return level;
}

export function checkFolder(folder) {
  const issues = [];
  const sources = ledger(folder, issues);
  const beliefs = idsFromTable(join(folder, 'beliefs.md'));
  const participants = idsFromTable(join(folder, 'primary.md'), 'Participants');
  const people = participantIndex(join(folder, 'primary.md'));
  const beliefVerdicts = new Map();
  const stats = { files: 0, claims: 0, evidenced: 0, inference: 0, belief: 0, contradicted: 0, confirmed: 0, proposed: 0, gap: 0 };

  const plannedBeliefs = new Set();
  const surveyPath = join(folder, 'survey.md');
  if (existsSync(surveyPath)) {
    const plan = parseFile(surveyPath).sections.find((s) => s.name === 'Analysis plan');
    const planTable = plan && firstTable(plan);
    if (planTable) planTable.rows.forEach((row) => (row.text.match(/\bB\d+\b/g) ?? []).forEach((id) => plannedBeliefs.add(id)));
  }
  const openHighBeliefs = { any: false, ids: new Set() };
  const validationPath = join(folder, 'validation.md');
  if (existsSync(validationPath)) {
    const section = parseFile(validationPath).sections.find((s) => s.name === 'Assumptions');
    const block = section && firstTable(section);
    if (block) {
      block.rows.forEach((row, i) => {
        const data = tableRows(block)[i];
        row.tags.flatMap((t) => t.beliefs).forEach((id) => plannedBeliefs.add(id));
        if (data.Impact?.toLowerCase() !== 'high' || data.Status?.toLowerCase() !== 'open') return;
        const ids = row.tags.flatMap((t) => t.beliefs);
        if (ids.length === 0) openHighBeliefs.any = true;
        ids.forEach((id) => openHighBeliefs.ids.add(id));
      });
    }
  }

  for (const file of OUTPUTS) {
    const path = join(folder, file);
    if (!existsSync(path)) continue;
    stats.files++;
    const add = (code, line, msg) => issues.push({ code, file, line, msg });
    const doc = parseFile(path);
    const template = templateFor(file);
    const inFile = new Map();
    const citedPeople = new Set();
    const citedSources = new Set();

    if (!doc.title) add('MISSING_SECTION', 1, 'no # title');
    for (const entry of template) {
      const found = doc.sections.filter((s) => matcher(entry.heading).test(s.name));
      if (found.length === 0 && !entry.optional) add('MISSING_SECTION', 1, `no "## ${entry.heading}" section`);
      for (const section of found) {
        for (const sub of entry.subs) {
          if (!section.subsections.some((s) => matcher(sub).test(s.name))) add('MISSING_SUBSECTION', section.line, `"${section.name}" has no "### ${sub}"`);
        }
      }
    }

    for (const section of doc.sections) {
      const entry = template.find((e) => matcher(e.heading).test(section.name));
      if (!entry) { add('EXTRA_SECTION', section.line, `"${section.name}" is not in the template, so the book would lose it`); continue; }
      if (entry.mode === 'none') continue;
      if (entry.subs.length && !entry.subs.some(isPattern)) {
        for (const sub of section.subsections) {
          if (!entry.subs.some((s) => matcher(s).test(sub.name))) add('EXTRA_SECTION', sub.line, `"### ${sub.name}" is not in the template`);
        }
      }

      const lines = claims(section);
      const isFuture = /^Future journey:/.test(section.name);
      const mayPropose = new Set();
      if (RECOMMENDS.includes(section.name)) lines.forEach((c) => mayPropose.add(c.line));
      section.subsections.filter((s) => RECOMMENDS.includes(s.name)).forEach((s) => claims(s).forEach((c) => mayPropose.add(c.line)));
      let weakest = null;
      for (const claim of lines) {
        if (claim.type === 'para') { add('LOOSE_PARAGRAPH', claim.line, 'claims go in bullets, table rows or blockquotes'); continue; }
        if (claim.tags.length === 0) { add('NO_TAG', claim.line, `no evidence tag: ${claim.text.slice(0, 60)}`); continue; }
        if (isFuture && !claim.tags.every((t) => t.kind === 'proposed')) add('NOT_PROPOSED', claim.line, 'a future journey is a proposal, so every line is tagged [proposed]');
        if (!isFuture && claim.tags.some((t) => t.kind === 'proposed') && !mayPropose.has(claim.line)) add('PROPOSED_OUT_OF_PLACE', claim.line, '[proposed] belongs in a future journey or a recommendation, not among findings');
        stats.claims++;
        for (const tag of claim.tags) {
          tag.sources.forEach((id) => { citedSources.add(id); if (!sources.has(id)) add('UNKNOWN_SOURCE', claim.line, `${id} is not in sources.md`); });
          tag.beliefs.forEach((id) => { if (!beliefs.has(id)) add('UNKNOWN_BELIEF', claim.line, `${id} is not in beliefs.md`); });
          tag.participants.forEach((id) => { citedPeople.add(id); if (!participants.has(id)) add('UNKNOWN_PARTICIPANT', claim.line, `${id} is not in primary.md`); });
          if (!tag.valid) add('BAD_TAG', claim.line, `${tag.raw} is not a tag the contract allows`);
          if (tag.kind === 'belief') {
            if (!tag.verdict) add('BAD_VERDICT', claim.line, `${tag.raw} has no valid verdict`);
            else tag.beliefs.forEach((id) => { if (!beliefVerdicts.has(id)) beliefVerdicts.set(id, new Set()); beliefVerdicts.get(id).add(tag.verdict); });
            tag.beliefs.forEach((id) => {
              const seen = inFile.get(id) ?? new Set();
              if (tag.verdict) seen.add(tag.verdict);
              inFile.set(id, seen);
            });
            if (needsBar(tag) && tag.threshold) {
              const measured = tag.sources.some((id) => sources.get(id)?.Status === 'verified' && sources.get(id)?.Kind === 'first-party');
              if (!measured || !tag.beliefs.every((id) => plannedBeliefs.has(id))) add('UNDER_BAR', claim.line, `${tag.raw} needs a verified first-party result and this belief named in the Analysis plan of survey.md`);
            } else if (needsBar(tag)) {
              const backers = people.behaviour.get(tag.beliefs[0]) ?? new Set();
              const orgs = new Set(tag.participants.filter((p) => backers.has(p) && people.orgs.has(p)).map((p) => people.orgs.get(p)));
              if (orgs.size < BAR_PEOPLE) add('UNDER_BAR', claim.line, `${tag.raw} needs ${BAR_PEOPLE} people from different organisations whose excerpts name this belief and record what they did, has ${orgs.size}`);
            }
          }
        }
        const verdicts = claim.tags.map((t) => t.verdict);
        if (claim.tags.some((t) => t.kind === 'gap')) stats.gap++;
        else if (verdicts.includes('confirmed')) stats.confirmed++;
        else if (verdicts.includes('contradicted') || verdicts.includes('refuted')) stats.contradicted++;
        else if (verdicts.includes('no evidence')) stats.belief++;
        else if (claim.tags.some((t) => t.kind === 'proposed')) stats.proposed++;
        else if (claim.tags.some((t) => t.kind === 'inference')) stats.inference++;
        else stats.evidenced++;
        const level = levelOf(claim.tags, sources, people.orgs);
        if (level !== null && (weakest === null || LEVELS[level] < LEVELS[weakest])) weakest = level;
      }
      if (lines.length && lines.every((c) => c.tags.length && c.tags.every((t) => t.kind === 'gap' || t.kind === 'proposed'))) weakest = 'low';
      if (file === 'voice.md' && section.name === 'Themes') {
        const block = firstTable(section);
        if (block) tableRows(block).forEach((row, i) => {
          if (Number(row.Frequency) * Number(row.Intensity) !== Number(row.Score)) add('BAD_SCORE', block.rows[i].line, `${row.Theme}: ${row.Frequency} times ${row.Intensity} is not ${row.Score}`);
        });
      }

      if (entry.mode === 'full' && lines.length === 0) add('EMPTY_SECTION', section.line, `"${section.name}" has no claims and no [gap]`);
      if (entry.mode === 'full') {
        if (section.confidence === null) add('NO_CONFIDENCE', section.line, `"${section.name}" has no Confidence line`);
        else if (!(section.confidence in LEVELS)) add('BAD_CONFIDENCE', section.confidenceLine, `"${section.confidence}" is not high, medium or low`);
        else if (weakest !== null && LEVELS[section.confidence] > LEVELS[weakest]) {
          add('CONFIDENCE_NOT_EARNED', section.confidenceLine, `"${section.name}" says ${section.confidence}, its weakest claim supports ${weakest}`);
        }
      }
    }

    valueChecks(file, doc, add, people);

    if (['affinity.md', 'cardsort.md'].includes(file)) {
      for (const id of citedSources) if (sources.get(id)?.Kind !== 'first-party') add('REAL_HAS_DESK', 1, `${id} is desk research, and this file is built only from real data`);
    }
    if (file === 'summary.md' && ![...citedSources].some((id) => sources.get(id)?.Kind === 'first-party')) add('REAL_HAS_DESK', 1, 'a research summary has to cite primary research');

    if (PROTO.includes(file)) {
      const proto = doc.banner?.match(/^Proto: (\d+) of (\d+) beliefs validated(?:, (\d+) refuted)?\./);
      const validated = doc.banner?.match(/^Validated: (\d+) of (\d+) beliefs confirmed(?:, (\d+) refuted)?, \d{4}-\d{2}-\d{2}\./);
      const real = doc.banner?.match(/^From research: (\d+) (?:people|person), (\d+) organisations?\./);
      if (real) {
        const orgs = new Set([...citedPeople].map((p) => people.orgs.get(p) ?? p));
        if (Number(real[1]) !== citedPeople.size || Number(real[2]) !== orgs.size) add('BANNER_COUNT', doc.bannerLine, `banner says ${real[1]} people and ${real[2]} organisations, the file cites ${citedPeople.size} and ${orgs.size}`);
        if (citedPeople.size === 0) add('UNDER_BAR', doc.bannerLine, 'a file built in real mode has to cite the people it came from');
        const allOrgs = new Set(people.orgs.values());
        if (allOrgs.size < BAR_PEOPLE) add('UNDER_BAR', doc.bannerLine, `real mode needs ${BAR_PEOPLE} organisations in primary.md, it holds ${allOrgs.size}`);
        for (const id of citedSources) if (sources.get(id)?.Kind !== 'first-party') add('REAL_HAS_DESK', doc.bannerLine, `${id} is desk research, and a file built in real mode cites only primary research`);
        if (inFile.size) add('REAL_HAS_BELIEF', doc.bannerLine, 'a file built in real mode cites beliefs; it should cite only what people did and said');
      } else if (!proto && !validated) add('NO_BANNER', 1, 'no Proto, Validated or From research banner after the title');
      else {
        const banner = proto ?? validated;
        const m = inFile.size;
        const n = [...inFile.values()].filter((v) => v.has('confirmed')).length;
        const r = [...inFile.values()].filter((v) => v.has('refuted')).length;
        if (Number(banner[1]) !== n || Number(banner[2]) !== m || Number(banner[3] ?? 0) !== r) add('BANNER_COUNT', doc.bannerLine, `banner says ${banner[1]} of ${banner[2]} and ${banner[3] ?? 0} refuted, the file has ${n} of ${m} and ${r} refuted`);
        if (validated) {
          const blocked = openHighBeliefs.any || [...inFile.keys()].some((id) => openHighBeliefs.ids.has(id));
          if (blocked || !existsSync(validationPath)) add('VALIDATED_TOO_SOON', doc.bannerLine, 'a high-impact assumption touching this file is still open');
        }
      }
    }
  }
  for (const [id, seen] of beliefVerdicts) {
    if (seen.size > 1) issues.push({ code: 'CONFLICTING_VERDICT', file: 'beliefs.md', line: 1, msg: `${id} carries more than one verdict: ${[...seen].join(', ')}` });
  }
  return { issues, stats };
}

async function selfTest() {
  const { CLEAN, MUTATIONS } = await import('./fixtures/fixture.mjs');
  let failures = 0;
  const run = (files) => {
    const dir = mkdtempSync(join(tmpdir(), 'research-check-'));
    for (const [name, text] of Object.entries(files)) writeFileSync(join(dir, name), text);
    const result = checkFolder(dir);
    rmSync(dir, { recursive: true, force: true });
    return result;
  };
  const clean = run(CLEAN);
  if (clean.issues.length) {
    failures++;
    console.log('FAIL clean fixture should pass:');
    clean.issues.forEach((i) => console.log(`  ${i.file}:${i.line} ${i.code} ${i.msg}`));
  } else console.log(`ok   clean fixture passes (${clean.stats.claims} claims)`);

  for (const m of MUTATIONS) {
    const files = { ...CLEAN };
    if (!files[m.file].includes(m.find)) { failures++; console.log(`FAIL ${m.expect}: fixture no longer contains "${m.find}"`); continue; }
    files[m.file] = files[m.file].replace(m.find, m.replace);
    for (const [find, replace] of Array.isArray(m.also) ? m.also : []) files[m.file] = files[m.file].replace(find, replace);
    const { issues } = run(files);
    if (m.expect === 'CLEAN') {
      if (issues.length) { failures++; console.log(`FAIL ${m.name} should pass: ${issues.map((i) => i.code).join(', ')}`); } else console.log(`ok   ${m.name} passes`);
      continue;
    }
    if (issues.some((i) => i.code === m.expect)) console.log(`ok   ${m.expect}`);
    else { failures++; console.log(`FAIL ${m.expect}: got ${issues.map((i) => i.code).join(', ') || 'no issues'}`); }
  }
  console.log(failures ? `\n${failures} self-test failure(s)` : '\nself-test passed');
  process.exit(failures ? 1 : 0);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const arg = process.argv[2];
  if (arg === '--self-test') await selfTest();
  else if (!arg || !existsSync(arg)) { console.error('usage: node check.mjs <folder> | --self-test'); process.exit(2); }
  else {
    const { issues, stats } = checkFolder(arg);
    issues.forEach((i) => console.log(`${i.file}:${i.line} ${i.code} ${i.msg}`));
    if (issues.length) { console.log(`\n${issues.length} issue(s)`); process.exit(1); }
    console.log(`OK: ${stats.files} files, ${stats.claims} claims. Evidenced ${stats.evidenced}, confirmed ${stats.confirmed}, inference ${stats.inference}, belief with no evidence ${stats.belief}, contradicted ${stats.contradicted}, proposed ${stats.proposed}, gap ${stats.gap}.`);
  }
}
