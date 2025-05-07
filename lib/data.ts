// Mock data for the e-commerce site

export const heroSlides = [
  {
    id: 1,
    title: "Personalized Gifts for Every Occasion",
    description: "Make your loved ones feel special with our custom gifts",
    image: "https://i.pinimg.com/736x/80/f4/29/80f4297787ceb89111962a3d51363277.jpg",
    cta: "Shop Now",
    link: "/products",
  },
  {
    id: 2,
    title: "New Collection: Memory Frames",
    description: "Turn your precious moments into beautiful keepsakes",
    image: "https://i.pinimg.com/736x/67/ae/83/67ae8363e789e9fb034bfbc960580a4b.jpg ",
    cta: "Explore Collection",
    link: "/products?category=frames",
  },
  {
    id: 3,
    title: "Special Offer: 20% Off",
    description: "Limited time offer on all personalized photo gifts",
    image: "https://i.pinimg.com/736x/1a/6f/dc/1a6fdc6e7698411e22e2acc3b9fb37cd.jpg",
    cta: "Shop Sale",
    link: "/products?sale=true",
  },
]

export const categories = [
  {
    id: 1,
    name: "Photo Frames",
    image: "https://i.pinimg.com/736x/45/34/8a/45348af986462a10cd40aee9e87fe1f4.jpg",
    link: "/products?category=frames",
  },
  {
    id: 2,
    name: "Custom Mugs",
    image: "https://i.pinimg.com/736x/97/e7/6a/97e76a6c0514da7fa6d22b9b64502221.jpg",
    link: "/products?category=mugs",
  },
  {
    id: 3,
    name: "Keychains",
    image: "https://i.pinimg.com/736x/53/97/d1/5397d1f9f7fd904471bff0be5dd9e98f.jpg",
    link: "/products?category=keychains",
  },
  {
    id: 4,
    name: "Cushions",
    image: "https://i.pinimg.com/736x/f5/e1/5b/f5e15b8d498be68956afc91a1e0a9955.jpg",
    link: "/products?category=cushions",
  },
  {
    id: 5,
    name: "Wall Art",
    image: "https://i.pinimg.com/736x/b0/0d/89/b00d89e413fd1a97e81067eced23e182.jpg",
    link: "/products?category=wall-art",
  },
  {
    id: 6,
    name: "Jewelry",
    image: "https://i.pinimg.com/736x/ea/0e/d9/ea0ed9dc5d090ca35da0b301850b304b.jpg",
    link: "/products?category=jewelry",
  },
]

