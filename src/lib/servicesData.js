// ─── Service catalogue ─────────────────────────────────────────────────────────

export const SERVICES = [
  {
    id: "plumbing",
    name: "Plumbing",
    iconKey: "Wrench",
    tagline: "Leak-free, guaranteed",
    badge: "Most Booked",
    color: "#0284C7",
    startingFrom: 299,
    priceUnit: "",
    rating: 4.8,
    totalJobs: 3420,
    description:
      "From dripping taps to full bathroom plumbing — our licensed plumbers handle it all with precision and care. Pipe leaks, water tank setup, bathroom fittings, and drainage work done right the first time.",
    highlights: [
      "Leak detection & repair",
      "Pipe installation & replacement",
      "Bathroom fittings & fixtures",
      "Water tank & pump setup",
    ],
    pricingTiers: [
      {
        name: "Basic",
        price: 299,
        desc: "Minor repairs",
        features: ["Single tap or joint fix", "Leak sealing", "Up to 1 hour on-site", "30-day warranty"],
      },
      {
        name: "Standard",
        price: 799,
        desc: "Most popular",
        features: ["Multi-point inspection", "Fixture replacement", "Pipe repair/rerouting", "90-day warranty"],
        popular: true,
      },
      {
        name: "Premium",
        price: 1999,
        desc: "Full renovation",
        features: ["Full bathroom plumbing", "Water tank setup", "Drain & sewage work", "1-year warranty"],
      },
    ],
    faqs: [
      { q: "Do I need to be home during the service?", a: "Yes, please be present for the duration of the visit so the professional can access all areas and discuss findings with you." },
      { q: "Are the plumbers licensed?", a: "Absolutely. All BuildBudy plumbers are licensed, background-verified, and carry their certification on every job." },
      { q: "What if the issue isn't fixed on the first visit?", a: "We offer a free revisit within 30 days if the same problem recurs. Your satisfaction is guaranteed." },
      { q: "Do you provide materials and spare parts?", a: "Professionals carry common parts. For specialized items, they'll advise you before purchasing to avoid surprises." },
    ],
    reviews: [
      { name: "Priya M.", rating: 5, date: "Mar 2026", body: "The plumber arrived exactly on time and fixed two leaky joints in under an hour. Very professional, no mess left behind." },
      { name: "Arjun K.", rating: 5, date: "Feb 2026", body: "Water tank setup was done perfectly. He explained everything clearly and even spotted a hidden pipe issue." },
      { name: "Sneha R.", rating: 4, date: "Jan 2026", body: "Good work overall. Bathroom faucet replaced cleanly. Slightly delayed but communicated ahead of time." },
    ],
  },

  {
    id: "electrical",
    name: "Electrical",
    iconKey: "Zap",
    tagline: "Safe wiring by certified pros",
    badge: "Top Rated",
    color: "#CA8A04",
    startingFrom: 399,
    priceUnit: "",
    rating: 4.9,
    totalJobs: 2185,
    description:
      "Panel upgrades, fixture installation, and complete wiring solutions by ISI-certified electricians. Every job follows IS standards and includes a safety check so your home stays hazard-free.",
    highlights: [
      "Fan & light installation",
      "Switch & socket fitting",
      "MCB panel upgrades",
      "Wiring & safety inspection",
    ],
    pricingTiers: [
      {
        name: "Basic",
        price: 399,
        desc: "Single fixture",
        features: ["Fan or light install", "Switch/socket fitting", "Basic inspection", "30-day warranty"],
      },
      {
        name: "Standard",
        price: 999,
        desc: "Most popular",
        features: ["Up to 5 points", "MCB check & reset", "Earth continuity test", "90-day warranty"],
        popular: true,
      },
      {
        name: "Premium",
        price: 2499,
        desc: "Full rewiring",
        features: ["Complete panel work", "Full room wiring", "Safety certification", "1-year warranty"],
      },
    ],
    faqs: [
      { q: "Is it safe to do electrical work without a professional?", a: "DIY electrical work is risky and may void home insurance. Our certified electricians ensure code-compliant, safe installations." },
      { q: "How long does a standard electrical job take?", a: "Most single-point jobs take 30–90 minutes. Panel work or full rewiring may take 3–6 hours depending on scope." },
      { q: "Do you handle smart home and automation wiring?", a: "Yes, our electricians are trained in smart switches, dimmers, and home automation wiring for major brands." },
      { q: "What certifications do your electricians hold?", a: "All our electricians hold valid wireman licences and are certified under IS 732 wiring standards." },
    ],
    reviews: [
      { name: "Rahul S.", rating: 5, date: "Apr 2026", body: "Installed 6 lights and 3 fans in a new apartment. Work was clean, no wall damage, and done in half a day." },
      { name: "Meera T.", rating: 5, date: "Mar 2026", body: "MCB panel was tripping constantly. The electrician diagnosed a faulty circuit and fixed it immediately." },
      { name: "Dev P.", rating: 5, date: "Feb 2026", body: "Smart switch wiring done perfectly. He also gave tips on load distribution. Highly recommended." },
    ],
  },

  {
    id: "painting",
    name: "Painting",
    iconKey: "Paintbrush",
    tagline: "Flawless finish, every time",
    badge: null,
    color: "#7C3AED",
    startingFrom: 8,
    priceUnit: "/sq ft",
    rating: 4.7,
    totalJobs: 1890,
    description:
      "Interior and exterior painting with premium paints. Wall prep, priming, and a two-coat finish included in every job. Our painters are trained in texture work, waterproofing, and specialty finishes.",
    highlights: [
      "Wall prep & crack filling",
      "Interior & exterior painting",
      "Texture & designer finishes",
      "Waterproofing & weatherproofing",
    ],
    pricingTiers: [
      {
        name: "Economy",
        price: 8,
        priceUnit: "/sq ft",
        desc: "Single coat",
        features: ["Basic putty + 1 coat paint", "Standard colours", "Roller application", "1-year warranty"],
      },
      {
        name: "Standard",
        price: 14,
        priceUnit: "/sq ft",
        desc: "Most popular",
        features: ["Putty + primer + 2 coats", "Premium emulsions", "Texture on request", "3-year warranty"],
        popular: true,
      },
      {
        name: "Premium",
        price: 22,
        priceUnit: "/sq ft",
        desc: "Designer finish",
        features: ["Full wall prep", "Luxury paints", "Texture/stencil work", "5-year warranty"],
      },
    ],
    faqs: [
      { q: "How many days will the painting take?", a: "A standard 2BHK takes 3–5 days for 2-coat interior painting. Exterior jobs or textured finishes may take longer." },
      { q: "Do I need to move my furniture?", a: "Our team covers furniture with drop sheets. However, moving fragile or heavy items beforehand is recommended." },
      { q: "Which paints do you use?", a: "We work with Asian Paints, Berger, and Nerolac. You can also specify a brand or finish at booking." },
      { q: "Is wall putty included?", a: "Yes. Standard and Premium packages include putty + primer. Economy includes basic putty only." },
    ],
    reviews: [
      { name: "Anita V.", rating: 5, date: "Apr 2026", body: "Full 3BHK interior done in 4 days. Flawless finish, clean work, and the team was respectful of our belongings." },
      { name: "Kiran B.", rating: 4, date: "Mar 2026", body: "Good quality paint job. Minor delay on day 2 but the final result was excellent. Walls look brand new." },
      { name: "Suresh N.", rating: 5, date: "Feb 2026", body: "Texture finish in the living room looks stunning. Very professional team, highly recommend the Premium package." },
    ],
  },

  {
    id: "cleaning",
    name: "Deep Cleaning",
    iconKey: "Sparkles",
    tagline: "Spotless, sanitised, refreshed",
    badge: "New",
    color: "#059669",
    startingFrom: 499,
    priceUnit: "",
    rating: 4.8,
    totalJobs: 876,
    description:
      "Comprehensive deep cleaning for kitchens, bathrooms, full homes, and offices. Our trained cleaning specialists use commercial-grade equipment and eco-friendly sanitising solutions.",
    highlights: [
      "Kitchen degreasing & appliances",
      "Bathroom sanitisation",
      "Floor scrubbing & polishing",
      "Sofa & carpet steam cleaning",
    ],
    pricingTiers: [
      {
        name: "Basic",
        price: 499,
        desc: "1BHK or bathroom",
        features: ["Single room deep clean", "Bathroom sanitisation", "Mop & vacuum", "Eco-safe products"],
      },
      {
        name: "Standard",
        price: 1299,
        desc: "Most popular",
        features: ["Full 2BHK clean", "Kitchen degreasing", "Bathroom scrub", "Balcony & windows"],
        popular: true,
      },
      {
        name: "Premium",
        price: 2499,
        desc: "3BHK + extras",
        features: ["3BHK deep clean", "Sofa/carpet cleaning", "Appliance cleaning", "Post-clean inspection"],
      },
    ],
    faqs: [
      { q: "Do I need to be home during cleaning?", a: "We recommend being present for the first 10 minutes to brief the team, but you don't need to stay throughout." },
      { q: "Are the cleaning products safe for children and pets?", a: "Yes. We use non-toxic, eco-certified cleaning agents that are safe for all family members including pets." },
      { q: "How long does deep cleaning take?", a: "A 2BHK typically takes 4–6 hours. The duration depends on the size and condition of the space." },
      { q: "Do you bring your own equipment and supplies?", a: "Yes, our team arrives fully equipped with all tools, machines, and cleaning solutions at no extra charge." },
    ],
    reviews: [
      { name: "Pooja L.", rating: 5, date: "Apr 2026", body: "Post-renovation cleaning was immaculate. The team removed cement dust, paint stains, and left every surface spotless." },
      { name: "Vikram A.", rating: 5, date: "Mar 2026", body: "Kitchen degreasing was thorough. The chimney filter and hob look brand new. Money well spent." },
      { name: "Nandita R.", rating: 4, date: "Feb 2026", body: "Good overall. Bathroom came out really clean. Wish the sofa cleaning was included in Standard package." },
    ],
  },

  {
    id: "installation",
    name: "Appliance Installation",
    iconKey: "Package",
    tagline: "Setup done right, first time",
    badge: "Quick Service",
    color: "#0891B2",
    startingFrom: 199,
    priceUnit: "",
    rating: 4.8,
    totalJobs: 2734,
    description:
      "AC, geyser, chimney, and furniture assembly by manufacturer-trained technicians. Quick turnaround, clean work, and a post-installation check on every job.",
    highlights: [
      "AC installation & gas refill",
      "Geyser & chimney setup",
      "Furniture assembly",
      "TV & appliance mounting",
    ],
    pricingTiers: [
      {
        name: "Basic",
        price: 199,
        desc: "Single appliance",
        features: ["1 appliance install", "Mounting & testing", "Basic cleanup", "30-day warranty"],
      },
      {
        name: "Standard",
        price: 599,
        desc: "Most popular",
        features: ["Up to 3 appliances", "Wall drilling & mounting", "Wiring connections", "90-day warranty"],
        popular: true,
      },
      {
        name: "Premium",
        price: 1499,
        desc: "Full home setup",
        features: ["All appliances", "AC + gas check", "Full furniture assembly", "1-year warranty"],
      },
    ],
    faqs: [
      { q: "Do you provide gas refilling for ACs?", a: "Yes. Our AC technicians are trained for gas top-up and leak testing as part of the installation service." },
      { q: "How long does AC installation take?", a: "A standard split AC installation takes 2–3 hours. Multiple units may require a full-day booking." },
      { q: "Can you assemble imported or branded furniture?", a: "Yes, our team can assemble IKEA, Durian, Pepperfry, and other brand furniture from manuals or instructions." },
      { q: "Is the service available on weekends?", a: "Yes. We operate 7 days a week including public holidays. Same-day slots may be available for standard installs." },
    ],
    reviews: [
      { name: "Arun M.", rating: 5, date: "Apr 2026", body: "Split AC installed in 2.5 hours with gas top-up included. Neat pipe routing, no mess left behind." },
      { name: "Divya S.", rating: 5, date: "Mar 2026", body: "IKEA wardrobe assembled perfectly. The team brought all tools and finished in under 2 hours." },
      { name: "Rajesh K.", rating: 4, date: "Feb 2026", body: "Geyser installation was clean. Slight delay in arrival but work quality was top notch." },
    ],
  },

  {
    id: "repair",
    name: "Home Repair",
    iconKey: "Hammer",
    tagline: "Fix it before it costs more",
    badge: null,
    color: "#DC2626",
    startingFrom: 249,
    priceUnit: "",
    rating: 4.7,
    totalJobs: 1542,
    description:
      "Carpentry repairs, door & window fixes, wall patching, waterproofing leaks, and general home maintenance. Our handymen handle the small jobs that pile up — quickly and cleanly.",
    highlights: [
      "Door & window alignment",
      "Drywall & wall patching",
      "Carpenter repairs",
      "Tile & flooring fixes",
    ],
    pricingTiers: [
      {
        name: "Basic",
        price: 249,
        desc: "Single repair",
        features: ["1 item fixed", "Standard materials", "Up to 1 hour", "30-day warranty"],
      },
      {
        name: "Standard",
        price: 699,
        desc: "Most popular",
        features: ["Up to 5 repair tasks", "Door/window/drywall", "Material included", "90-day warranty"],
        popular: true,
      },
      {
        name: "Premium",
        price: 1799,
        desc: "Full home maintenance",
        features: ["Full inspection + fixes", "Carpentry + tiling", "Waterproofing patches", "1-year warranty"],
      },
    ],
    faqs: [
      { q: "What types of repairs can I book?", a: "Door squeaks, window alignment, drywall holes, tile re-grouting, shelf installation, wood repairs, and general carpentry." },
      { q: "Do you bring materials?", a: "Standard materials like putty, nails, screws, and basic fittings are included. Specialty materials are quoted separately." },
      { q: "Can I book for multiple small repairs in one visit?", a: "Absolutely. Our Standard package covers up to 5 tasks in a single visit — great for a maintenance checklist." },
      { q: "Are handymen certified for carpentry and masonry?", a: "Yes. All repair specialists have trade certifications and a minimum of 5 years of on-site experience." },
    ],
    reviews: [
      { name: "Meena J.", rating: 5, date: "Apr 2026", body: "Fixed 4 door hinges, a broken shelf, and patched a wall hole. Fast and tidy. Exactly what I needed." },
      { name: "Sanjay V.", rating: 4, date: "Mar 2026", body: "Bathroom tile re-grouting done well. Small delay but communication was good. Will book again." },
      { name: "Kavya R.", rating: 5, date: "Feb 2026", body: "Window alignment sorted in 20 minutes. The handyman also spotted a damp patch we hadn't noticed." },
    ],
  },

  {
    id: "garden",
    name: "Garden & Landscaping",
    iconKey: "TreePine",
    tagline: "Green spaces, crafted with care",
    badge: "Seasonal",
    color: "#16A34A",
    startingFrom: 499,
    priceUnit: "",
    rating: 4.7,
    totalJobs: 743,
    description:
      "Lawn care, plant setup, irrigation systems, and complete garden design by horticulture experts. Whether you want a low-maintenance balcony garden or a full landscape overhaul, we've got you covered.",
    highlights: [
      "Garden design & layout",
      "Plant selection & setup",
      "Drip irrigation systems",
      "Lawn mowing & maintenance",
    ],
    pricingTiers: [
      {
        name: "Basic",
        price: 499,
        desc: "Balcony garden",
        features: ["5–10 plants setup", "Soil & potting", "Basic layout", "Care instructions"],
      },
      {
        name: "Standard",
        price: 1499,
        desc: "Most popular",
        features: ["Full garden plan", "15–20 plants", "Drip irrigation", "Monthly visit x1"],
        popular: true,
      },
      {
        name: "Premium",
        price: 4999,
        desc: "Full landscape",
        features: ["Lawn + garden design", "Irrigation + lighting", "Hardscape elements", "Monthly maintenance"],
      },
    ],
    faqs: [
      { q: "Do you supply the plants and soil?", a: "Yes. Plants, soil, pots, and fertiliser are sourced by our team for all Standard and Premium packages." },
      { q: "How often does a garden need professional maintenance?", a: "Monthly visits are recommended for most gardens. High-maintenance lawns may need fortnightly attention." },
      { q: "Can you design a garden for a terrace or rooftop?", a: "Yes. We specialise in terrace gardens with weight-appropriate planters, waterproofing, and drainage solutions." },
      { q: "What plants work best for Indian climates?", a: "We recommend low-water natives and hardy tropical species. Our horticulturists will suggest the best options for your location and sunlight." },
    ],
    reviews: [
      { name: "Anjali P.", rating: 5, date: "Apr 2026", body: "Terrace garden transformed completely. The team chose plants perfectly suited to our sun exposure. Beautiful result." },
      { name: "Gopal S.", rating: 4, date: "Mar 2026", body: "Balcony planter setup was lovely. Plants are thriving 2 months later. Happy with the selection." },
      { name: "Neha K.", rating: 5, date: "Jan 2026", body: "Drip irrigation installed for our backyard. Zero water wastage now and the garden has never looked better." },
    ],
  },

  {
    id: "construction",
    name: "Construction & Civil",
    iconKey: "HardHat",
    tagline: "Built solid, built right",
    badge: null,
    color: "#9333EA",
    startingFrom: 999,
    priceUnit: "",
    rating: 4.6,
    totalJobs: 412,
    description:
      "Minor construction work including wall building, waterproofing, flooring, tiling, and structural repairs. For renovation projects that require more than a handyman — but don't need a full contractor.",
    highlights: [
      "Tile & flooring installation",
      "Wall construction & plastering",
      "Waterproofing & leakage sealing",
      "False ceiling & partition walls",
    ],
    pricingTiers: [
      {
        name: "Basic",
        price: 999,
        desc: "Single area",
        features: ["Up to 50 sq ft work", "Material estimate", "Standard finish", "3-month warranty"],
      },
      {
        name: "Standard",
        price: 4999,
        desc: "Most popular",
        features: ["Up to 200 sq ft", "Tiling or plastering", "Site cleanup", "6-month warranty"],
        popular: true,
      },
      {
        name: "Premium",
        price: 14999,
        desc: "Room renovation",
        features: ["Full room scope", "Waterproofing", "False ceiling option", "1-year warranty"],
      },
    ],
    faqs: [
      { q: "Do you handle full home renovations?", a: "We handle targeted construction tasks up to room-level scope. For full-home renovations, we can connect you with our partnered contractors." },
      { q: "Is material cost included in the pricing?", a: "Material cost is typically quoted separately based on specifications. Labour charges are covered in the packages shown." },
      { q: "How disruptive is a tiling or flooring project?", a: "Tiling work generates dust and noise. We recommend planning for 2–5 days of limited room access depending on the area." },
      { q: "Can you work on older buildings and heritage structures?", a: "Yes, with appropriate care. Our civil specialists assess structural conditions before proceeding on older buildings." },
    ],
    reviews: [
      { name: "Harish T.", rating: 5, date: "Mar 2026", body: "Bathroom tiling + waterproofing done in 3 days. No leakage since. Superb quality of materials and workmanship." },
      { name: "Rekha M.", rating: 4, date: "Feb 2026", body: "False ceiling in hall looks great. Some delays due to material availability but end result was worth the wait." },
      { name: "Praveen A.", rating: 5, date: "Jan 2026", body: "Terrace waterproofing fixed a chronic leakage issue. Finally a dry monsoon. Couldn't be happier." },
    ],
  },
];

