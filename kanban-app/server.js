const express = require('express')
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const cookieParser = require('cookie-parser');
const app = express();
// To parse cookies from the HTTP Request
app.use(cookieParser());
const port = 3001;
const { User, Project, Task } = require('./data/database');

const handlebars = expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

app.use(express.static(__dirname + '/public'));
app.use(express.static('styles'));
app.use(express.static('views/images'));
app.engine('handlebars', handlebars);
app.set('views', __dirname + '/views/')
app.set('view engine', 'handlebars');
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.use(async(req, res, next) => {
    // Get auth token from the cookies
    const userid = req.cookies['userid'];
    if (!!userid) {
        // Inject the user to the request
        console.log('Here be he: ', userid);
        req.user = await getUser(userid);
    }

    next();
});


const getUser = async(id) => {
    return await User.findByPk(id);
}

// Login - default page
app.get('/', async(req, res) => {
    res.clearCookie("userid");
    const users = await User.findAll();
    res.render('login', { users })
});

// TaskList



/*
    USER END POINTS
*/

// Add a User
app.post('/users/add', async(req, res) => {
    console.log('Details provided', req.body);
    const { name, avatarUrl } = req.body;
    const user = await User.create({ name: name, avatarUrl: avatarUrl });
    console.log('I have made:', user);
    res.redirect(`/projects/${user.id}`)
});

// Get all users
app.get('/users', async(req, res) => {
    const users = await User.findAll();
    res.send(users);
});

// Get a single users
app.get('/users/:id', async(req, res) => {
    const user = await getUser(req.params.id);
    res.send(user);
});

// Delete a user
app.get('/users/:id/delete', async(req, res) => {
    const user = await getUser(req.params.id);
    user.destroy();
    console.log('User has been.... taken care of');
});

/*
    TASK END POINTS
*/

// Add a task - ID of the project is provided
app.post('/tasks/:id/add', async(req, res) => {
    const project = Project.findByPk(req.params.id);
    const task = await Task.create(req.body);
    project.addTask(task);
    res.redirect(`/projects`)
});

// DELETE a task - ID of the task is provided
app.get('/tasks/:id/delete', async(req, res) => {
    const task = await Task.findByPk(req.params.id);
    task.destroy();
    console.log('Task removed');
});

app.get('/tasks/:id', async(req, res) => {
    if (req.user) {
        const tasks = await Task.findAll({
            where: {
                projectId: Number(req.params.id)
            }
        });
        console.log('Tasks i have found', tasks);
        res.render('tasklist', { tasks });
    } else {
        res.redirect(`/`)
    }
});

app.get('/tasks/:id', async(req, res) => {
    // const data = await getUser(req.params.id);
    // const tasks = await data.getTasks();
    res.render('tasklist', {});
});


/*
    PROJECT END POINTS
*/

// Get the users projects
app.get('/projects', async(req, res) => {
    if (req.user) {
        console.log('Here we have: ', req.user.id);
        const projects = await req.user.getProjects();
        res.render('projects', { projects });
    } else {
        res.redirect(`/`)
    }
});

app.get('/projects/:id', async(req, res) => {
    if (req.params.id != null) {
        const user = await getUser(req.params.id);
        const projects = await user.getProjects();

        res.cookie('userid', user.id);

        res.render('projects', { projects });
    }
});

// Add a project
app.post('/project/add', async(req, res) => {
    const { name } = req.body;
    const project = await Project.create({ name, userId: Number(req.user.id) })
    await req.user.addProject(project);
    res.redirect(`/projects`)
});

// Delete a project
app.post('/project/:id/delete', async(req, res) => {
    const project = await Project.findByPk(req.params.id)
    project.destroy();
    console.log('Project is bye bye');
    res.redirect('/projects');
});

// Delete a project
app.post('/project/:id/update', async(req, res) => {
    const project = await Project.findByPk(req.params.id)
    project.update({ name: req.body.name });
});

// Single project.. do we need?
app.get('/project/:id', async(req, res) => {
    const project = await Project.findOne({
        where: {
            id: req.params.id
        },
        include: [{ model: Task, as: 'tasks' }]
    });

    console.log('Your single project sir', { project });

    res.send(project);
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})