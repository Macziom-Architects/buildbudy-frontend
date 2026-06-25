"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft, Bookmark, BookmarkCheck, Clock, Star, Share2,
  ChevronRight, Play, ShoppingCart, CheckCircle2, AlertTriangle,
  Wrench, Home, Tag,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { getProducts } from "@/lib/api/products";
import Footer from "@/components/layout/Footer";

// ─── Guide data (mirrors diy/page.jsx GUIDES) ─────────────────────────────────

const GUIDES = [
  { id: "1",  category: "painting",      difficulty: "Beginner",     title: "How to Paint Like a Professional",               duration: "25 min read", rating: 4.8, reviews: 312, tags: ["Paint","Interior","Walls"] },
  { id: "2",  category: "plumbing",      difficulty: "Beginner",     title: "Fixing a Leaky Pipe at Home",                    duration: "18 min read", rating: 4.7, reviews: 245, tags: ["Plumbing","Pipes","Water"] },
  { id: "3",  category: "electrical",    difficulty: "Intermediate", title: "Installing LED Panel Lights Safely",              duration: "30 min read", rating: 4.9, reviews: 198, tags: ["Electrical","Lighting","LED"] },
  { id: "4",  category: "furniture",     difficulty: "Beginner",     title: "Assembling Flat-Pack Furniture the Right Way",    duration: "15 min read", rating: 4.6, reviews: 421, tags: ["Furniture","Assembly","IKEA"] },
  { id: "5",  category: "tools",         difficulty: "Beginner",     title: "Understanding Power Drills: A Complete Guide",    duration: "20 min read", rating: 4.7, reviews: 356, tags: ["Drills","Power Tools","Basics"] },
  { id: "6",  category: "repair",        difficulty: "Intermediate", title: "Patching Drywall Like a Pro",                     duration: "22 min read", rating: 4.5, reviews: 187, tags: ["Repair","Drywall","Walls"] },
  { id: "7",  category: "construction",  difficulty: "Advanced",     title: "Building a Concrete Garden Path",                 duration: "45 min read", rating: 4.8, reviews: 134, tags: ["Concrete","Outdoor","Construction"] },
  { id: "8",  category: "painting",      difficulty: "Intermediate", title: "Exterior Wall Painting in Indian Climate",        duration: "28 min read", rating: 4.6, reviews: 278, tags: ["Paint","Exterior","Weatherproofing"] },
  { id: "9",  category: "electrical",    difficulty: "Beginner",     title: "Electrical Safety Basics Every Homeowner Should Know", duration: "20 min read", rating: 4.9, reviews: 501, tags: ["Electrical","Safety","Basics"] },
  { id: "10", category: "plumbing",      difficulty: "Intermediate", title: "Installing a Bathroom Faucet Step by Step",       duration: "35 min read", rating: 4.7, reviews: 163, tags: ["Plumbing","Bathroom","Faucet"] },
  { id: "11", category: "tools",         difficulty: "Advanced",     title: "Angle Grinder Mastery: Cuts, Grinding & Safety",  duration: "40 min read", rating: 4.8, reviews: 222, tags: ["Grinder","Metal","Advanced"] },
  { id: "12", category: "beginner",      difficulty: "Beginner",     title: "Your First Home Toolbox: What You Actually Need", duration: "12 min read", rating: 4.9, reviews: 892, tags: ["Starter","Essentials","Tools"] },
  { id: "13", category: "construction",  difficulty: "Intermediate", title: "How to Mix Cement for Different Applications",    duration: "20 min read", rating: 4.6, reviews: 309, tags: ["Cement","Concrete","Mixing"] },
  { id: "14", category: "repair",        difficulty: "Beginner",     title: "Fixing a Squeaky Door in 10 Minutes",             duration: "10 min read", rating: 4.5, reviews: 677, tags: ["Door","Quick Fix","Repair"] },
  { id: "15", category: "furniture",     difficulty: "Advanced",     title: "Build Your Own Solid Wood Bookshelf",             duration: "55 min read", rating: 4.9, reviews: 145, tags: ["Woodworking","Shelving","Build"] },
  // Featured article stubs (slug-based)
  { id: "repaint-living-room",    category: "painting",  difficulty: "Beginner",     title: "Repaint Your Living Room in One Weekend",         duration: "Weekend",    rating: 4.8, reviews: 203, tags: ["Paint","Living Room","Weekend"] },
  { id: "electrical-safety-rules",category: "electrical",difficulty: "Beginner",     title: "Home Electrical Safety: 8 Rules to Live By",      duration: "10 min read",rating: 4.9, reviews: 418, tags: ["Electrical","Safety","Rules"] },
  { id: "monsoon-proof-home",     category: "repair",    difficulty: "Intermediate", title: "Monsoon-Proof Your Home: A Full Checklist",       duration: "30 min read",rating: 4.7, reviews: 287, tags: ["Waterproofing","Monsoon","Checklist"] },
];

