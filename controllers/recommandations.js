import Lobby from "../models/lobby.js";
import Campsite from "../models/campsite.js";
import User from "../models/user.js";
import { messageResponse } from "../utils/messageResponse.js";

const recommandLobbiesWithPoints = async (user) => {
    const userProfile = await Profile.findOne({ user: user.id }).exec();

    if (!userProfile) {
        throw new Error("User profile not found");
    }
    // Extract relevant profile information
    const userGender = userProfile.gender || "";
    const userAge = userProfile.age || 0;
    const userExperience = userProfile.experience || "";
    const userInterests = userProfile.interests || [];

    // Find lobbies that match user's preferences
    const recommendedLobbies = await Lobby.find({
        open: true, // Lobbies that are open
    }).populate("owner").populate("owner.profile").exec();

    console.log(recommendedLobbies)

    // Calculate points for each lobby based on matching attributes
    const lobbiesWithPoints = recommendedLobbies.map((lobby) => {
        let points = 0;

        if (lobby.gender === userGender || lobby.gender === "") {
            points++;
        }

        if (lobby.age === userAge || lobby.age === "") {
            points++;
        }

        if (lobby.experience === userExperience || lobby.experience === "") {
            points++;
        }

        return {
            lobby,
            points,
        };
    });

    // Exclude lobbies that the user has already joined
    const filteredLobbies = lobbiesWithPoints.filter(
        (entry) => !entry.lobby.joined.includes(req.user.id)
    );

    // Sort lobbies based on total points
    const sortedLobbies = filteredLobbies.sort((a, b) => b.points - a.points);

    return { lobbies: sortedLobbies }
}




const lobby = async (req, res) => {
    try {
        // Get the user's profile
        const lobbies = await recommandLobbiesWithPoints(req.user);
        return res.json({ lobbies });
    } catch (error) {
        console.error("Error in lobbyRecommendationHandler:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const recommandCampsites = async (user) => {
    const userProfile = await Profile.findOne({ user: user.id })

        .populate("favorites") // Populate the favorites array with Campsite documents
        .exec();

    if (!userProfile) {
        throw new Error("User profile not found");
    }

    // Extract user interests and equipment
    const userInterests = userProfile.interests || [];
    const userEquipment = userProfile.equipment || [];

    // Find campsites that match user interests or equipment
    const recommendedCampsites = await Campsite.find({
        $or: [
            { category: { $in: userInterests } },
            { amenities: { $in: userEquipment } },
        ],
    }).exec();

    // Exclude user's favorite campsites from recommendations
    const filteredRecommendations = recommendedCampsites.filter(
        (campsite) =>
            !userProfile.favorites.some((fav) => fav.equals(campsite._id))
    );

    // Calculate points for each campsite based on matching attributes
    const campsitesWithPoints = filteredRecommendations.map((campsite) => {
        let points = 0;

        // You can add more criteria and adjust points accordingly

        return {
            campsite,
            points,
        };
    });


    // Sort campsite recommendations based on total points
    const sortedRecommendations = campsitesWithPoints.sort(
        (a, b) => b.points - a.points
    );

    return { campsites: sortedRecommendations };

}

const campsite = async (req, res) => {
    try {
        return res.json({ campsites: await recommandCampsites(req.user) });
    } catch (error) {
        console.error("Error in campsite recommendationHandler:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
const search = async (req, res) => {
    const { query } = req.query;

    if (query.length < 1) {

        return res.json(messageResponse("Please enter a search query"))
    }
    try {
        // Find lobbies that match the query
        const recommendedLobbies = await Lobby.find({
            $or: [{ name: { $regex: query, $options: "i" } }],
        }).exec();

        // Find campsites that match the query
        const recommendedCampsites = await Campsite.find({
            $or: [{ name: { $regex: query, $options: "i" } }],
        }).exec();

        // Find users that match the query
        const recommendedUsers = await User.find({
            $or: [{ name: { $regex: query, $options: "i" } }],
        }).exec();

        // Calculate points for each result based on matching attributes
        const resultsWithPoints = [
            { results: recommendedLobbies, model: 'Lobby' },
            { results: recommendedCampsites, model: 'Campsite' },
            { results: recommendedUsers, model: 'User' },
        ].map(({ results, model }) => {
            const points = results.reduce((totalPoints, result) => {
                // You can add more criteria and adjust points accordingly
                return totalPoints + 1; // Example: 1 point for each match
            }, 0);

            return {
                model,
                results,
                points,
            };
        });

        // Sort results based on total points
        const sortedResults = resultsWithPoints.sort((a, b) => b.points - a.points);

        return res.json({ results: sortedResults });
    } catch (error) {
        console.error("Error in searchHandler:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


export const recommandation = {
    search,
    campsite,
    lobby
}