import Userschema, { User } from "../models/user";
import ProfileSchema, { ProfileInterface } from "../models/profile";

export const findAllUsersWithProfiles = async () : Promise<[User[], ProfileInterface[]] | null> => {
    const users = await Userschema.find();
    // Extract user IDs
    const userIDs = users.map(user => user._id); 
    // Find corresponding profiles
    const profiles = await ProfileSchema.find({ userID: { $in: userIDs } }); 
    return [users, profiles];
};

export const deleteUser = async (
    userID: string
    ) => {
    await Userschema.findByIdAndDelete(userID);
    await ProfileSchema.findOneAndDelete({ userID: userID });
}

export const updateEmail = async (
    userID: string,
    email: string,
    ) => {
    await Userschema.findOneAndUpdate(
        { _id: userID },
        { $set: {email: email } });
}