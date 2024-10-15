import UserModel from "./user";
import PitchModel from "./pitch";
import Session from "./session";
import LosModel from "./los";
import ProgramModel from "./program";

// Users have many Programs
UserModel.hasMany(ProgramModel, { foreignKey: "userId", onDelete: "CASCADE" });
ProgramModel.belongsTo(UserModel, { foreignKey: "userId" });

// Users have many Pitches
UserModel.hasMany(PitchModel, { foreignKey: "userId", onDelete: "CASCADE" });
PitchModel.belongsTo(UserModel, { foreignKey: "userId"});

// Users have many Loses
UserModel.hasMany(LosModel, { foreignKey: "userId", onDelete: "CASCADE" });
LosModel.belongsTo(UserModel, { foreignKey: "userId"});


// Users have one session
UserModel.hasOne(Session, { foreignKey: "userId", onDelete: "CASCADE" });
Session.belongsTo(UserModel, { foreignKey: "userId" });


// Programs have one pitch
ProgramModel.hasOne(PitchModel, { foreignKey: "pitchId", onDelete: "CASCADE"});
PitchModel.belongsTo(ProgramModel, {foreignKey: "pitchId"  });


// Programs have many LoSes
ProgramModel.hasMany(LosModel, { foreignKey: "programId", onDelete: "CASCADE" });
LosModel.belongsTo(ProgramModel, { foreignKey: "programId" });


export {
	UserModel,
	PitchModel,
	ProgramModel,
	Session,
	LosModel
};




