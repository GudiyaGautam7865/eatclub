export const mockReviews = [
  {
    id: 1,
    customer: {
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
      email: "sarah.johnson@email.com"
    },
    menuItem: {
      name: "Chicken Biryani",
      image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=60&h=60&fit=crop",
      price: 350
    },
    rating: 5,
    reviewText: "Absolutely delicious! The chicken was perfectly cooked and the rice was aromatic. Best biryani I've had in a long time. Will definitely order again!",
    date: "2024-01-15",
    images: ["https://images.unsplash.com/photo-1563379091339-03246963d96c?w=200&h=150&fit=crop"],
    helpful: 12
  },
  {
    id: 2,
    customer: {
      name: "Mike Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      email: "mike.chen@email.com"
    },
    menuItem: {
      name: "Margherita Pizza",
      image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=60&h=60&fit=crop",
      price: 420
    },
    rating: 4,
    reviewText: "Great pizza with fresh ingredients. The crust was perfect and cheese quality was excellent. Only minor issue was delivery time.",
    date: "2024-01-14",
    images: [],
    helpful: 8
  },
  {
    id: 3,
    customer: {
      name: "Emily Davis",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      email: "emily.davis@email.com"
    },
    menuItem: {
      name: "Butter Chicken",
      image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=60&h=60&fit=crop",
      price: 380
    },
    rating: 5,
    reviewText: "Outstanding butter chicken! Rich, creamy sauce with tender chicken pieces. Portion size was generous and came with fresh naan.",
    date: "2024-01-13",
    images: ["https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=200&h=150&fit=crop"],
    helpful: 15
  },
  {
    id: 4,
    customer: {
      name: "David Wilson",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      email: "david.wilson@email.com"
    },
    menuItem: {
      name: "Caesar Salad",
      image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=60&h=60&fit=crop",
      price: 280
    },
    rating: 3,
    reviewText: "Decent salad but could use more dressing. Croutons were a bit stale and chicken was dry. Expected better for the price.",
    date: "2024-01-12",
    images: [],
    helpful: 3
  },
  {
    id: 5,
    customer: {
      name: "Lisa Anderson",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face",
      email: "lisa.anderson@email.com"
    },
    menuItem: {
      name: "Chocolate Brownie",
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=60&h=60&fit=crop",
      price: 180
    },
    rating: 5,
    reviewText: "Perfect dessert to end the meal! Rich, fudgy brownie with vanilla ice cream. Presentation was beautiful too.",
    date: "2024-01-11",
    images: ["https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=200&h=150&fit=crop"],
    helpful: 9
  },
  {
    id: 6,
    customer: {
      name: "James Rodriguez",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
      email: "james.rodriguez@email.com"
    },
    menuItem: {
      name: "Fish Tacos",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=60&h=60&fit=crop",
      price: 320
    },
    rating: 2,
    reviewText: "Fish was overcooked and tacos were soggy. Salsa was too spicy and overwhelmed other flavors. Not worth the price.",
    date: "2024-01-10",
    images: [],
    helpful: 1
  }
];

export const getReviewsByRating = (rating) => {
  if (rating === 'all') return mockReviews;
  return mockReviews.filter(review => review.rating === rating);
};

export const searchReviews = (reviews, searchTerm) => {
  if (!searchTerm) return reviews;
  
  const term = searchTerm.toLowerCase();
  return reviews.filter(review => 
    review.customer.name.toLowerCase().includes(term) ||
    review.menuItem.name.toLowerCase().includes(term) ||
    review.reviewText.toLowerCase().includes(term)
  );
};