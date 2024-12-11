const User = require('../models/user');
const Favourites = require('../models/favourite');


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
        const favourites = await Favourites.findAll({
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
