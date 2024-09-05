import UserModel from "./user";
import PitchModel from "./pitch";
import Session from "./session";

UserModel.hasOne(PitchModel);
PitchModel.belongsTo(UserModel);

UserModel.hasOne(Session);
Session.belongsTo(UserModel);

export {
    UserModel,
    PitchModel,
    Session
};