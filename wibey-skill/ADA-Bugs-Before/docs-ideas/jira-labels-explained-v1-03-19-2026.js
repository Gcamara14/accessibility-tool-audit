// validationConfig.js - Global Validation Configuration for Chrome Extension
// This creates a global window object that all scripts can access
// No ES6 imports needed - works reliably in all Chrome extension contexts

// ⚠️  CRITICAL: HTML DROPDOWN SYNC REQUIREMENT ⚠️
// ALL values here MUST exactly match <option> values in:
// → src/jira-edit/edit-bug-form.html
// → src/ticket-create/ticket-create.html  
// If they don't match, save functionality FAILS silently!
// Always update BOTH files when changing dropdown values.

console.log('🔧 Loading global validation configuration...');

// Create global configuration object
window.A11Y_VALIDATION_CONFIG = {
  // ============================================================================
  // ALLOWED VALUES
  // ============================================================================
  allowedValues: {
    bugTeam: [
      "CE-ADA-E2E Team",
      "idc-a11y Team", 
      "Intl-UX-Accessibility Team",
      "sams_accessibility Team",
      "Associate-A11Y Team",
      "Seller-Center-A11Y Team",
      "Applause-ADA Team"
    ],
    
    bugLocation: [
      "Walmart.com",
      "Walmart.com.mx", 
      "Walmart.ca",
      "Samsclub.com",
      "Seller.walmart.com",
      "Associate-website",
      "Uncategorized-website"
    ],
    
    bugPlatform: ["Web", "Android", "iOS"],
    
    primaryWCAG: [
      "Missing-WCAG", "WCAG-1.1.1", "WCAG-1.2.1", "WCAG-1.2.2", "WCAG-1.2.3",
      "WCAG-1.2.4", "WCAG-1.2.5", "WCAG-1.2.6", "WCAG-1.2.7", "WCAG-1.2.8",
      "WCAG-1.2.9", "WCAG-1.3.1", "WCAG-1.3.2", "WCAG-1.3.3", "WCAG-1.3.4",
      "WCAG-1.3.5", "WCAG-1.3.6", "WCAG-1.4.1", "WCAG-1.4.2", "WCAG-1.4.3",
      "WCAG-1.4.4", "WCAG-1.4.5", "WCAG-1.4.6", "WCAG-1.4.7", "WCAG-1.4.8",
      "WCAG-1.4.9", "WCAG-1.4.10", "WCAG-1.4.11", "WCAG-1.4.12", "WCAG-1.4.13",
      "WCAG-2.1.1", "WCAG-2.1.2", "WCAG-2.1.3", "WCAG-2.1.4", "WCAG-2.2.1",
      "WCAG-2.2.2", "WCAG-2.2.3", "WCAG-2.2.4", "WCAG-2.2.5", "WCAG-2.2.6",
      "WCAG-2.3.1", "WCAG-2.3.2", "WCAG-2.3.3", "WCAG-2.4.1", "WCAG-2.4.2",
      "WCAG-2.4.3", "WCAG-2.4.4", "WCAG-2.4.5", "WCAG-2.4.6", "WCAG-2.4.7",
      "WCAG-2.4.8", "WCAG-2.4.9", "WCAG-2.4.10", "WCAG-2.4.11", "WCAG-2.4.12",
      "WCAG-2.4.13", "WCAG-2.5.1", "WCAG-2.5.2", "WCAG-2.5.3", "WCAG-2.5.4",
      "WCAG-2.5.5", "WCAG-2.5.6", "WCAG-2.5.7", "WCAG-2.5.8", "WCAG-3.1.1",
      "WCAG-3.1.2", "WCAG-3.1.3", "WCAG-3.1.4", "WCAG-3.1.5", "WCAG-3.1.6",
      "WCAG-3.2.1", "WCAG-3.2.2", "WCAG-3.2.3", "WCAG-3.2.4", "WCAG-3.2.5",
      "WCAG-3.2.6", "WCAG-3.3.1", "WCAG-3.3.2", "WCAG-3.3.3", "WCAG-3.3.4",
      "WCAG-3.3.5", "WCAG-3.3.6", "WCAG-3.3.7", "WCAG-3.3.8", "WCAG-3.3.9",
      "WCAG-4.1.2", "WCAG-4.1.3"
    ],
    
    // Dynamic template titles - pulls from actual loaded templates to prevent mismatches
    get bugTemplateTitles() {
      // Extract unique template titles from window.A11Y_TEMPLATES
      const templates = window.A11Y_TEMPLATES || [];
      
      if (templates.length === 0) {
        console.warn('[VALIDATION CONFIG] No templates loaded yet - window.A11Y_TEMPLATES is empty');
        // Return empty array if templates not loaded yet - this prevents validation errors
        return [];
      }
      
      const uniqueTitles = [...new Set(templates.map(t => t.title))].filter(Boolean).sort();
      
      console.log(`[VALIDATION CONFIG] ✅ Dynamically loaded ${uniqueTitles.length} unique template titles from templates.js`, 
        uniqueTitles.length > 0 ? `\nFirst few: ${uniqueTitles.slice(0, 3).join(', ')}...\nThis prevents template mismatch errors!` : 'None found');
      
      return uniqueTitles;
    },
    
    parentCapabilityArchitectureUS: [
      "A11Y-US-Team-Accounts", "A11Y-US-Team-PAC", "A11Y-US-Team-Address",
      "A11Y-US-Team-All-Departments", "A11Y-US-Team-Amends", "A11Y-US-Team-ACC",
      "A11Y-US-Team-Bookslot", "A11Y-US-Team-Brand", "A11Y-US-Team-Browse",
      "A11Y-US-Team-Cancel-Order", "A11Y-US-Team-Cart", "A11Y-US-Team-Category",
      "A11Y-US-Team-Charge-History", "A11Y-US-Team-Chat", "A11Y-US-Team-Checkout",
      "A11Y-US-Team-Custom-Cakes", "A11Y-US-Team-Digital-Store-Receipts",
      "A11Y-US-Team-Evergreen", "A11Y-US-Team-GIC", "A11Y-US-Team-Global-Nav",
      "A11Y-US-Team-Help-Center", "A11Y-US-Team-Homepage", "A11Y-US-Team-InHome",
      "A11Y-US-Team-Insurance-Services", "A11Y-US-Team-Item-Page", "A11Y-US-Team-Item-Reviews",
      "A11Y-US-Team-Lists-Wishlist", "A11Y-US-Team-Live-Order-Tracking",
      "A11Y-US-Team-Local-Marketplace", "A11Y-US-Team-My-Items", "A11Y-US-Team-Order-Details",
      "A11Y-US-Team-Payments-Wallet", "A11Y-US-Team-P13N", "A11Y-US-Team-PetRX",
      "A11Y-US-Team-Pharmacy", "A11Y-US-Team-Photo-Services", "A11Y-US-Team-Pickup-checkin",
      "A11Y-US-Team-Privacy-Center", "A11Y-US-Team-Protection-Plans",
      "A11Y-US-Team-Purchase-History", "A11Y-US-Team-Recipe", "A11Y-US-Team-Registry",
      "A11Y-US-Team-Returns", "A11Y-US-Team-Review-Order-CSAT", "A11Y-US-Team-Savings",
      "A11Y-US-Team-Search", "A11Y-US-Team-Seller-Overview", "A11Y-US-Team-Services",
      "A11Y-US-Team-Shop", "A11Y-US-Team-Shoppable-lists", "A11Y-US-Team-Social-Commerce",
      "A11Y-US-Team-Spark-Good", "A11Y-US-Team-Sparky", "A11Y-US-Team-Store",
      "A11Y-US-Team-Store-Directory", "A11Y-US-Team-Store-Locator", "A11Y-US-Team-Store-Mode",
      "A11Y-US-Team-Store-WiFi", "A11Y-US-Team-Subscriptions", "A11Y-US-Team-Substitutes",
      "A11Y-US-Team-Thank-You", "A11Y-US-Team-Uncategorized-Architecture",
      "A11Y-US-Team-Vision-Center", "A11Y-US-Team-Walmart-Cash", "A11Y-US-Team-Walmart-Live",
      "A11Y-US-Team-WPlus-Benefits", "A11Y-US-Team-WPlus-Lifecycle",
      "A11Y-US-Team-WPlus-Management", "A11Y-US-Team-Wireless", "A11Y-US-Team-WM-Contacts"
    ],
    
    parentCapabilityArchitectureCA: [
      "A11Y-CA-Team-Uncategorized-Architecture", "A11Y-CA-Team-Accounts", "A11Y-CA-Team-PAC",
      "A11Y-CA-Team-Address", "A11Y-CA-Team-All-Departments", "A11Y-CA-Team-Amends",
      "A11Y-CA-Team-Bookslot", "A11Y-CA-Team-Browse",
      "A11Y-CA-Team-Cancel-Order", "A11Y-CA-Team-Cart", "A11Y-CA-Team-Category",
      "A11Y-CA-Team-Checkout", "A11Y-CA-Team-GIC", "A11Y-CA-Team-Global-Nav",
      "A11Y-CA-Team-Help-Center", "A11Y-CA-Team-Homepage",
      "A11Y-CA-Team-Item-Page", "A11Y-CA-Team-Item-Reviews",
      "A11Y-CA-Team-Lists-Wishlist", "A11Y-CA-Team-Live-Order-Tracking",
      "A11Y-CA-Team-My-Items", "A11Y-CA-Team-Order-Details",
      "A11Y-CA-Team-Payments-Wallet", "A11Y-CA-Team-P13N",
      "A11Y-CA-Team-Pharmacy", "A11Y-CA-Team-Pickup-checkin",
      "A11Y-CA-Team-Privacy-Center", "A11Y-CA-Team-Protection-Plans",
      "A11Y-CA-Team-Purchase-History", "A11Y-CA-Team-Registry",
      "A11Y-CA-Team-Returns", "A11Y-CA-Team-Review-Order-CSAT",
      "A11Y-CA-Team-Search", "A11Y-CA-Team-Services",
      "A11Y-CA-Team-Shop", "A11Y-CA-Team-Store",
      "A11Y-CA-Team-Store-Locator",	"A11Y-CA-Team-Delivery-Pass",
      "A11Y-CA-Team-Subscriptions", "A11Y-CA-Team-Substitutes",
      "A11Y-CA-Team-Thank-You", "A11Y-CA-Team-Vision-Center",
    ]
  },

  // ============================================================================
  // PRETTY DISPLAY NAMES
  // ============================================================================
  parentCapabilityPretty: {
    "A11Y-US-Team-Accounts": "Accounts",
    "A11Y-US-Team-PAC": "Added to Cart (PAC)",
    "A11Y-US-Team-Address": "Address",
    "A11Y-US-Team-All-Departments": "All Departments",
    "A11Y-US-Team-Amends": "Amends",
    "A11Y-US-Team-ACC": "Auto Care Center (ACC)",
    "A11Y-US-Team-Bookslot": "Bookslot",
    "A11Y-US-Team-Brand": "Brand Pages",
    "A11Y-US-Team-Browse": "Browse Pages",
    "A11Y-US-Team-Cancel-Order": "Cancel Order",
    "A11Y-US-Team-Cart": "Cart Page",
    "A11Y-US-Team-Category": "Category Pages",
    "A11Y-US-Team-Charge-History": "Charge History",
    "A11Y-US-Team-Chat": "Chat",
    "A11Y-US-Team-Checkout": "Checkout Page",
    "A11Y-US-Team-Custom-Cakes": "Custom Cake Pages",
    "A11Y-US-Team-Digital-Store-Receipts": "Digital Store Receipts",
    "A11Y-US-Team-Evergreen": "Evergreen",
    "A11Y-US-Team-GIC": "Global Intent Center (GIC)",
    "A11Y-US-Team-Global-Nav": "Global Nav (Header & Footer)",
    "A11Y-US-Team-Help-Center": "Help Center Pages",
    "A11Y-US-Team-Homepage": "Homepage",
    "A11Y-US-Team-InHome": "InHome",
    "A11Y-US-Team-Insurance-Services": "Insurance Services",
    "A11Y-US-Team-Item-Page": "Item Pages",
    "A11Y-US-Team-Item-Reviews": "Item Reviews (UGC)",
    "A11Y-US-Team-Lists-Wishlist": "List & Wishlist Pages",
    "A11Y-US-Team-Live-Order-Tracking": "Live Order Tracking",
    "A11Y-US-Team-Local-Marketplace": "Local Marketplace",
    "A11Y-US-Team-My-Items": "My Items",
    "A11Y-US-Team-Order-Details": "Order Details",
    "A11Y-US-Team-Payments-Wallet": "Payments/Wallet",
    "A11Y-US-Team-P13N": "Personalization (P13n)",
    "A11Y-US-Team-PetRX": "PetRX",
    "A11Y-US-Team-Pharmacy": "Pharmacy Pages",
    "A11Y-US-Team-Photo-Services": "Photo Services Pages",
    "A11Y-US-Team-Pickup-checkin": "Pick Up-Checkin",
    "A11Y-US-Team-Privacy-Center": "Privacy Center",
    "A11Y-US-Team-Protection-Plans": "Protection Plans",
    "A11Y-US-Team-Purchase-History": "Purchase History",
    "A11Y-US-Team-Recipe": "Recipe Pages",
    "A11Y-US-Team-Registry": "Registry",
    "A11Y-US-Team-Returns": "Returns",
    "A11Y-US-Team-Review-Order-CSAT": "Review Order (CSAT)",
    "A11Y-US-Team-Savings": "Savings",
    "A11Y-US-Team-Search": "Search",
    "A11Y-US-Team-Seller-Overview": "Seller Overview",
    "A11Y-US-Team-Services": "Services",
    "A11Y-US-Team-Shop": "Shop",
    "A11Y-US-Team-Shoppable-lists": "Shoppable lists",
    "A11Y-US-Team-Social-Commerce": "Social commerce",
    "A11Y-US-Team-Spark-Good": "Spark Good",
    "A11Y-US-Team-Sparky": "Sparky",
    "A11Y-US-Team-Store": "Store",
    "A11Y-US-Team-Store-Directory": "Store Directory",
    "A11Y-US-Team-Store-Locator": "Store Locator Pages",
    "A11Y-US-Team-Store-Mode": "Store Mode",
    "A11Y-US-Team-Store-WiFi": "Store Wi-Fi",
    "A11Y-US-Team-Subscriptions": "Subscriptions",
    "A11Y-US-Team-Substitutes": "Substitutes",
    "A11Y-US-Team-Thank-You": "Thank You Page",
    "A11Y-US-Team-Uncategorized-Architecture": "Uncategorized Architecture Bucket",
    "A11Y-US-Team-Vision-Center": "Vision Center Pages",
    "A11Y-US-Team-Walmart-Cash": "Walmart Cash",
    "A11Y-US-Team-Walmart-Live": "Walmart Live",
    "A11Y-US-Team-WPlus-Benefits": "Walmart+ Benefits",
    "A11Y-US-Team-WPlus-Lifecycle": "Walmart+ Lifecycle",
    "A11Y-US-Team-WPlus-Management": "Walmart+ Membership Management, and Renewals & Billing",
    "A11Y-US-Team-Wireless": "Wireless",
    "A11Y-US-Team-WM-Contacts": "Walmart Contacts",
    // CA Team pretty names
    "A11Y-CA-Team-Uncategorized-Architecture": "Uncategorized Architecture Bucket",
    "A11Y-CA-Team-Accounts": "Accounts",
    "A11Y-CA-Team-Browse": "Browse Pages",
    "A11Y-CA-Team-Cart": "Cart Page",
    "A11Y-CA-Team-Category": "Category Pages",
    "A11Y-CA-Team-Checkout": "Checkout Page",
    "A11Y-CA-Team-Help-Center": "Help Center Pages",
    "A11Y-CA-Team-Homepage": "Homepage",
    "A11Y-CA-Team-Item-Page": "Item Pages",
    "A11Y-CA-Team-Lists-Wishlist": "List & Wishlist Pages",
    "A11Y-CA-Team-Pharmacy": "Pharmacy Pages",
    "A11Y-CA-Team-Registry": "Registry",
    "A11Y-CA-Team-Item-Reviews": "Item Reviews (UGC)",
    "A11Y-CA-Team-Search": "Search",
    "A11Y-CA-Team-Services": "Services",
    "A11Y-CA-Team-Store-Locator": "Store Locator Pages",
    "A11Y-CA-Team-Thank-You": "Thank You Page",
    "A11Y-CA-Team-Vision-Center": "Vision Center Pages",
    "A11Y-CA-Team-Delivery-Pass": "Walmart Delivery Pass",
    "A11Y-CA-Team-My-Items": "My Items",
    "A11Y-CA-Team-Payments-Wallet": "Payments/Wallet",
    "A11Y-CA-Team-Subscriptions": "Subscriptions",
    "A11Y-CA-Team-Shop": "Shop",
    "A11Y-CA-Team-Protection-Plans": "Protection Plans",
    "A11Y-CA-Team-Order-Details": "Order Details",
    "A11Y-CA-Team-All-Departments": "All Departments",
    "A11Y-CA-Team-PAC": "Added to Cart (PAC)",
    "A11Y-CA-Team-GIC": "Global Intent Center (GIC)",
    "A11Y-CA-Team-Address": "Address",
    "A11Y-CA-Team-Bookslot": "Bookslot",
    "A11Y-CA-Team-Store": "Store",
    "A11Y-CA-Team-Pickup-checkin": "Pick Up-Checkin",
    "A11Y-CA-Team-P13N": "Personalization (P13n)",
    "A11Y-CA-Team-Amends": "Amends",
    "A11Y-CA-Team-Substitutes": "Substitutes",
    "A11Y-CA-Team-Live-Order-Tracking": "Live Order Tracking",
    "A11Y-CA-Team-Review-Order-CSAT": "Review Order (CSAT)",
    "A11Y-CA-Team-Purchase-History": "Purchase History",
    "A11Y-CA-Team-Returns": "Returns",
    "A11Y-CA-Team-Privacy-Center": "Privacy Center",
    "A11Y-CA-Team-Cancel-Order": "Cancel Order",
    "A11Y-CA-Team-Global-Nav": "Global Nav (Header & Footer)"
  },

  // ============================================================================
  // MAPPING OBJECTS
  // ============================================================================
  wcagMap: {
    "Missing-WCAG": "NOT-WCAG",
    "WCAG-1.1.1": "A", "WCAG-1.2.1": "A", "WCAG-1.2.2": "A", "WCAG-1.2.3": "A",
    "WCAG-1.2.4": "AA", "WCAG-1.2.5": "AA", "WCAG-1.2.6": "AAA", "WCAG-1.2.7": "AAA",
    "WCAG-1.2.8": "AAA", "WCAG-1.2.9": "AAA", "WCAG-1.3.1": "A", "WCAG-1.3.2": "A",
    "WCAG-1.3.3": "A", "WCAG-1.3.4": "AA", "WCAG-1.3.5": "AA", "WCAG-1.3.6": "AAA",
    "WCAG-1.4.1": "A", "WCAG-1.4.2": "A", "WCAG-1.4.3": "AA", "WCAG-1.4.4": "AA",
    "WCAG-1.4.5": "AA", "WCAG-1.4.6": "AAA", "WCAG-1.4.7": "AAA", "WCAG-1.4.8": "AAA",
    "WCAG-1.4.9": "AAA", "WCAG-1.4.10": "AA", "WCAG-1.4.11": "AA", "WCAG-1.4.12": "AA",
    "WCAG-1.4.13": "AA", "WCAG-2.1.1": "A", "WCAG-2.1.2": "A", "WCAG-2.1.3": "A",
    "WCAG-2.1.4": "A", "WCAG-2.2.1": "A", "WCAG-2.2.2": "A", "WCAG-2.2.3": "AAA",
    "WCAG-2.2.4": "AAA", "WCAG-2.2.5": "AAA", "WCAG-2.2.6": "AAA", "WCAG-2.3.1": "A",
    "WCAG-2.3.2": "AAA", "WCAG-2.3.3": "AAA", "WCAG-2.4.1": "A", "WCAG-2.4.2": "A",
    "WCAG-2.4.3": "A", "WCAG-2.4.4": "A", "WCAG-2.4.5": "AA", "WCAG-2.4.6": "AA",
    "WCAG-2.4.7": "AA", "WCAG-2.4.8": "AAA", "WCAG-2.4.9": "AAA", "WCAG-2.4.10": "AAA",
    "WCAG-2.4.11": "AA", "WCAG-2.4.12": "AA", "WCAG-2.4.13": "AA", "WCAG-2.5.1": "A",
    "WCAG-2.5.2": "A", "WCAG-2.5.3": "A", "WCAG-2.5.4": "A", "WCAG-2.5.5": "AAA",
    "WCAG-2.5.6": "AAA", "WCAG-2.5.7": "AA", "WCAG-2.5.8": "AA", "WCAG-3.1.1": "A",
    "WCAG-3.1.2": "AA", "WCAG-3.1.3": "AAA", "WCAG-3.1.4": "AAA", "WCAG-3.1.5": "AAA",
    "WCAG-3.1.6": "AAA", "WCAG-3.2.1": "A", "WCAG-3.2.2": "A", "WCAG-3.2.3": "AA",
    "WCAG-3.2.4": "AA", "WCAG-3.2.5": "AAA", "WCAG-3.2.6": "A", "WCAG-3.3.1": "A",
    "WCAG-3.3.2": "A", "WCAG-3.3.3": "AA", "WCAG-3.3.4": "AA", "WCAG-3.3.5": "AAA",
    "WCAG-3.3.6": "AAA", "WCAG-3.3.7": "AA", "WCAG-3.3.8": "AAA", "WCAG-3.3.9": "AAA",
    "WCAG-4.1.2": "A", "WCAG-4.1.3": "AA"
  },

  architectureMap: {
    "A11Y-US-Team-Accounts":  "A11Y-US-Area-Accounts",
    "A11Y-US-Team-PAC":  "A11Y-US-Area-Transaction",
    "A11Y-US-Team-Address":  "A11Y-US-Area-Fulfillment",
    "A11Y-US-Team-All-Departments":  "A11Y-US-Area-Discovery",
    "A11Y-US-Team-Amends":  "A11Y-US-Area-Post-Transaction",
    "A11Y-US-Team-ACC":  "A11Y-US-Area-Omni-Services",
    "A11Y-US-Team-Bookslot":  "A11Y-US-Area-Fulfillment",
    "A11Y-US-Team-Brand":  "A11Y-US-Area-Discovery",
    "A11Y-US-Team-Browse":  "A11Y-US-Area-Discovery",
    "A11Y-US-Team-Cancel-Order":  "A11Y-US-Area-Post-Transaction",
    "A11Y-US-Team-Cart":  "A11Y-US-Area-Transaction",
    "A11Y-US-Team-Category":  "A11Y-US-Area-Discovery",
    "A11Y-US-Team-Charge-History":  "A11Y-US-Area-Post-Transaction",
    "A11Y-US-Team-Chat":  "A11Y-US-Area-Customer-Care",
    "A11Y-US-Team-Checkout":  "A11Y-US-Area-Transaction",
    "A11Y-US-Team-Custom-Cakes":  "A11Y-US-Area-Omni-Services",
    "A11Y-US-Team-Digital-Store-Receipts":  "A11Y-US-Area-Post-Transaction",
    "A11Y-US-Team-Evergreen":  "A11Y-US-Area-Fulfillment",
    "A11Y-US-Team-GIC":  "A11Y-US-Area-Fulfillment",
    "A11Y-US-Team-Global-Nav":  "A11Y-US-Area-Discovery",
    "A11Y-US-Team-Help-Center":  "A11Y-US-Area-Customer-Care",
    "A11Y-US-Team-Homepage":  "A11Y-US-Area-Discovery",
    "A11Y-US-Team-InHome":  "A11Y-US-Area-Fulfillment",
    "A11Y-US-Team-Insurance-Services":  "A11Y-US-Area-Omni-Services",
    "A11Y-US-Team-Item-Page":  "A11Y-US-Area-Discovery",
    "A11Y-US-Team-Item-Reviews":  "A11Y-US-Area-Discovery",
    "A11Y-US-Team-Lists-Wishlist":  "A11Y-US-Area-Discovery",
    "A11Y-US-Team-Live-Order-Tracking":  "A11Y-US-Area-Post-Transaction",
    "A11Y-US-Team-Local-Marketplace":  "A11Y-US-Area-Marketplace",
    "A11Y-US-Team-My-Items":  "A11Y-US-Area-Discovery",
    "A11Y-US-Team-Order-Details":  "A11Y-US-Area-Post-Transaction",
    "A11Y-US-Team-Payments-Wallet":  "A11Y-US-Area-Transaction",
    "A11Y-US-Team-P13N":  "A11Y-US-Area-P13N",
    "A11Y-US-Team-PetRX":  "A11Y-US-Area-Omni-Services",
    "A11Y-US-Team-Pharmacy":  "A11Y-US-Area-Omni-Services",
    "A11Y-US-Team-Photo-Services":  "A11Y-US-Area-Omni-Services",
    "A11Y-US-Team-Pickup-checkin":  "A11Y-US-Area-Fulfillment",
    "A11Y-US-Team-Privacy-Center":  "A11Y-US-Area-Data-Reporting-Finance-Accounting",
    "A11Y-US-Team-Protection-Plans":  "A11Y-US-Area-Omni-Services",
    "A11Y-US-Team-Purchase-History":  "A11Y-US-Area-Post-Transaction",
    "A11Y-US-Team-Recipe":  "A11Y-US-Area-Discovery",
    "A11Y-US-Team-Registry":  "A11Y-US-Area-Discovery",
    "A11Y-US-Team-Returns":  "A11Y-US-Area-Post-Transaction",
    "A11Y-US-Team-Review-Order-CSAT":  "A11Y-US-Area-Post-Transaction",
    "A11Y-US-Team-Savings":  "A11Y-US-Area-Accounts",
    "A11Y-US-Team-Search":  "A11Y-US-Area-Discovery",
    "A11Y-US-Team-Seller-Overview":  "A11Y-US-Area-Marketplace",
    "A11Y-US-Team-Services":  "A11Y-US-Area-Omni-Services",
    "A11Y-US-Team-Shop":  "A11Y-US-Area-Discovery",
    "A11Y-US-Team-Shoppable-lists":  "A11Y-US-Area-Discovery",
    "A11Y-US-Team-Social-Commerce":  "A11Y-US-Area-Social-Commerce",
    "A11Y-US-Team-Spark-Good":  "A11Y-US-Area-Uncategorized",
    "A11Y-US-Team-Sparky":  "A11Y-US-Area-Sparky",
    "A11Y-US-Team-Store":  "A11Y-US-Area-Fulfillment",
    "A11Y-US-Team-Store-Directory":  "A11Y-US-Area-Uncategorized",
    "A11Y-US-Team-Store-Locator":  "A11Y-US-Area-Uncategorized",
    "A11Y-US-Team-Store-Mode":  "A11Y-US-Area-Omni-Services",
    "A11Y-US-Team-Store-WiFi":  "A11Y-US-Area-Uncategorized",
    "A11Y-US-Team-Subscriptions":  "A11Y-US-Area-Subscriptions",
    "A11Y-US-Team-Substitutes":  "A11Y-US-Area-Post-Transaction",
    "A11Y-US-Team-Thank-You":  "A11Y-US-Area-Post-Transaction",
    "A11Y-US-Team-Uncategorized-Architecture":  "A11Y-US-Area-Uncategorized",
    "A11Y-US-Team-Vision-Center":  "A11Y-US-Area-Omni-Services",
    "A11Y-US-Team-Walmart-Cash":  "A11Y-US-Area-WPlus",
    "A11Y-US-Team-Walmart-Live":  "A11Y-US-Area-Discovery",
    "A11Y-US-Team-WPlus-Benefits":  "A11Y-US-Area-WPlus",
    "A11Y-US-Team-WPlus-Lifecycle":  "A11Y-US-Area-WPlus",
    "A11Y-US-Team-WPlus-Management":  "A11Y-US-Area-WPlus",
    "A11Y-US-Team-Wireless":  "A11Y-US-Area-Omni-Services",
    "A11Y-US-Team-WM-Contacts":  "A11Y-US-Area-WM-Contacts",

    
    // CA Team → Area mappings
    "A11Y-CA-Team-Uncategorized-Architecture": "A11Y-CA-Area-Uncategorized",
    "A11Y-CA-Team-Accounts": "A11Y-CA-Area-Accounts",
    "A11Y-CA-Team-Browse": "A11Y-CA-Area-Discovery",
    "A11Y-CA-Team-Cart": "A11Y-CA-Area-Transaction",
    "A11Y-CA-Team-Category": "A11Y-CA-Area-Discovery",
    "A11Y-CA-Team-Checkout": "A11Y-CA-Area-Transaction",
    "A11Y-CA-Team-Homepage": "A11Y-CA-Area-Discovery",
    "A11Y-CA-Team-Help-Center":  "A11Y-US-Area-Customer-Care",
    "A11Y-CA-Team-Item-Page": "A11Y-CA-Area-Discovery",
    "A11Y-CA-Team-Lists-Wishlist": "A11Y-CA-Area-Discovery",
    "A11Y-CA-Team-Pharmacy": "A11Y-CA-Area-Omni-Services",
    "A11Y-CA-Team-Registry": "A11Y-CA-Area-Discovery",
    "A11Y-CA-Team-Item-Reviews": "A11Y-CA-Area-Discovery",
    "A11Y-CA-Team-Search": "A11Y-CA-Area-Discovery",
    "A11Y-CA-Team-Services": "A11Y-CA-Area-Omni-Services",
    "A11Y-CA-Team-Store-Locator": "A11Y-CA-Area-Uncategorized",
    "A11Y-CA-Team-Thank-You": "A11Y-CA-Area-Post-Transaction",
    "A11Y-CA-Team-Vision-Center": "A11Y-CA-Area-Omni-Services",
    "A11Y-CA-Team-Delivery-Pass": "A11Y-CA-Area-Delivery-Pass",
    "A11Y-CA-Team-My-Items": "A11Y-CA-Area-Discovery",
    "A11Y-CA-Team-Payments-Wallet": "A11Y-CA-Area-Transaction",
    "A11Y-CA-Team-Subscriptions": "A11Y-CA-Area-Subscriptions",
    "A11Y-CA-Team-Shop": "A11Y-CA-Area-Discovery",
    "A11Y-CA-Team-Protection-Plans": "A11Y-CA-Area-Omni-Services",
    "A11Y-CA-Team-Order-Details": "A11Y-CA-Area-Post-Transaction",
    "A11Y-CA-Team-All-Departments": "A11Y-CA-Area-Discovery",
    "A11Y-CA-Team-PAC": "A11Y-CA-Area-Transaction",
    "A11Y-CA-Team-GIC": "A11Y-CA-Area-Fulfillment",
    "A11Y-CA-Team-Address": "A11Y-CA-Area-Fulfillment",
    "A11Y-CA-Team-Bookslot": "A11Y-CA-Area-Fulfillment",
    "A11Y-CA-Team-Store": "A11Y-CA-Area-Fulfillment",
    "A11Y-CA-Team-Pickup-checkin": "A11Y-CA-Area-Fulfillment",
    "A11Y-CA-Team-P13N": "A11Y-CA-Area-P13N",
    "A11Y-CA-Team-Amends": "A11Y-CA-Area-Post-Transaction",
    "A11Y-CA-Team-Substitutes": "A11Y-CA-Area-Post-Transaction",
    "A11Y-CA-Team-Live-Order-Tracking": "A11Y-CA-Area-Post-Transaction",
    "A11Y-CA-Team-Review-Order-CSAT": "A11Y-CA-Area-Post-Transaction",
    "A11Y-CA-Team-Purchase-History": "A11Y-CA-Area-Post-Transaction",
    "A11Y-CA-Team-Returns": "A11Y-CA-Area-Post-Transaction",
    "A11Y-CA-Team-Privacy-Center": "A11Y-CA-Area-Data-Reporting-Finance-Accounting",
    "A11Y-CA-Team-Cancel-Order": "A11Y-CA-Area-Post-Transaction",
    "A11Y-CA-Team-Global-Nav": "A11Y-CA-Area-Discovery"
  },

  // ============================================================================
  // COMPONENT MAPS - Design System Components
  // ============================================================================

  // LD Components → A11Y-Design-System-LD
  ldComponentMap: {
    "A11Y-Component-LD-Uncategorized": "A11Y-Design-System-LD",
    "A11Y-Component-LD-Alert": "A11Y-Design-System-LD",
    "A11Y-Component-LD-Badge": "A11Y-Design-System-LD",
    "A11Y-Component-LD-Banner": "A11Y-Design-System-LD",
    "A11Y-Component-LD-Bottom-Sheet": "A11Y-Design-System-LD",
    "A11Y-Component-LD-Breadcrumb": "A11Y-Design-System-LD",
    "A11Y-Component-LD-Button": "A11Y-Design-System-LD",
    "A11Y-Component-LD-Button-Group": "A11Y-Design-System-LD",
    "A11Y-Component-LD-Callout": "A11Y-Design-System-LD",
    "A11Y-Component-LD-Card": "A11Y-Design-System-LD",
    "A11Y-Component-LD-Checkbox": "A11Y-Design-System-LD",
    "A11Y-Component-LD-Chip": "A11Y-Design-System-LD",
    "A11Y-Component-LD-Chip-Group": "A11Y-Design-System-LD",
    "A11Y-Component-LD-Data-Table": "A11Y-Design-System-LD",
    "A11Y-Component-LD-Date-Field": "A11Y-Design-System-LD",
    "A11Y-Component-LD-Date-Picker": "A11Y-Design-System-LD",
    "A11Y-Component-LD-Date-Range-Field": "A11Y-Design-System-LD",
    "A11Y-Component-LD-Date-Range-Picker": "A11Y-Design-System-LD",
    "A11Y-Component-LD-Divider": "A11Y-Design-System-LD",
    "A11Y-Component-LD-Error-Message": "A11Y-Design-System-LD",
    "A11Y-Component-LD-Form-Group": "A11Y-Design-System-LD",
    "A11Y-Component-LD-Icon-Button": "A11Y-Design-System-LD",
    "A11Y-Component-LD-Link": "A11Y-Design-System-LD",
    "A11Y-Component-LD-Link-Button": "A11Y-Design-System-LD",
    "A11Y-Component-LD-List": "A11Y-Design-System-LD",
    "A11Y-Component-LD-Menu": "A11Y-Design-System-LD",
    "A11Y-Component-LD-Metric": "A11Y-Design-System-LD",
    "A11Y-Component-LD-Modal": "A11Y-Design-System-LD",
    "A11Y-Component-LD-Nudge": "A11Y-Design-System-LD",
    "A11Y-Component-LD-Panel": "A11Y-Design-System-LD",
    "A11Y-Component-LD-Popover": "A11Y-Design-System-LD",
    "A11Y-Component-LD-Progress-Indicator": "A11Y-Design-System-LD",
    "A11Y-Component-LD-Progress-Tracker": "A11Y-Design-System-LD",
    "A11Y-Component-LD-Radio": "A11Y-Design-System-LD",
    "A11Y-Component-LD-Rating": "A11Y-Design-System-LD",
    "A11Y-Component-LD-Select": "A11Y-Design-System-LD",
    "A11Y-Component-LD-Side-Navigation": "A11Y-Design-System-LD",
    "A11Y-Component-LD-Skeleton": "A11Y-Design-System-LD",
    "A11Y-Component-LD-Snackbar": "A11Y-Design-System-LD",
    "A11Y-Component-LD-Spinner": "A11Y-Design-System-LD",
    "A11Y-Component-LD-Spot-Icon": "A11Y-Design-System-LD",
    "A11Y-Component-LD-Styled-Text": "A11Y-Design-System-LD",
    "A11Y-Component-LD-Switch": "A11Y-Design-System-LD",
    "A11Y-Component-LD-Tab-Navigation": "A11Y-Design-System-LD",
    "A11Y-Component-LD-Tag": "A11Y-Design-System-LD",
    "A11Y-Component-LD-Text-Area": "A11Y-Design-System-LD",
    "A11Y-Component-LD-Text-Field": "A11Y-Design-System-LD",
    "A11Y-Component-LD-Wizard": "A11Y-Design-System-LD"
  },

  // WCP Components → A11Y-Design-System-WCP (abbreviated for space)
  wcpComponentMap: {
    "A11Y-Component-WCP-Uncategorized": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Accordion": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Action-Tiles": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Add-to-Cart-Button": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Amend-Banner": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-App-Bottom-Navigation": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Ar-Experience": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Avatar-button": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Avatar-dynamic": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Avatar-image": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Avatar-initials": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Basic-Banner": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Bottom-sheet": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Button-Group": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Button-Primary-Alt": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Buy-Now-Button": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Camera-View": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Card-multi-action": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Card-Single-action": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Carousel-Pagination": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Carousel-dynamic": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Chat-Bottom-Sheet": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Chat-Full-Page-Modal": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Chat-Header": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Chat-Header-collapsed": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Chat-Input-Field": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Chat-Response": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Chat-Response-loading": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Collapse-Text": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Comparison-Chart": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Country-code-select-combo-box": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Country-Flag-Icons": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Country-Select": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Customer-feedback": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Data-Table": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Divider-(Vertical)": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Edit-Image-Bottom-Sheet": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Error-Message": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-FAB": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Feedback": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Feedback-Module": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Feedback-View": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Filter-Chip": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Flag": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Floating-Button": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Footer-Link-Button": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Footer-Web": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Form-Group": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Fulfillment-Badge-View": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Full-page-Loading": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Generic-Spinner": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Global-Navigation": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Header": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Heart-View": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Highlight": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Hyperlink": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Icon-Text-component": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Icon-button": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Icon-Selector-large": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Icon-Selector-small": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Icons": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Image-Uploader": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Interactive-Rating": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Item-Tile": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Jumbo-Selectors": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Keyhole-Reveal-View": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Landing-Cards": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Large-List-Product-Tile-View": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Link": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Loading-Animation-Placeholder": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Loading-Overlay": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Mosaic": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Mosaic/Unique": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Native-Components": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Nudge": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Order-Status-Wizard": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Paging-Footer-View": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Panel": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Product-Carousel-Footer-View": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Product-Carousel-Header-View": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Product-Carousel-Recycler-View": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Product-Carousel-View": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Product-Item-List": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Product-List-Item-quantity": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Product-List-item-select": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Product-List-Item-single-select": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Progress-Button": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Promotional-View": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-QTY-Stepper-teritary": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Quantity-Stepper": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Queue-Banner": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Queue-Landing": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Queue-Product-Cards": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Radio-Button-Group": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Rating": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Reticle-View": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Rewards-View": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Rich-Media-Sheet": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Scroll-Button": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Scrollbar": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Search-Bar": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Sectioned-Product-Grid-View": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Segmented-Control": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Seller-Info-View": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Shimmer": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Shimmer-Layout": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Signature-Capture": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Signature-Capture-Delegate": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Simple-Dialogue": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Slide-Indicator-View": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Snackbar": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Spinner": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Sponsored-Container-View": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Suggestion-Button": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Swatch": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Text-Field": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Text-Patterns": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Thumbs-Up-Down-View": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Timeline": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Timer-View": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Tokens": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-User-Response": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-User-Response-image": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Variant-Image-Swatch-Indicator-View": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Video-View": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Waiting-Room-View": "A11Y-Design-System-WCP",
    "A11Y-Component-WCP-Wrapping-Seller-Text-View": "A11Y-Design-System-WCP"
  },

  // Other Component Maps (abbreviated)
  cxComponentMap: {
    "A11Y-Component-CX-Uncategorized": "A11Y-Design-System-CX",
    "A11Y-Component-CX-Button": "A11Y-Design-System-CX"
  },

  axComponentMap: {
    "A11Y-Component-AX-Uncategorized"             : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Accordion"                 : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Action-Container"          : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Action-Footer"             : "A11Y-Design-System-AX",
    "A11Y-Component-AX-App-Header"                : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Attribute"                 : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Avatar"                    : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Bottom-Nav"                : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Bottom-Sheet-Date-Picker"  : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Bottom-Sheet-Starter"      : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Breadcrumbs"               : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Button-Group"              : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Card-Item"                 : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Card-Starter"              : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Checkbox"                  : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Chip-Group-Single-Select"  : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Clock-Status"              : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Date-Picker"               : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Disclosure"                : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Divider"                   : "A11Y-Design-System-AX",
    "A11Y-Component-AX-FAB"                       : "A11Y-Design-System-AX",
    "A11Y-Component-AX-File-Upload"               : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Filter-Group"              : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Filter-Toggle"             : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Filter-Trigger-Single"     : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Filters-Bottom-Sheet"      : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Guage"                     : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Header-Group"              : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Header-Page"               : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Icon-Wrapper"              : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Input-Selectors"           : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Insight"                   : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Item-Info"                 : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Logo-Mark"                 : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Menu"                      : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Menu-Option-Card"          : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Metric-Group"              : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Metrics"                   : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Native-Date-Picker"        : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Navigation-Side-Bar"       : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Page-Pagination"           : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Popover"                   : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Progress-Bar"              : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Progress-Tracker"          : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Progress-Tracker-Orders"   : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Pull-To-Refresh"           : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Push-Notifications"        : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Quantity-Stepper"          : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Radio-Button"              : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Scan-Screen-Recipe"        : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Search"                    : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Section-Header"            : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Select"                    : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Selection-Banner"          : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Selector"                  : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Sidebar-Menu"              : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Skeleton-Text"             : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Snackbar"                  : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Sorting-Button"            : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Spinner-Overlay"           : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Spot-Icon"                 : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Switch-List"               : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Switch-Small"              : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Tag-Input"                 : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Text-Field"                : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Text-Patterns"             : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Tip"                       : "A11Y-Design-System-AX",
    "A11Y-Component-AX-Wizard-Footer"             : "A11Y-Design-System-AX"
  },

  pxComponentMap: {
    "A11Y-Component-PX-Uncategorized"                 : "A11Y-Design-System-PX",
    "A11Y-Component-PX-Accordion-Large"               : "A11Y-Design-System-PX",
    "A11Y-Component-PX-Accordion-Small"               : "A11Y-Design-System-PX",
    "A11Y-Component-PX-Action-Button-Group-Compact"   : "A11Y-Design-System-PX",
    "A11Y-Component-PX-Alert-Group"                   : "A11Y-Design-System-PX",
    "A11Y-Component-PX-Bulk-Action-Bar"               : "A11Y-Design-System-PX",
    "A11Y-Component-PX-Card"                          : "A11Y-Design-System-PX",
    "A11Y-Component-PX-Card-About"                    : "A11Y-Design-System-PX",
    "A11Y-Component-PX-Card-Accordion"                 : "A11Y-Design-System-PX",
    "A11Y-Component-PX-Card-Accordion-List"           : "A11Y-Design-System-PX",
    "A11Y-Component-PX-Card-Contact-Block"            : "A11Y-Design-System-PX",
    "A11Y-Component-PX-Card-Item-Horizontal"          : "A11Y-Design-System-PX",
    "A11Y-Component-PX-Card-Item-Vertical"            : "A11Y-Design-System-PX",
    "A11Y-Component-PX-Card-List"                     : "A11Y-Design-System-PX",
    "A11Y-Component-PX-Card-Metric-Large"             : "A11Y-Design-System-PX",
    "A11Y-Component-PX-Card-Metric-Small"             : "A11Y-Design-System-PX",
    "A11Y-Component-PX-Card-Promo"                    : "A11Y-Design-System-PX",
    "A11Y-Component-PX-Card-Promo-03"                 : "A11Y-Design-System-PX",
    "A11Y-Component-PX-Card-Settings"                 : "A11Y-Design-System-PX",
    "A11Y-Component-PX-Card-Status"                   : "A11Y-Design-System-PX",
    "A11Y-Component-PX-Card-Todo"                     : "A11Y-Design-System-PX",
    "A11Y-Component-PX-Card-Todo-Group"               : "A11Y-Design-System-PX",
    "A11Y-Component-PX-Chip-Group-Multi-Select"       : "A11Y-Design-System-PX",
    "A11Y-Component-PX-Column-Preference-Panel"       : "A11Y-Design-System-PX",
    "A11Y-Component-PX-Contextual-Save-Bar"           : "A11Y-Design-System-PX",
    "A11Y-Component-PX-Data-Ribbon"                   : "A11Y-Design-System-PX",
    "A11Y-Component-PX-Data-Table"                    : "A11Y-Design-System-PX",
    "A11Y-Component-PX-Data-Viz"                      : "A11Y-Design-System-PX",
    "A11Y-Component-PX-Date-Picker"                   : "A11Y-Design-System-PX",
    "A11Y-Component-PX-Divider"                       : "A11Y-Design-System-PX",
    "A11Y-Component-PX-Downloader"                    : "A11Y-Design-System-PX",
    "A11Y-Component-PX-File-Upload"                   : "A11Y-Design-System-PX",
    "A11Y-Component-PX-Filter-Button"                 : "A11Y-Design-System-PX",
    "A11Y-Component-PX-Filter-Button-Applied-Tag"     : "A11Y-Design-System-PX",
    "A11Y-Component-PX-Filter-Button-Applied-Tag-Group": "A11Y-Design-System-PX",
    "A11Y-Component-PX-Filter-Button-Group"           : "A11Y-Design-System-PX",
    "A11Y-Component-PX-Filter-Button-Switch"          : "A11Y-Design-System-PX",
    "A11Y-Component-PX-Filter-Panel"                  : "A11Y-Design-System-PX",
    "A11Y-Component-PX-Form-Group"                    : "A11Y-Design-System-PX",
    "A11Y-Component-PX-Icon-Button-Selector"          : "A11Y-Design-System-PX",
    "A11Y-Component-PX-Inbox-Element"                 : "A11Y-Design-System-PX",
    "A11Y-Component-PX-Mega-Nav"                      : "A11Y-Design-System-PX",
    "A11Y-Component-PX-Modal"                         : "A11Y-Design-System-PX",
    "A11Y-Component-PX-Sidenav-Seller-Center"         : "A11Y-Design-System-PX",
    "A11Y-Component-PX-Tool-Tip"                      : "A11Y-Design-System-PX",
    "A11Y-Component-PX-Wizard-Footer"                 : "A11Y-Design-System-PX"    
  },

  sharedComponentMap: {
    "A11Y-Component-Shared-Uncategorized": "A11Y-Design-System-Shared",
    "A11Y-Component-Shared-Button": "A11Y-Design-System-Shared"
  },

  platformComponentMap: {
    "A11Y-Component-Platform-Uncategorized": "A11Y-Design-System-Platform",
    "A11Y-Component-Platform-Button": "A11Y-Design-System-Platform"
  },

  tempoComponentMap: {
    "A11Y-Component-Tempo-Uncategorized": "A11Y-Design-System-Tempo",
    "A11Y-Component-Tempo-Button": "A11Y-Design-System-Tempo"
  },

  
  // ============================================================================
  // TEAM VALIDATION CONFIGURATIONS
  // ============================================================================
  teamValidationConfigs: [
    {
      location: "Walmart.com",
      teamLabel: "US Team",
      areaLabel: "US Area", 
      teamAllowedValues: "parentCapabilityArchitectureUS" // Reference to allowedValues key
    },
    {
      location: "Walmart.ca", 
      teamLabel: "CA Team",
      areaLabel: "CA Area",
      teamAllowedValues: "parentCapabilityArchitectureCA" // Reference to allowedValues key
    }
    // Future locations can be easily added here:
    // {
    //   location: "Walmart.com.mx",
    //   teamLabel: "MX Team", 
    //   areaLabel: "MX Area",
    //   teamAllowedValues: "parentCapabilityArchitectureMX"
    // }
  ],

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================
  getTeamNamesWithoutSuffix: function() {
    return this.allowedValues.bugTeam.map(t => t.replace(/\s*Team$/, ""));
  },

  getWcagLevelForCriterion: function(criterion) {
    return this.wcagMap[criterion] || null;
  },

  getAreaForParentCapability: function(parentCapability) {
    return this.architectureMap[parentCapability] || null;
  },

  // Combined component map for easy access to all components
  getCombinedComponentMap: function() {
    return {
      ...this.ldComponentMap,
      ...this.wcpComponentMap,
      ...this.cxComponentMap,
      ...this.axComponentMap,
      ...this.pxComponentMap,
      ...this.sharedComponentMap,
      ...this.platformComponentMap,
      ...this.tempoComponentMap
    };
  },

  getAllComponentKeys: function() {
    return Object.keys(this.getCombinedComponentMap());
  },

  getAllComponentAreas: function() {
    return Array.from(new Set(Object.values(this.getCombinedComponentMap())));
  }
};

