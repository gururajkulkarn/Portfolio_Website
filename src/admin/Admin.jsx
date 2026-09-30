import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import {
  createItem,
  getSingleton,
  removeItem,
  saveSingleton,
  updateItem,
} from "../lib/content";
import { useCollection } from "../hooks/useCollection";
import {
  defaultAbout,
  defaultProfile,
  defaultProjects,
  defaultSettings,
} from "../data/defaultData";

const tabs = [
  ["profile", "Profile"],
  ["homepage", "Homepage"],
  ["about", "About & services"],
  ["skills", "Technologies"],
  ["projects", "Projects"],
  ["experience", "Experience"],
  ["testimonials", "Testimonials"],
];

const serviceIconOptions = ["Globe2", "AppWindow", "Boxes", "Database", "Smartphone", "Rocket"];
const adminEmail = "admin@gmail.com";

function Field({ label, value, onChange, multiline = false, type = "text", placeholder, required = false }) {
  const common = {
    value: value ?? "",
    onChange: (event) => onChange(event.target.value),
    placeholder,
    required,
    className: "admin-input mt-2 w-full rounded-xl border border-white/10 bg-slate-950/80 px-3.5 py-3 text-white outline-none focus:border-indigo-400/70",
  };
  return (
    <label className="block text-sm font-medium text-slate-300">
      {label}
      {multiline ? <textarea rows={4} {...common} /> : <input type={type} {...common} />}
    </label>
  );
}

function SaveButton({ children = "Save changes", saving = false, disabled = false }) {
  return (
    <button
      type="submit"
      disabled={saving || disabled}
      className="admin-save-button rounded-xl px-5 py-3 font-bold text-white disabled:cursor-wait disabled:opacity-60"
    >
      {saving ? "Saving…" : children}
    </button>
  );
}

function Notice({ message }) {
  if (!message) return null;
  return <p role="status" className="mt-4 rounded-xl border border-white/10 bg-white/[.04] px-4 py-3 text-sm text-cyan-200">{message}</p>;
}