export const products = [
  {
    id: 1,
    name: "Custom Photo Frame",
    description: "Beautiful wooden frame with your favorite photo",
    price: 29.99,
    salePrice: null,
    img: "https://i.pinimg.com/736x/f8/2f/2a/f82f2abcdb0747e79c01eae5d489e564.jpg",
    images: [
      "https://i.pinimg.com/736x/ca/69/c9/ca69c919ba626e6d52aa47d6f4e58c19.jpg",
      "https://i.pinimg.com/736x/2d/20/0f/2d200fa43ffc479190d68e763f1e89e8.jpg",
      "https://i.pinimg.com/736x/93/2f/c6/932fc6fa9a628db5898535cbef170cf0.jpg",
      "https://i.pinimg.com/736x/be/4d/74/be4d74efa0276b970fd7b9e83125b58c.jpg"
    ],
    category: "frames",
    badge: null,
    rating: 4.8,
    reviewCount: 124,
  },
  {
    id: 2,
    name: "Personalized Coffee Mug",
    description: "Ceramic mug with custom photo and text",
    price: 19.99,
    salePrice: 14.99,
    img: "https://i.pinimg.com/736x/ca/94/6b/ca946bb8ca34bbcbd238b431e5ead05c.jpg",
    images: [
      "https://i.pinimg.com/736x/84/e2/60/84e260471ebadc8c580160642f8d8c43.jpg",
      "https://i.pinimg.com/736x/9a/c2/ff/9ac2ff190e2d3bc5aef19b214a7ffb98.jpg",
      "https://i.pinimg.com/736x/a4/64/65/a4646523a615347ec312c3ce10b894d2.jpg",
      "https://i.pinimg.com/736x/97/a7/82/97a782e489ea79d671f216b46ff7f088.jpg"
    ],
    category: "mugs",
    badge: "Sale",
    rating: 4.5,
    reviewCount: 89,
  },
  {
    id: 3,
    name: "Custom Name Necklace",
    description: "Sterling silver necklace with personalized name",
    price: 49.99,
    salePrice: null,
    img: "https://i.pinimg.com/736x/84/6e/ea/846eea3c696adfb8e42bc119bee2af25.jpg",
    images: [
      "https://i.pinimg.com/736x/bf/9e/2e/bf9e2e1fa2f368a43ebe78074baae4f8.jpg",
      "https://i.pinimg.com/736x/62/83/2c/62832ce20d4411d1089a8eaed110e308.jpg",
      "https://i.pinimg.com/736x/9d/ec/c4/9decc4cc2dedab09eb5b680a3fd260bd.jpg",
      "https://i.pinimg.com/736x/cc/a1/fc/cca1fc1db9f675a8088684cea0aa9470.jpg"
    ],
    category: "jewelry",
    badge: "Bestseller",
    rating: 4.9,
    reviewCount: 215,
  },
  {
    id: 4,
    name: "Photo Cushion Cover",
    description: "Soft cushion cover with your favorite memory",
    price: 24.99,
    salePrice: null,
    img: "https://i.pinimg.com/736x/24/75/4f/24754f1a9ee2cc92b3f3276b1f5884d1.jpg",
    images: [
      "https://i.pinimg.com/736x/16/13/62/1613623cba0240768f888b49e1003d95.jpg",
      "https://i.pinimg.com/736x/dd/7e/f6/dd7ef68780cc9dcee81fb7334c9c6b59.jpg",
      "https://i.pinimg.com/736x/28/13/37/2813372a89fff3072b2d73a34dba3673.jpg",
      "https://i.pinimg.com/736x/01/36/a3/0136a3792d60c2fb9a582fdddf5ca5e8.jpg"
    ],
    category: "cushions",
    badge: null,
    rating: 4.7,
    reviewCount: 67,
  },
  {
    id: 5,
    name: "Custom Keychain",
    description: "Metal keychain with engraved photo",
    price: 12.99,
    salePrice: 9.99,
    img: "https://i.pinimg.com/736x/7b/3a/c9/7b3ac9453b0a27fa07b934d8703b3f97.jpg",
    images: [
      "https://i.pinimg.com/736x/56/6f/49/566f49082c3e653c83b4422474ca3371.jpg",
      "https://i.pinimg.com/736x/85/89/1f/85891f26290bc7e07f3367a7745e879f.jpg",
      "https://i.pinimg.com/736x/0a/81/b7/0a81b79f7ee627ab43e23d4fa9d37ffc.jpg",
      "https://i.pinimg.com/736x/15/f3/07/15f3071377810f6bb4ee3438ade47c83.jpg"
    ],
    category: "keychains",
    badge: "Sale",
    rating: 4.6,
    reviewCount: 103,
  },
  {
    id: 6,
    name: "Personalized Wall Art",
    description: "Canvas print with your favorite photo",
    price: 39.99,
    salePrice: null,
    img: "https://i.pinimg.com/736x/ae/ff/f5/aefff5fe21c58b1bf52305344c915578.jpg",
    images: [
      "https://i.pinimg.com/736x/c3/21/cf/c321cf1801acdd749c551611ec9a9c10.jpg",
      "https://i.pinimg.com/736x/ad/b9/41/adb9417d467f675c48b346e87fc8933c.jpg",
      "https://i.pinimg.com/736x/ef/87/6f/ef876f2ae6f4da15fe92b555a4ef818f.jpg",
      "https://i.pinimg.com/736x/f3/15/bd/f315bdfdb67e8d74b840de69f33bb6ec.jpg"
    ],
    category: "wall-art",
    badge: "New",
    rating: 4.8,
    reviewCount: 42,
  },
  {
    id: 7,
    name: "Custom Calendar",
    description: "12-month calendar with your photos",
    price: 29.99,
    salePrice: null,
    img: "https://i.pinimg.com/736x/0e/8c/e7/0e8ce716ba7bef01385bf0fab4d48713.jpg",
    images: [
      "https://i.pinimg.com/736x/51/14/54/511454e4840761d414d92194176839c1.jpg",
      "https://i.pinimg.com/736x/b0/8d/6c/b08d6c0f9ce5eb79bd2f92b8acd02d7d.jpg",
      "https://i.pinimg.com/736x/c0/47/91/c047916e605b3034f0d75dc34335f5b5.jpg",
      "https://i.pinimg.com/736x/39/52/a1/3952a160cd96e8daf4535bd72aaadd6d.jpg"
    ],
    category: "calendars",
    badge: null,
    rating: 4.7,
    reviewCount: 56,
  },
  {
    id: 8,
    name: "Photo Album",
    description: "Leather-bound album for your precious memories",
    price: 59.99,
    salePrice: 49.99,
    img: "https://i.pinimg.com/736x/46/a6/30/46a630cbbc1d934373b2845175dd9123.jpg",
    images: [
      "https://i.pinimg.com/736x/0a/72/e3/0a72e323cb2ec3ad598d98561fd059c9.jpg",
      "https://i.pinimg.com/736x/b0/c2/0b/b0c20bab661895efde2b97250a17542c.jpg",
      "https://i.pinimg.com/736x/20/5c/cd/205ccd648103605fdff3c8e58e696dfd.jpg",
      "https://i.pinimg.com/736x/34/2a/a4/342aa48d3cbfe5f4844a5cd33633681a.jpg"
    ],
    category: "albums",
    badge: "Sale",
    rating: 4.9,
    reviewCount: 78,
  },
];

