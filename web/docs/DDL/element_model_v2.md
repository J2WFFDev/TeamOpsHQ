Goal: I’ve inlined both markdown documents so you can copy-paste them, and I’ve re-saved them to new filenames in case the links were the issue.

# element\_model\_v2.md (inline)

```markdown
# Unified Element Data Model (v2) — Elements, Progress, Squads, Bucket List, Versioning

**Purpose:** Define a flexible, single-table Element model with typed JSON details to support Tasks, Decisions, Events, Journals, Notes, Coach Notes, Habits, and Bucket List items—plus identity hierarchy, lists, progress, calendar/feed, and versioning.

---

## Global enums & conventions
```

Status := "open" | "in\_progress" | "blocked" | "done" | "completed" | "wont\_do" | "archived" | "deleted"
ElementType := "task" | "decision" | "event" | "journal" | "note" | "coach\_note" | "habit" | "bucket\_list"
Timestamp := ISO-8601 string    // "YYYY-MM-DDTHH\:mm\:ss±hh\:mm"
Date := "YYYY-MM-DD"

```
- Each `details_json` includes `"$type"` (matches Element.type) and `"$v"` (schema version).
- “Quick Reference” uses a first-class flag and optional short code for fast retrieval.
- Progress is logged generically and can be rolled up per element.

---

## Element (root / row)
```

Element
├─ element\_id : number
├─ type : ElementType
├─ title : string|null
├─ status : Status|null
├─ priority : 1 | 2 | 3 | 4 | null
├─ quick\_ref : boolean                   // quick reference surfacing
├─ quick\_code : string|null              // e.g., "VPN", "ACL"
├─ created\_by : number                   // user\_id
├─ created\_at : Timestamp
├─ updated\_at : Timestamp|null
├─ deleted\_at : Timestamp|null
├─ list\_id : number|null                 // default list bucket
├─ parent\_id : number|null               // subtask/thread/epic parent
├─ pinned : boolean|null
├─ details\_json : object                 // typed payload; see below
│  ├─ \$type : string
│  └─ \$v : number
├─ start\_at : Timestamp|null             // derived from details\_json
├─ due\_at   : Timestamp|null
├─ end\_at   : Timestamp|null
├─ goal\_date: Date|null
└─ location\_name : string|null

```

### Relationships & organization
```

ElementLink
├─ parent\_id : number
├─ child\_id  : number
└─ link\_type : "subtask" | "relates" | "blocks" | "implements" | "references"

Tag
├─ tag\_id : number
├─ org\_id : number
├─ name : string
└─ color : string|null

ElementTag
├─ element\_id : number
└─ tag\_id : number

```

---

## Lists & Bucket List
- **List** is customizable per Org/Program/Team; “Bucket List” can be a list type and/or an element type.
```

List
├─ list\_id : number
├─ org\_id : number
├─ program\_id : number|null
├─ team\_id : number|null
├─ name : string
├─ list\_type : "standard" | "bucket" | "smart"
└─ sort\_idx : number|null

ElementList              // optional multi-list membership
├─ element\_id : number
└─ list\_id : number

```

**Bucket List as element type**
```

details\_json (type="bucket\_list")
├─ \$type : "bucket\_list"; \$v : 1
├─ category : string|null
├─ target\_date : Date|null
├─ milestones : { label\:string, done\:boolean, at?\:Date|null }\[]
├─ resources : { name\:string, url?\:string }\[]
└─ inspiration\_md : string|null

```

---

## Identity & hierarchy (Org → Program → Team → Squad)
```

Org
├─ org\_id : number
├─ name : string
├─ slug : string
└─ timezone : string|null

Program
├─ program\_id : number
├─ org\_id : number
├─ name : string
└─ description : string|null

Team
├─ team\_id : number
├─ program\_id : number|null
├─ name : string
└─ color : string|null

Squad
├─ squad\_id : number
├─ team\_id : number|null
├─ program\_id : number|null
└─ name : string

User
├─ user\_id : number
├─ org\_id : number
├─ email : string
├─ display\_name : string
└─ tz : string|null

```

**Memberships (many-to-many)**
```

UserOrgRole
├─ org\_id : number
├─ user\_id : number
└─ role : "owner" | "admin" | "member" | "coach" | "viewer"

UserProgramRole
├─ program\_id : number
├─ user\_id : number
└─ role : string

UserTeamRole
├─ team\_id : number
├─ user\_id : number
└─ role : "coach" | "lead" | "member"

UserSquadRole
├─ squad\_id : number
├─ user\_id : number
└─ role : "lead" | "member" | "coach"

```

---

## Progress tracking (generic + rollups)
```

