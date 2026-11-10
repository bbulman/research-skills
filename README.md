# research-skills

> **This has moved.** These skills now live in the [ux-os plugin](https://github.com/bbulman/ux-os/tree/main/plugin), with five more commands, a link from every finding to the passage behind it, and a way to connect your design system. Install that instead:
>
> ```
> /plugin marketplace add bbulman/ux-os
> /plugin install ux-os@ux-os
> ```
>
> Commands there are typed `/ux-os:<name>`, such as `/ux-os:create-personas`. Everything below is the earlier version, kept so existing installs still have a source.

Twelve Claude Code skills for UX research, from planning a study to turning what you heard into something you can act on.

They're part of [UX-OS](https://bbulman.github.io/ux-os/research/).

## Install

You need Claude Code, and Node for the checking scripts.

```bash
git clone https://github.com/bbulman/research-skills.git
cd research-skills
./install.sh
```

Open a new Claude Code session and call one by name, such as `/create-persona a booking app for small clinics`. They only run when you call them, so they don't crowd Claude's list of skills.

If you already have a skill with any of these names, the installer moves it to `~/.claude/backups/` rather than overwriting it.

## The skills

| Skill | What it's for |
| --- | --- |
| `affinity-diagram` | Sorting real notes into the themes people actually share. Needs data |
| `analyze-card-sort` | How people grouped your cards, what structure that points to, and which cards have no clear home. Needs results |
| `summarize-research` | A transcript, a study or a whole folder turned into findings rated by how many people stand behind them. Needs data |
| `create-empathy-map` | What one person says, does, thinks and feels in one moment, and where saying and doing come apart |
| `create-persona` | Who behaves differently enough to design for separately |
| `create-jtbd` | What people are trying to get done, apart from any product |
| `create-journey-map` | What happens step by step today, or a proposal for what should happen in future |
| `create-interview-script` | A short guide built on real past events, with every question tied to something it tests |
| `create-usability-plan` | Realistic tasks, with pass lines set before anyone is tested |
| `create-diary-study` | A diary study people will finish |
| `create-survey` | The analysis first, then only the questions it needs, with sample sizes from a script |
| `create-research-repository` | One place for what you've learned across studies, and how far to trust it |

## How they work

Left alone, Claude will write you a persona from nothing, and it will read like a finding. These skills are built so that **a belief and a finding never look the same on the page.**

**Every line carries its evidence.** A line is tagged with its source, marked as an inference, marked as your belief with a verdict, or marked as a gap. A script checks this, and each skill has to pass it to finish.

**Proto or real.** `create-empathy-map`, `create-persona`, `create-jtbd` and `create-journey-map` work two ways. In proto mode they interview you about what you believe, then check each belief against the evidence, and tell you first where you were wrong. In real mode they build only from your research.

**They won't invent research data.** `affinity-diagram`, `analyze-card-sort` and `summarize-research` have no proto mode. Without data they say what they need and stop.

**Bring your own research.** Drop transcripts, notes, survey exports or analytics in `inbox/` in the idea's folder, or pass `--evidence <path>`. Every skill takes them in first. Names come out before anything else happens, and `inbox/` and `evidence/` are kept out of git.

**"Validated" has a bar.** A belief counts as confirmed only with 5 people from different organisations reporting what they actually did, or a survey result that meets a threshold set in advance. Desk research alone never validates anything.

**The numbers come from code.** Card sort groups, survey sample sizes and the evidence checks are small Node scripts with no dependencies, each with its own self-test.

**Each idea gets a designed page.** Every run updates a private page for the idea, with beliefs in pencil and evidence in ink, so you can see how much of a persona is a guess. Tap any line to see where it came from. Without Claude's Artifacts it stays a local file you can open in a browser.

Output goes to `docs/research/<idea>/` if your project has `docs/research/`, otherwise `research/<idea>/`. An optional `.research-profile.md` at your project root can change the folder, name your own data sources, and set the page's fonts and accent.

## What's been tested, and what hasn't

So far these have only run on made-up test data: invented interviews, a simulated founder and a generated card sort export.

What that showed:

- A false belief planted in the test came back contradicted, and led the report.
- A belief backed by 5 people from 5 organisations came back confirmed, and one that only 2 people touched stayed open.
- With no data, the three data-only skills stopped and said what they needed.
- No participant's name or email reached any output in the runs I checked.

What it didn't:

- None of them has been used on a real project, or compared with Claude using no skill at all.
- The belief interview has only run on simulated answers.
- `summarize-research` passed its checks as a draft, but a test agent was refused when writing a file called `summary.md`, so it hasn't yet written its output in a test.

Two independent code reviews found real problems, including a script-injection hole and ways to cheat the validation bar. Those are fixed and covered by the self-tests.

To run the self-tests after installing:

```bash
cd ~/.claude/skills/research-shared
node check.mjs --self-test
node book.mjs --self-test
node card-sort.mjs --self-test
node sample-size.mjs --self-test
```

## Licence

MIT. See [LICENSE](LICENSE).
