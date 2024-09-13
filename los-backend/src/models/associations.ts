import UserModel from "./user";
import PitchModel from "./pitch";
import Session from "./session";
import LosModel from "./los";


UserModel.hasOne(PitchModel, {
    onDelete: 'CASCADE', // When a user is deleted, delete the associated pitch
    foreignKey: 'userId'
});
PitchModel.belongsTo(UserModel, { foreignKey: 'userId' });

UserModel.hasOne(LosModel, {
    onDelete: 'CASCADE', // When a user is deleted, delete the associated los
    foreignKey: 'userId'
});
LosModel.belongsTo(UserModel, { foreignKey: 'userId' });

UserModel.hasOne(Session, {
    onDelete: 'CASCADE', // When a user is deleted, delete the associated session
    foreignKey: 'userId'
});
Session.belongsTo(UserModel, { foreignKey: 'userId'});


export {
    UserModel,
    PitchModel,
    Session,
    LosModel
};