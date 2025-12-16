const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const products = [
    {
        id: "1",
        name: "Wireless Headphones",
        description: "High-quality wireless headphones with noise cancellation",
        price: 99.99,
        category: "Electronics",
        image: "/wireless-headphones.png",
        stock: 50,
        manufacturer: "TechCorp",
    },
    {
        id: "2",
        name: "Cotton T-Shirt",
        description: "Comfortable 100% cotton t-shirt available in multiple sizes",
        price: 19.99,
        category: "Clothing",
        image: "/cotton-tshirt.png",
        stock: 200,
        manufacturer: "FashionHub",
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    },
    {
        id: "3",
        name: "JavaScript Guide",
        description: "Complete guide to modern JavaScript programming",
        price: 29.99,
        category: "Books",
        image: "/javascript-programming-book.png",
        stock: 100,
        manufacturer: "BookPress",
    },
    {
        id: "4",
        name: "Garden Tool Set",
        description: "Complete set of essential garden tools including shovel, rake, and pruning shears",
        price: 49.99,
        category: "Home & Garden",
        image: "/garden-tool-set.jpg",
        stock: 30,
        manufacturer: "GardenPro",
    },
    {
        id: "5",
        name: "Yoga Mat",
        description: "Non-slip yoga mat for all levels, eco-friendly material",
        price: 24.99,
        category: "Sports",
        image: "/rolled-yoga-mat.png",
        stock: 75,
        manufacturer: "FitLife",
    },
    {
        id: "6",
        name: "Building Blocks Set",
        description: "Educational building blocks for kids aged 1+, 500 pieces",
        price: 34.99,
        category: "Toys",
        image: "/colorful-building-blocks.png",
        stock: 120,
        manufacturer: "ToyWorld",
    },
    {
        id: "7",
        name: "Leather Jacket",
        description: "Premium leather jacket with classic design",
        price: 149.99,
        category: "Clothing",
        image: "/black-leather-jacket.png",
        stock: 35,
        manufacturer: "FashionHub",
        sizes: ["S", "M", "L", "XL"],
    },
    {
        id: "8",
        name: "Smart Watch",
        description: "Fitness tracker with heart rate monitor and GPS",
        price: 199.99,
        category: "Electronics",
        image: "/smart-watch-fitness.png",
        stock: 60,
        manufacturer: "TechCorp",
    },
    {
        id: "9",
        name: "Running Shoes",
        description: "Lightweight running shoes with excellent cushioning",
        price: 89.99,
        category: "Clothing",
        image: "/running-shoes.jpg",
        stock: 100,
        manufacturer: "FitLife",
        sizes: ["7", "8", "9", "10", "11", "12"],
    },
    {
        id: "10",
        name: "Cookbook Collection",
        description: "Essential cookbook with 200+ recipes from around the world",
        price: 24.99,
        category: "Books",
        image: "/cookbook-recipes.jpg",
        stock: 80,
        manufacturer: "BookPress",
    },
    {
        id: "11",
        name: "LED Desk Lamp",
        description: "Adjustable LED desk lamp with multiple brightness levels",
        price: 39.99,
        category: "Home & Garden",
        image: "/led-desk-lamp.png",
        stock: 45,
        manufacturer: "GardenPro",
    },
    {
        id: "12",
        name: "Tennis Racket",
        description: "Professional-grade tennis racket for advanced players",
        price: 129.99,
        category: "Sports",
        image: "/tennis-racket.png",
        stock: 25,
        manufacturer: "FitLife",
    },
];

const importData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        const createdUsers = await User.create([
            {
                name: 'Admin User',
                email: 'admin@eshop.com',
                password: 'admin123',
                role: 'admin'
            },
            {
                name: 'John Doe',
                email: 'user@example.com',
                password: 'password123',
                role: 'user'
            }
        ]);

        const adminUser = createdUsers[0]._id;
        const sampleProducts = products.map(product => {
            return { ...product, user: adminUser };
        });

        await Product.insertMany(sampleProducts);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
