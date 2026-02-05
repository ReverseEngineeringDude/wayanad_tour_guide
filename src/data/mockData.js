// src/data/mockData.js



export const myBookingsData = [
  { id: 1, place: "Edakkal Caves", guideName: "Rahul K.", date: "2026-02-10", status: "confirmed" },
  { id: 2, place: "Banasura Sagar Dam", guideName: "Fatima S.", date: "2026-02-15", status: "pending" },
  { id: 3, place: "Soochipara Waterfalls", guideName: "Arjun M.", date: "2026-01-20", status: "rejected" },
];
// src/data/mockData.js (Append this to the file)

export const guideRequestsData = [
  { 
    id: 1, 
    touristName: "Anjali Menon", 
    place: "Edakkal Caves", 
    date: "2026-02-12", 
    status: "pending",
    contact: "+91 9876543210"
  },
  { 
    id: 2, 
    touristName: "John Smith", 
    place: "Banasura Sagar Dam", 
    date: "2026-02-14", 
    status: "confirmed",
    contact: "+91 9988776655"
  },
  { 
    id: 3, 
    touristName: "David & Family", 
    place: "Soochipara Waterfalls", 
    date: "2026-02-10", 
    status: "rejected",
    contact: "Hidden"
  },
  { 
    id: 4, 
    touristName: "Priya P.", 
    place: "Edakkal Caves", 
    date: "2026-02-18", 
    status: "pending",
    contact: "+91 8877665544"
  }
];
// src/data/mockData.js (Append this)

export const allGuidesData = [
  { id: 101, name: "Rahul K.", email: "rahul@gmail.com", status: "Verified", joined: "2024-01-10" },
  { id: 102, name: "Fatima S.", email: "fatima@gmail.com", status: "Verified", joined: "2024-02-15" },
  { id: 103, name: "Arjun M.", email: "arjun@gmail.com", status: "Pending", joined: "2026-02-01" }, // New guide needing approval
  { id: 104, name: "Suresh P.", email: "suresh@gmail.com", status: "Pending", joined: "2026-02-02" },
];
export const allUsersData = [
  { id: 201, name: "Anjali Menon", email: "anjali@gmail.com", joined: "2024-01-12", bookings: 3, status: "Active" },
  { id: 202, name: "John Smith", email: "john.s@gmail.com", joined: "2024-02-18", bookings: 1, status: "Active" },
  { id: 203, name: "David Miller", email: "david.m@yahoo.com", joined: "2024-03-05", bookings: 0, status: "Inactive" },
  { id: 204, name: "Priya P.", email: "priya@gmail.com", joined: "2024-03-10", bookings: 5, status: "Active" },
];
export const allBookingsData = [
  { id: 301, touristName: "Anjali Menon", guideName: "Rahul K.", place: "Edakkal Caves", date: "2026-02-12", status: "confirmed", amount: "₹800" },
  { id: 302, touristName: "John Smith", guideName: "Fatima S.", place: "Banasura Sagar Dam", date: "2026-02-15", status: "pending", amount: "₹1200" },
  { id: 303, touristName: "David Miller", guideName: "Arjun M.", place: "Soochipara Waterfalls", date: "2026-02-10", status: "rejected", amount: "₹1000" },
  { id: 304, touristName: "Priya P.", guideName: "Rahul K.", place: "Pookode Lake", date: "2026-02-18", status: "confirmed", amount: "₹600" },
  { id: 305, touristName: "Anjali Menon", guideName: "Suresh P.", place: "Chembra Peak", date: "2026-03-01", status: "pending", amount: "₹1500" },
];