// ─── Guide content (tools, materials, steps, intro) ───────────────────────────

const GUIDE_CONTENT = {
  "1": {
    intro: "Painting a room yourself can save thousands of rupees and give you a real sense of accomplishment. The difference between an amateur result and a professional one comes down to preparation, not talent. This guide walks you through every step.",
    tools: ["Paint roller (9\" nap)", "2\" angled paintbrush", "Paint tray + liner", "Extension pole", "Painter's tape (2\")", "Drop cloths", "Sandpaper (120-grit)"],
    materials: ["Wall primer", "Interior emulsion (2 coats)", "Wall putty / filler", "Tack cloth"],
    estimatedCost: "₹2,000 – ₹6,000",
    safety: "Ensure room is well-ventilated while painting. Wear a dust mask during sanding and gloves when handling paint.",
    steps: [
      { title: "Clear and protect the room", content: "Move furniture away from walls and cover with drop cloths. Remove switchplates and wall fixtures. Run painter's tape along ceiling edges, door frames, and baseboards — press tape firmly to prevent bleed." },
      { title: "Repair and prep the wall surface", content: "Fill cracks and nail holes with wall putty. Let dry completely (2–3 hours), then sand smooth with 120-grit paper. Wipe dust with a damp cloth. For walls with stains or discolouration, spot-prime those areas first." },
      { title: "Apply primer across the full wall", content: "Using a roller, apply primer in a W or M pattern and fill in between — don't roll straight up and down. Cut in the edges with a brush first. Let primer dry completely (4 hours minimum) before proceeding." },
      { title: "Paint the first coat", content: "Pour paint into the tray, load the roller, and apply in overlapping W strokes. Maintain a wet edge to avoid lap marks. Cut in corners and edges with a brush before rolling each section. Work from the top down." },
      { title: "Apply the second coat and finish", content: "Let the first coat dry fully (check the can — typically 4–6 hours). Apply the second coat in the same pattern. Carefully remove painter's tape at 45° while the paint is still slightly wet for clean lines. Reinstall fixtures after 24 hours." },
    ],
  },
  "2": {
    intro: "Most household pipe leaks are simple to fix with the right approach. Before you call a plumber, check whether it's a joint leak, a pinhole, or a cracked section — each has a different fix, all manageable at home.",
    tools: ["Adjustable wrench", "Pipe wrench", "Plumber's tape (PTFE)", "Pipe cutter or hacksaw", "Bucket", "Towels"],
    materials: ["Epoxy putty or pipe repair clamp", "Replacement joint or coupling (if needed)", "Thread seal tape"],
    estimatedCost: "₹150 – ₹800",
    safety: "Always turn off the main water supply before starting. Have a bucket and towels ready for residual water.",
    steps: [
      { title: "Locate and assess the leak", content: "Run a dry cloth along the pipe and look for the wet spot. Determine if it's at a joint (most common), a pinhole, or a longer crack. Joint leaks are the easiest to fix." },
      { title: "Shut off the water supply", content: "Turn the main water valve fully clockwise to shut off supply. Open a lower tap to drain residual pressure from the line. Dry the leaking area thoroughly with a cloth." },
      { title: "Fix joint leaks with PTFE tape", content: "Unscrew the leaking fitting with a pipe wrench. Wrap new PTFE tape clockwise around the male thread 4–6 times, stretching slightly as you go. Reattach and tighten firmly — don't overtighten on plastic fittings." },
      { title: "Apply epoxy for pinhole leaks", content: "For small holes on straight pipe sections, knead epoxy putty until uniform and press firmly over the hole. Shape around the pipe and let cure per instructions (usually 1 hour) before restoring water pressure." },
      { title: "Restore water and check", content: "Turn the main valve back on slowly. Check the repair under full pressure for 5 minutes. Run a dry cloth along the repair to confirm no seeping. If still leaking at a joint, tighten by quarter-turns." },
    ],
  },
  "3": {
    intro: "LED panel lights offer better light quality and lower energy bills than traditional tube lights. Installing them isn't complicated — but electrical work demands respect for safety. Follow this guide carefully and turn off power at the breaker before you start.",
    tools: ["Screwdrivers (flathead + Phillips)", "Wire stripper", "Voltage tester", "Drill with 6mm bit", "Measuring tape", "Pencil"],
    materials: ["LED panel light(s)", "Mounting frame/bracket", "Electrical wire (1.5mm)", "Junction box (if needed)", "Wire connectors"],
    estimatedCost: "₹800 – ₹3,500 per panel",
    safety: "Turn off the circuit breaker before touching any wiring. Use a voltage tester to confirm power is off. Never work on live wires.",
    steps: [
      { title: "Turn off power and plan layout", content: "Switch off the relevant circuit breaker and verify with a voltage tester. Measure your ceiling and mark panel positions. Ensure each panel location has access to the wiring from the existing ceiling rose or junction box." },
      { title: "Install the mounting frame", content: "Hold the mounting frame against the ceiling, mark drill points, and drill with a 6mm bit. Insert plastic anchors and screw the frame securely. The panel should sit flush when dropped in." },
      { title: "Run and connect the supply wire", content: "Route a 1.5mm wire from the nearest junction box to the panel location. Strip 10mm of insulation from each wire end. Connect Live (red) to Live, Neutral (black) to Neutral, and Earth (green/yellow) to Earth using wire connectors. Never reverse Live and Neutral." },
      { title: "Mount the LED panel", content: "Connect the driver (the small box inside the panel) to the supply wires if it's a separate unit. Snap or screw the panel into the mounting frame. Ensure the panel sits flat and flush." },
      { title: "Test and commission", content: "Turn the breaker back on and switch on the light. Check for even illumination across the panel. If the light flickers, recheck the connections — usually a loose neutral. Seal any ceiling gaps around the frame with white caulk." },
    ],
  },
  "4": {
    intro: "Flat-pack furniture gets a bad reputation but most assembly problems come from skipping steps or misidentifying parts. A systematic approach makes it fast and produces a sturdy result.",
    tools: ["Allen key set (usually included)", "Mallet or rubber hammer", "Phillips screwdriver", "Spirit level", "Measuring tape"],
    materials: ["All hardware from the box (check the manifest)", "Wood glue (optional for extra strength)"],
    estimatedCost: "Included in furniture cost",
    safety: "Never stand on assembled shelves to reach higher sections. For large wardrobes, have a second person to hold panels upright.",
    steps: [
      { title: "Inventory and sort all parts", content: "Lay out every panel, dowel, cam lock, and screw. Check the manifest in the manual and confirm all parts are present before starting. Separate hardware by type into small containers — this saves huge time." },
      { title: "Read the diagram completely", content: "Scan through the entire instruction booklet before touching any pieces. Identify the first 3 steps and mentally rehearse them. Flat-pack errors almost always come from misreading which panel faces which direction." },
      { title: "Build the base and back structure", content: "Attach dowels to base panels first — tap gently with a mallet until seated. Insert cam locks into the designated holes. Connect the back panel (if any) before standing the structure up — it's much easier horizontal." },
      { title: "Assemble the frame upright", content: "With help, stand the frame upright. Insert side panels and lock cam nuts with a screwdriver until the symbol lines up (a quarter-turn is usually enough). Don't over-tighten — you may need to adjust." },
      { title: "Attach doors, drawers, and shelves", content: "Hang doors using the included hinges and adjust using the adjustment screws until the gap is even. Insert drawer slides, mount drawers, and test smooth operation. Check all joints for play and tighten as needed." },
    ],
  },
  "5": {
    intro: "A power drill is the single most-used tool in home DIY. Understanding how to select the right bit, set the correct speed, and drill straight will make every project easier and safer.",
    tools: ["Corded or cordless drill", "Drill bit set (HSS for metal, masonry for walls, wood bits)", "Depth stop or tape marker", "Safety glasses", "Ear protection"],
    materials: ["Wall plugs/anchors (matching bit size)", "Screws"],
    estimatedCost: "₹1,500 – ₹5,000 for a good drill",
    safety: "Always wear safety glasses. Never use a damaged or bent bit. Clamp small workpieces — never hold them by hand while drilling.",
    steps: [
      { title: "Choose the right bit for your material", content: "Use masonry bits (grey, carbide-tipped) for concrete and brick walls. Use HSS bits (shiny metal) for metal. Use wood bits or spade bits for timber. The bit diameter should match your wall plug size." },
      { title: "Set speed and mode correctly", content: "Low speed (torque mode) for driving screws — prevents stripping. High speed for drilling. Use hammer mode for masonry walls. Start on the lowest clutch setting for screws and increase if needed." },
      { title: "Mark and start the hole cleanly", content: "Mark with a pencil cross. For tiles or smooth surfaces, place tape over the mark first to stop the bit wandering. Start at a low speed with gentle pressure to create a dimple, then increase speed." },
      { title: "Drill straight and at the right depth", content: "Keep the drill perpendicular to the surface — use a small level or mirror. Wrap tape around the bit at the target depth to know when to stop. Apply steady, firm pressure — don't force. Let the bit do the work." },
      { title: "Insert wall plugs and drive screws", content: "Blow dust from the hole (or use a small brush). Tap the wall plug in flush with a hammer. Drive the screw slowly into the plug — stop as soon as resistance increases to avoid stripping." },
    ],
  },
  "6": {
    intro: "Holes in drywall from doorknobs, anchors, or water damage are easy to fix invisibly with the right materials and patience. The secret is building up thin layers rather than one thick application.",
    tools: ["Putty knife (4\" and 6\")", "Sanding block (120-grit and 220-grit)", "Corner trowel (for edge damage)", "Spray bottle with water"],
    materials: ["Drywall mesh patch (for holes over 2cm)", "Joint compound (premixed)", "Drywall primer", "Matching paint"],
    estimatedCost: "₹400 – ₹1,200",
    safety: "Wear a dust mask when sanding drywall compound — the fine dust is an irritant.",
    steps: [
      { title: "Assess and prepare the hole", content: "For small holes (under 1cm), no backing is needed. For medium holes (1–7cm), apply a self-adhesive mesh patch. For larger holes, cut a square around the damage, add wood backing strips, and screw in a drywall patch piece." },
      { title: "Apply first thin coat of compound", content: "Load the 4\" putty knife with a small amount of compound and skim over the patch in smooth, overlapping strokes. Feather the edges out 5–10cm beyond the patch. This coat will crack slightly — that's fine. Let dry fully (4–8 hours)." },
      { title: "Sand and apply second coat", content: "Sand the first coat lightly with 120-grit. Wipe dust. Apply a wider second coat — this time using the 6\" knife to feather even further out. The goal is to make the patch edges invisible. Let dry fully." },
      { title: "Final sand and prime", content: "Sand with 220-grit for a smooth finish. Run your palm over the surface to feel for ridges. Apply drywall primer to seal the compound — this prevents the paint from absorbing unevenly (called flashing)." },
      { title: "Paint to match", content: "Once primer is dry, apply the matching wall paint. If you don't have the original paint, take a chip to a hardware store for colour matching. Apply 2 coats for full coverage and blend into the surrounding wall by feathering strokes outward." },
    ],
  },
  default: {
    intro: "This guide walks you through a practical, step-by-step approach using the right tools and materials. Take your time with each step and read through the full guide before starting.",
    tools: ["Measuring tape", "Safety glasses", "Work gloves", "Relevant hand tools for this task"],
    materials: ["Materials specific to your project scope"],
    estimatedCost: "Varies by scope",
    safety: "Read all safety notes before starting. If in doubt about any step, consult a professional.",
    steps: [
      { title: "Plan and gather materials", content: "Before starting, measure the work area and create a complete shopping list. Having everything on hand before you begin prevents mid-project trips and keeps momentum. Read the full guide once through first." },
      { title: "Prepare the work area", content: "Clear the space, protect surfaces with drop cloths, and ensure you have adequate lighting. Set up your tools within reach. A well-organised workspace makes the job faster and safer." },
      { title: "Execute the main task", content: "Work methodically from one end to the other. Don't rush — take breaks to assess your progress against the plan. Most mistakes happen when people work too fast or skip assessment steps." },
      { title: "Check and refine your work", content: "Step back and evaluate. Check that everything is level, square, and properly secured. Make adjustments while it's still easy to do so, before any materials set or are permanently fixed." },
      { title: "Clean up and document", content: "Remove all tools, waste materials, and drop cloths. Photograph the finished result — useful for insurance, future reference, and sharing. Store leftover materials (paint, putty, tiles) labelled for touch-ups." },
    ],
  },
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

const BOOKMARK_KEY = "bb_bookmarks";

function getBookmarkSnapshot() {
  if (typeof window === "undefined") return "[]";
  return localStorage.getItem(BOOKMARK_KEY) || "[]";
}
function subscribeBookmarks(cb) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}
function parseBookmarks(raw) {
  try { return JSON.parse(raw); } catch { return []; }
}

