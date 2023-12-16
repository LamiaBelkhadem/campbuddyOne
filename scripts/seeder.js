const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require("../models/user.js");
const Campsite = require("../models/campsite.js");
const Lobby = require("../models/lobby.js");
const Review = require("../models/review.js");


mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

// Function to seed the database
async function seedDatabase() {
    try {
        // Clear existing data
        await Promise.all([
            Campsite.deleteMany({}),
            User.deleteMany({}),
            Review.deleteMany({}),
            Lobby.deleteMany({}),
        ]);

        // Seed Campsites
        const campsiteData = [
            // Add your campsite data here
            {
                name: 'Campsite 1',
                location: 'Location 1',
                category: 'Category 1',
                // ... other fields
            },
            {
                name: 'Campsite 2',
                location: 'Location 2',
                category: 'Category 2',
                // ... other fields
            },
            // Add more campsites as needed
        ];

        const campsites = await Campsite.create(campsiteData);

        // Seed Users
        const userData = [
            // Add your user data here
            {
                username: 'user1',
                email: 'user1@example.com',
                password: await bcrypt.hash('password123', 10),
                // ... other fields
            },
            {
                username: 'user2',
                email: 'user2@example.com',
                password: await bcrypt.hash('password456', 10),
                // ... other fields
            },
            // Add more users as needed
        ];

        const users = await User.create(userData);

        // Seed Reviews
        const reviewData = [
            // Add your review data here
            {
                userId: users[0]._id,
                rating: 4,
                text: 'Great experience!',
                // ... other fields
            },
            {
                userId: users[1]._id,
                rating: 5,
                text: 'Awesome place!',
                // ... other fields
            },
            // Add more reviews as needed
        ];

        const reviews = await Review.create(reviewData);

        // Seed Lobbies
        const lobbyData = [
            // Add your lobby data here
            {
                name: 'Lobby 1',
                start: '2023-01-01',
                end: '2023-01-07',
                time: '10:00 AM',
                campsite: campsites[0]._id,
                maximumParticipants: 10,
                participants: [],
                // ... other fields
            },
            {
                name: 'Lobby 2',
                start: '2023-02-01',
                end: '2023-02-07',
                time: '2:00 PM',
                campsite: campsites[1]._id,
                maximumParticipants: 15,
                participants: [],
                // ... other fields
            },
            // Add more lobbies as needed
        ];

        const lobbies = await Lobby.create(lobbyData);

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        // Close the connection when done
        mongoose.connection.close();
    }
}

// Call the seed function
seedDatabase();