function explainFirebaseError(error, fallback) {
  if (error?.code === "permission-denied") {
    return "Firestore rejected this save. Deploy the project's firebase.rules and confirm this account is authorized to write.";
  }
  if (error?.code === "unauthenticated") {
    return "Your admin session expired. Sign in again, then retry.";
  }
  return error?.message || fallback;
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (authError) {
      setError(authError.message || "Sign in failed. Check your email and password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-grid px-6 py-12">
      <form onSubmit={submit} className="glass w-full max-w-md rounded-3xl p-8">
        <p className="text-xs font-bold uppercase tracking-[.22em] text-cyan-300">Portfolio CMS</p>
        <h1 className="mt-3 text-3xl font-black">Admin Login</h1>
        <p className="mt-2 text-slate-400">Manage every section of your portfolio.</p>
        <label className="mt-7 block text-sm text-slate-300">
          Email
          <input autoComplete="username" required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="admin-input mt-2 w-full rounded-xl border border-white/10 bg-slate-950/80 px-3.5 py-3 text-white" />
        </label>
        <label className="mt-3 block text-sm text-slate-300">
          Password
          <input autoComplete="current-password" required type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="admin-input mt-2 w-full rounded-xl border border-white/10 bg-slate-950/80 px-3.5 py-3 text-white" />
        </label>
        {error && <p role="alert" className="mt-3 text-sm text-red-300">{error}</p>}
        <button disabled={busy} className="admin-save-button mt-5 w-full rounded-xl py-3 font-bold text-white disabled:opacity-60">{busy ? "Signing in…" : "Sign in"}</button>
      </form>
    </div>
  );
}

function ProfileEditor({ profile, setProfile, onSave, saving, notice }) {
  const fields = [
    ["name", "Display name"],
    ["headline", "Hero headline (use • to separate the animated title and subtitle)"],
    ["bio", "Hero introduction", true],
    ["location", "Location"],
    ["email", "Contact email", false, "email"],
    ["phone", "WhatsApp phone (include country code)", false, "tel"],
    ["avatarUrl", "Portrait image URL"],
    ["resumeUrl", "Resume URL"],
    ["availability", "Availability message"],
  ];
  const setSocial = (key, value) => setProfile({ ...profile, socials: { ...profile.socials, [key]: value } });

  return (
    <form onSubmit={onSave}>
      <div className="admin-section-heading">
        <div><p className="admin-kicker">YOUR PUBLIC DETAILS</p><h2>Profile</h2></div>
        <SaveButton saving={saving} />
      </div>
      <div className="admin-panel mt-6 grid gap-5 rounded-2xl p-5 md:grid-cols-2 md:p-7">
        {fields.map(([key, label, multiline, type]) => (
          <div key={key} className={key === "bio" ? "md:col-span-2" : ""}>
            <Field
              label={label}
              multiline={multiline}
              type={type || "text"}
              placeholder={key === "phone" ? "e.g. 919876543210" : key.includes("Url") ? "https://…" : ""}
              value={profile[key]}
              onChange={(value) => setProfile({ ...profile, [key]: value })}
            />
          </div>
        ))}
        <Field label="LinkedIn URL" value={profile.socials?.linkedin} onChange={(value) => setSocial("linkedin", value)} />
        <Field label="GitHub URL" value={profile.socials?.github} onChange={(value) => setSocial("github", value)} />
      </div>
      <Notice message={notice} />
    </form>
  );
}

function HomepageEditor({ settings, setSettings, onSave, saving, notice }) {
  const editStat = (index, part, value) => {
    const stats = [...(settings.stats || [])];
    stats[index] = [...stats[index]];
    stats[index][part] = value;
    setSettings({ ...settings, stats });
  };
  const removeStat = (index) => setSettings({ ...settings, stats: (settings.stats || []).filter((_, i) => i !== index) });
  const addStat = () => setSettings({ ...settings, stats: [...(settings.stats || []), ["New statistic", "Value"]] });
  const fields = [
    ["heroEyebrow", "Hero greeting"],
    ["primaryCta", "WhatsApp button text"],
    ["secondaryCta", "Resume button text"],
    ["scrollCue", "Hero scroll prompt"],
    ["projectsEyebrow", "Projects eyebrow"],
    ["projectsTitle", "Projects heading"],
    ["projectsDescription", "Projects description", true],
    ["skillsEyebrow", "Technology section eyebrow"],
    ["skillsTitle", "Technology section heading"],
    ["technologyPanelTitle", "Technology card heading"],
    ["technologyPanelDescription", "Technology card description", true],
    ["technologyPanelFooter", "Technology card footer"],
    ["experienceEyebrow", "Experience eyebrow"],
    ["experienceTitle", "Experience heading"],
    ["testimonialsEyebrow", "Testimonials eyebrow"],
    ["testimonialsTitle", "Testimonials heading"],
    ["contactEyebrow", "Contact section eyebrow"],
    ["contactTitle", "Contact heading"],
    ["contactDescription", "Contact description", true],
    ["contactCta", "Contact email button text"],
    ["footerText", "Footer text"],
  ];

  return (
    <form onSubmit={onSave}>
      <div className="admin-section-heading">
        <div><p className="admin-kicker">HERO, STATS & CONTACT</p><h2>Homepage content</h2></div>
        <SaveButton saving={saving} />
      </div>
      <div className="admin-panel mt-6 grid gap-5 rounded-2xl p-5 md:grid-cols-2 md:p-7">
        {fields.map(([key, label, multiline]) => (
          <div key={key} className={multiline || key === "footerText" ? "md:col-span-2" : ""}>
            <Field label={label} value={settings[key]} multiline={multiline} onChange={(value) => setSettings({ ...settings, [key]: value })} />
          </div>
        ))}
      </div>
      <div className="admin-section-heading mt-9">
        <div><p className="admin-kicker">NAVIGATION LABELS</p><h3>Menu items</h3></div>
      </div>
      <div className="admin-panel mt-4 grid gap-4 rounded-2xl p-5 sm:grid-cols-2 lg:grid-cols-3 md:p-7">
        {Object.entries(defaultSettings.navigation).map(([key, label]) => (
          <Field
            key={key}
            label={`${label} menu label`}
            value={settings.navigation?.[key] ?? label}
            onChange={(value) => setSettings({ ...settings, navigation: { ...defaultSettings.navigation, ...settings.navigation, [key]: value } })}
          />
        ))}
      </div>
      <div className="admin-section-heading mt-9">
        <div><p className="admin-kicker">EDIT THE HIGHLIGHTS</p><h3>Homepage statistics</h3></div>
        <button type="button" onClick={addStat} className="admin-secondary-button">+ Add statistic</button>
      </div>
      <div className="mt-4 space-y-3">
        {(settings.stats || []).map(([label, value], index) => (
          <div key={`${index}-${label}`} className="admin-panel grid items-end gap-3 rounded-2xl p-4 sm:grid-cols-[1fr_1fr_auto]">
            <Field label="Label" value={label} onChange={(next) => editStat(index, 0, next)} />
            <Field label="Value" value={value} onChange={(next) => editStat(index, 1, next)} />
            <button type="button" onClick={() => removeStat(index)} className="admin-delete-button">Remove</button>
          </div>
        ))}
      </div>
      <div className="mt-5"><SaveButton saving={saving}>Save homepage</SaveButton></div>
      <Notice message={notice} />
    </form>
  );
}

function AboutEditor({ about, setAbout, onSave, saving, notice }) {
  const updateService = (index, key, value) => {
    const services = [...(about.services || [])];
    services[index] = { ...services[index], [key]: value };
    setAbout({ ...about, services });
  };
  const addService = () => setAbout({ ...about, services: [...(about.services || []), { icon: "Boxes", title: "New service", description: "Describe what you deliver to clients." }] });
  const removeService = (index) => setAbout({ ...about, services: (about.services || []).filter((_, i) => i !== index) });

  return (
    <form onSubmit={onSave}>
      <div className="admin-section-heading">
        <div><p className="admin-kicker">INTRODUCTION & CAPABILITIES</p><h2>About section</h2></div>
        <SaveButton saving={saving} />
      </div>
      <div className="admin-panel mt-6 grid gap-5 rounded-2xl p-5 md:grid-cols-2 md:p-7">
        <Field label="Eyebrow" value={about.eyebrow} onChange={(value) => setAbout({ ...about, eyebrow: value })} />
        <Field label="Heading" value={about.title} onChange={(value) => setAbout({ ...about, title: value })} />
        <div className="md:col-span-2"><Field label="Gradient heading text" value={about.titleAccent} onChange={(value) => setAbout({ ...about, titleAccent: value })} /></div>
        <div className="md:col-span-2"><Field label="Client-focused introduction" multiline value={about.description} onChange={(value) => setAbout({ ...about, description: value })} /></div>
      </div>
      <div className="admin-section-heading mt-9">
        <div><p className="admin-kicker">CREATE, UPDATE OR REMOVE</p><h3>About service cards</h3></div>
        <button type="button" onClick={addService} className="admin-secondary-button">+ Add service</button>
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        {(about.services || []).map((service, index) => (
          <div key={`${index}-${service.title}`} className="admin-panel rounded-2xl p-4 md:p-5">
            <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
              <Field label="Service title" value={service.title} onChange={(value) => updateService(index, "title", value)} />
              <label className="block text-sm font-medium text-slate-300">Card icon
                <select value={service.icon} onChange={(event) => updateService(index, "icon", event.target.value)} className="admin-input mt-2 w-full rounded-xl border border-white/10 bg-slate-950/80 px-3.5 py-3 text-white">
                  {serviceIconOptions.map((icon) => <option key={icon} value={icon}>{icon}</option>)}
                </select>
              </label>
              <button type="button" onClick={() => removeService(index)} className="admin-delete-button self-end">Remove</button>
            </div>
            <div className="mt-4"><Field label="Description" multiline value={service.description} onChange={(value) => updateService(index, "description", value)} /></div>
          </div>
        ))}
      </div>
      <div className="mt-5"><SaveButton saving={saving}>Save About section</SaveButton></div>
      <Notice message={notice} />
    </form>
  );
}

function SkillsEditor({ profile, setProfile, onSave, saving, notice }) {
  const [draft, setDraft] = useState("");
  const skills = profile.skills || [];
  const addSkill = (event) => {
    event.preventDefault();
    const skill = draft.trim();
    if (skill && !skills.some((current) => current.toLowerCase() === skill.toLowerCase())) {
      setProfile({ ...profile, skills: [...skills, skill] });
    }
    setDraft("");
  };
  const removeSkill = (skill) => setProfile({ ...profile, skills: skills.filter((current) => current !== skill) });

  return (
    <form onSubmit={onSave}>
      <div className="admin-section-heading">
        <div><p className="admin-kicker">TECHNOLOGIES I WORK WITH</p><h2>Technology stack</h2></div>
        <SaveButton saving={saving} />
      </div>
      <p className="mt-2 text-sm text-slate-400">Add or remove a technology. Its name also determines the logo shown on the public site when a brand mark is available.</p>
      <div className="admin-panel mt-6 rounded-2xl p-5 md:p-7">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => event.key === "Enter" && addSkill(event)} placeholder="Add a technology" className="admin-input min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-950/80 px-3.5 py-3 text-white" />
          <button type="button" onClick={addSkill} className="admin-secondary-button">+ Add technology</button>
        </div>
        <div className="mt-5 flex flex-wrap gap-2.5">
          {skills.map((skill) => (
            <span key={skill} className="admin-skill-chip">
              {skill}
              <button type="button" aria-label={`Remove ${skill}`} onClick={() => removeSkill(skill)}>×</button>
            </span>
          ))}
          {!skills.length && <p className="text-sm text-slate-500">No technologies added yet.</p>}
        </div>
      </div>
      <div className="mt-5"><SaveButton saving={saving}>Save technologies</SaveButton></div>
      <Notice message={notice} />
    </form>
  );
}