ProgressLog
├─ progress\_id : number
├─ element\_id : number
├─ at : Timestamp
├─ unit : "percent" | "hours" | "count" | "points" | "custom"
├─ value : number
├─ target : number|null
└─ note : string|null

ProgressRollup (derived cache)
├─ element\_id : number
├─ unit : string
├─ current : number
└─ target : number|null

```
**Applies to:** tasks, habits, bucket_list items, coach notes (training), and indirectly decisions (via OKRs).

---

## details_json by type

### Task
```

details\_json (type="task")
├─ \$type : "task"; \$v : 1
├─ assignees : number\[]
├─ start\_at : Timestamp|null
├─ due\_at   : Timestamp|null
├─ reminders : { offset\_min\:number, channel:"app"|"email"|"sms" }\[]
├─ estimate\_min : number|null
├─ recurrence : string|null
├─ checklist : { id\:string, text\:string, done\:boolean, order\:number }\[]
├─ links : { type:"task"|"decision", element\_id\:number, rel:"implements"|"relates"|"blocks" }\[]
├─ context : { area?\:string|null, energy?\:string|null }
├─ dependencies : { depends\_on\:number, blocks\:number } | null
├─ is\_group : boolean
├─ shared\_profile\_id : number|null
└─ inheritance : "inherit" | "override" | "copy\_on\_create" | null

```

### Decision (status & header pinning)
```

details\_json (type="decision")
├─ \$type : "decision"; \$v : 1
├─ status : "active" | "on\_hold" | "approved" | "rejected" | "implemented" | "retired"
├─ pin\_header : boolean
├─ objective : string
├─ key\_results : { kr\:string, metric\:string, target\:number, current\:number|null }\[]
├─ options : { id\:string, label\:string, pros\:string, cons\:string, score\:number|null }\[]
├─ chosen\_option\_id : string|null
├─ goal\_date : Date|null
├─ review\_at : Timestamp|null
├─ rationale\_md : string|null
├─ owners : number\[]
├─ stakeholders : number\[]
└─ status\_detail : string|null

```

### Event (kinds: meeting/game|match/practice)
```

details\_json (type="event")
├─ \$type : "event"; \$v : 1
├─ event\_kind : "meeting" | "game" | "match" | "practice" | "other"
├─ start\_at : Timestamp
├─ end\_at   : Timestamp
├─ location : { name\:string, address?\:string|null, geo?:{ lat\:number, lng\:number }|null }
├─ attendees : { contact\_id?\:number|null, user\_id?\:number|null, name\:string, email?\:string|null, rsvp:"yes"|"no"|"maybe"|null, role?\:string|null }\[]
├─ reminders : { offset\_min\:number, channel:"app"|"email"|"sms" }\[]
├─ recurrence : string|null
├─ resources : { type\:string, id\:string }\[]
├─ notes\_md : string|null
├─ series\_id : number|null
└─ program\_plan\_step\_id : number|null

```

### Journal (modes & prompts)
```

details\_json (type="journal")
├─ \$type : "journal"; \$v : 1
├─ mode : "freestyle" | "prompt\_morning" | "prompt\_weekly" | "prompt\_custom"
├─ prompt\_set\_id : number|null
├─ prompt\_id : number|null
├─ mood : string|null
├─ energy : string|null
├─ links : { type:"task"|"decision", element\_id\:number, rel:"reflects"|"references" }\[]
├─ highlights : string\[]
├─ blockers : string\[]
└─ body\_md : string

```

### Note (quick-reference friendly)
```

details\_json (type="note")
├─ \$type : "note"; \$v : 1
├─ pinned : boolean
├─ codes : string\[]
├─ source\_url : string|null
├─ attachments : { name\:string, path?\:string, url?\:string }\[]
└─ body\_md : string

```

### Coach Note (audience targets)
```

details\_json (type="coach\_note")
├─ \$type : "coach\_note"; \$v : 1
├─ subject : { type:"athlete"|"team"|"squad", id\:number, name?\:string|null }
├─ audience : { users?\:number, squads?\:number, teams?\:number }
├─ feedback\_md : string
├─ confidentiality : "private" | "team" | "public"
├─ goals : { text\:string, goal\_date\:Date, metric?\:string|null, baseline?\:number|null }\[]
├─ action\_items : { text\:string, due\_at?\:Timestamp|null, linked\_task?\:number|null }\[]
└─ tags : string\[]

```

### Habit (recurrence semantics & skip)
```