console.log('✅ Global validation configuration loaded successfully!');
console.log('🔧 Access via: window.A11Y_VALIDATION_CONFIG');

// For backward compatibility, also create shortcuts
window.allowedValues = window.A11Y_VALIDATION_CONFIG.allowedValues;
window.wcagMap = window.A11Y_VALIDATION_CONFIG.wcagMap;
window.architectureMap = window.A11Y_VALIDATION_CONFIG.architectureMap;
window.parentCapabilityPretty = window.A11Y_VALIDATION_CONFIG.parentCapabilityPretty;

// Component maps
window.ldComponentMap = window.A11Y_VALIDATION_CONFIG.ldComponentMap;
window.wcpComponentMap = window.A11Y_VALIDATION_CONFIG.wcpComponentMap;
window.cxComponentMap = window.A11Y_VALIDATION_CONFIG.cxComponentMap;
window.axComponentMap = window.A11Y_VALIDATION_CONFIG.axComponentMap;
window.pxComponentMap = window.A11Y_VALIDATION_CONFIG.pxComponentMap;
window.sharedComponentMap = window.A11Y_VALIDATION_CONFIG.sharedComponentMap;
window.platformComponentMap = window.A11Y_VALIDATION_CONFIG.platformComponentMap;
window.tempoComponentMap = window.A11Y_VALIDATION_CONFIG.tempoComponentMap;

// Combined maps
window.componentMap = window.A11Y_VALIDATION_CONFIG.getCombinedComponentMap();
window.allComponentKeys = window.A11Y_VALIDATION_CONFIG.getAllComponentKeys();
window.allComponentAreas = window.A11Y_VALIDATION_CONFIG.getAllComponentAreas();

// Team validation shortcuts
window.teamValidationConfigs = window.A11Y_VALIDATION_CONFIG.teamValidationConfigs;