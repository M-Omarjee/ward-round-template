# Ward Round Documentation Tool

A browser-based clinical documentation tool for hospital ward rounds. Manages patients, stores entries over time, auto-generates summaries from previous notes, and includes drawable anatomical examination diagrams.

> **Disclaimer:** This is a portfolio/educational project. It must **not** be used for real clinical care or with real patient data. Always use authorised, validated hospital systems.

---

## Features

**Patient management** — Add patients with hospital number, NHS number, DOB, ward, and consultant. View all patients from a single dashboard.

**Entry timeline** — Every ward round entry is saved and timestamped. Click any past entry to review it. Entries are displayed in reverse chronological order.

**Auto-filled templates** — Patient details (name, ID, DOB) carry forward automatically. PMH and presenting complaint are pre-populated from previous entries with a summary of recent assessments and the last documented plan.

**Drawable examination diagrams** — Four anatomical canvases (heart, lungs, abdomen, lower limbs) with multi-colour drawing tools. Annotations are saved with each entry and persist when viewing past records.

**Structured documentation** — Each entry follows a consistent clinical format: Patient Details → PMH/PC → Assessment → Examination → Systems Review → Plan → Sign-off (name, grade, date).

**No server required** — Runs entirely in the browser. Data is stored in localStorage — no backend, no database, no login needed. Just open the file and start documenting.

## Quickstart

```bash
git clone https://github.com/M-Omarjee/ward-round-template.git
cd ward-round-template
open index.html
```

Or simply double-click `index.html` in Finder. No installation, no dependencies, no build step.

## How It Works

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **UI** | HTML + Tailwind CSS (CDN) | Responsive, modern interface |
| **Logic** | Vanilla JavaScript | Screen navigation, data management, drawing |
| **Storage** | localStorage | Patient data and entries persist between sessions |
| **Diagrams** | SVG + Canvas overlay | Anatomical outlines with freehand drawing |
| **Summaries** | Heuristic text extraction | Pulls PMH, recent assessments, and last plan from previous entries |

## App Structure

```
Screen 1: Patient list
  └─ Click patient → Screen 2

Screen 2: Patient record (entry timeline)
  ├─ Click entry → Screen 3 (read-only view)
  └─ New entry → Screen 3 (editable form)

Screen 3: Ward round entry
  ├─ Patient details (auto-filled)
  ├─ PMH & presenting complaint (auto-generated, editable)
  ├─ Today's assessment (free text)
  ├─ Examination diagrams (heart, lungs, abdomen, legs — drawable)
  ├─ Systems review (free text)
  ├─ Plan / management (free text)
  └─ Sign-off (name, grade, date)
```

## Limitations

- **localStorage only** — data lives in the browser. Clearing browser data will erase everything. Not suitable for multi-device or multi-user access.
- **No authentication** — anyone with access to the browser can view the data.
- **Heuristic summaries** — the auto-generated PMH/PC section uses simple text extraction, not a trained NLP model. In a production system this would use an LLM with appropriate clinical safeguards.
- **Not validated** — this has not undergone clinical safety testing or NHS Digital assessment.

## Next Steps

1. **Backend + database** — Replace localStorage with a Flask/FastAPI backend and PostgreSQL for multi-device access
2. **LLM-powered summaries** — Integrate an LLM (with appropriate guardrails) for clinically intelligent summarisation
3. **User authentication** — Role-based access control (consultant vs FY1 vs nurse)
4. **PDF export** — Generate printable ward round documentation
5. **FHIR integration** — Connect to NHS FHIR APIs for real patient demographics

## Technical Stack

HTML · CSS (Tailwind) · JavaScript · Canvas API · localStorage

## Author

**Muhammed Omarjee** — Foundation Doctor (MBBS, King's College London 2023)

## License

[MIT](LICENSE)
