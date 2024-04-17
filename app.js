const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/user');
const Phone = require('./models/phone');


// connect to mongodb & listen for requests
//const dbURI = "paste here your mongodb uri that can be get form connect button";
const dbURI = "mongodb://127.0.0.1:27017/phonedb";
//const dbURI = "mongodb://localhost:60380/futuredial";
const port = 8080;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true }) //this return promise
  .then((result) =>{ console.log("Database-connected"); app.listen(port); console.log(`running on port ${port}...`)})
  //after db connected than it will listen to port3000
  .catch(err => console.log(err)); //else errors will be shown

// express app
const app = express();

// register view engine
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
  })
); 
// middleware & static files
app.use(express.static('public')); //this will helps to use style.css file
app.use(express.urlencoded({ extended: true })); //this will helps to get submitted data of form in req.body obj

var search = require('./routes/search');
app.use('/',search);
/**************************auth****************************************************/
const authenticate = async (req, res, next) => {
  try {
    // Example: Authenticate based on user ID in request header
    const user = await User.findById(req.header('userId'));
    if (!user) {
      return res.status(401).send('Authentication failed');
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  res.status(403).send('Access denied');
};


/***************************** login++ **************************************************/
const users = [
  { username: 'admin', password: 'password' },
  { username: 'user', password: '123456' },
];

// Middleware to check if a user is logged in
function requireLogin(req, res, next) {
  if (req.session.user) {
    console.log("requireLogin: "+ req.session.user);
    next();
  } else {
    res.redirect('/login');
  }
}
// Routes
// app.get('/', requireLogin, (req, res) => {
//   // Your CRUD operations and views here
//   console.log(req.session);
//   res.render('index',{ user: req.session.user });
// });

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find((u) => u.username === username && u.password === password);

  if (user) {
    req.session.user = user;
    res.redirect('/');
  } else {
    res.render('login', { error: 'Invalid username or password' });
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

/****************************login--***************************************************/

// home routes
app.get('/', (req, res) => {
  res.redirect('/phones'); //this will redirect page to /phones
});

//users i.e index route
// app.get('/users',(req,res)=>{
//   console.log("req made on"+req.url);
//    User.find().sort({createdAt:-1})//it will find all data and show it in descending order
//     .then(result => { 
//       res.render('index', { users: result ,title: 'Home' }); //it will then render index page along with users
//     })
//     .catch(err => {
//       console.log(err);
//     });
// })
//phones i.e index route
// app.get('/phones',requireLogin,(req,res)=>{
//   console.log("req made on"+req.url);
//   console.log(req.session);
//    Phone.find().sort({createdAt:-1})//it will find all data and show it in descending order
//     .then(result => { 
//       res.render('phone', { phones: result ,title: 'Phone-Home',user: req.session.user }); //it will then render index page along with users
//     })
//     .catch(err => {
//       console.log(err);
//     });
// })

app.get('/phones',(req,res)=>{
  console.log("req made on"+req.url);
  console.log(req.session);
   Phone.find().sort({createdAt:-1})//it will find all data and show it in descending order
    .then(result => { 
      res.render('phone', { phones: result ,title: 'Phone-Home'}); //it will then render index page along with users
    })
    .catch(err => {
      console.log(err);
    });
})

//about route
app.get('/about',(req,res)=>{
  console.log("req made on"+req.url);
  res.render('about',{title:'About'});
})

//route for user create
// app.get('/user/create',(req,res)=>{
//   console.log("GET req made on"+req.url);
//   res.render('adduser',{title:'Add-User'});
// })
//route for phone create
app.get('/phone/create',requireLogin,(req,res)=>{
  console.log("GET req made on"+req.url);
  res.render('addphone',{title:'Add-Phone',user: req.session.user});
})

//route for users/withvar
// app.get('/users/:id',(req, res) => {
//   const id = req.params.id;
//   User.findById(id)
//     .then(result => {
//       res.render('details', { user: result, action:'edit',title: 'User Details' });
//     })
//     .catch(err => {
//       console.log(err);
//     });
// });
//route for phones/withvar
app.get('/phones/:id',requireLogin,(req, res) => {
  const id = req.params.id;
  Phone.findById(id)
    .then(result => {
      res.render('details-phone', { phone: result, action:'edit',title: 'Phone Details',user: req.session.user});
    })
    .catch(err => {
      console.log(err);
    });
});

//route for edit/name/action variable that will display current value to input field
app.get('/edit/:name/:action',(req,res)=>{
  const name = req.params.name;
  console.log("req made on"+req.url);
  User.findOne({name:name})
    .then(result => {
      res.render('edit', { user: result ,title: 'Edit-User' });
    })
    .catch(err => {
      console.log(err);
    });
})
//route for PHONE edit/name/action variable that will display current value to input field
app.get('/edit-phone/:esn/:action',(req,res)=>{
  const esn = req.params.esn;
  console.log("req made on"+req.url);
  Phone.findOne({esn:esn}) 
    .then(result => {
      res.render('edit-phone', { phone: result ,title: 'Edit-Phone' });
    })
    .catch(err => {
      console.log(err);
    });
})

//submitting data routes
  app.post('/user/create',(req,res)=>{
  console.log("POST req made on"+req.url);
  console.log("Form submitted to server");


  /*Note: when you are passing form obj directly to collection using model you
          have to give same name in form of that data that is to be passed in database 
          and that name is declared inside schema*/
  const user = new User(req.body); //passing object of form data directly to collection
  user.save() //then saving this to database and this return promise
    .then(result => {
      res.redirect('/users');//is success save this will redirect to home page
    })
    .catch(err => { //if data not saved error showed
      console.log(err);
    });

})
//submitting phone data routes
app.post('/phone/create',(req,res)=>{
  console.log("POST req made on"+req.url);
  console.log("phone data submitted to server");


  /*Note: when you are passing form obj directly to collection using model you
          have to give same name in form of that data that is to be passed in database 
          and that name is declared inside schema*/
  const phone = new Phone(req.body); //passing object of form data directly to collection
  phone.save() //then saving this to database and this return promise
    .then(result => {
      res.redirect('/phones');//is success save this will redirect to home page
    })
    .catch(err => { //if data not saved error showed
      console.log(err);
    });

})
//route for updating users data
app.post('/edit/:id',(req,res)=>{
  console.log("POST req made on"+req.url);
  User.updateOne({_id:req.params.id},req.body) //then updating that user whose id is get from url 
                                               //first passing id which user is to be updated than passing update info
    .then(result => {
      res.redirect('/users');//is success save this will redirect to home page
      console.log("Users profile Updated");
    })
    .catch(err => { //if data not saved error showed
      console.log(err);
    });

})
//route for updating phones data
app.post('/edit-phone/:id',(req,res)=>{
  console.log("POST req made on"+req.url);
  Phone.updateOne({_id:req.params.id},req.body) //then updating that user whose id is get from url 
                                               //first passing id which user is to be updated than passing update info
    .then(result => {
      res.redirect('/phones');//is success save this will redirect to home page
      console.log("Phones profile Updated");
    })
    .catch(err => { //if data not saved error showed
      console.log(err);
    });

})

//routes for deleting users by getting users name from url then finding that  users then doing delete
app.post('/users/:name',(req,res)=>{ //form action of details.ejs pass name of user that later is assume as name
  const name = req.params.name;
  console.log(name);
  User.deleteOne({name:name})
  .then(result => {
    res.redirect('/users');
  })
  .catch(err => {
    console.log(err);
  });
})
//routes for deleting phones by getting phones esn from url then finding that phones then doing delete
app.post('/phones/:esn',(req,res)=>{ //form action of details.ejs pass name of user that later is assume as name
  const esn = req.params.esn;
  console.log(esn);
  Phone.deleteOne({esn:esn})
  .then(result => {
    res.redirect('/phones');
  })
  .catch(err => {
    console.log(err);
  });
})
//404 errors routes
//this will auto run incase no routes
//Note: must put this route at last route list
app.use((req,res)=>{
  console.log("req made on"+req.url);
  res.render('404',{title:'NotFound'});
})