details\_json (type="habit")
├─ \$type : "habit"; \$v : 1
├─ cadence : "daily" | "weekly" | "monthly" | "custom"
├─ schedule :
│  ├─ rrule : string|null                   // e.g., "FREQ=WEEKLY;BYDAY=WE"
│  └─ window : { start?\:string|null, end?\:string|null }
├─ miss\_policy : "ignore" | "ask" | "auto\_skip"
├─ skip\_behavior : "skip\_forward" | "catch\_up"         // default "skip\_forward"
├─ target : { unit:"count"|"minutes"|"seconds"|"custom", value\:number }
├─ streak : { current\:number, best\:number, since?\:Date|null }
├─ log : { date\:Date, value\:number, note?\:string|null, skipped?\:boolean }\[]
├─ reminders : { offset\_min\:number, channel:"app"|"email"|"sms" }\[]
├─ context : { location?\:string|null, energy?\:string|null, tags?\:string }
└─ auto\_complete : boolean|null

```

---

## Prompts & programs (for journals/practice)
```

PromptSet
├─ prompt\_set\_id : number
├─ name : string
└─ scope : "org" | "program" | "team" | "user"

Prompt
├─ prompt\_id : number
├─ prompt\_set\_id : number
├─ title : string
└─ body\_md : string

ProgramPlanStep
├─ program\_plan\_step\_id : number
├─ program\_id : number
├─ title : string
└─ descr : string|null

```

---

## Calendar index
```

CalendarEvent
├─ cal\_event\_id : number
├─ element\_id : number
├─ start\_at : Timestamp
├─ end\_at : Timestamp
├─ location\_name : string|null
├─ recurrence : string|null
└─ visibility : "private" | "team" | "org" | "public"

EventAttendee
├─ cal\_event\_id : number
├─ user\_id : number|null
├─ contact\_id : number|null
└─ rsvp : "yes" | "no" | "maybe" | null

CalendarResource
├─ resource\_id : number
├─ name : string
└─ type : "room" | "bay" | "range" | "equipment"

EventResource
├─ cal\_event\_id : number
└─ resource\_id : number

```

---

## Feed / audit
```

FeedItem
├─ feed\_id : number
├─ org\_id : number
├─ actor\_user\_id : number
├─ verb : "created" | "updated" | "status\_changed" | "completed" | "deleted" | "restored" | "commented" | "linked"
├─ object\_type : "element" | "team" | "program" | "list"
├─ object\_id : number
├─ target\_type : string|null
├─ target\_id : number|null
├─ ts : Timestamp
└─ payload : object

FeedReadState
├─ feed\_id : number
├─ user\_id : number
└─ read\_at : Timestamp|null

```

---

## People, places, collaboration
```

Contact
├─ contact\_id : number
├─ org\_id : number
├─ name : string
├─ email : string|null
├─ phone : string|null
└─ notes : string|null

Location
├─ location\_id : number
├─ name : string
├─ address : string|null
└─ geo : { lat\:number, lng\:number } | null

Comment
├─ comment\_id : number
├─ element\_id : number
├─ author\_user\_id : number
├─ body\_md : string
├─ created\_at : Timestamp
└─ parent\_id : number|null

Attachment
├─ attachment\_id : number
├─ element\_id : number
├─ name : string
├─ mime : string
├─ size\_bytes : number
└─ url\_or\_path : string

```

---

## Objectives / OKR
```

Objective
├─ objective\_id : number
├─ org\_id : number
├─ title : string
├─ owner\_user\_id : number|null
└─ horizon : "quarter" | "year" | string

KeyResult
├─ kr\_id : number
├─ objective\_id : number
├─ label : string
├─ metric : string
├─ target : number
└─ current : number|null

ElementObjectiveLink
├─ element\_id : number
└─ objective\_id : number

```

---

## Version control (append-only history)
```

Element (adds)
├─ current\_revision\_id : number
└─ rev\_num : number

ElementRevision
├─ revision\_id : number
├─ element\_id : number
├─ rev\_num : number
├─ parent\_revision\_id : number|null
├─ changed\_by : number
├─ changed\_at : Timestamp
├─ change\_note : string|null
├─ branch : string|null
└─ snapshot : object     // full state: headers + details\_json + status

ElementPatch (optional)
├─ revision\_id : number
├─ op : "json\_patch" | "merge\_patch"
└─ patch\_json : object

```

---

## Indexing & view hints
- Quick Reference: `WHERE quick_ref=1 ORDER BY updated_at DESC`; optionally filter by `quick_code`.
- Habit rollups: last N `ProgressLog` entries per habit; derive streak from `log` and `target`.
- Decision header: `WHERE type="decision" AND (details_json.status="active" OR details_json.pin_header=1)`.
- Calendar: join `CalendarEvent` for time ranges; filter by `event_kind`.
- Bucket List board: `WHERE type="bucket_list"`, group by `category`, order by `target_date`.
```