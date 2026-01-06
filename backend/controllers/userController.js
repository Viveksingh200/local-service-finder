import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
    try {
        const { name, email, phone, password} = req.body;

    if(!name || !email || !phone || !password){
        return res.status(404).json({message: "All fields are required!"});
    };

    const existingUser = await User.findOne({phone});
    if(existingUser){
        return res.status(400).json({message: "User with this phone number already exists!"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
        name: name,
        email: email,
        phone: phone,
        password: hashedPassword
    })

    return res.status(201).json({
        message: "User created successfully!",
        data: {
            newUser
        }
    });
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
};

export const loginUser = async (req, res) => {
    const {phone, password} = req.body;
}