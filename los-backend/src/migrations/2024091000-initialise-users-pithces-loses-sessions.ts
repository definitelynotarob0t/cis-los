import { DataTypes, QueryInterface, Sequelize } from 'sequelize';


export async function up({ context }: { context: QueryInterface }) {
  await context.createTable('users', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
      },
    email: {
      type: DataTypes.TEXT,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
      },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [60, 60], 
      }
    },
    disabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  })
  await context.createTable('pitches', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
    title: {
        type: DataTypes.TEXT,
        allowNull: true
      },
    main_activity: {
        type: DataTypes.TEXT,
        allowNull: true
      },
    challenge: {
        type: DataTypes.TEXT,
        allowNull: true
      },
    outcome: {
        type: DataTypes.TEXT,
        allowNull: true
      },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' },
      onDelete: "CASCADE"
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  })
  await context.createTable('loses', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: { model: 'pitches', key: 'id'}
    },
    inputs: {
        type: DataTypes.ARRAY(DataTypes.STRING),        
        allowNull: true
    },
    activities: {
        type: DataTypes.ARRAY(DataTypes.STRING),        
        allowNull: true
    },
    outputs: {
        type: DataTypes.ARRAY(DataTypes.STRING),        
        allowNull: true
    },
    usages: {
        type: DataTypes.ARRAY(DataTypes.STRING),        
        allowNull: true
    },
    outcomes: {
        type: DataTypes.ARRAY(DataTypes.STRING),        
        allowNull: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onDelete: "CASCADE"
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  })
  await context.createTable('sessions', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users',  key: 'id' },
        onDelete: 'CASCADE'
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
    })
}
  

export async function down({ context }: { context: QueryInterface }) {
  await context.dropTable('users');
  await context.dropTable('pitches');
  await context.dropTable('loses');
  await context.dropTable('sessions');

}