export const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "https://i.pinimg.com/736x/d4/15/71/d41571849b4aeacb01649b10753306cf.jpg",
    rating: 5,
    text: "I ordered a custom photo frame for my parents' anniversary and they absolutely loved it! The quality is amazing and delivery was faster than expected.",
  },
  {
    id: 2,
    name: "Michael Brown",
    avatar: "https://i.pinimg.com/736x/1a/37/49/1a374991f4c461a91e88050304606c9f.jpg",
    rating: 4,
    text: "The personalized mug I ordered came out beautifully. My wife uses it every day and the print hasn't faded at all after months of use.",
  },
  {
    id: 3,
    name: "Emily Davis",
    avatar: "https://i.pinimg.com/736x/71/00/80/71008068e0d461157b5cd43b88c47a72.jpg",
    rating: 5,
    text: "I've ordered multiple items from this shop and have never been disappointed. The custom cushion covers are my favorite - such great quality!",
  },
  {
    id: 4,
    name: "David Wilson",
    avatar: "https://i.pinimg.com/736x/d5/e2/d3/d5e2d302042b1252a18b8b2808d979c7.jpg",
    rating: 5,
    text: "The customer service is exceptional. They helped me design a custom wall art piece that perfectly captures our family vacation.",
  },
]

export const howItWorks = [
  {
    id: 1,
    title: "Choose Your Product",
    description: "Browse our collection and select the perfect gift",
    icon: "Gift",
  },
  {
    id: 2,
    title: "Customize It",
    description: "Upload your photos and add personalized text",
    icon: "Pencil",
  },
  {
    id: 3,
    title: "Receive & Enjoy",
    description: "We'll deliver your custom gift right to your doorstep",
    icon: "Package",
  },
]

export const faqs = [
  {
    id: 1,
    question: "How long does shipping take?",
    answer:
      "Standard shipping takes 3-5 business days. Express shipping options are available at checkout for 1-2 business day delivery.",
  },
  {
    id: 2,
    question: "Can I track my order?",
    answer:
      "Yes, once your order ships, you'll receive a tracking number via email that you can use to monitor your delivery status.",
  },
  {
    id: 3,
    question: "What if I'm not satisfied with my order?",
    answer:
      "We offer a 30-day satisfaction guarantee. If you're not completely happy with your purchase, please contact our customer service team for a return or exchange.",
  },
  {
    id: 4,
    question: "How do I upload my photos?",
    answer:
      "During the customization process, you'll be able to upload photos directly from your device. We accept JPG, PNG, and HEIC formats with a minimum resolution of 300 DPI for best results.",
  },
  {
    id: 5,
    question: "Do you offer gift wrapping?",
    answer:
      "Yes, we offer premium gift wrapping services for an additional fee. You can select this option during checkout.",
  },
]

export const instagramPosts = [
  {
    id: 1,
    image: "https://i.pinimg.com/736x/e4/5c/52/e45c5210444971a69c4b740e158d111c.jpg",
    link: "https://instagram.com",
  },
  {
    id: 2,
    image: "https://i.pinimg.com/736x/0a/f4/52/0af45276da3ea6dfb5899b3bb0fe6220.jpg",
    link: "https://instagram.com",
  },
  {
    id: 3,
    image: "https://i.pinimg.com/736x/d5/c4/b2/d5c4b207473aa41cd2af7532adebfbee.jpg",
    link: "https://instagram.com",
  },
  {
    id: 4,
    image: "https://i.pinimg.com/736x/12/72/ba/1272ba515d7d7936828d0d4096ee0b8a.jpg",
    link: "https://instagram.com",
  },
  {
    id: 5,
    image: "https://i.pinimg.com/736x/b6/dc/f0/b6dcf0ad5ef02d95f665ac7a5f334cef.jpg",
    link: "https://instagram.com",
  },
  {
    id: 6,
    image: "https://i.pinimg.com/736x/42/e4/fd/42e4fdb141f94cfe763e9021163b7ca2.jpg",
    link: "https://instagram.com",
  },
]