const collectionFields = {
  projects: [
    { key: "title", label: "Project name", required: true },
    { key: "category", label: "Project type" },
    { key: "description", label: "Description", multiline: true, required: true },
    { key: "image", label: "Image URL" },
    { key: "url", label: "Live project URL" },
    { key: "tags", label: "Technology tags (comma separated)" },
  ],
  experience: [
    { key: "role", label: "Role", required: true },
    { key: "company", label: "Company / client", required: true },
    { key: "period", label: "Period" },
    { key: "description", label: "Description", multiline: true, required: true },
  ],
  testimonials: [
    { key: "name", label: "Client name", required: true },
    { key: "role", label: "Client role / project" },
    { key: "quote", label: "Testimonial", multiline: true, required: true },
  ],
};

function CollectionEditor({ type, title }) {
  const { data, loading, error } = useCollection(type);
  const fields = collectionFields[type];
  const singular = { projects: "project", experience: "experience", testimonials: "testimonial" }[type];
  const empty = Object.fromEntries(fields.map(({ key }) => [key, ""]));
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [notice, setNotice] = useState("");

  const reset = () => {
    setForm(empty);
    setEditing(null);
    setNotice("");
  };

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setNotice("");
    const payload = { ...form };
    if (type === "projects") payload.tags = (payload.tags || "").split(",").map((tag) => tag.trim()).filter(Boolean);
    try {
      if (editing) await updateItem(type, editing, payload);
      else await createItem(type, payload);
      reset();
      setNotice(editing ? `${singular} updated.` : `${singular} created.`);
    } catch (error) {
      setNotice(explainFirebaseError(error, `Could not save ${title.toLowerCase()}.`));
    } finally {
      setBusy(false);
    }
  }

  async function deleteRecord(item) {
    const name = item.title || item.role || item.name;
    if (!window.confirm(`Delete “${name}”? This cannot be undone.`)) return;
    setNotice("");
    try {
      await removeItem(type, item.id);
      if (editing === item.id) reset();
      setNotice(`${name} deleted.`);
    } catch (error) {
      setNotice(explainFirebaseError(error, "Could not delete this item."));
    }
  }

  async function publishStarterProjects() {
    setSeeding(true);
    setNotice("");
    try {
      await Promise.all(defaultProjects.map((project) => createItem("projects", project)));
      setNotice("Starter projects added. You can now edit each project here.");
    } catch (error) {
      setNotice(explainFirebaseError(error, "Could not add the starter projects."));
    } finally {
      setSeeding(false);
    }
  }

  return (
    <section>
      <div className="admin-section-heading">
        <div><p className="admin-kicker">MANAGE YOUR CONTENT</p><h2>{title}</h2></div>
        <button type="button" onClick={reset} disabled={Boolean(error)} className="admin-secondary-button">+ New {singular}</button>
      </div>
      <form onSubmit={submit} className="admin-panel mt-6 rounded-2xl p-5 md:p-7">
        <h3 className="mb-5 text-lg font-bold">{editing ? `Edit ${singular}` : `Create ${singular}`}</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {fields.map(({ key, label, multiline, required }) => (
            <div key={key} className={multiline || key === "description" || key === "quote" ? "md:col-span-2" : ""}>
              <Field
                label={label}
                multiline={multiline}
                required={required}
                value={Array.isArray(form[key]) ? form[key].join(", ") : form[key]}
                onChange={(value) => setForm({ ...form, [key]: value })}
              />
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <SaveButton saving={busy} disabled={Boolean(error)}>{editing ? `Update ${singular}` : `Create ${singular}`}</SaveButton>
          {editing && <button type="button" onClick={reset} className="admin-secondary-button">Cancel edit</button>}
        </div>
        <Notice message={notice} />
      </form>
      <div className="mt-8">
        <h3 className="mb-4 text-lg font-bold">Published items <span className="text-sm font-medium text-slate-500">({data.length})</span></h3>
        {type === "projects" && !loading && !error && !data.length && (
          <div className="admin-panel mb-4 flex flex-col items-start justify-between gap-4 rounded-2xl p-5 sm:flex-row sm:items-center">
            <p className="max-w-xl text-sm leading-6 text-slate-400">The public site is showing your three starter project cards. Add them to Firestore to edit or remove them here.</p>
            <button type="button" disabled={seeding} onClick={publishStarterProjects} className="admin-secondary-button shrink-0 disabled:opacity-60">{seeding ? "Adding projects…" : "Add starter projects to CMS"}</button>
          </div>
        )}
        {loading && <p className="text-sm text-slate-400">Loading {title.toLowerCase()}…</p>}
        {error && <p role="alert" className="mb-4 rounded-xl border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-200">Could not load this collection: {error}</p>}
        {!loading && !error && !data.length && <div className="admin-panel rounded-2xl p-6 text-sm text-slate-400">No {title.toLowerCase()} yet. Create one above.</div>}
        <div className="space-y-3">
          {data.map((item) => (
            <article key={item.id} className="admin-panel flex flex-col justify-between gap-4 rounded-2xl p-4 sm:flex-row sm:items-center sm:p-5">
              <div className="min-w-0">
                <h4 className="truncate font-bold text-white">{item.title || item.role || item.name}</h4>
                <p className="mt-1 line-clamp-2 text-sm text-slate-400">{item.description || item.quote || item.period}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button type="button" disabled={Boolean(error)} onClick={() => {
                  const nextForm = { ...empty };
                  fields.forEach(({ key }) => {
                    nextForm[key] = key === "tags"
                      ? (Array.isArray(item[key]) ? item[key].join(", ") : item[key] || "")
                      : item[key] || "";
                  });
                  setForm(nextForm);
                  setEditing(item.id);
                  setNotice("");
                }} className="admin-secondary-button">Edit</button>
                <button type="button" disabled={Boolean(error)} onClick={() => deleteRecord(item)} className="admin-delete-button">Delete</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Dashboard() {
  const [tab, setTab] = useState("profile");
  const [profile, setProfile] = useState(defaultProfile);
  const [settings, setSettings] = useState(defaultSettings);
  const [about, setAbout] = useState(defaultAbout);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([getSingleton("profile"), getSingleton("settings"), getSingleton("about")])
      .then(([savedProfile, savedSettings, savedAbout]) => {
        if (!active) return;
        if (savedProfile) setProfile({
          ...defaultProfile,
          ...savedProfile,
          avatarUrl: savedProfile.avatarUrl || defaultProfile.avatarUrl,
          socials: { ...defaultProfile.socials, ...savedProfile.socials },
        });
        if (savedSettings) setSettings({ ...defaultSettings, ...savedSettings, navigation: { ...defaultSettings.navigation, ...savedSettings.navigation } });
        if (savedAbout) setAbout({ ...defaultAbout, ...savedAbout });
      })
      .catch((error) => {
        if (active) setNotice(error.message || "Could not load saved site content.");
      })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  async function saveDocument(name, value, successMessage) {
    setSaving(true);
    setNotice("");
    try {
      await saveSingleton(name, value);
      setNotice(successMessage);
    } catch (error) {
      setNotice(explainFirebaseError(error, "Save failed. Please try again."));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="min-h-screen grid place-items-center bg-[#050816] text-slate-300">Loading your site content…</div>;

  return (
    <div className="admin-shell min-h-screen bg-grid">
      <header className="admin-header sticky top-0 z-20 border-b border-white/10 bg-[#050816]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-6">
          <div><p className="admin-kicker">SITE MANAGEMENT</p><b className="text-lg sm:text-xl">Portfolio Admin</b></div>
          <button type="button" onClick={() => signOut(auth)} className="admin-secondary-button">Log out</button>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-7 px-5 py-8 md:px-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:py-10">
        <aside className="admin-tabs grid grid-cols-2 gap-2 sm:grid-cols-3 lg:sticky lg:top-28 lg:block lg:h-fit lg:space-y-2">
          {tabs.map(([id, label]) => (
            <button key={id} type="button" onClick={() => { setTab(id); setNotice(""); }} className={`admin-tab ${tab === id ? "admin-tab-active" : ""}`}>{label}</button>
          ))}
        </aside>
        <main className="min-w-0">
          {tab === "profile" && <ProfileEditor profile={profile} setProfile={setProfile} onSave={(event) => { event.preventDefault(); saveDocument("profile", profile, "Profile saved successfully."); }} saving={saving} notice={notice} />}
          {tab === "homepage" && <HomepageEditor settings={settings} setSettings={setSettings} onSave={(event) => { event.preventDefault(); saveDocument("settings", settings, "Homepage content saved successfully."); }} saving={saving} notice={notice} />}
          {tab === "about" && <AboutEditor about={about} setAbout={setAbout} onSave={(event) => { event.preventDefault(); saveDocument("about", about, "About section saved successfully."); }} saving={saving} notice={notice} />}
          {tab === "skills" && <SkillsEditor profile={profile} setProfile={setProfile} onSave={(event) => { event.preventDefault(); saveDocument("profile", profile, "Technology stack saved successfully."); }} saving={saving} notice={notice} />}
          {tab === "projects" && <CollectionEditor type="projects" title="Projects" />}
          {tab === "experience" && <CollectionEditor type="experience" title="Experience" />}
          {tab === "testimonials" && <CollectionEditor type="testimonials" title="Testimonials" />}
        </main>
      </div>
    </div>
  );
}

export default function Admin() {
  const [user, setUser] = useState(undefined);
  useEffect(() => onAuthStateChanged(auth, setUser), []);
  if (user === undefined) return <div className="min-h-screen grid place-items-center bg-[#050816] text-slate-300">Checking admin session…</div>;
  if (!user) return <Login />;
  if (user.email?.toLowerCase() !== adminEmail) {
    return (
      <div className="min-h-screen grid place-items-center bg-grid px-6 py-12">
        <section className="glass w-full max-w-md rounded-3xl p-8">
          <p className="text-xs font-bold uppercase tracking-[.22em] text-cyan-300">Portfolio CMS</p>
          <h1 className="mt-3 text-3xl font-black">Admin access restricted</h1>
          <p className="mt-3 text-slate-400">Signed in as {user.email || "an account without an email"}. Use the configured admin account to manage this portfolio.</p>
          <button type="button" onClick={() => signOut(auth)} className="admin-save-button mt-6 rounded-xl px-5 py-3 font-bold text-white">Sign out</button>
        </section>
      </div>
    );
  }
  return <Dashboard />;
}
