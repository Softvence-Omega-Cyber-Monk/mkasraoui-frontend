// src/data/diyActivities.ts
 // Type definition for a DIY activity
export interface Activity {
  id: string;
  title: string;
  description: string; // HTML string
  materials: string;   // HTML string
  steps: string;       // HTML string
  difficulty: "Easy" | "Moderate" | "Hard";
  category: string[];
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
}


export const diyActivities: Activity[] = [
  {
    id: "1",
    title: "Wooden Birdhouse",
    description: "<p>Build a small birdhouse for your garden using basic woodworking tools.</p>",
    materials: "<ul><li>Wood planks</li><li>Nails</li><li>Hammer</li><li>Paint</li></ul>",
    steps: "<ol><li>Cut wood planks to size</li><li>Nail them together</li><li>Paint and decorate</li><li>Place in garden</li></ol>",
    difficulty: "Moderate",
    category: ["Woodwork", "Outdoor Projects", "Crafts"],
    images: [
      "https://via.placeholder.com/150?text=Birdhouse+1",
      "https://via.placeholder.com/150?text=Birdhouse+2"
    ],
  },
  {
    id: "2",
    title: "Recycled Paper Notebook",
    description: "<p>Create a notebook using recycled paper and cardboard covers.</p>",
    materials: "<ul><li>Old paper</li><li>Cardboard</li><li>Glue</li><li>Stapler</li></ul>",
    steps: "<ol><li>Collect and fold paper</li><li>Create cardboard cover</li><li>Bind with staples or glue</li><li>Decorate cover</li></ol>",
    difficulty: "Easy",
    category: ["Recycling", "Kids", "Crafts"],
    images: [
      "https://via.placeholder.com/150?text=Notebook+1",
      "https://via.placeholder.com/150?text=Notebook+2"
    ],
  },
  {
    id: "3",
    title: "Painted Flower Pots",
    description: "<p>Decorate terracotta pots with acrylic paint for your indoor or outdoor plants.</p>",
    materials: "<ul><li>Terracotta pots</li><li>Acrylic paint</li><li>Paintbrushes</li></ul>",
    steps: "<ol><li>Clean the pots</li><li>Paint desired patterns</li><li>Let dry completely</li><li>Plant flowers or herbs</li></ol>",
    difficulty: "Easy",
    category: ["Decor", "Gardening", "Art"],
    images: [
      "https://via.placeholder.com/150?text=Flower+Pot+1",
      "https://via.placeholder.com/150?text=Flower+Pot+2"
    ],
  }
  // ...add more activities as needed
];