export const placesData = [
  {
    id: 1,
    name: "Edakkal Caves",
    description: "A journey into the prehistoric past, these caves feature Stone Age carvings.",
    history: "The Edakkal Caves are believed to be one of the earliest centers of human settlement. Inside the caves, you will find pictorial writings believed to date back to 6000 BC. The caves were discovered by Fred Fawcett, a police official of the Malabar District in 1890.",
    // NEW FIELDS
    ticketPrice: "₹50 / Person",
    openTime: "09:00 AM",
    closeTime: "04:00 PM",
    locationUrl: "https://www.google.com/maps/embed?pb=...", // Add real embed link
    gallery: [
       "https://www.sterlingholidays.com/activities/vythiri/sterling-vythiri-wayanad-edakkal-caves.jpg.imgw.1280.1280.jpeg",
       "https://www.sterlingholidays.com/activities/vythiri/sterling-vythiri-wayanad-edakkal-caves.jpg.imgw.1280.1280.jpeg",
       "https://www.sterlingholidays.com/activities/vythiri/sterling-vythiri-wayanad-edakkal-caves.jpg.imgw.1280.1280.jpeg"
    ],
    image: "https://www.sterlingholidays.com/activities/vythiri/sterling-vythiri-wayanad-edakkal-caves.jpg.imgw.1280.1280.jpeg",
  },
  {
    id: 2,
    name: "Banasura Sagar Dam",
    description: "The largest earth dam in India and the second largest in Asia.",
    history: "Constructed in 1979, the Banasura Sagar Dam supports the Kakkayam Hydroelectric power project. It is named after Banasura, the son of King Mahabali.",
    // NEW FIELDS
    ticketPrice: "₹40 / Person",
    openTime: "08:30 AM",
    closeTime: "05:30 PM",
    locationUrl: "https://www.google.com/maps/embed?pb=...", 
    gallery: [
       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSV3N1GhJgAD4b6QQiMcg3_ze2dA4orWvSPsa_Z8ehrknxRbaxFbbJ3YskLU8jOEWmGQOg&usqp=CAU",
       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSV3N1GhJgAD4b6QQiMcg3_ze2dA4orWvSPsa_Z8ehrknxRbaxFbbJ3YskLU8jOEWmGQOg&usqp=CAU",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSV3N1GhJgAD4b6QQiMcg3_ze2dA4orWvSPsa_Z8ehrknxRbaxFbbJ3YskLU8jOEWmGQOg&usqp=CAU",
         "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSV3N1GhJgAD4b6QQiMcg3_ze2dA4orWvSPsa_Z8ehrknxRbaxFbbJ3YskLU8jOEWmGQOg&usqp=CAU",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSV3N1GhJgAD4b6QQiMcg3_ze2dA4orWvSPsa_Z8ehrknxRbaxFbbJ3YskLU8jOEWmGQOg&usqp=CAU",
           "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSV3N1GhJgAD4b6QQiMcg3_ze2dA4orWvSPsa_Z8ehrknxRbaxFbbJ3YskLU8jOEWmGQOg&usqp=CAU",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSV3N1GhJgAD4b6QQiMcg3_ze2dA4orWvSPsa_Z8ehrknxRbaxFbbJ3YskLU8jOEWmGQOg&usqp=CAU",
    ],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSV3N1GhJgAD4b6QQiMcg3_ze2dA4orWvSPsa_Z8ehrknxRbaxFbbJ3YskLU8jOEWmGQOg&usqp=CAU",
  }
];

export const guidesData = [
  { 
    id: 101, 
    name: "Rahul K.", 
    experience: "5 Years", 
    languages: ["Malayalam", "English"], 
    rate: 800,
    bio: "I grew up near the caves and know every carving by heart. I specialize in historical tours.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600" 
  },
  { 
    id: 102, 
    name: "Fatima S.", 
    experience: "3 Years", 
    languages: ["Malayalam", "Hindi", "English"], 
    rate: 750,
    bio: "Nature enthusiast. I love showing families the best photo spots in Wayanad.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600"
  },
  { 
    id: 103, 
    name: "Arjun M.", 
    experience: "7 Years", 
    languages: ["English", "Arabic"], 
    rate: 1000,
    bio: "Certified eco-tourism guide. I ensure a safe and informative trekking experience.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600"
  },
];
// ... rest of data