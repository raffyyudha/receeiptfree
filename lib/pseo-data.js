
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
    { slug: 'event-planner', title: 'Event Planner', verb: 'Event Planning', items: ['Coordination', 'Venue Booking', 'Vendor Mgmt', 'Design'], desc: 'helps organizers itemize planning fees.' }
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