// ─── Specialists per service ───────────────────────────────────────────────────

export const SPECIALISTS = {
  plumbing: [
    { id: "pl1", name: "Rajesh Sharma", initials: "RS", experience: 9, rating: 4.9, reviews: 487, specialization: "Leak detection & bathroom plumbing", available: true,  priceAdj: 0   },
    { id: "pl2", name: "Sunil Patil",   initials: "SP", experience: 6, rating: 4.8, reviews: 312, specialization: "Pipe installation & water tanks",    available: true,  priceAdj: 0   },
    { id: "pl3", name: "Manoj Verma",   initials: "MV", experience: 11,rating: 4.9, reviews: 623, specialization: "Full bathroom renovations",           available: false, priceAdj: 100 },
    { id: "pl4", name: "Deepak Rao",    initials: "DR", experience: 5, rating: 4.7, reviews: 198, specialization: "General plumbing & drain cleaning",   available: true,  priceAdj: 0   },
    { id: "pl5", name: "Anil Kumar",    initials: "AK", experience: 14,rating: 5.0, reviews: 891, specialization: "Commercial & residential plumbing",   available: true,  priceAdj: 200 },
  ],
  electrical: [
    { id: "el1", name: "Vijay Nair",    initials: "VN", experience: 8, rating: 4.9, reviews: 534, specialization: "Panel upgrades & full rewiring",      available: true,  priceAdj: 0   },
    { id: "el2", name: "Santosh Iyer",  initials: "SI", experience: 6, rating: 4.8, reviews: 289, specialization: "Lighting & fixture installation",      available: true,  priceAdj: 0   },
    { id: "el3", name: "Ravi Menon",    initials: "RM", experience: 12,rating: 5.0, reviews: 741, specialization: "Smart home & automation wiring",       available: true,  priceAdj: 150 },
    { id: "el4", name: "Suresh Das",    initials: "SD", experience: 4, rating: 4.6, reviews: 143, specialization: "Switches, sockets & MCB work",         available: false, priceAdj: 0   },
    { id: "el5", name: "Prakash Pillai",initials: "PP", experience: 10,rating: 4.9, reviews: 412, specialization: "Safety inspections & certifications",  available: true,  priceAdj: 100 },
  ],
  painting: [
    { id: "pa1", name: "Lakshman Rao",  initials: "LR", experience: 10,rating: 4.9, reviews: 378, specialization: "Interior painting & texture work",    available: true,  priceAdj: 0   },
    { id: "pa2", name: "Pradeep Singh", initials: "PS", experience: 7, rating: 4.7, reviews: 256, specialization: "Exterior & waterproof painting",       available: true,  priceAdj: 0   },
    { id: "pa3", name: "Ganesh Kumar",  initials: "GK", experience: 13,rating: 5.0, reviews: 589, specialization: "Designer & luxury finishes",           available: true,  priceAdj: 200 },
    { id: "pa4", name: "Balaji T.",     initials: "BT", experience: 5, rating: 4.6, reviews: 187, specialization: "Budget painting & touch-ups",          available: false, priceAdj: 0   },
  ],
  cleaning: [
    { id: "cl1", name: "Anitha S.",     initials: "AS", experience: 6, rating: 4.9, reviews: 321, specialization: "Deep cleaning & sanitisation",        available: true,  priceAdj: 0   },
    { id: "cl2", name: "Ramesh Babu",   initials: "RB", experience: 8, rating: 4.8, reviews: 198, specialization: "Kitchen & appliance degreasing",      available: true,  priceAdj: 0   },
    { id: "cl3", name: "Sunitha P.",    initials: "SP", experience: 5, rating: 4.7, reviews: 134, specialization: "Carpet & upholstery steam cleaning",  available: false, priceAdj: 100 },
    { id: "cl4", name: "Mohan Raj",     initials: "MR", experience: 9, rating: 4.9, reviews: 267, specialization: "Post-construction cleaning",          available: true,  priceAdj: 100 },
  ],
  installation: [
    { id: "in1", name: "Kiran Reddy",   initials: "KR", experience: 8, rating: 4.9, reviews: 445, specialization: "AC & HVAC installation",              available: true,  priceAdj: 0   },
    { id: "in2", name: "Srikanth M.",   initials: "SM", experience: 6, rating: 4.8, reviews: 312, specialization: "Geyser & chimney setup",              available: true,  priceAdj: 0   },
    { id: "in3", name: "Venugopal K.",  initials: "VK", experience: 11,rating: 5.0, reviews: 587, specialization: "Furniture assembly specialist",       available: true,  priceAdj: 100 },
    { id: "in4", name: "Harish B.",     initials: "HB", experience: 5, rating: 4.7, reviews: 201, specialization: "TV mounting & home theatre",          available: false, priceAdj: 0   },
    { id: "in5", name: "Dinesh T.",     initials: "DT", experience: 9, rating: 4.8, reviews: 376, specialization: "Multi-appliance setups",              available: true,  priceAdj: 50  },
  ],
  repair: [
    { id: "re1", name: "Murali Krishna",initials: "MK", experience: 12,rating: 4.9, reviews: 532, specialization: "Carpentry & woodwork repairs",        available: true,  priceAdj: 0   },
    { id: "re2", name: "Suresh Babu",   initials: "SB", experience: 7, rating: 4.8, reviews: 287, specialization: "Door, window & lock repairs",         available: true,  priceAdj: 0   },
    { id: "re3", name: "Ramana P.",     initials: "RP", experience: 5, rating: 4.6, reviews: 156, specialization: "Drywall & tile patch work",           available: false, priceAdj: 0   },
    { id: "re4", name: "Naresh V.",     initials: "NV", experience: 9, rating: 4.9, reviews: 398, specialization: "Waterproofing & leakage repair",      available: true,  priceAdj: 100 },
  ],
  garden: [
    { id: "ga1", name: "Savitha K.",    initials: "SK", experience: 8, rating: 4.9, reviews: 198, specialization: "Landscape design & plant selection",  available: true,  priceAdj: 0   },
    { id: "ga2", name: "Ramu Nair",     initials: "RN", experience: 10,rating: 4.8, reviews: 267, specialization: "Irrigation systems & lawn care",      available: true,  priceAdj: 0   },
    { id: "ga3", name: "Gayathri R.",   initials: "GR", experience: 6, rating: 4.7, reviews: 134, specialization: "Balcony & terrace gardens",           available: false, priceAdj: 0   },
    { id: "ga4", name: "Prakash N.",    initials: "PN", experience: 14,rating: 5.0, reviews: 321, specialization: "Full landscaping projects",           available: true,  priceAdj: 200 },
  ],
  construction: [
    { id: "co1", name: "Ibrahim Khan",  initials: "IK", experience: 15,rating: 4.9, reviews: 287, specialization: "Tiling & flooring",                  available: true,  priceAdj: 0   },
    { id: "co2", name: "Ganesan R.",    initials: "GR", experience: 10,rating: 4.8, reviews: 198, specialization: "Plastering & masonry",                available: true,  priceAdj: 0   },
    { id: "co3", name: "Abdul Hamid",   initials: "AH", experience: 12,rating: 4.9, reviews: 312, specialization: "Waterproofing & civil work",          available: false, priceAdj: 100 },
    { id: "co4", name: "Rajkumar S.",   initials: "RS", experience: 8, rating: 4.7, reviews: 167, specialization: "False ceiling & partitions",          available: true,  priceAdj: 50  },
  ],
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

export function getServiceBySlug(slug) {
  return SERVICES.find((s) => s.id === slug) ?? null;
}

export function getSpecialists(slug) {
  return SPECIALISTS[slug] ?? [];
}
