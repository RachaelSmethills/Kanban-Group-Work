const { Sequelize, Model, DataTypes } = require('sequelize'),
    defaultData = require('../defaultdata.json');
const path = require('path');
require('dotenv').config();

const connectionSettings = {
    test: { dialect: 'sqlite', storage: 'sqlite::memory:', logging: false },
    dev: { dialect: 'sqlite', storage: path.join(__dirname, 'data.db'), logging: false },
    production: { dialect: 'postgres', protocal: 'postgres' }
}

const moo = process.env.NODE_ENV === 'production';
console.log('we are runnig in production', moo, process.env.NODE_ENV);

const sequelize = process.env.NODE_ENV === 'production' ?
    new Sequelize(process.env.DATABASE_URL, connectionSettings[process.env.NODE_ENV]) :
    new Sequelize(connectionSettings[process.env.NODE_ENV]);

class User extends Model {}
class Project extends Model {}
class Task extends Model {}

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: DataTypes.STRING,
    avatarUrl: DataTypes.STRING

}, { sequelize, modelName: 'user', freezeTableName: true });

Project.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: DataTypes.STRING

}, { sequelize, modelName: 'project', freezeTableName: true });

Task.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    desc: DataTypes.STRING,
    status: DataTypes.NUMBER

}, { sequelize, modelName: 'task', freezeTableName: true });

User.hasMany(Project, { onDelete: 'cascade' });
Project.belongsTo(User);

Project.hasMany(Task, { onDelete: 'cascade', as: 'tasks' });
Task.belongsTo(Project);

sequelize.sync().then(async() => {
    const taskQueue = defaultData.map(async(json_data) => {
        const user = await User.create({ id: json_data.id, name: json_data.name, avatarUrl: json_data.avatarUrl });
        const projects = await Promise.all(json_data.projects.map(async(_project) => {
            const tasks = await Promise.all(_project.tasks.map(({ id, desc, status }) => Task.create({ id, desc, status })))
            const project = await Project.create({ id: _project.id, name: _project.name });
            return project.setTasks(tasks);
        }))
        return await user.setProjects(projects);
    })
    await Promise.all(taskQueue).then(data => {
        console.log('Default data loaded', JSON.stringify(data, null, 2));
    }).catch(console.error);
})

module.exports = {
    User,
    Project,
    Task,
    sequelize
}