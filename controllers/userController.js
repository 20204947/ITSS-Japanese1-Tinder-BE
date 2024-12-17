const User = require('../models/user');
const Favorites = require('../models/favourite');
const Action = require('../models/action');
const Matching = require('../models/matching');
const { Op } = require('sequelize');

exports.register = async (req, res) => {
    const { email, password, name, gender, role, dob } = req.body;

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const newUser = await User.create({ email, password, name, gender, role, dob });
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (err) {
        res.status(500).json({ message: 'Error registering user', error: err.message });
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email, password } });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        // Truy vấn FavouriteName dựa trên FavouriteID
        const favourites = await Favorites.findAll({
            where: {
                favouriteID: [
                    user.firstFavouriteID,
                    user.secondFavouriteID,
                    user.thirdFavouriteID,
                    user.fourthFavouriteID,
                    user.fifthFavouriteID
                ].filter(id => id !== null), // Loại bỏ giá trị null nếu không có ID
            },
        });

        const favouriteNames = favourites.map(fav => fav.favouriteName);
        // Lưu thông tin user vào session
        req.session.user = {
            userID: user.userID,
            email: user.email,
            name: user.name,
            role: user.role,
            gender: user.gender,
            dob: user.dob,
            imageURL: user.imageURL,
            firstFavouriteID: favouriteNames[0],
            secondFavouriteID: favouriteNames[1],
            thirdFavouriteID: favouriteNames[2],
            fourthFavouriteID: favouriteNames[3],
            fifthFavouriteID: favouriteNames[4],
        };

        res.status(200).json({ message: 'Login successful', user });
    } catch (err) {
        res.status(500).json({ message: 'Error logging in', error: err.message });
    }
};


// Lấy thông tin người dùng
exports.profile = async (req, res) => {
    try {
        // Kiểm tra xem session có tồn tại không
        const userID = req.session?.user?.userID;
        if (!userID) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        // Truy vấn thông tin người dùng từ DB
        const user = await User.findByPk(userID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Trả về thông tin người dùng
        return res.status(200).json({
            message: "User profile retrieved successfully",
            user: {
                userID: user.userID,
                email: user.email,
                name: user.name,
                role: user.role,
                gender: user.gender,
                dob: user.dob,
                imageURL: user.imageURL,
                firstFavouriteID: user.firstFavouriteID,
                secondFavouriteID: user.secondFavouriteID,
                thirdFavouriteID: user.thirdFavouriteID,
                fourthFavouriteID: user.fourthFavouriteID,
                fifthFavouriteID: user.fifthFavouriteID,
            },
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error retrieving user profile",
            error: err.message,
        });
    }
};

// Cập nhật thông tin người dùng
exports.updateProfile = async (req, res) => {
    try {
        // Kiểm tra xem session có tồn tại không
        const userID = req.session?.user?.userID;
        if (!userID) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        // Lấy người dùng từ DB
        const user = await User.findByPk(userID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Lấy dữ liệu từ body request
        const { name, email, gender, dob, imageURL } = req.body;

        // Cập nhật từng trường nếu có
        if (name !== undefined) {
            user.name = name;
        }

        if (email !== undefined) {
            // Kiểm tra email có hợp lệ và có bị trùng không
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                return res.status(400).json({ message: "Invalid email format" });
            }

            const existingUser = await User.findOne({ where: { email } });
            if (existingUser && existingUser.userID !== userID) {
                return res.status(400).json({ message: "Email is already taken" });
            }

            user.email = email;
        }

        if (gender !== undefined) {
            const parsedGender = parseInt(gender, 10); // Chuyển chuỗi thành số
            if (![0, 1, 2].includes(parsedGender)) {
                return res.status(400).json({ message: "Invalid gender value" });
            }
            user.gender = parsedGender;
        }


        if (dob !== undefined) {
            if (isNaN(new Date(dob).getTime())) {
                return res.status(400).json({ message: "Invalid date format for DOB" });
            }
            user.dob = dob;
        }

        if (imageURL !== undefined) {
            user.imageURL = imageURL;
        }

        // Lưu thay đổi vào DB
        await user.save();

        // Cập nhật session (nếu cần)
        req.session.user = {
            ...req.session.user,
            name: user.name,
            email: user.email,
            gender: user.gender,
            dob: user.dob,
            imageURL: user.imageURL,
        };

        return res.status(200).json({
            message: "User profile updated successfully",
            user: {
                userID: user.userID,
                email: user.email,
                name: user.name,
                role: user.role,
                gender: user.gender,
                dob: user.dob,
                imageURL: user.imageURL,
            },
        });
    } catch (err) {
        const isDev = process.env.NODE_ENV === "development";
        return res.status(500).json({
            message: "Error updating user profile",
            error: isDev ? err.message : "Internal server error",
        });
    }
};




exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Logout failed" });
        }
        res.status(200).json({ message: "Logout successful" });
    });
}