const DIFFICULTY = {
  Beginner:     { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  Intermediate: { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500"   },
  Advanced:     { bg: "bg-red-50",     text: "text-red-700",     dot: "bg-red-500"     },
};

const CATEGORY_PRODUCTS = {
  painting:     ["paint", "painting", "brush", "roller"],
  plumbing:     ["plumbing", "pipe", "tap", "fitting"],
  electrical:   ["light", "electrical", "LED", "switch"],
  tools:        ["drill", "tool", "grinder", "wrench"],
  furniture:    ["furniture", "wood", "shelf"],
  repair:       ["repair", "putty", "sandpaper"],
  construction: ["cement", "concrete", "tile"],
  beginner:     ["tool", "drill", "hammer"],
  default:      [],
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function DIYArticlePage() {
  const { slug } = useParams();
  const guide = GUIDES.find((g) => g.id === String(slug));
  const { addToCart, showToast } = useCart();

  const raw = useSyncExternalStore(subscribeBookmarks, getBookmarkSnapshot, () => "[]");
  const bookmarks = parseBookmarks(raw);
  const isBookmarked = bookmarks.includes(String(slug));

  function toggleBookmark() {
    const current = parseBookmarks(localStorage.getItem(BOOKMARK_KEY) || "[]");
    const exists = current.includes(String(slug));
    const next = exists ? current.filter((id) => id !== String(slug)) : [...current, String(slug)];
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("storage"));
    showToast(exists ? "Bookmark removed" : "Guide bookmarked");
  }

  function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      navigator.share({ title: guide?.title ?? "DIY Guide", url }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(url);
      showToast("Link copied to clipboard");
    }
  }

  if (!guide) {
    return (
      <div className="min-h-screen bg-[#F5F6F8] flex flex-col items-center justify-center px-4 py-24 text-center">
        <p className="text-4xl font-black text-gray-200 mb-4">404</p>
        <h1 className="text-xl font-bold text-primary mb-2">Guide not found</h1>
        <p className="text-sm text-muted mb-6">This guide may have moved or doesn't exist yet.</p>
        <Link href="/diy" className="flex items-center gap-2 bg-primary text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-primary/90 cursor-pointer">
          <ArrowLeft className="h-4 w-4" /> Browse All Guides
        </Link>
      </div>
    );
  }

  const content = GUIDE_CONTENT[guide.id] ?? GUIDE_CONTENT.default;
  const diff = DIFFICULTY[guide.difficulty] ?? DIFFICULTY.Beginner;

  // Related guides: same category, different id
  const relatedGuides = GUIDES.filter(
    (g) => g.category === guide.category && g.id !== guide.id,
  ).slice(0, 3);

  // Related products: match by category keywords
  const keywords = CATEGORY_PRODUCTS[guide.category] ?? CATEGORY_PRODUCTS.default;
  const allProducts = getProducts();
  const relatedProducts = allProducts
    .filter((p) =>
      keywords.some((kw) =>
        p.name.toLowerCase().includes(kw.toLowerCase()) ||
        p.category?.toLowerCase().includes(kw.toLowerCase()),
      ),
    )
    .slice(0, 4);
  const fallbackProducts = relatedProducts.length > 0 ? relatedProducts : allProducts.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#F5F6F8]">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="bg-primary px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-white/50 mb-6 flex-wrap">
            <Link href="/" className="flex items-center gap-1 hover:text-white transition-colors"><Home className="h-3 w-3"/>Home</Link>
            <ChevronRight className="h-3 w-3"/>
            <Link href="/diy" className="hover:text-white transition-colors">DIY Hub</Link>
            <ChevronRight className="h-3 w-3"/>
            <span className="text-white/80 capitalize">{guide.category.replace("-", " ")}</span>
          </nav>

          {/* Difficulty + tags */}
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${diff.bg} ${diff.text}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${diff.dot}`}/>
              {guide.difficulty}
            </span>
            {guide.tags.map((tag) => (
              <span key={tag} className="px-2.5 py-1 rounded-full bg-white/10 text-[11px] font-medium text-white/70">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-white leading-snug mb-4">
            {guide.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-5 mb-6">
            <span className="flex items-center gap-1.5 text-sm text-white/60">
              <Clock className="h-4 w-4"/>
              {guide.duration}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-white/60">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400"/>
              <span className="font-semibold text-white">{guide.rating}</span>
              <span>({guide.reviews} ratings)</span>
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/diy"
              className="flex items-center gap-1.5 rounded-xl border border-white/20 px-4 py-2 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4"/> All Guides
            </Link>
            <button
              onClick={toggleBookmark}
              className={`flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors cursor-pointer ${
                isBookmarked
                  ? "border-accent bg-accent text-primary"
                  : "border-white/20 text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {isBookmarked ? <BookmarkCheck className="h-4 w-4"/> : <Bookmark className="h-4 w-4"/>}
              {isBookmarked ? "Saved" : "Save"}
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 rounded-xl border border-white/20 px-4 py-2 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              <Share2 className="h-4 w-4"/> Share
            </button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">

          {/* ── Main article ────────────────────────────────────────── */}
          <div className="space-y-8 min-w-0">

            {/* Video placeholder */}
            <div className="relative overflow-hidden rounded-2xl bg-primary aspect-video flex items-center justify-center group cursor-pointer shadow-lg">
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: "radial-gradient(circle at 60% 50%, #F0C12D 0%, transparent 70%)" }}/>
              <div className="flex flex-col items-center gap-3 z-10">
                <div className="h-16 w-16 rounded-full bg-accent flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                  <Play className="h-7 w-7 text-primary ml-1" />
                </div>
                <p className="text-white font-semibold text-sm">Watch the Video Tutorial</p>
                <p className="text-white/50 text-xs">Full walkthrough · {guide.duration}</p>
              </div>
            </div>

            {/* Introduction */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-primary mb-3">Introduction</h2>
              <p className="text-sm leading-7 text-gray-600">{content.intro}</p>
              {content.estimatedCost && (
                <div className="mt-4 inline-flex items-center gap-2 bg-accent/10 rounded-xl px-4 py-2 text-sm">
                  <Tag className="h-4 w-4 text-accent"/>
                  <span className="font-semibold text-primary">Estimated Cost:</span>
                  <span className="text-primary">{content.estimatedCost}</span>
                </div>
              )}
            </div>

            {/* Safety notice */}
            {content.safety && (
              <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5"/>
                <div>
                  <p className="text-sm font-bold text-amber-800 mb-0.5">Safety First</p>
                  <p className="text-sm text-amber-700 leading-relaxed">{content.safety}</p>
                </div>
              </div>
            )}

            {/* Step-by-step */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-primary">Step-by-Step Guide</h2>
              {content.steps.map((step, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-accent text-sm font-black">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-primary mb-2">{step.title}</h3>
                      <p className="text-sm leading-7 text-gray-600">{step.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              {/* Completion CTA */}
              <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0"/>
                <div>
                  <p className="text-sm font-bold text-emerald-800">All done!</p>
                  <p className="text-sm text-emerald-700">Share your result or bookmark this guide for next time.</p>
                </div>
                <button
                  onClick={handleShare}
                  className="ml-auto flex items-center gap-1.5 bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer flex-shrink-0"
                >
                  <Share2 className="h-3.5 w-3.5"/> Share
                </button>
              </div>
            </div>

            {/* Related guides */}
            {relatedGuides.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-primary mb-4">Related Guides</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {relatedGuides.map((g) => {
                    const d = DIFFICULTY[g.difficulty] ?? DIFFICULTY.Beginner;
                    return (
                      <Link
                        key={g.id}
                        href={`/diy/${g.id}`}
                        className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm p-4 gap-2 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
                      >
                        <div className="h-1.5 w-full rounded-full bg-accent/40 mb-1"/>
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold w-fit ${d.bg} ${d.text}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${d.dot}`}/>
                          {g.difficulty}
                        </span>
                        <h3 className="text-xs font-bold text-primary leading-snug group-hover:text-accent transition-colors line-clamp-2">
                          {g.title}
                        </h3>
                        <span className="flex items-center gap-1 text-[11px] text-muted mt-auto">
                          <Clock className="h-3 w-3"/>{g.duration}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ── Sidebar ─────────────────────────────────────────────── */}
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">

            {/* Tools needed */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-sm font-bold text-primary mb-3 flex items-center gap-2">
                <Wrench className="h-4 w-4 text-accent"/>
                Tools Needed
              </h3>
              <ul className="space-y-2">
                {content.tools.map((tool) => (
                  <li key={tool} className="flex items-start gap-2 text-xs text-gray-700">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0 mt-0.5"/>
                    {tool}
                  </li>
                ))}
              </ul>
            </div>

            {/* Materials */}
            {content.materials?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="text-sm font-bold text-primary mb-3 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-accent"/>
                  Materials
                </h3>
                <ul className="space-y-2">
                  {content.materials.map((mat) => (
                    <li key={mat} className="flex items-start gap-2 text-xs text-gray-700">
                      <span className="h-3.5 w-3.5 flex-shrink-0 mt-0.5 flex items-center justify-center">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent"/>
                      </span>
                      {mat}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bookmark CTA */}
            <div className="bg-primary rounded-2xl p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-accent mb-1">Save for later</p>
              <p className="text-sm font-bold text-white mb-3">Bookmark this guide</p>
              <p className="text-xs text-white/60 mb-4">Come back to it anytime from your saved guides.</p>
              <button
                onClick={toggleBookmark}
                className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all cursor-pointer ${
                  isBookmarked
                    ? "bg-accent/20 text-accent border border-accent/30"
                    : "bg-accent text-primary hover:brightness-95"
                }`}
              >
                {isBookmarked ? <BookmarkCheck className="h-4 w-4"/> : <Bookmark className="h-4 w-4"/>}
                {isBookmarked ? "Bookmarked" : "Save Guide"}
              </button>
            </div>

            {/* Need professional help CTA */}
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-muted mb-1">Prefer a pro?</p>
              <p className="text-sm font-bold text-primary mb-2">Book a specialist instead</p>
              <p className="text-xs text-muted mb-4">Get this job done by a verified BuildBudy professional.</p>
              <Link
                href="/services/book"
                className="flex items-center justify-center gap-2 w-full bg-primary text-white text-sm font-bold py-2.5 rounded-xl hover:bg-primary/90 transition-colors cursor-pointer"
              >
                Book a Service
              </Link>
            </div>
          </aside>
        </div>

        {/* ── Related Products ──────────────────────────────────────── */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-primary">Products Used in This Guide</h2>
              <p className="text-sm text-muted mt-0.5">Shop the tools and materials mentioned above</p>
            </div>
            <Link href="/products" className="text-sm font-bold text-accent hover:underline cursor-pointer">
              Shop all →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {fallbackProducts.map((product) => {
              const price = product.price ?? 0;
              const originalPrice = product.originalPrice ?? 0;
              const discount = originalPrice > price
                ? Math.round(((originalPrice - price) / originalPrice) * 100)
                : 0;
              return (
                <div
                  key={product.id}
                  className="group relative flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden"
                >
                  <Link href={`/products/${product.id}`} className="absolute inset-0 z-10"/>
                  <div className="relative bg-gray-50">
                    {discount > 0 && (
                      <span className="absolute left-2 top-2 z-20 rounded-md bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        -{discount}%
                      </span>
                    )}
                    <div className="flex aspect-square items-center justify-center p-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </div>
                  <div className="p-3 flex flex-col gap-1.5">
                    <p className="text-[11px] font-semibold capitalize text-primary/60">
                      {product.category?.replaceAll("-", " ")}
                    </p>
                    <h3 className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-sm font-bold text-primary">
                      ₹{price.toLocaleString("en-IN")}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        if (product.inStock) {
                          addToCart(product, 1);
                          showToast(`${product.name.split(" ").slice(0, 3).join(" ")} added to cart`);
                        }
                      }}
                      disabled={!product.inStock}
                      className="relative z-20 flex items-center justify-center gap-1.5 rounded-xl bg-accent px-2 py-1.5 text-[11px] font-bold text-primary transition hover:bg-accent/90 active:scale-[0.98] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="h-3 w-3"/>
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="hidden md:block mt-10">
        <Footer/>
      </div>
    </div>
  );
}
