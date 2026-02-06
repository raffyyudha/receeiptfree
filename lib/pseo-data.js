
// Database PSEO untuk FreeReceipt.online
// MASSIVE EXPANSION: US 1000 Cities + Global Major Cities
// + MICRO NICHES

// Helper to expand common cities
const US_MAJOR_CITIES = [
    "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose",
    "Austin", "Jacksonville", "Fort Worth", "Columbus", "Charlotte", "San Francisco", "Indianapolis", "Seattle", "Denver", "Washington",
    "Boston", "El Paso", "Nashville", "Detroit", "Oklahoma City", "Portland", "Las Vegas", "Memphis", "Louisville", "Baltimore",
    "Milwaukee", "Albuquerque", "Tucson", "Fresno", "Mesa", "Sacramento", "Atlanta", "Kansas City", "Colorado Springs", "Miami",
    "Raleigh", "Omaha", "Long Beach", "Virginia Beach", "Oakland", "Minneapolis", "Tulsa", "Arlington", "Tampa", "New Orleans",
    "Wichita", "Cleveland", "Bakersfield", "Aurora", "Anaheim", "Honolulu", "Santa Ana", "Riverside", "Corpus Christi", "Lexington",
    "Stockton", "Henderson", "Saint Paul", "St. Louis", "Cincinnati", "Pittsburgh", "Greensboro", "Anchorage", "Plano", "Lincoln",
    "Orlando", "Irvine", "Newark", "Toledo", "Durham", "Chula Vista", "Fort Wayne", "Jersey City", "St. Petersburg", "Laredo",
    "Madison", "Chandler", "Buffalo", "Lubbock", "Scottsdale", "Reno", "Glendale", "Gilbert", "Winston-Salem", "North Las Vegas",
    "Norfolk", "Chesapeake", "Garland", "Irving", "Hialeah", "Fremont", "Boise", "Richmond", "Baton Rouge", "Spokane"
];

const AU_CITIES = [
    "Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast", "Canberra", "Newcastle", "Wollongong", "Logan City",
    "Geelong", "Hobart", "Townsville", "Cairns", "Toowoomba", "Darwin", "Ballarat", "Bendigo", "Albury", "Launceston",
    "Mackay", "Rockhampton", "Bunbury", "Coffs Harbour", "Bundaberg", "Wagga Wagga", "Hervey Bay", "Mildura", "Shepparton"
];

const CA_CITIES = [
    "Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton", "Ottawa", "Winnipeg", "Quebec City", "Hamilton", "Kitchener",
    "London", "Victoria", "Halifax", "Oshawa", "Windsor", "Saskatoon", "St. Catharines", "Regina", "St. John's", "Kelowna",
    "Barrie", "Sherbrooke", "Guelph", "Abbotsford", "Kingston", "Kanata", "Trois-Rivieres", "Moncton", "Chicoutimi"
];

const UK_CITIES = [
    "London", "Birmingham", "Manchester", "Glasgow", "Leeds", "Liverpool", "Newcastle", "Sheffield", "Belfast", "Bristol",
    "Nottingham", "Southampton", "Portsmouth", "Leicester", "Edinburgh", "Cardiff", "Coventry", "Bradford", "Brighton", "Stoke-on-Trent",
    "Plymouth", "Derby", "Swansea", "Aberdeen", "Sunderland", "Luton", "Wolverhampton", "Reading", "Hull", "Preston"
];

