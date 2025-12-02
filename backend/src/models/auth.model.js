import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    role: { type: String, enum: ["institution", "ugc", "aicte", "super_admin"], require: true },
    created_at: { type: Date, default: Date.now }
});

const User = mongoose.model("User",userSchema);

export default User;