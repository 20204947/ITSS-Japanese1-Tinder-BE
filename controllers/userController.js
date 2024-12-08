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
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            gender: user.gender,
            dob: user.dob,
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

exports.profile = (req, res) => {
    if (req.session.user) {
        return res.status(200).json({ message: 'User logged in', user: req.session.user });
    }
    res.status(401).json({ message: 'User not logged in' });
}

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Logout failed" });
        }
        res.status(200).json({ message: "Logout successful" });
    });
}
