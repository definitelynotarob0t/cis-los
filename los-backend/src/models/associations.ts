import UserModel from "./user";
import PitchModel from "./pitch";
import Session from "./session";
import LosModel from "./los";
import ProgramModel from "./program";

UserModel.hasMany(ProgramModel, { foreignKey: 'userId', onDelete: 'CASCADE',});
ProgramModel.belongsTo(UserModel, {   foreignKey: 'userId', });

UserModel.hasOne(Session, { onDelete: 'CASCADE', foreignKey: 'userId'});
Session.belongsTo(UserModel, { foreignKey: 'userId'});


ProgramModel.hasOne(PitchModel, { foreignKey: 'pitchId', onDelete: 'CASCADE'});
PitchModel.belongsTo(ProgramModel, {foreignKey: 'pitchId'  });

ProgramModel.hasOne(LosModel, {foreignKey: 'losId',  onDelete: 'CASCADE',});
LosModel.belongsTo(PitchModel, { foreignKey: 'losId'});


export {
    UserModel,
    PitchModel,
    Session,
    LosModel
};