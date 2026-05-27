import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

const register = async (req, res) => {
    try {
        const { name, username, password } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Tên đăng nhập đã tồn tại" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const customerCode = `WB-${Math.floor(100000 + Math.random() * 900000)}`;

        const user = await User.create({
            name,
            username,
            password: hashedPassword,
            customerCode
        });

        res.json({
            message: "Đã đăng ký thành công!",
            token: generateToken(user)
        })
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Có lỗi xảy ra, vui lòng thử lại" });
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Tên đăng nhập hoặc mật khẩu không đúng" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Tên đăng nhập hoặc mật khẩu không đúng" });
        }

        res.json({
            message: "Đăng nhập thành công!",
            user,
            token: generateToken(user)
        })
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Có lỗi xảy ra, vui lòng thử lại" });
    }
}

const logout = async (req, res) => {
    try {
        res.json({
            message: "Đăng xuất thành công!"
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Có lỗi xảy ra, vui lòng thử lại" });
    }
}

const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.phone = req.body.phone || user.phone;
            user.address = req.body.address || user.address;
            
            if (req.body.password) {
                user.password = await bcrypt.hash(req.body.password, 10);
            }

            const updatedUser = await user.save();

            res.json({
                message: "Cập nhật thông tin thành công!",
                user: updatedUser,
                token: generateToken(updatedUser)
            });
        } else {
            res.status(404).json({ message: "Không tìm thấy người dùng" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Có lỗi xảy ra, vui lòng thử lại" });
    }
}

const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Mật khẩu hiện tại không đúng" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: "Đổi mật khẩu thành công!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Có lỗi xảy ra, vui lòng thử lại" });
    }
}

export {
    register,
    login,
    logout,
    updateProfile,
    changePassword
}