const COUNTRIES = [
    { code: 'US', name: 'United States', currency: 'USD', currencySymbol: '$', taxLabel: 'Sales Tax', cities: US_MAJOR_CITIES },
    { code: 'AU', name: 'Australia', currency: 'AUD', currencySymbol: '$', taxLabel: 'GST', cities: AU_CITIES },
    { code: 'CA', name: 'Canada', currency: 'CAD', currencySymbol: '$', taxLabel: 'GST/HST', cities: CA_CITIES },
    { code: 'UK', name: 'United Kingdom', currency: 'GBP', currencySymbol: '£', taxLabel: 'VAT', cities: UK_CITIES },
    { code: 'SG', name: 'Singapore', currency: 'SGD', currencySymbol: '$', taxLabel: 'GST', cities: ['Singapore', 'Jurong West', 'Tampines', 'Woodlands', 'Hougang'] },
    { code: 'NZ', name: 'New Zealand', currency: 'NZD', currencySymbol: '$', taxLabel: 'GST', cities: ['Auckland', 'Wellington', 'Christchurch', 'Hamilton', 'Tauranga', 'Napier', 'Dunedin', 'Palmerston North'] },
    { code: 'IE', name: 'Ireland', currency: 'EUR', currencySymbol: '€', taxLabel: 'VAT', cities: ['Dublin', 'Cork', 'Limerick', 'Galway', 'Waterford', 'Drogheda', 'Swords', 'Dundalk'] },
    { code: 'ZA', name: 'South Africa', currency: 'ZAR', currencySymbol: 'R', taxLabel: 'VAT', cities: ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth', 'Bloemfontein', 'Sandton', 'Soweto'] },
    { code: 'AE', name: 'United Arab Emirates', currency: 'AED', currencySymbol: 'د.إ', taxLabel: 'VAT', cities: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Al Ain', 'Ajman', 'Ras Al Khaimah'] },
    { code: 'IN', name: 'India', currency: 'INR', currencySymbol: '₹', taxLabel: 'GST', cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Surat'] },
    { code: 'PH', name: 'Philippines', currency: 'PHP', currencySymbol: '₱', taxLabel: 'VAT', cities: ['Manila', 'Quezon City', 'Davao City', 'Cebu City', 'Makati', 'Taguig', 'Pasig', 'Zamboanga City'] }
];

// EXPANDED INDUSTRIES (Micro-Niches)
const INDUSTRIES = [
    // TRADES - PLUMBING
    { slug: 'plumber', title: 'Plumber', verb: 'Plumbing', items: ['Pipe Repair', 'Leak Fix', 'Faucet Install', 'Labor'], desc: 'helps plumbers invoice for repairs.' },
    { slug: 'emergency-plumber', title: 'Emergency Plumber', verb: 'Emergency Plumbing', items: ['Urgent Leak Fix', 'Midnight Service', 'Pipe Burst', 'Labor'], desc: 'is essential for 24/7 plumbing services.' },
    { slug: 'commercial-plumber', title: 'Commercial Plumber', verb: 'Commercial Plumbing', items: ['Building Pipe Maint', 'Restroom Install', 'Valve Check', 'Labor'], desc: 'allows commercial plumbers to bill businesses.' },

    // TRADES - ELECTRICAL
    { slug: 'electrician', title: 'Electrician', verb: 'Electrical Work', items: ['Wiring', 'Outlet Repair', 'Panel Box', 'Inspection'], desc: 'generates receipts for electrical jobs.' },
    { slug: 'residential-electrician', title: 'Residential Electrician', verb: 'Home Wiring', items: ['Fan Install', 'Light Fixture', 'Rewiring', 'Service Call'], desc: 'helps home electricians bill homeowners.' },

    // TRADES - AUTO
    { slug: 'mechanic', title: 'Mechanic', verb: 'Auto Repair', items: ['Oil Change', 'Brake Pads', 'Diagnostics', 'Tire Rotation'], desc: 'provides receipts for auto shops.' },
    { slug: 'mobile-mechanic', title: 'Mobile Mechanic', verb: 'Mobile Auto Repair', items: ['On-site Repair', 'Travel Fee', 'Parts', 'Labor'], desc: 'is perfect for mechanics who travel to clients.' },
    { slug: 'auto-detailer', title: 'Auto Detailer', verb: 'Car Detailing', items: ['Full Detail', 'Interior Clean', 'Wax & Polish', 'Ceramic Coat'], desc: 'creates receipts for car wash and detailing.' },

    // CONTRACTORS
    { slug: 'contractor', title: 'Contractor', verb: 'Contracting', items: ['Project Milestone', 'Materials', 'Labor', 'Permits'], desc: 'simplifies billing for general contractors.' },
    { slug: 'roofing-contractor', title: 'Roofing Contractor', verb: 'Roofing', items: ['Shingle Replace', 'Leak Patch', 'New Roof', 'Gutter Clean'], desc: 'helps roofers professionally bill for repairs.' },
    { slug: 'flooring-installer', title: 'Flooring Installer', verb: 'Flooring', items: ['Hardwood Install', 'Tile Setting', 'Grout Work', 'Materials'], desc: 'creates receipts for floor installation jobs.' },
    { slug: 'hvac-tech', title: 'HVAC Tech', verb: 'HVAC Services', items: ['AC Repair', 'Heater Maint', 'Freon', 'Service Call'], desc: 'generates receipts for heating and cooling repairs.' },

    // HOME SERVICES
    { slug: 'cleaner', title: 'Cleaner', verb: 'Cleaning', items: ['House Clean', 'Deep Clean', 'Supplies', 'Hours'], desc: 'generates proof of payment for cleaning.' },
    { slug: 'carpet-cleaner', title: 'Carpet Cleaner', verb: 'Carpet Cleaning', items: ['Steam Clean', 'Stain Removal', 'Room Rate', 'Deodorizer'], desc: 'helps carpet cleaners bill per room.' },
    { slug: 'window-washer', title: 'Window Washer', verb: 'Window Cleaning', items: ['Exterior Windows', 'Screen Clean', 'Track Detail', 'Ladder Work'], desc: 'creates receipts for window washing services.' },
    { slug: 'pest-control', title: 'Pest Control', verb: 'Pest Control', items: ['Inspection', 'Treatment', 'Traps', 'Follow-up'], desc: 'provides documentation for exterminators.' },
    { slug: 'landscaper', title: 'Landscaper', verb: 'Landscaping', items: ['Mowing', 'Trimming', 'Mulch', 'Cleanup'], desc: 'simplifies billing for lawn care.' },
    { slug: 'tree-service', title: 'Tree Service', verb: 'Tree Service', items: ['Tree Removal', 'Stump Grinding', 'Pruning', 'Haul Away'], desc: 'helps arborists bill for tree work.' },
    { slug: 'pool-service', title: 'Pool Service', verb: 'Pool Maint', items: ['Weekly Clean', 'Chemicals', 'Filter Clean', 'Salt'], desc: 'helps pool techs track payments.' },

    // FREELANCE & CREATIVE
    { slug: 'freelancer', title: 'Freelancer', verb: 'Freelance Work', items: ['Project Fee', 'Hourly Rate', 'Consultation', 'Deposit'], desc: 'allows freelancers to look professional.' },
    { slug: 'web-designer', title: 'Web Designer', verb: 'Web Design', items: ['Site Design', 'Mockups', 'Coding', 'Hosting'], desc: 'creates receipts for digital design work.' },
    { slug: 'graphic-designer', title: 'Graphic Designer', verb: 'Graphic Design', items: ['Logo Design', 'Branding', 'Revisions', 'Files'], desc: 'helps designers bill for creative assets.' },
    { slug: 'photographer', title: 'Photographer', verb: 'Photography', items: ['Session Fee', 'Editing', 'Prints', 'Travel'], desc: 'generates receipts for photo shoots.' },
    { slug: 'wedding-photographer', title: 'Wedding Photographer', verb: 'Wedding Photo', items: ['Full Day Coverage', 'Editing', 'Album', 'Engagement Shoot'], desc: 'is tailored for wedding photography billing.' },
    { slug: 'videographer', title: 'Videographer', verb: 'Video Production', items: ['Filming', 'Editing', 'Gear Rental', 'Licensing'], desc: 'is perfect for video production billing.' },
    { slug: 'copywriter', title: 'Copywriter', verb: 'Copywriting', items: ['Blog Post', 'Web Copy', 'Editing', 'SEO'], desc: 'allows writers to invoice for words or hours.' },
    { slug: 'dj', title: 'DJ', verb: 'DJ Services', items: ['Event Performance', 'Sound Setup', 'Lighting', 'Overtime'], desc: 'allows DJs to issue receipts for gigs.' },

    // PERSONAL SERVICES
    { slug: 'tutor', title: 'Tutor', verb: 'Tutoring', items: ['Lesson Hour', 'Exam Prep', 'Materials', 'Travel'], desc: 'helps tutors track session payments.' },
    { slug: 'music-teacher', title: 'Music Teacher', verb: 'Music Lessons', items: ['Piano Lesson', 'Guitar Lesson', 'Books', 'Recital Fee'], desc: 'creates receipts for music instructors.' },
    { slug: 'personal-trainer', title: 'Personal Trainer', verb: 'Training', items: ['Session', 'Program Design', 'Nutrtion Plan', 'Gym Fee'], desc: 'allows trainers to issue receipts.' },
    { slug: 'yoga-instructor', title: 'Yoga Instructor', verb: 'Yoga Class', items: ['Private Class', 'Group Session', 'Mat Rental', 'Workshop'], desc: 'helps yoga teachers bill students.' },
    { slug: 'makeup-artist', title: 'Makeup Artist', verb: 'Makeup Svc', items: ['Bridal Makeup', 'Trial', 'Lashes', 'Travel'], desc: 'creates elegant receipts for beauty work.' },
    { slug: 'hair-stylist', title: 'Hair Stylist', verb: 'Hair Services', items: ['Cut & Style', 'Color', 'Treatment', 'Product'], desc: 'is ideal for salon professionals.' },
    { slug: 'nanny', title: 'Nanny', verb: 'Childcare', items: ['Babysitting', 'Overtime', 'Meal Prep', 'Outing'], desc: 'provides a way to track childcare earnings.' },
    { slug: 'pet-sitter', title: 'Pet Sitter', verb: 'Pet Sitting', items: ['Dog Walking', 'Overnight Stay', 'Feeding', 'Medication'], desc: 'helps pet sitters bill clients.' },

    // PROFESSIONAL
    { slug: 'consultant', title: 'Consultant', verb: 'Consulting', items: ['Strategy Session', 'Report', 'Hourly Rate', 'Travel'], desc: 'provides a clean format for consulting fees.' },
    { slug: 'accountant', title: 'Accountant', verb: 'Accounting', items: ['Tax Prep', 'Bookkeeping', 'Filing', 'Audit'], desc: 'helps accountants issue receipts.' },
    { slug: 'translator', title: 'Translator', verb: 'Translation', items: ['Doc Translation', 'Proofreading', 'Certifying', 'Word Count'], desc: 'creates receipts for translation work.' },
    { slug: 'notary', title: 'Notary Public', verb: 'Notary Svc', items: ['Signature', 'Oath', 'Travel', 'Copy Cert'], desc: 'helps notaries bill for official acts.' },
    { slug: 'event-planner', title: 'Event Planner', verb: 'Event Planning', items: ['Coordination', 'Venue Booking', 'Vendor Mgmt', 'Design'], desc: 'helps organizers itemize planning fees.' },

    // NEW ADDITIONS (Scale to 100+)
    { slug: 'handyman', title: 'Handyman', verb: 'General Repairs', items: ['Labor', 'Small Parts', 'Mounting', 'Assembly'], desc: 'is perfect for odd jobs and home repairs.' },
    { slug: 'painter', title: 'Painter', verb: 'Painting Services', items: ['Interior Paint', 'Exterior Paint', 'Trim Work', 'Supplies'], desc: 'helps painters bill per sq ft or hour.' },
    { slug: 'drywall-contractor', title: 'Drywall Contractor', verb: 'Drywall', items: ['Hanging', 'Taping', 'Mudding', 'Sanding'], desc: 'generates receipts for drywall installation and repair.' },
    { slug: 'locksmith', title: 'Locksmith', verb: 'Lock Services', items: ['Lockout Svc', 'Key Duplication', 'Rekeying', 'Install'], desc: 'provides proof of payment for security services.' },
    { slug: 'junk-removal', title: 'Junk Removal', verb: 'Junk Removal', items: ['Hauling Fee', 'Disposal Fee', 'Labor', 'Truck Load'], desc: 'helps haulers bill for trash removal.' },
    { slug: 'mover', title: 'Mover', verb: 'Moving Services', items: ['Truck Fee', 'Labor Hours', 'Packing Materials', 'Distance'], desc: 'creates receipts for moving companies.' },
    { slug: 'pressure-washer', title: 'Pressure Washer', verb: 'Pressure Washing', items: ['Driveway Clean', 'Siding Wash', 'Deck Polish', 'Sealing'], desc: 'is ideal for exterior cleaning services.' },
    { slug: 'gutter-cleaner', title: 'Gutter Cleaner', verb: 'Gutter Cleaning', items: ['Gutter Clean', 'Downspout Flush', 'Repair', 'Debris Removal'], desc: 'helps maintenance pros bill quickly.' },
    { slug: 'fencing-contractor', title: 'Fencing Contractor', verb: 'Fencing', items: ['Post Install', 'Panel Install', 'Gate Hang', 'Materials'], desc: 'generates receipts for fence building.' },
    { slug: 'deck-builder', title: 'Deck Builder', verb: 'Deck Building', items: ['Framing', 'Decking', 'Railing', 'Staining'], desc: 'helps carpenters bill for outdoor structures.' },
    { slug: 'tiler', title: 'Tiler', verb: 'Tiling', items: ['Tile Laying', 'Grouting', 'Demo', 'Waterproofing'], desc: 'creates professional invoices for tile work.' },
    { slug: 'glazier', title: 'Glazier', verb: 'Glass Services', items: ['Window Replace', 'Mirror Install', 'Shower Door', 'Sealant'], desc: 'helps glass specialists track jobs.' },
    { slug: 'welder', title: 'Welder', verb: 'Welding', items: ['Fabrication', 'Repair', 'Mobile Svc', 'Materials'], desc: 'generates receipts for metal work.' },
    { slug: 'carpenter', title: 'Carpenter', verb: 'Carpentry', items: ['Framing', 'Finish Work', 'Cabinetry', 'Repairs'], desc: 'is essential for woodworkers.' },
    { slug: 'mason', title: 'Mason', verb: 'Masonry', items: ['Brick Laying', 'Stone Work', 'Concrete', 'Pointing'], desc: 'helps masons bill for stone and brick work.' },
    { slug: 'plasterer', title: 'Plasterer', verb: 'Plastering', items: ['Skimming', 'Patching', 'Rendering', 'Materials'], desc: 'creates receipts for wall finishing.' },
    { slug: 'insulation-contractor', title: 'Insulation Contractor', verb: 'Insulation', items: ['Spray Foam', 'Batt Install', 'Removal', 'Attic Check'], desc: 'provides proof of energy efficiency upgrades.' },
    { slug: 'demolition-contractor', title: 'Demolition Contractor', verb: 'Demolition', items: ['Tear Down', 'Debris Haul', 'Site Prep', 'Machine Hours'], desc: 'helps demo crews bill for site clearing.' },
    { slug: 'septic-service', title: 'Septic Service', verb: 'Septic Svc', items: ['Pumping', 'Inspection', 'Filter Clean', 'Digging'], desc: 'is vital for sanitation service billing.' },
    { slug: 'chimney-sweep', title: 'Chimney Sweep', verb: 'Chimney Svc', items: ['Sweeping', 'Inspection', 'Cap Install', 'Repair'], desc: 'helps hearth professionals get paid.' },

    // HEALTH & WELLNESS
    { slug: 'massage-therapist', title: 'Massage Therapist', verb: 'Massage', items: ['60min Massage', '90min Massage', 'Deep Tissue', 'Aroma'], desc: 'creates relaxing receipts for clients.' },
    { slug: 'chiropractor', title: 'Chiropractor', verb: 'Chiropractic', items: ['Adjustment', 'Consultation', 'Therapy', 'X-Ray'], desc: 'helps clinics produce patient receipts.' },
    { slug: 'acupuncturist', title: 'Acupuncturist', verb: 'Acupuncture', items: ['Session', 'Herbs', 'Cupping', 'Consult'], desc: 'provides holistic health billing.' },
    { slug: 'nutritionist', title: 'Nutritionist', verb: 'Nutrition Counseling', items: ['Meal Plan', 'Consultation', 'Follow-up', 'Analysis'], desc: 'helps dietitians bill for advice.' },
    { slug: 'life-coach', title: 'Life Coach', verb: 'Coaching', items: ['1:1 Session', 'Group Call', 'strategy', 'Retainer'], desc: 'is perfect for personal development pros.' },
    { slug: 'therapist', title: 'Therapist', verb: 'Therapy', items: ['Counseling', 'Session', 'Assesment', 'Report'], desc: 'provides confidential receipts for sessions.' },

    // TECH & DIGITAL
    { slug: 'seo-specialist', title: 'SEO Specialist', verb: 'SEO Services', items: ['Audit', 'Link Building', 'Content', 'Optimization'], desc: 'helps marketers bill for ranking services.' },
    { slug: 'social-media-manager', title: 'Social Media Manager', verb: 'Social Media', items: ['Content Creation', 'Posting', 'Community Mgmt', 'Ads'], desc: 'creates receipts for digital agencies.' },
    { slug: 'virtual-assistant', title: 'Virtual Assistant', verb: 'VA Services', items: ['Admin Hours', 'Email Mgmt', 'Research', 'Booking'], desc: 'helps remote workers track time.' },
    { slug: 'it-consultant', title: 'IT Consultant', verb: 'IT Support', items: ['Network Setup', 'Troubleshooting', 'Security', 'Hardware'], desc: 'generates receipts for tech support.' },
    { slug: 'app-developer', title: 'App Developer', verb: 'Development', items: ['Coding', 'UI/UX', 'Testing', 'Deployment'], desc: 'helps coders bill for software.' },
    { slug: 'video-editor', title: 'Video Editor', verb: 'Video Editing', items: ['Cutting', 'Color Grade', 'Audio Mix', 'Rendering'], desc: 'is for post-production billing.' },

    // PETS
    { slug: 'dog-walker', title: 'Dog Walker', verb: 'Dog Walking', items: ['30min Walk', '60min Walk', 'Pack Walk', 'Drop-in'], desc: 'keeps pet parents happy with receipts.' },
    { slug: 'dog-groomer', title: 'Dog Groomer', verb: 'Grooming', items: ['Wash & Cut', 'Nail Trim', 'De-shedding', 'Style'], desc: 'helps salons bill for furry clients.' },
    { slug: 'dog-trainer', title: 'Dog Trainer', verb: 'Dog Training', items: ['Private Lesson', 'Group Class', 'Boarding', 'Consult'], desc: 'provides receipts for obedience training.' },

    // EVENTS
    { slug: 'caterer', title: 'Caterer', verb: 'Catering', items: ['Food Service', 'Staff', 'Rentals', 'Beverage'], desc: 'helps food services bill large events.' },
    { slug: 'florist', title: 'Florist', verb: 'Floral Design', items: ['Bouquet', 'Centerpiece', 'Delivery', 'Setup'], desc: 'creates beautiful receipts for arrangements.' },
    { slug: 'baker', title: 'Baker', verb: 'Baking', items: ['Custom Cake', 'Pastries', 'Delivery', 'Tasting'], desc: 'helps bakeries invoice for special orders.' },
    { slug: 'party-entertainer', title: 'Party Entertainer', verb: 'Entertainment', items: ['Performance', 'Travel', 'Setup', 'Overtime'], desc: 'is for clowns, magicians, and characters.' }
];

// SPINTAX TEMPLATES
const INTRO_TEMPLATES = [
    "Looking for a <strong>free receipt template for {industry}</strong> in {location}? You've found the best tool. Our generator is tailored specifically for {industry} needs.",
    "Create professional PDF receipts for your <strong>{industry} business</strong> in {location}. No watermark, 100% free, and fully compliant with {country} tax standards.",
    "The ultimate receipt maker for {location} {industry} professionals. Generate, customize, and download your receipt in seconds. Perfect for billing {verb}.",
    "Need to issue a receipt for <strong>{verb}</strong>? It only takes 5 seconds here. Optimized for {location} currency ({currency}) and locally used tax labels like {taxLabel}.",
    "Stop using Word or Excel. Our <strong>{industry} receipt generator</strong> for {location} users is automatic, fast, and professional."
];

export { COUNTRIES, INDUSTRIES, INTRO_TEMPLATES };