exports.getMatchingUsers = async (req, res) => {
    try {
        const currentUserID = req.session?.user?.userID;
        if (!currentUserID) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        const actions = await Action.findAll({
            where: { userID: currentUserID },
            attributes: ['targetUserID']
        });

        const actionedUserIDs = actions.map(action => action.targetUserID);

        const matchingUsers = await User.findAll({
            where: {
                userID: {
                    [Op.notIn]: actionedUserIDs,
                    [Op.ne]: currentUserID
                }
            },
            attributes: [
                'userID', // ID người dùng
                'name', // Tên người dùng
                'role', // Vai trò người dùng
                'imageURL', // Avatar người dùng
                'firstFavouriteID', // ID sở thích đầu tiên
                'secondFavouriteID', // ID sở thích thứ hai
                'thirdFavouriteID', // ID sở thích thứ ba
                'fourthFavouriteID', // ID sở thích thứ tư
                'fifthFavouriteID' // ID sở thích thứ năm
            ]
        });

        // Lấy tên sở thích từ các ID sở thích
        const transformedUsers = await Promise.all(matchingUsers.map(async (user) => {
            // Lấy tên các sở thích từ bảng Favorite bằng ID
            const firstFavorite = await Favorites.findByPk(user.firstFavouriteID);
            const secondFavorite = await Favorites.findByPk(user.secondFavouriteID);
            const thirdFavorite = await Favorites.findByPk(user.thirdFavouriteID);
            const fourthFavorite = await Favorites.findByPk(user.fourthFavouriteID);
            const fifthFavorite = await Favorites.findByPk(user.fifthFavouriteID);

            return {
                userID: user.userID,
                name: user.name,
                role: user.role,
                avatar: user.imageURL,
                favorites: [
                    firstFavorite ? firstFavorite.favouriteName : null,
                    secondFavorite ? secondFavorite.favouriteName : null,
                    thirdFavorite ? thirdFavorite.favouriteName : null,
                    fourthFavorite ? fourthFavorite.favouriteName : null,
                    fifthFavorite ? fifthFavorite.favouriteName : null
                ]
            };
        }));

        res.status(200).json({ message: 'Matching users retrieved successfully', users: transformedUsers });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error getting matching users', error: error.message });
    }
}

exports.likeOrDislike = async (req, res) => {
    const { targetUserID, action } = req.body;
    const currentUserID = req.session?.user?.userID;
    if (!currentUserID) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    try {
        const newAction = await Action.create({
            userID: currentUserID,
            targetUserID: targetUserID,
            action: action
        });

        const existingAction = await Action.findOne({
            where: {
                userID: targetUserID,
                targetUserID: currentUserID
            }
        });

        if (existingAction) {
            if (action === 1 && existingAction.action === 1) {
                const matching = await Matching.create({
                    userA: currentUserID,
                    userB: targetUserID,
                    status: 1,
                });

                return res.status(200).json({
                    message: "Action updated successfully and a match was created",
                    match: matching
                });

            }
        }

        res.status(201).json({ message: "Action saved successfully", action: newAction });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error processing action', error: err.message });
    }
};
