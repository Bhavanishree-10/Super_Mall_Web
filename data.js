// File: js/data.js

export const SHOP_CONFIG = [
    // --- TECH (5) ---
    { name: "Apple Store", cat: "tech", icon: "fa-mobile-alt" },
    { name: "Samsung Experience", cat: "tech", icon: "fa-microchip" },
    { name: "Sony Center", cat: "tech", icon: "fa-gamepad" },
    { name: "Bose Audio", cat: "tech", icon: "fa-headphones" },
    { name: "Croma", cat: "tech", icon: "fa-plug" },

    // --- FASHION (8) ---
    { name: "Zara", cat: "fashion", icon: "fa-tshirt" },
    { name: "H&M", cat: "fashion", icon: "fa-layer-group" },
    { name: "Levi's", cat: "fashion", icon: "fa-user-astronaut" },
    { name: "Nike", cat: "fashion", icon: "fa-shoe-prints" },
    { name: "Adidas", cat: "fashion", icon: "fa-running" },
    { name: "Puma", cat: "fashion", icon: "fa-cat" },          // Added
    { name: "FabIndia", cat: "fashion", icon: "fa-feather-alt" }, // Added
    { name: "Manyavar", cat: "fashion", icon: "fa-user-tie" },    // Added

    // --- LUXURY (4) ---
    { name: "Rolex Boutique", cat: "luxury", icon: "fa-clock" },
    { name: "Gucci", cat: "luxury", icon: "fa-shopping-bag" },
    { name: "Louis Vuitton", cat: "luxury", icon: "fa-suitcase" }, // Added
    { name: "Titan World", cat: "luxury", icon: "fa-stopwatch" },  // Added

    // --- FOOD (6) ---
    { name: "KFC", cat: "food", icon: "fa-drumstick-bite" },
    { name: "McDonald's", cat: "food", icon: "fa-hamburger" },
    { name: "Starbucks", cat: "food", icon: "fa-coffee" },
    { name: "Domino's Pizza", cat: "food", icon: "fa-pizza-slice" }, // Added
    { name: "Taco Bell", cat: "food", icon: "fa-pepper-hot" },       // Added
    { name: "Baskin Robbins", cat: "food", icon: "fa-ice-cream" },   // Added

    // --- OTHERS (2) ---
    { name: "IKEA Studio", cat: "home", icon: "fa-couch" },
    { name: "Hamleys", cat: "kids", icon: "fa-shapes" }
];

const TEMPLATES = {
    tech: ["Pro Smartphone", "Ultra Tablet", "Wireless Buds", "Smart Watch 5", "Gaming Laptop", "4K Monitor", "PowerBank", "Smart Speaker"],
    fashion: ["Slim Fit Shirt", "Denim Jacket", "Chino Pants", "Cotton T-Shirt", "Polo Shirt", "Formal Blazer", "Sneakers", "Hoodie"],
    luxury: ["Gold Watch", "Diamond Ring", "Leather Handbag", "Silk Tie", "Designer Belt", "Perfume", "Sunglasses"],
    food: ["Combo Meal", "Large Burger", "Cheese Pizza", "Spicy Wings", "French Fries", "Cold Coffee", "Ice Cream Sundae"],
    home: ["Sofa 2-Seater", "Dining Table", "Office Chair", "Desk Lamp", "Bookshelf", "Carpet"],
    kids: ["Teddy Bear", "Lego Set", "Remote Car", "Doll House", "Puzzle 3D", "Action Figure"]
};

// Generate Data Logic
export let FULL_DATA = {};
export let ALL_PRODUCTS = []; 

SHOP_CONFIG.forEach(shop => {
    let products = [];
    let baseList = TEMPLATES[shop.cat] || TEMPLATES.fashion;
    
    // Randomize product count (between 25 and 35 items per shop)
    let count = Math.floor(Math.random() * 10) + 25; 
    
    for(let i=0; i<count; i++) {
        let baseName = baseList[i % baseList.length];
        
        // Determine Price Range based on Category
        let price = 500;
        if(shop.cat === 'luxury') price = 50000 + Math.floor(Math.random() * 150000);
        else if(shop.cat === 'tech') price = 10000 + Math.floor(Math.random() * 80000);
        else if(shop.cat === 'food') price = 150 + Math.floor(Math.random() * 600);
        else price = 800 + Math.floor(Math.random() * 4000); // Fashion/Home

        let prodObj = {
            id: `${shop.name.replace(/\s/g, '')}_${i}`,
            name: `${shop.name} ${baseName}`,
            price: price,
            shop: shop.name
        };
        products.push(prodObj);
        ALL_PRODUCTS.push(prodObj);
    }
    FULL_DATA[shop.name] = { ...shop, products: products };
});