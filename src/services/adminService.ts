import Userschema, { User } from "../models/user";
import ProfileSchema, { ProfileInterface } from "../models/profile";
import PromoCodeSchema, { Promocode } from "../models/promocode";
import { Double } from "mongodb";

export const findAllUsersWithProfiles = async (): Promise<
  [User[], ProfileInterface[]] | null
> => {
  const users = await Userschema.find();
  // Extract user IDs
  const userIDs = users.map((user) => user._id);
  // Find corresponding profiles
  const profiles = await ProfileSchema.find({ userID: { $in: userIDs } });
  return [users, profiles];
};

export const deleteUser = async (userID: string) => {
  await Userschema.findByIdAndDelete(userID);
  await ProfileSchema.findOneAndDelete({ userID: userID });
};

export const updateEmail = async (userID: string, email: string) => {
  await Userschema.findOneAndUpdate(
    { _id: userID },
    { $set: { email: email } }
  );
};

export const findAllPromoCodes = async (
  keyWords: string
): Promise<Promocode[] | null> => {
  let promoCodes = [];
  if (!keyWords) {
    promoCodes = await PromoCodeSchema.find();
  } else {
    promoCodes = await PromoCodeSchema.find({
      code: { $regex: keyWords, $options: "i" },
    });
  }
  return promoCodes;
};

export const removePromoCode = async (promoCodeID: string) => {
  await PromoCodeSchema.findOneAndDelete({ _id: promoCodeID });
};

export const createPromoCode = async (
  code: string,
  expirationDate: Date,
  discountRate: Number,
  minThreshold: Number
): Promise<String> => {
  return new Promise(async (resolve, reject) => {
    try {
      //edit name must different from existing promocode name
      const promoCodes = await PromoCodeSchema.find({ code: code }).exec();

      if (promoCodes.length > 0) {
        reject(
          "Sorry, the promoCode with this name can not be created, because the input name has already exist."
        );
        return;
      }

      const newPromoCode = new PromoCodeSchema({
        code,
        expirationDate,
        discountRate,
        minThreshold,
      });

      await newPromoCode.save().catch(() => {
        return "error";
      });

      resolve("success");
    } catch (err) {}
  });
};

export const editPromoCode = async (
  promoCodeID: string,
  code: string,
  expirationDate: Date,
  discountRate: Number,
  minThreshold: Number
): Promise<String> => {
  return new Promise(async (resolve, reject) => {
    try {
      //edit name must different from existing promocode name
      const promoCodes = await PromoCodeSchema.find({
        $and: [{ _id: { $ne: promoCodeID } }, { code: code }],
      }).exec();

      if (promoCodes.length > 0) {
        await PromoCodeSchema.findOneAndUpdate(
          { _id: promoCodeID },
          {
            $set: {
              expirationDate: expirationDate,
              discountRate: discountRate,
              minThreshold: minThreshold,
            },
          }
        ).catch(() => {
          return "error";
        });

        reject(
          "Sorry, the promoCode Name will not changed, because the input name has already exist."
        );
        return;
      }

      await PromoCodeSchema.findOneAndUpdate(
        { _id: promoCodeID },
        {
          $set: {
            code: code,
            expirationDate: expirationDate,
            discountRate: discountRate,
            minThreshold: minThreshold,
          },
        }
      ).catch(() => {
        return "error";
      });

      resolve("success");
    } catch (err) {}
  });
};
