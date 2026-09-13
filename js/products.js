/**
 * RAJA'S WEAR — Luxury Men's Formalwear & Suits
 * Centralized Product Catalog Data
 */

const RAJA_PRODUCTS = [
  {
    id: "rw-01",
    name: "The Sovereign Navy 3-Piece Suit",
    category: "Suits",
    subCategory: "Business",
    price: 895,
    oldPrice: 1050,
    rating: 4.9,
    reviewCount: 48,
    isBestseller: true,
    isNew: false,
    badge: "Bestseller",
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=85"
    ],
    colors: [
      { name: "Midnight Navy", hex: "#152238" },
      { name: "Charcoal Slate", hex: "#2b2d35" },
      { name: "Deep Obsidian", hex: "#111113" }
    ],
    sizes: ["38R", "40R", "42R", "44R", "46R"],
    shortDesc: "Impeccably tailored three-piece suit woven from Super 150s Australian Merino wool with half-canvas architectural construction.",
    fabric: "100% Super 150s Australian Merino Wool (280g/m²)",
    fit: "Modern Tailored Fit — sculpted chest with a natural taper through the waist.",
    construction: "Floating half-canvas chest piece, hand-finished lapel roll, genuine horn buttons, pure Bemberg cupro lining.",
    care: "Specialist dry clean only. Steam press gently. Hang on contoured cedar wood hanger.",
    details: [
      "Jacket: Notch lapel, two-button front, double back vents, pick stitching",
      "Waistcoat: Five-button closure, tailored back cinch adjuster",
      "Trousers: Flat front, side tab adjusters, unfinished hem for custom inseam"
    ]
  },
  {
    id: "rw-02",
    name: "Grand Savoy Peak Lapel Tuxedo",
    category: "Tuxedos",
    subCategory: "Black Tie",
    price: 1150,
    oldPrice: 1320,
    rating: 5.0,
    reviewCount: 62,
    isBestseller: true,
    isNew: false,
    badge: "Signature Black Tie",
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1555069519-127aadedf1ee?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1598808503746-f34c53b9323e?auto=format&fit=crop&w=1000&q=85"
    ],
    colors: [
      { name: "Raven Black", hex: "#0c0d0f" },
      { name: "Midnight Blue", hex: "#0d1b2a" }
    ],
    sizes: ["36R", "38R", "40R", "42R", "44R", "46L"],
    shortDesc: "The pinnacle of formal evening attire featuring wide grosgrain silk peak lapels and full floating horsehair canvas.",
    fabric: "Pure British Barathea Wool with 100% Mulberry Silk Facing",
    fit: "Slim Architectural Fit — structured roped shoulders and sharp waist accentuation.",
    construction: "Full canvas hand-padded lapels, grosgrain silk-covered buttons, working surgeon cuffs.",
    care: "Professional formalwear dry clean only. Store in breathable garment bag.",
    details: [
      "Jacket: Silk grosgrain peak lapels, single jetted pockets, no vents (traditional formal)",
      "Trousers: Braided grosgrain side stripe, side tab buckle adjusters, zip fly",
      "Crafted in accordance with classical Savile Row black-tie traditions"
    ]
  },
  {
    id: "rw-03",
    name: "Verona Velvet Dinner Jacket",
    category: "Blazers",
    subCategory: "Wedding",
    price: 680,
    oldPrice: null,
    rating: 4.8,
    reviewCount: 34,
    isBestseller: false,
    isNew: true,
    badge: "New Arrival",
    images: [
      "https://images.unsplash.com/photo-1598808503746-f34c53b9323e?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=85"
    ],
    colors: [
      { name: "Midnight Sapphire", hex: "#14213d" },
      { name: "Bordeaux Burgundy", hex: "#4a0e17" },
      { name: "Forest Emerald", hex: "#0f2b1d" }
    ],
    sizes: ["38R", "40R", "42R", "44R"],
    shortDesc: "Sumptuous Italian cotton velvet evening jacket with a black silk satin shawl collar, tailored for gala occasions.",
    fabric: "100% Italian Cotton Velvet (Pontoglio mill) with Silk Satin Shawl",
    fit: "Modern European Fit — contouring chest with comfortable shoulder freedom.",
    construction: "Half-canvas chest, silk satin covered buttons, luxury gold piped interior.",
    care: "Dry clean only. Do not iron directly; steam from reverse side only.",
    details: [
      "Curved shawl lapel in lustrous satin",
      "Single button front closure with silk gauntlet cuffs",
      "Four interior pockets including dedicated cigar and ticket pockets"
    ]
  },
  {
    id: "rw-04",
    name: "Alabaster Riviera Wedding Tuxedo",
    category: "Wedding",
    subCategory: "Suits",
    price: 1020,
    oldPrice: 1190,
    rating: 4.9,
    reviewCount: 41,
    isBestseller: true,
    isNew: false,
    badge: "Wedding Highlight",
    images: [
      "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=85"
    ],
    colors: [
      { name: "Warm Alabaster", hex: "#f4f1ea" },
      { name: "Cream Champagne", hex: "#ede6d6" }
    ],
    sizes: ["38R", "40R", "42R", "44R", "46R"],
    shortDesc: "A masterwork for destination weddings and summer galas, pairing an ivory wool-silk dinner jacket with contrast black trousers.",
    fabric: "70% Wool, 30% Mulberry Silk blend jacket; 100% Super 130s black trousers",
    fit: "Contemporary Tailored Fit with light shoulder padding.",
    construction: "Half-canvas, mother-of-pearl shank buttons, full interior silk lining.",
    care: "Dry clean with specialist formalwear care.",
    details: [
      "Jacket: Ivory satin shawl lapel, welt chest pocket, jetted waist pockets",
      "Trousers: Midnight black barathea wool trousers with matching satin side stripe",
      "Designed for both indoor cathedral and coastal evening ceremonies"
    ]
  },
  {
    id: "rw-05",
    name: "Milano Glen Plaid Double-Breasted Suit",
    category: "Suits",
    subCategory: "Business",
    price: 940,
    oldPrice: null,
    rating: 4.7,
    reviewCount: 29,
    isBestseller: false,
    isNew: true,
    badge: "Editorial Choice",
    images: [
      "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=1000&q=85"
    ],
    colors: [
      { name: "Steel Glen Plaid", hex: "#3a3d45" },
      { name: "Warm Taupe Check", hex: "#4a4640" }
    ],
    sizes: ["38R", "40R", "42R", "44R", "46R"],
    shortDesc: "Distinguished 6-on-2 button double-breasted suit cut from Biella flannel, expressing authentic Milanese sprezzatura.",
    fabric: "100% Italian Worsted Wool Flannel (Vitale Barberis Canonico)",
    fit: "Classic Sartorial Silhouette — masculine peak lapels and broad chest drape.",
    construction: "Full canvas chest, handcrafted Milanese buttonhole on left lapel.",
    care: "Dry clean only. Regular brushing with a natural boar bristle brush.",
    details: [
      "6x2 button stance with broad 4-inch peak lapels",
      "Flapped waist pockets with ticket pocket",
      "High-rise double forward pleated trousers with 2-inch cuffs"
    ]
  },
  {
    id: "rw-06",
    name: "Capri Hopsack Unstructured Blazer",
    category: "Blazers",
    subCategory: "Business",
    price: 520,
    oldPrice: 590,
    rating: 4.8,
    reviewCount: 39,
    isBestseller: true,
    isNew: false,
    badge: "Versatile Staple",
    images: [
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1000&q=85"
    ],
    colors: [
      { name: "Mediterranean Navy", hex: "#1e2d42" },
      { name: "Cigar Havana Brown", hex: "#453229" },
      { name: "Heather Olive", hex: "#353d34" }
    ],
    sizes: ["38R", "40R", "42R", "44R", "46R"],
    shortDesc: "Featherlight, unlined hopsack wool blazer offering exceptional breathability, natural stretch, and effortless versatility.",
    fabric: "100% High-Twist Tropical Hopsack Wool",
    fit: "Neapolitan Cut — soft 'spalla camicia' unpadded shoulder.",
    construction: "Unlined back with piped seams, patch pockets, natural horn buttons.",
    care: "Dry clean only. Resilient crease-recovery for business travel.",
    details: [
      "Two-roll-three button stance",
      "Curved 'barchetta' chest pocket",
      "Dual rear side vents and patch hip pockets"
    ]
  },
  {
    id: "rw-07",
    name: "Riviera Pure Irish Linen Suit",
    category: "Suits",
    subCategory: "Wedding",
    price: 780,
    oldPrice: null,
    rating: 4.9,
    reviewCount: 22,
    isBestseller: false,
    isNew: true,
    badge: "Summer Edition",
    images: [
      "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=85"
    ],
    colors: [
      { name: "Natural Sandstone", hex: "#d8cca3" },
      { name: "Riviera Sky Blue", hex: "#6c889b" },
      { name: "Olive Sage", hex: "#5a6857" }
    ],
    sizes: ["38R", "40R", "42R", "44R"],
    shortDesc: "Tailored from heavyweight Irish linen that drapes cleanly while softening gracefully with wear under the sun.",
    fabric: "100% Pure Irish Linen from Spence Bryson (310g/m²)",
    fit: "Relaxed Tailored Silhouette — comfortable chest with gentle waist taper.",
    construction: "Butterfly quarter-lined in breathable cotton voile, horn buttons.",
    care: "Dry clean or gentle hand wash cold. Embrace natural linen creases.",
    details: [
      "Notch lapels with topstitching",
      "Trousers with extended 2-button waistband closure and side buckles",
      "Unconstructed canvas for optimal ventilation in warm climates"
    ]
  },
  {
    id: "rw-08",
    name: "Savile Row Pinstripe Executive Suit",
    category: "Suits",
    subCategory: "Business",
    price: 920,
    oldPrice: 1080,
    rating: 4.8,
    reviewCount: 51,
    isBestseller: true,
    isNew: false,
    badge: "Boardroom Icon",
    images: [
      "https://images.unsplash.com/photo-1548454782-15b189d129ab?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=85"
    ],
    colors: [
      { name: "Charcoal Chalkstripe", hex: "#23262d" },
      { name: "Navy Pinstripe", hex: "#172033" }
    ],
    sizes: ["38R", "40R", "42R", "44R", "46R", "48L"],
    shortDesc: "The quintessential power suit. Hand-cut chalkstripe wool with roped English shoulders engineered for commanding leadership.",
    fabric: "100% British Wool Flannel with subtle woven chalkstripe",
    fit: "English Structured Cut — defined chest canvas, pagoda shoulder slope.",
    construction: "Floating half-canvas with premium horsehair padding, Bemberg lining.",
    care: "Dry clean only. Steam refresh periodically.",
    details: [
      "Classic 3.5-inch notch lapel",
      "Slanted ticket pocket and twin side vents",
      "Trousers with internal suspender buttons and side adjusters"
    ]
  },
  {
    id: "rw-09",
    name: "Cashmere Houndstooth Club Blazer",
    category: "Blazers",
    subCategory: "Business",
    price: 720,
    oldPrice: null,
    rating: 4.9,
    reviewCount: 31,
    isBestseller: false,
    isNew: true,
    badge: "Heritage Cashmere",
    images: [
      "https://images.unsplash.com/photo-1521341057461-6eb5f40b07ab?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1000&q=85"
    ],
    colors: [
      { name: "Oatmeal & Ebony Houndstooth", hex: "#4b443c" }
    ],
    sizes: ["38R", "40R", "42R", "44R"],
    shortDesc: "An exceptional blend of Mongolian cashmere and Scottish lambswool in an iconic micro-houndstooth weave.",
    fabric: "90% Scottish Wool, 10% Pure Cashmere",
    fit: "Modern Country Tailoring — athletic drape through the torso.",
    construction: "Soft construction, genuine dark horn buttons, twin vents.",
    care: "Specialist wool & cashmere dry clean.",
    details: [
      "Richly textured micro-houndstooth weave",
      "Flap pockets with welt ticket pocket",
      "Supple brown suede under-collar accent"
    ]
  },
  {
    id: "rw-10",
    name: "Sea Island Poplin Spread Collar Shirt",
    category: "Shirts",
    subCategory: "Business",
    price: 185,
    oldPrice: 220,
    rating: 4.9,
    reviewCount: 77,
    isBestseller: true,
    isNew: false,
    badge: "Wardrobe Essential",
    images: [
      "https://images.unsplash.com/photo-1620012253295-c15c429fcc71?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=85"
    ],
    colors: [
      { name: "Crisp Pure White", hex: "#ffffff" },
      { name: "Sky Glaze Blue", hex: "#d0e1f9" },
      { name: "French Stripe Lilac", hex: "#ded6e5" }
    ],
    sizes: ["15.0", "15.5", "16.0", "16.5", "17.0"],
    shortDesc: "Woven in Switzerland from rare extra-long staple cotton. Silky touch, French cuffs, and removable brass collar stays.",
    fabric: "100% 2-ply 120s Sea Island Cotton Poplin",
    fit: "Tailored Slim Fit — clean back darts with zero bunching under jackets.",
    construction: "Single-needle 22-stitches-per-inch stitching, genuine mother-of-pearl buttons.",
    care: "Machine wash delicate 30°C or professional launder. Warm iron while damp.",
    details: [
      "Semi-spread collar designed for four-in-hand and half-windsor knots",
      "Double French cuffs for cufflink pairing",
      "Split back yoke for anatomical comfort across shoulders"
    ]
  },
  {
    id: "rw-11",
    name: "Pleated Gurkha Flannel Trousers",
    category: "Trousers",
    subCategory: "Business",
    price: 260,
    oldPrice: null,
    rating: 4.7,
    reviewCount: 38,
    isBestseller: false,
    isNew: true,
    badge: "Sartorial Favorite",
    images: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1000&q=85"
    ],
    colors: [
      { name: "Charcoal Heather", hex: "#32353e" },
      { name: "Caramel Camel", hex: "#8e6b47" },
      { name: "Deep Navy", hex: "#141d2f" }
    ],
    sizes: ["30W", "32W", "34W", "36W", "38W"],
    shortDesc: "High-waisted sartorial trousers featuring double reverse pleats and an iconic wraparound Gurkha buckled cummerbund waistband.",
    fabric: "100% Italian Wool Flannel with natural drape",
    fit: "Relaxed High-Rise Tapered Cut with generous thigh comfort.",
    construction: "Hand-finished waistband curtain, lined to the knee in soft cupro.",
    care: "Dry clean only. Steam press sharp center creases.",
    details: [
      "Signature twin buckle wrap closure eliminates need for a belt",
      "Deep double reverse pleats for dramatic drape",
      "Slanted side pockets and button-through rear welt pockets"
    ]
  },
  {
    id: "rw-12",
    name: "24K Gold & Onyx Octagonal Cufflinks",
    category: "Accessories",
    subCategory: "Black Tie",
    price: 195,
    oldPrice: 240,
    rating: 5.0,
    reviewCount: 54,
    isBestseller: true,
    isNew: false,
    badge: "Fine Jewelry",
    images: [
      "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=85"
    ],
    colors: [
      { name: "Gold & Black Onyx", hex: "#d4af37" },
      { name: "Rhodium & Mother of Pearl", hex: "#d9d9d9" }
    ],
    sizes: ["One Size"],
    shortDesc: "Handcrafted octagonal cufflinks featuring natural mirror-polished black onyx framed in 24k gold-plated sterling silver.",
    fabric: "Solid 925 Sterling Silver with 24k Gold Micron Vermeil and Natural Onyx",
    fit: "Universal swivel whale-back closure compatible with all French cuff shirts.",
    construction: "Individually hand-set gemstones with bevelled octagonal border.",
    care: "Buff gently with specialized jewelry microfiber cloth. Store in bespoke presentation box.",
    details: [
      "Subtle engraved 'Raja's Wear' crest hallmark on back clasp",
      "Hypoallergenic and tarnish-resistant protective nano-coating",
      "Arrives in leatherette keepsake gift casket"
    ]
  },
  {
    id: "rw-13",
    name: "Como Jacquard Mulberry Silk Tie",
    category: "Accessories",
    subCategory: "Wedding",
    price: 135,
    oldPrice: null,
    rating: 4.8,
    reviewCount: 46,
    isBestseller: false,
    isNew: true,
    badge: "Artisanal",
    images: [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=85"
    ],
    colors: [
      { name: "Champagne Gold Medallion", hex: "#c5a059" },
      { name: "Midnight Paisley", hex: "#16233b" },
      { name: "Silver Frost Houndstooth", hex: "#b8b8b8" }
    ],
    sizes: ["3.15\" Width (8cm)"],
    shortDesc: "Seven-fold construction woven on historic jacquard looms in Lake Como, Italy. Untipped hand-rolled edges.",
    fabric: "100% Pure Mulberry Silk (36 momme weight)",
    fit: "Classic 8cm blade width with pure wool interlining for a dimpled knot.",
    construction: "Hand-sewn slip stitch allowing natural stretch recovery after wearing.",
    care: "Dry clean only. Roll rather than fold when travelling.",
    details: [
      "Self-fabric keeper loop and reinforced bar tacking",
      "Untipped edges with hand-rolled borders showcasing authentic craftsmanship",
      "Perfect thickness for a crisp sartorial dimple"
    ]
  },
  {
    id: "rw-14",
    name: "Classic Silk Barathea Cummerbund & Bow Tie",
    category: "Accessories",
    subCategory: "Black Tie",
    price: 175,
    oldPrice: 210,
    rating: 4.9,
    reviewCount: 33,
    isBestseller: false,
    isNew: false,
    badge: "Black Tie Complete",
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1555069519-127aadedf1ee?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1000&q=85"
    ],
    colors: [
      { name: "Deep Satin Black", hex: "#0a0a0b" },
      { name: "Midnight Navy Grosgrain", hex: "#0b1424" }
    ],
    sizes: ["Adjustable (Fits 28\" - 44\" waist)"],
    shortDesc: "Authentic evening wear set including an upward-pleated silk satin cummerbund and a self-tie butterfly formal bow tie.",
    fabric: "100% Pure Italian Silk Barathea",
    fit: "Fully adjustable elasticized band with chrome slide clasps.",
    construction: "Four traditional upward-facing pleats designed to hold opera and theater stubs.",
    care: "Specialist silk dry clean.",
    details: [
      "Includes self-tie bow tie with collar size indicators (14.5 to 18 inches)",
      "Concealed interior ticket pocket inside the cummerbund",
      "Complies with strict white tie and black tie dress standards"
    ]
  }
];

