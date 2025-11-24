import User from "../models/auth.model.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { asyncHandler } from "../utils/asyncHandler.js";

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "10d" }
    );
};

// login
export const login = asyncHandler(async (req,res) => {
    const { email, password } = req.body;    
    let role = null;

    const institutionDomains = [ ".edu", ".ac.in", ".college.edu", ".university.in" ];

    if(email === "chandermanimishra91@gmail.com") role = "super_admin";
    else if(email.endsWith("@ugc.gov.in")) role = "ugc";
    else if(email.endsWith("@aicte.gov.in")) role = "aicte";
    else if (institutionDomains.some(domain => email.endsWith(domain)))
        role = "institution";


    if (!role) return res.status(403).json({ message: "Email Domain not authorized" });

    let UserExist = await User.findOne({ email });

    if(!UserExist){
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password,salt);
        UserExist = await User.create({ name: "" , email, password: hash, role })
    }

    return res
        .status(200)
        .json({
        message: "login successfully",
        token: generateToken(UserExist),
        role: UserExist.role
    });
});


export const getProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const user =  await User.findById(userId).select('-password');

    if(!user){
        return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
});


// 🔹 Logout
export const logout = asyncHandler(async (req, res) => {
    res.clearCookie('token');
    return res.status(200).json({ message: 'User logged out successfully' });
});
