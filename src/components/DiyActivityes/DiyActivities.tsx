import { useState, useMemo } from "react";
import { ChevronRight, Play } from "lucide-react";

interface Activity {
  id: number;
  name: string;
  category: string;
  theme: string;
  image: string;
  time: string;
  difficulty: string;
  ageRange: string;
  description: string;
  materials: string[];
  steps: string[];
  image_url: string;
  video: string;
  rating: number;
  reviews: number;
}

interface Theme {
  id: string;
  label: string;
}

const DiyActivities: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<string>("all");
  const [page, setPage] = useState<number>(1);
  const activitiesPerPage = 9;

  const activities: Activity[] = [
    {
      id: 1,
      name: "DIY Birthday Crown",
      category: "Gabby",
      theme: "Gabby",
      image: "https://i.ibb.co.com/qQjJScX/Screenshot-1.png",
      time: "25 mins",
      difficulty: "Easy",
      ageRange: "4-10 years",
      description:
        "Create a magical birthday crown to make the birthday person feel extra special. A fun and simple decoration that kids love!",
      materials: [
        "Cardstock",
        "Markers",
        "Glitter",
        "Glue",
        "Scissors",
        "Tape",
      ],
      steps: [
        "Cut cardstock into a crown shape",
        "Decorate with markers and add personal touches",
        "Sprinkle glitter and let dry",
        "Wrap around head and secure with tape",
        "Wear your crown proudly!",
      ],
      image_url: "https://i.ibb.co.com/qQjJScX/Screenshot-1.png",
      video: "https://www.youtube.com/watch?v=s3Tq0gpSGBk",
      rating: 4.8,
      reviews: 234,
    },
    {
      id: 2,
      name: "Magical Unicorns Craft",
      category: "Gabby Magical Unicorns",
      theme: "Gabby Magical Unicorns",
      image: "https://i.ibb.co.com/qYWJwvvx/Screenshot-2.png",
      time: "40 mins",
      difficulty: "Medium",
      ageRange: "5-12 years",
      description:
        "Create enchanting unicorn decorations with rainbow colors and sparkles. Perfect for magical-themed birthday parties!",
      materials: [
        "Paper cones",
        "Colored paper",
        "Glitter",
        "Markers",
        "Glue gun",
        "Ribbons",
      ],
      steps: [
        "Form a cone shape from paper",
        "Cut and attach colorful mane pieces",
        "Draw or attach unicorn face",
        "Add sparkles and glitter",
        "Display as party decorations",
      ],
      image_url: "https://i.ibb.co.com/qYWJwvvx/Screenshot-2.png",
      video: "https://www.youtube.com/watch?v=3p_CceVCXVc",
      rating: 4.9,
      reviews: 312,
    },
    {
      id: 3,
      name: "Dinosaur Party Decorations",
      category: "Dinosaurs",
      theme: "Dinosaurs",
      image: "https://i.ibb.co.com/4R9f3hpp/Screenshot-3.png",
      time: "50 mins",
      difficulty: "Medium",
      ageRange: "6-13 years",
      description:
        "Build roaring dinosaur decorations to transform your party space into a prehistoric adventure zone!",
      materials: [
        "Green paper",
        "Markers",
        "Cotton balls",
        "Glue",
        "Tape",
        "String",
      ],
      steps: [
        "Draw dinosaur outline on paper",
        "Cut out carefully",
        "Add details with markers",
        "Attach string for hanging",
        "Create multiple dinos for display",
      ],
      image_url: "https://i.ibb.co.com/4R9f3hpp/Screenshot-3.png",
      video: "https://www.youtube.com/watch?v=f9DAKjccJ50",
      rating: 4.7,
      reviews: 198,
    },

    {
      id: 4,
      name: "Jungle Safari Setup",
      category: "Safari / Jungle",
      theme: "Safari / Jungle",
      image: "https://i.ibb.co.com/JXxZRG5/Screenshot-4.png",
      time: "60 mins",
      difficulty: "Hard",
      ageRange: "7-14 years",
      description:
        "Create an immersive jungle safari environment with vines, animals, and exotic decorations for an adventurous party experience.",
      materials: [
        "Green streamers",
        "Construction paper",
        "Paint",
        "Markers",
        "Glue gun",
        "String",
      ],
      steps: [
        "Hang green streamers as vines",
        "Create animal cutouts from paper",
        "Paint jungle scene backdrops",
        "Add hanging decorations",
        "Set up photo spots",
      ],
      image_url: "https://i.ibb.co.com/JXxZRG5/Screenshot-4.png",
      video: "https://www.youtube.com/watch?v=BBX596NdMv8",
      rating: 4.6,
      reviews: 167,
    },
    {
      id: 5,
      name: "Marvel Superheroes Masks",
      category: "Marvel / Avengers",
      theme: "Marvel / Avengers",
      image: "https://i.ibb.co.com/pjcFywBX/Screenshot-5.png",
      time: "30 mins",
      difficulty: "Easy",
      ageRange: "5-14 years",
      description:
        "Design superhero masks featuring your favorite Marvel characters. Guests can choose their hero and decorate their own!",
      materials: [
        "Mask templates",
        "Markers",
        "Glitter",
        "Elastic bands",
        "Stickers",
      ],
      steps: [
        "Print or cut mask template",
        "Choose your superhero character",
        "Decorate with markers and stickers",
        "Add glitter for extra shine",
        "Attach elastic band and wear!",
      ],
      image_url: "https://i.ibb.co.com/pjcFywBX/Screenshot-5.png",
      video: "https://www.youtube.com/watch?v=v9oTN5B4FbU",
      rating: 4.8,
      reviews: 289,
    },
    {
      id: 6,
      name: "Pirates Treasure Hunt Setup",
      category: "Pirates & Treasure Hunt",
      theme: "Pirates & Treasure Hunt",
      image: "https://i.ibb.co.com/S4bGMY1G/Screenshot-6.png",
      time: "45 mins",
      difficulty: "Medium",
      ageRange: "6-13 years",
      description:
        "Create pirate-themed treasures, maps, and decorations for an exciting treasure hunt adventure at your party.",
      materials: [
        "Brown paper",
        "Tea bags",
        "Markers",
        "String",
        "Boxes",
        "Stickers",
      ],
      steps: [
        "Create aged treasure maps using tea-stained paper",
        "Design pirate flags and banners",
        "Decorate treasure boxes",
        "Hide clues around party space",
        "Make wanted posters",
      ],
      image_url: "https://i.ibb.co.com/S4bGMY1G/Screenshot-6.png",
      video: "https://www.youtube.com/watch?v=f9DAKjccJ50",
      rating: 4.7,
      reviews: 245,
    },
    {
      id: 7,
      name: "Paw Patrol Party Pack",
      category: "Paw Patrol",
      theme: "Paw Patrol",
      image: "https://i.ibb.co.com/fYcc8GLB/Screenshot-7.png",
      time: "35 mins",
      difficulty: "Easy",
      ageRange: "3-8 years",
      description:
        "Create Paw Patrol character decorations and props. Perfect for younger kids who love the rescue team!",
      materials: [
        "Colored paper",
        "Character templates",
        "Markers",
        "Glue",
        "String",
      ],
      steps: [
        "Print Paw Patrol character templates",
        "Color and decorate each character",
        "Cut out carefully",
        "Attach to string for hanging",
        "Arrange throughout party space",
      ],
      image_url: "https://i.ibb.co.com/fYcc8GLB/Screenshot-7.png",
      video: "https://www.youtube.com/watch?v=S6L6t2Rz14M",
      rating: 4.9,
      reviews: 421,
    },

    {
      id: 8,
      name: "Barbie Dream Party Setup",
      category: "Barbie",
      theme: "Barbie",
      image: "https://i.ibb.co.com/LXZHd8MF/Screenshot-8.png",
      time: "55 mins",
      difficulty: "Medium",
      ageRange: "6-14 years",
      description:
        "Design glamorous pink and sparkly Barbie-themed decorations for a fabulous party celebration.",
      materials: [
        "Pink paper",
        "Glitter",
        "Ribbons",
        "Markers",
        "Glue gun",
        "Feathers",
      ],
      steps: [
        "Create pink and purple backdrop",
        "Make sparkly decorative elements",
        "Design fashion-themed props",
        "Add glitter to everything",
        "Set up glamorous display areas",
      ],
      image_url: "https://i.ibb.co.com/LXZHd8MF/Screenshot-8.png",
      video: "https://www.youtube.com/watch?v=FYSrMDn60s8",
      rating: 4.8,
      reviews: 356,
    },
    {
      id: 9,
      name: "Space & Astronomy Decorations",
      category: "Space / Astronomy",
      theme: "Space / Astronomy",
      image: "https://i.ibb.co.com/qYb9WyDw/Screenshot-9.png",
      time: "50 mins",
      difficulty: "Medium",
      ageRange: "7-14 years",
      description:
        "Build a cosmic space station with planets, stars, and spacecraft decorations for an out-of-this-world party!",
      materials: [
        "Black paper",
        "Foil",
        "Markers",
        "String",
        "Balloons",
        "Glow paint",
      ],
      steps: [
        "Create planet models from paper",
        "Make spaceship cutouts",
        "Paint stars and galaxies",
        "Hang with fishing line",
        "Add glow-in-the-dark elements",
      ],
      image_url: "https://i.ibb.co.com/qYb9WyDw/Screenshot-9.png",
      video: "https://www.youtube.com/watch?v=6lfkdJblB74",
      rating: 4.7,
      reviews: 203,
    },
    {
      id: 10,
      name: "Pokémon Adventure Setup",
      category: "Pokémon",
      theme: "Pokémon",
      image: " https://i.ibb.co.com/XxjgfWQ0/Screenshot-10.png",
      time: "45 mins",
      difficulty: "Medium",
      ageRange: "6-13 years",
      description:
        "Create Pokémon-themed decorations and poké ball props for a trainer-worthy birthday celebration.",
      materials: [
        "Red and white paper",
        "Markers",
        "Glue",
        "String",
        "Templates",
      ],
      steps: [
        "Create poké ball decorations",
        "Make Pokémon character cutouts",
        "Design trainer badges and ribbons",
        "Hang around party area",
        "Set up interactive Pokémon station",
      ],
      image_url: " https://i.ibb.co.com/XxjgfWQ0/Screenshot-10.png",
      video: "https://www.youtube.com/watch?v=UPGzDU10CNA",
      rating: 4.8,
      reviews: 278,
    },

    {
      id: 11,
      name: "Disney Princess Ball",
      category: "Disney Princesses",
      theme: "Disney Princesses",
      image: "https://i.ibb.co.com/ym9bpdRt/Screenshot-11.png",
      time: "60 mins",
      difficulty: "Hard",
      ageRange: "5-14 years",
      description:
        "Create an elegant royal ball atmosphere with princess-themed decorations and castle elements.",
      materials: [
        "Purple paper",
        "Gold foil",
        "Glitter",
        "Balloons",
        "String lights",
        "Ribbons",
      ],
      steps: [
        "Create castle backdrop",
        "Make princess character silhouettes",
        "Design royal banners and flags",
        "Add twinkling lights",
        "Set up throne area",
      ],
      image_url: "https://i.ibb.co.com/ym9bpdRt/Screenshot-11.png",
      video: "https://www.youtube.com/watch?v=u18HUewsqbY",
      rating: 4.9,
      reviews: 412,
    },
    {
      id: 12,
      name: "Frozen Winter Wonderland",
      category: "Frozen",
      theme: "Frozen",
      image: "https://i.ibb.co.com/wZXHSCbm/Screenshot-12.png",
      time: "50 mins",
      difficulty: "Medium",
      ageRange: "5-12 years",
      description:
        "Build an icy Frozen-themed party with snowflakes, ice effects, and character decorations.",
      materials: [
        "Blue paper",
        "White glitter",
        "Markers",
        "String",
        "Foam snowflakes",
      ],
      steps: [
        "Create snowflake decorations",
        "Make Frozen character cutouts",
        "Add blue and white streamers",
        "Set up icy backdrop",
        "Add glitter for sparkle",
      ],
      image_url: "https://i.ibb.co.com/wZXHSCbm/Screenshot-12.png",
      video: "https://www.youtube.com/watch?v=s3Tq0gpSGBk",
      rating: 4.7,
      reviews: 198,
    },
    {
      id: 13,
      name: "Spider-Man Action Setup",
      category: "Spider-Man",
      theme: "Spider-Man",
      image: "https://i.ibb.co.com/LhdLkr4F/Screenshot-13.png",
      time: "40 mins",
      difficulty: "Medium",
      ageRange: "5-12 years",
      description:
        "Design Spider-Man-themed decorations and web props for superhero adventures.",
      materials: [
        "Red and blue paper",
        "String",
        "Markers",
        "Glue",
        "Spider templates",
      ],
      steps: [
        "Cut out spider web shapes",
        "Decorate walls with Spider-Man silhouettes",
        "Make web props with string",
        "Create Spider-Man masks",
        "Set up superhero activity corner",
      ],
      image_url: "https://i.ibb.co.com/LhdLkr4F/Screenshot-13.png",
      video: "https://www.youtube.com/watch?v=aDWWY203-sk",
      rating: 4.8,
      reviews: 256,
    },
    {
      id: 14,
      name: "Batman Dark Knight Setup",
      category: "Batman",
      theme: "Batman",
      image: "https://i.ibb.co.com/4R9f3hpp/Screenshot-3.png",
      time: "45 mins",
      difficulty: "Medium",
      ageRange: "6-14 years",
      description:
        "Transform your party into Gotham City with Batman-themed decorations, bats, and dark city props.",
      materials: [
        "Black paper",
        "Yellow markers",
        "Glue",
        "String",
        "Batman logos",
        "Cardstock",
      ],
      steps: [
        "Create Gotham skyline backdrops",
        "Cut out bat shapes and hang them",
        "Design Bat-Signal decorations",
        "Make Batman masks",
        "Set up themed photo spot",
      ],
      image_url: "https://i.ibb.co.com/4R9f3hpp/Screenshot-3.png",
      video: "https://www.youtube.com/watch?v=wjzNaktHwwc",
      rating: 4.7,
      reviews: 212,
    },
  ];

  // [
  //   // {
  //   //   id: 1,
  //   //   name: "DIY Birthday Crown",
  //   //   category: "Gabby",
  //   //   theme: "Gabby",
  //   //   image: img,
  //   //   time: "25 mins",
  //   //   difficulty: "Easy",
  //   //   ageRange: "4-10 years",
  //   //   description:
  //   //     "Create a magical birthday crown to make the birthday person feel extra special. A fun and simple decoration that kids love!",
  //   //   materials: ["Cardstock", "Markers", "Glitter", "Glue", "Scissors", "Tape"],
  //   //   steps: [
  //   //     "Cut cardstock into a crown shape",
  //   //     "Decorate with markers and add personal touches",
  //   //     "Sprinkle glitter and let dry",
  //   //     "Wrap around head and secure with tape",
  //   //     "Wear your crown proudly!",
  //   //   ],
  //   //   image_url: "img",
  //   //   video: vedio,
  //   //   rating: 4.8,
  //   //   reviews: 234,
  //   // },
  //   // {
  //   //   id: 2,
  //   //   name: "Magical Unicorns Craft",
  //   //   category: "Gabby Magical Unicorns",
  //   //   theme: "Gabby Magical Unicorns",
  //   //   image: "🦄",
  //   //   time: "40 mins",
  //   //   difficulty: "Medium",
  //   //   ageRange: "5-12 years",
  //   //   description:
  //   //     "Create enchanting unicorn decorations with rainbow colors and sparkles. Perfect for magical-themed birthday parties!",
  //   //   materials: ["Paper cones", "Colored paper", "Glitter", "Markers", "Glue gun", "Ribbons"],
  //   //   steps: [
  //   //     "Form a cone shape from paper",
  //   //     "Cut and attach colorful mane pieces",
  //   //     "Draw or attach unicorn face",
  //   //     "Add sparkles and glitter",
  //   //     "Display as party decorations",
  //   //   ],
  //   //   image_url: "🦄",
  //   //   video: "https://www.youtube.com/watch?v=J-ZuTSHkZbM",
  //   //   rating: 4.9,
  //   //   reviews: 312,
  //   // },
  //   // {
  //   //   id: 3,
  //   //   name: "Dinosaur Party Decorations",
  //   //   category: "Dinosaurs",
  //   //   theme: "Dinosaurs",
  //   //   image: "🦕",
  //   //   time: "50 mins",
  //   //   difficulty: "Medium",
  //   //   ageRange: "6-13 years",
  //   //   description:
  //   //     "Build roaring dinosaur decorations to transform your party space into a prehistoric adventure zone!",
  //   //   materials: ["Green paper", "Markers", "Cotton balls", "Glue", "Tape", "String"],
  //   //   steps: [
  //   //     "Draw dinosaur outline on paper",
  //   //     "Cut out carefully",
  //   //     "Add details with markers",
  //   //     "Attach string for hanging",
  //   //     "Create multiple dinos for display",
  //   //   ],
  //   //   image_url: "🦕",
  //   //   video: "https://www.youtube.com/watch?v=ooEZ99bwhVs",
  //   //   rating: 4.7,
  //   //   reviews: 198,
  //   // },
  //   // {
  //   //   id: 4,
  //   //   name: "Jungle Safari Setup",
  //   //   category: "Safari / Jungle",
  //   //   theme: "Safari / Jungle",
  //   //   image: "🌿",
  //   //   time: "60 mins",
  //   //   difficulty: "Hard",
  //   //   ageRange: "7-14 years",
  //   //   description:
  //   //     "Create an immersive jungle safari environment with vines, animals, and exotic decorations for an adventurous party experience.",
  //   //   materials: ["Green streamers", "Construction paper", "Paint", "Markers", "Glue gun", "String"],
  //   //   steps: [
  //   //     "Hang green streamers as vines",
  //   //     "Create animal cutouts from paper",
  //   //     "Paint jungle scene backdrops",
  //   //     "Add hanging decorations",
  //   //     "Set up photo spots",
  //   //   ],
  //   //   image_url: "🌿",
  //   //   video: "Jungle_DIY.mp4",
  //   //   rating: 4.6,
  //   //   reviews: 167,
  //   // },
  //   // {
  //   //   id: 5,
  //   //   name: "Marvel Superheroes Masks",
  //   //   category: "Marvel / Avengers",
  //   //   theme: "Marvel / Avengers",
  //   //   image: "🦸",
  //   //   time: "30 mins",
  //   //   difficulty: "Easy",
  //   //   ageRange: "5-14 years",
  //   //   description:
  //   //     "Design superhero masks featuring your favorite Marvel characters. Guests can choose their hero and decorate their own!",
  //   //   materials: ["Mask templates", "Markers", "Glitter", "Elastic bands", "Stickers"],
  //   //   steps: [
  //   //     "Print or cut mask template",
  //   //     "Choose your superhero character",
  //   //     "Decorate with markers and stickers",
  //   //     "Add glitter for extra shine",
  //   //     "Attach elastic band and wear!",
  //   //   ],
  //   //   image_url: "🦸",
  //   //   video: "Superhero_Mask.mp4",
  //   //   rating: 4.8,
  //   //   reviews: 289,
  //   // },
  //   // {
  //   //   id: 6,
  //   //   name: "Pirates Treasure Hunt Setup",
  //   //   category: "Pirates & Treasure Hunt",
  //   //   theme: "Pirates & Treasure Hunt",
  //   //   image: "🏴‍☠️",
  //   //   time: "45 mins",
  //   //   difficulty: "Medium",
  //   //   ageRange: "6-13 years",
  //   //   description:
  //   //     "Create pirate-themed treasures, maps, and decorations for an exciting treasure hunt adventure at your party.",
  //   //   materials: ["Brown paper", "Tea bags", "Markers", "String", "Boxes", "Stickers"],
  //   //   steps: [
  //   //     "Create aged treasure maps using tea-stained paper",
  //   //     "Design pirate flags and banners",
  //   //     "Decorate treasure boxes",
  //   //     "Hide clues around party space",
  //   //     "Make wanted posters",
  //   //   ],
  //   //   image_url: "🏴‍☠️",
  //   //   video: "Pirates_DIY.mp4",
  //   //   rating: 4.7,
  //   //   reviews: 245,
  //   // },
  //   // {
  //   //   id: 7,
  //   //   name: "Paw Patrol Party Pack",
  //   //   category: "Paw Patrol",
  //   //   theme: "Paw Patrol",
  //   //   image: "🐾",
  //   //   time: "35 mins",
  //   //   difficulty: "Easy",
  //   //   ageRange: "3-8 years",
  //   //   description:
  //   //     "Create Paw Patrol character decorations and props. Perfect for younger kids who love the rescue team!",
  //   //   materials: ["Colored paper", "Character templates", "Markers", "Glue", "String"],
  //   //   steps: [
  //   //     "Print Paw Patrol character templates",
  //   //     "Color and decorate each character",
  //   //     "Cut out carefully",
  //   //     "Attach to string for hanging",
  //   //     "Arrange throughout party space",
  //   //   ],
  //   //   image_url: "🐾",
  //   //   video: "PawPatrol_DIY.mp4",
  //   //   rating: 4.9,
  //   //   reviews: 421,
  //   // },
  //   // {
  //   //   id: 8,
  //   //   name: "Barbie Dream Party Setup",
  //   //   category: "Barbie",
  //   //   theme: "Barbie",
  //   //   image: "💗",
  //   //   time: "55 mins",
  //   //   difficulty: "Medium",
  //   //   ageRange: "6-14 years",
  //   //   description:
  //   //     "Design glamorous pink and sparkly Barbie-themed decorations for a fabulous party celebration.",
  //   //   materials: ["Pink paper", "Glitter", "Ribbons", "Markers", "Glue gun", "Feathers"],
  //   //   steps: [
  //   //     "Create pink and purple backdrop",
  //   //     "Make sparkly decorative elements",
  //   //     "Design fashion-themed props",
  //   //     "Add glitter to everything",
  //   //     "Set up glamorous display areas",
  //   //   ],
  //   //   image_url: "💗",
  //   //   video: "Barbie_DIY.mp4",
  //   //   rating: 4.8,
  //   //   reviews: 356,
  //   // },
  //   // {
  //   //   id: 9,
  //   //   name: "Space & Astronomy Decorations",
  //   //   category: "Space / Astronomy",
  //   //   theme: "Space / Astronomy",
  //   //   image: "🚀",
  //   //   time: "50 mins",
  //   //   difficulty: "Medium",
  //   //   ageRange: "7-14 years",
  //   //   description:
  //   //     "Build a cosmic space station with planets, stars, and spacecraft decorations for an out-of-this-world party!",
  //   //   materials: ["Black paper", "Foil", "Markers", "String", "Balloons", "Glow paint"],
  //   //   steps: [
  //   //     "Create planet models from paper",
  //   //     "Make spaceship cutouts",
  //   //     "Paint stars and galaxies",
  //   //     "Hang with fishing line",
  //   //     "Add glow-in-the-dark elements",
  //   //   ],
  //   //   image_url: "🚀",
  //   //   video: "Space_DIY.mp4",
  //   //   rating: 4.7,
  //   //   reviews: 203,
  //   // },
  //   // {
  //   //   id: 10,
  //   //   name: "Pokémon Adventure Setup",
  //   //   category: "Pokémon",
  //   //   theme: "Pokémon",
  //   //   image: "⚡",
  //   //   time: "45 mins",
  //   //   difficulty: "Medium",
  //   //   ageRange: "6-13 years",
  //   //   description:
  //   //     "Create Pokémon-themed decorations and poké ball props for a trainer-worthy birthday celebration.",
  //   //   materials: ["Red and white paper", "Markers", "Glue", "String", "Templates"],
  //   //   steps: [
  //   //     "Create poké ball decorations",
  //   //     "Make Pokémon character cutouts",
  //   //     "Design trainer badges and ribbons",
  //   //     "Hang around party area",
  //   //     "Set up interactive Pokémon station",
  //   //   ],
  //   //   image_url: "⚡",
  //   //   video: "Pokemon_DIY.mp4",
  //   //   rating: 4.8,
  //   //   reviews: 278,
  //   // },
  //   // {
  //   //   id: 11,
  //   //   name: "Disney Princess Ball",
  //   //   category: "Disney Princesses",
  //   //   theme: "Disney Princesses",
  //   //   image: "👸",
  //   //   time: "60 mins",
  //   //   difficulty: "Hard",
  //   //   ageRange: "5-14 years",
  //   //   description:
  //   //     "Create an elegant royal ball atmosphere with princess-themed decorations and castle elements.",
  //   //   materials: ["Purple paper", "Gold foil", "Glitter", "Balloons", "String lights", "Ribbons"],
  //   //   steps: [
  //   //     "Create castle backdrop",
  //   //     "Make princess character silhouettes",
  //   //     "Design royal banners and flags",
  //   //     "Add twinkling lights",
  //   //     "Set up throne area",
  //   //   ],
  //   //   image_url: "👸",
  //   //   video: "Princess_DIY.mp4",
  //   //   rating: 4.9,
  //   //   reviews: 412,
  //   // },
  //   // {
  //   //   id: 12,
  //   //   name: "Frozen Winter Wonderland",
  //   //   category: "Frozen",
  //   //   theme: "Frozen",
  //   //   image: "❄️",
  //   //   time: "50 mins",
  //   //   difficulty: "Medium",
  //   //   ageRange: "5-12 years",
  //   //   description:
  //   //     "Build an icy Frozen-themed party with snowflakes, ice effects, and character decorations.",
  //   //   materials: ["Blue paper", "White glitter", "Markers", "String", "Foam snowflakes"],
  //   //   steps: [
  //   //     "Create snowflake decorations",
  //   //     "Make Frozen character cutouts",
  //   //     "Add blue and white streamers",
  //   //     "Set up icy backdrop",
  //   //     "Add glitter for sparkle",
  //   //   ],
  //   //   image_url: "❄️",
  //   //   video: "Frozen_DIY.mp4",
  //   //   rating: 4.7,
  //   //   reviews: 198,
  //   // },
  //   // {
  //   //   id: 13,
  //   //   name: "Spider-Man Action Setup",
  //   //   category: "Spider-Man",
  //   //   theme: "Spider-Man",
  //   //   image: "🕷️",
  //   //   time: "40 mins",
  //   //   difficulty: "Medium",
  //   //   ageRange: "5-12 years",
  //   //   description:
  //   //     "Design Spider-Man-themed decorations and web props for superhero adventures.",
  //   //   materials: ["Red and blue paper", "String", "Markers", "Glue", "Spider templates"],
  //   //   steps: [
  //   //     "Cut out spider web shapes",
  //   //     "Decorate walls with Spider-Man silhouettes",
  //   //     "Make web props with string",
  //   //     "Create Spider-Man masks",
  //   //     "Set up superhero activity corner",
  //   //   ],
  //   //   image_url: "🕷️",
  //   //   video: "SpiderMan_DIY.mp4",
  //   //   rating: 4.8,
  //   //   reviews: 256,
  //   // },
  //   // {
  //   //   id: 14,
  //   //   name: "Batman Dark Knight Setup",
  //   //   category: "Batman",
  //   //   theme: "Batman",
  //   //   image: "🦇",
  //   //   time: "45 mins",
  //   //   difficulty: "Medium",
  //   //   ageRange: "6-14 years",
  //   //   description:
  //   //     "Transform your party into Gotham City with Batman-themed decorations, bats, and dark city props.",
  //   //   materials: ["Black paper", "Yellow markers", "Glue", "String", "Batman logos", "Cardstock"],
  //   //   steps: [
  //   //     "Create Gotham skyline backdrops",
  //   //     "Cut out bat shapes and hang them",
  //   //     "Design Bat-Signal decorations",
  //   //     "Make Batman masks",
  //   //     "Set up themed photo spot",
  //   //   ],
  //   //   image_url: "🦇",
  //   //   video: "Batman_DIY.mp4",
  //   //   rating: 4.7,
  //   //   reviews: 212,
  //   // },
  // ];

  const themes: Theme[] = [
    { id: "all", label: "All Themes" },
    { id: "Gabby", label: "Gabby" },
    { id: "Gabby Magical Unicorns", label: "Magical Unicorns" },
    { id: "Dinosaurs", label: "Dinosaurs" },
    { id: "Safari / Jungle", label: "Safari / Jungle" },
    { id: "Marvel / Avengers", label: "Marvel" },
    { id: "Pirates & Treasure Hunt", label: "Pirates" },
    { id: "Paw Patrol", label: "Paw Patrol" },
    { id: "Barbie", label: "Barbie" },
    { id: "Space / Astronomy", label: "Space" },
    { id: "Pokémon", label: "Pokémon" },
    { id: "Disney Princesses", label: "Princesses" },
    { id: "Frozen", label: "Frozen" },
    { id: "Spider-Man", label: "Spider-Man" },
    { id: "Batman", label: "Batman" },
  ];

  const filtered = useMemo(
    () =>
      activeTab === "all"
        ? activities
        : activities.filter((a) => a.theme === activeTab),
    [activeTab],
  );

  // Pagination
  const total = filtered.length;
  const totalPages = Math.ceil(total / activitiesPerPage);
  const startIndex = (page - 1) * activitiesPerPage;
  const paginated = filtered.slice(startIndex, startIndex + activitiesPerPage);

  // const handleAddToBox = (activity: Activity) => {
  //   console.log("Added to box:", activity.name);
  // };

  // const handleSaveActivity = (activity: Activity) => {
  //   console.log("Saved activity:", activity.name);
  // };

  const handleCloseModal = () => setSelectedActivity(null);

  return (
    <div className="container mx-auto mt-10">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="mb-4 flex items-center gap-3">
            <div className="text-4xl">🎨</div>
            <h1 className="text-4xl font-bold text-gray-800">DIY Activities</h1>
          </div>
          <p className="text-lg text-gray-600">
            Explore amazing themed decorations and celebrations for your perfect
            party
          </p>
        </div>

        {/* Theme Filter Tabs */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-3">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => {
                setActiveTab(theme.id);
                setPage(1);
              }}
              className={`rounded-full px-4 py-2 font-semibold whitespace-nowrap transition-all hover:cursor-pointer ${
                activeTab === theme.id
                  ? "bg-[#223B7D] text-white shadow-md"
                  : "border border-gray-200 bg-white text-gray-700 hover:border-[#223B7D]"
              }`}
            >
              {theme.label}
            </button>
          ))}
        </div>

        {/* Activities Grid - BlogCard style */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {paginated.map((activity) => (
            <div
              key={activity.id}
              className="flex flex-col overflow-hidden rounded-lg bg-[#FFF7ED] shadow-md hover:shadow-lg transition-all"
            >
              <div className="relative h-56 w-full">
                <img
                  src={activity.image}
                  alt={activity.name}
                  className="h-full w-full object-cover"
                />
                {activity.difficulty && (
                  <span className="absolute top-3 right-3 rounded-full bg-[#223B7D] px-2.5 py-1.5 text-xs font-medium text-white">
                    {activity.difficulty}
                  </span>
                )}
                {activity.video && (
                  <div className="absolute bottom-2 right-2 bg-red-500 text-white rounded-full p-1.5">
                    <Play size={14} fill="white" />
                  </div>
                )}
              </div>

              <div className="flex-1 p-4">
                <h3 className="mb-2 line-clamp-2 text-lg font-medium">
                  {activity.name}
                </h3>
                <p className="mb-4 line-clamp-3 text-sm text-[#5A5C5F]">
                  {activity.description}
                </p>

                <div className="mb-3 flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {activity.time}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {activity.ageRange}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-yellow-500">
                    ★ <span className="font-semibold">{activity.rating}</span>
                    <span className="text-gray-500 text-xs">
                      ({activity.reviews})
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedActivity(activity)}
                    className="flex items-center gap-1 text-[#223B7D] font-medium hover:underline"
                  >
                    View Details <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              <div className="mt-auto p-4 pt-0">
                <button
                  onClick={() => handleAddToBox(activity)}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-[#223B7D] px-4 py-3 text-sm text-white hover:bg-[#343f5c]"
                >
                  Add to Box <Heart size={16} className="text-white" />
                </button>
              </div>
            </div>
          ))}
        </div> */}

        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {paginated.map((activity) => (
            <div
              key={activity.id}
              className="flex flex-col overflow-hidden rounded-lg bg-[#FFF7ED] shadow-md hover:shadow-lg transition-all"
            >
               <div className="relative h-56 w-full">
                <img
                  src={activity.image}
                  alt={activity.name}
                  className="h-full w-full object-cover"
                />

                {activity.difficulty && (
                  <span className="absolute top-3 right-3 rounded-full bg-[#223B7D] px-2.5 py-1.5 text-xs font-medium text-white">
                    {activity.difficulty}
                  </span>
                )}

                 {activity.video && (
                  <button
                    onClick={() => setSelectedVideo(activity.video)}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition"
                  >
                    <div className="bg-red-500 hover:cursor-pointer text-white rounded-full p-4 shadow-lg hover:bg-red-600 transition">
                      <Play size={22} fill="white" />
                    </div>
                  </button>
                )}
              </div>


               <div className="flex-1 p-4">
                <h3 className="mb-2 line-clamp-2 text-lg font-medium">
                  {activity.name}
                </h3>
                <p className="mb-4 line-clamp-3 text-sm text-[#5A5C5F]">
                  {activity.description}
                </p>

                 <div className="mb-3 flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {activity.time}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {activity.ageRange}
                  </div>
                </div>

                 <div className="flex items-center gap-1 text-yellow-500 mb-3">
                  ★ <span className="font-semibold">{activity.rating}</span>
                  <span className="text-gray-500 text-xs">({activity.reviews})</span>
                </div>

                 <button
                  onClick={() => setSelectedActivity(activity)}
                  className="flex w-full items-center hover:cursor-pointer justify-center gap-2 rounded-md bg-[#223B7D] px-4 py-3 text-sm text-white font-medium hover:bg-[#343f5c] transition-all"
                >
                  View Details <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}

           {selectedVideo && (
            <div
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedVideo(null)} // close when clicking background
            >
              <div
                className="relative bg-black rounded-lg overflow-hidden max-w-3xl w-full"
                onClick={(e) => e.stopPropagation()} // prevent closing when clicking video
              >
                <video
                  src={selectedVideo}
                  controls
                  autoPlay
                  className="w-full h-auto rounded-lg"
                />
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="absolute top-2 right-2 hover:cursor-pointer text-white bg-black/60 hover:bg-black/80 rounded-full p-2"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div> */}

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginated.map((activity) => (
            <div
              key={activity.id}
              className="flex flex-col overflow-hidden rounded-lg bg-[#FFF7ED] shadow-md transition-all hover:shadow-lg"
            >
              {/* Image with Play Button */}
              <div className="relative h-56 w-full">
                <img
                  src={activity.image}
                  alt={activity.name}
                  className="h-full w-full object-cover"
                />

                {activity.video && (
                  <button
                    onClick={() => setSelectedVideo(activity.video)}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 transition hover:cursor-pointer hover:bg-black/40"
                  >
                    <div className="rounded-full bg-red-500 p-4 text-white shadow-lg transition hover:bg-red-600">
                      <Play size={22} fill="white" />
                    </div>
                  </button>
                )}
              </div>

              {/* Card Content */}
              <div className="flex flex-1 flex-col p-4">
                <h3 className="mb-2 line-clamp-2 text-lg font-medium">
                  {activity.name}
                </h3>
                <p className="mb-4 line-clamp-3 text-sm text-[#5A5C5F]">
                  {activity.description}
                </p>
                <button
                  onClick={() => setSelectedActivity(activity)}
                  className="mt-auto flex w-full items-center justify-center gap-2 rounded-md bg-[#223B7D] px-4 py-3 text-sm font-medium text-white transition-all hover:cursor-pointer hover:bg-[#343f5c]"
                >
                  View Details <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}

          {/* Video Modal */}
          {selectedVideo && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
              onClick={() => setSelectedVideo(null)} // close modal on background click
            >
              <div
                className="relative w-full max-w-3xl overflow-hidden rounded-lg bg-black"
                onClick={(e) => e.stopPropagation()} // prevent closing when clicking video
              >
                <video
                  src={selectedVideo}
                  controls
                  autoPlay
                  className="h-auto w-full rounded-lg"
                />
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="absolute top-2 right-2 rounded-full bg-black/60 p-2 text-white transition hover:cursor-pointer hover:bg-black/80"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Pagination UI (copied from BlogCard) */}
        {filtered.length > 0 && (
          <div className="mt-6 flex items-center justify-between px-4 py-3">
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium">{paginated.length}</span> of{" "}
              <span className="font-medium">{total}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded-lg border px-3 py-1.5 text-sm text-gray-600 hover:cursor-pointer hover:bg-gray-100 disabled:opacity-50"
              >
                Prev
              </button>
              <div className="min-w-[50px] rounded-md border bg-gray-50 px-3 py-1.5 text-center text-sm font-medium text-gray-700 hover:cursor-pointer">
                {page} / {totalPages}
              </div>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="rounded-lg border px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Optional Modal (unchanged) */}
      {/* {selectedActivity && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-blue-600 p-6 flex justify-between items-start">
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {selectedActivity.name}
                </h2>
                <div className="flex gap-3 text-white text-sm flex-wrap">
                  <span className="bg-white/20 px-3 py-1 rounded-full">
                    {selectedActivity.difficulty}
                  </span>
                  <span className="bg-white/20 px-3 py-1 rounded-full">
                    {selectedActivity.time}
                  </span>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-white cursor-pointer hover:bg-white/20 p-2 rounded-full"
              >
                ✕
              </button>
            </div>

            {selectedActivity.video ? (
              <video
                src={selectedActivity.video}
                poster={selectedActivity.image_url}
                controls
                className="w-full"
              />
            ) : (
              <img
                src={selectedActivity.image_url}
                alt={selectedActivity.name}
                className="w-full"
              />
            )}

            <div className="p-6 space-y-6">
              <p className="text-gray-700">{selectedActivity.description}</p>
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Materials:</h3>
                <ul className="space-y-2">
                  {selectedActivity.materials.map((m, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-700">
                      <span className="text-indigo-600">✓</span> {m}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Steps:</h3>
                <ol className="space-y-2">
                  {selectedActivity.steps.map((s, i) => (
                    <li key={i} className="flex gap-3 text-gray-700">
                      <span className="font-bold text-indigo-600">{i + 1}.</span>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      )} */}

      {selectedActivity && (
        <div className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="animate-slideUp relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <h2 className="p-6 text-2xl font-bold tracking-wide text-gray-800">
              {selectedActivity.name}
            </h2>
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-50 rounded-full bg-black/30 p-2 text-white transition hover:cursor-pointer hover:bg-black/50"
            >
              ✕
            </button>

            {/* Media Section */}
            {/* <div className="relative w-full h-64 md:h-80 rounded-t-2xl overflow-hidden">
        {selectedActivity.video ? (
          <video
            src={selectedActivity.video}
            poster={selectedActivity.image_url}
            controls
            autoPlay
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={selectedActivity.image_url}
            alt={selectedActivity.name}
            className="w-full h-full object-cover"
          />
        )}
      </div> */}

            <div className="relative mt-4 h-72 w-full overflow-hidden rounded-t-2xl p-3 md:h-80">
              {selectedActivity.video ? (
                <iframe
                  src={`${selectedActivity.video.replace("watch?v=", "embed/")}?autoplay=1`}
                  title={selectedActivity.name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full object-cover"
                />
              ) : (
                <img
                  src={selectedActivity.image_url}
                  alt={selectedActivity.name}
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            {/* Content Section */}
            <div className="space-y-8 p-6">
              <div className="flex flex-col space-y-2">
                {/* <h2 className="text-2xl font-bold text-gray-800 tracking-wide">
            {selectedActivity.name}
          </h2> */}
                <div className="flex flex-wrap gap-2 text-sm">
                  {selectedActivity.difficulty && (
                    <span className="rounded-full bg-indigo-100 px-3 py-1 text-indigo-700">
                      {selectedActivity.difficulty}
                    </span>
                  )}
                  {selectedActivity.time && (
                    <span className="rounded-full bg-indigo-100 px-3 py-1 text-indigo-700">
                      ⏱ {selectedActivity.time}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-800">
                  About this Activity
                </h3>
                <p className="leading-relaxed text-gray-700">
                  {selectedActivity.description}
                </p>
              </div>

              {selectedActivity.materials?.length > 0 && (
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-800">
                    🧺 Materials Needed
                  </h3>
                  <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {selectedActivity.materials.map((m, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-gray-700 transition hover:bg-indigo-50"
                      >
                        <span className="font-bold text-indigo-600">✓</span> {m}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedActivity.steps?.length > 0 && (
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-800">
                    🪄 Step-by-Step Instructions
                  </h3>
                  <ol className="space-y-3">
                    {selectedActivity.steps.map((s, i) => (
                      <li
                        key={i}
                        className="flex gap-3 rounded-lg bg-gray-50 px-4 py-3 text-gray-700 transition hover:bg-indigo-50"
                      >
                        <span className="font-bold text-indigo-600">
                          {i + 1}.
                        </span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiyActivities;