// Curated Editorial Collections Data
const RAJA_COLLECTIONS = [
  {
    id: "col-executive",
    name: "The Executive Collection",
    tagline: "Uncompromising Authority in Every Stitch",
    desc: "Engineered for boardrooms and negotiations. Precision-cut British and Italian wools with architectural silhouettes that command respect without uttering a word.",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85",
    categoryFilter: "Business",
    pieceCount: "12 Bespoke Pieces"
  },
  {
    id: "col-blacktie",
    name: "Black Tie & Gala Mastery",
    tagline: "The Ceremonial Height of Evening Elegance",
    desc: "From state dinners to charity galas, explore pure barathea wool dinner jackets, silk grosgrain peak lapels, and hand-finished formal accessories.",
    image: "https://images.unsplash.com/photo-1555069519-127aadedf1ee?auto=format&fit=crop&w=1200&q=85",
    categoryFilter: "Tuxedos",
    pieceCount: "8 Masterworks"
  },
  {
    id: "col-wedding",
    name: "The Wedding Edit",
    tagline: "Memories Tailored for Eternity",
    desc: "Designed for grooms, best men, and bridal parties. From warm alabaster destination tuxedos to rich three-piece ceremonial suits in timeless midnight tones.",
    image: "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=1200&q=85",
    categoryFilter: "Wedding",
    pieceCount: "10 Ceremonial Suits"
  },
  {
    id: "col-blazers",
    name: "Signature Italian Blazers",
    tagline: "Sprezzatura for Modern Versatility",
    desc: "Deconstructed Neapolitan shoulders, open-weave hopsack wools, and Pontoglio cotton velvet for effortlessly elevated off-duty sophistication.",
    image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=1200&q=85",
    categoryFilter: "Blazers",
    pieceCount: "14 Tailored Blazers"
  },
  {
    id: "col-riviera",
    name: "Summer Riviera Linen",
    tagline: "Breathable Sophistication Under the Sun",
    desc: "Pure Irish linen and featherweight silk-wool blends cut with gentle ease for coastal destinations, garden celebrations, and warm-climate soirees.",
    image: "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&w=1200&q=85",
    categoryFilter: "Suits",
    pieceCount: "7 Summer Styles"
  },
  {
    id: "col-accessories",
    name: "Sartorial Jewelry & Accents",
    tagline: "The Final Polish of a True Connoisseur",
    desc: "24k gold cufflinks with natural black onyx, Como 7-fold jacquard silk ties, and hand-rolled pocket squares crafted to complete your ensemble.",
    image: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=85",
    categoryFilter: "Accessories",
    pieceCount: "18 Handcrafted Accents"
  }
];
