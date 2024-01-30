
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const dbOperations = require('./dbFiles/dbOperations');
const cors = require('cors');
const app = express();
const port = 5000;
const corsOptions = {
  origin: 'http://localhost:3000', // Replace with the actual origin of your frontend
  credentials: true,
};

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy({
    usernameField: 'aadhaarNumber',
    passwordField: 'password',
  }, (aadhaarNumber, password, done) => {
    console.log(aadhaarNumber, password)
    dbOperations.validate(aadhaarNumber, password)
      .then((isValid) => {
        if (isValid) {
          return done(null, { aadhaarNumber, password });
        } else {
          return done(null, false, { message: 'Incorrect Aadhaar number or password.' });
        }
      })
      .catch((error) => {
        return done(error);
      });
  })
);
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ isAuthenticated: false, error: 'Unauthorized' });
};
passport.serializeUser((user, done) => {
  done(null, user.aadhaarNumber);
});
passport.deserializeUser(async (aadhaarNumber, done) => {
  try {
    const user = await dbOperations.getUserInfo(aadhaarNumber);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// app.get("/api/dashboard", isAuthenticated, async (req, res) => {
//   console.log(req.user)
//   console.log(req.user.aadhaarNumber)
//   const aadhaarNumber = req.user.aadhaarNumber;
//   try {
//     const user = await dbOperations.getUserInfo(aadhaarNumber); 
//     if (user) {
//       res.json({ user }); 
//     } else {
//       res.status(404).json({ error: 'User not found' });
//     }
//   } catch (error) {
//     console.error('Error:', error.message);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });
// app.get('/api/dashboard', (req, res) => {
//   // Check if the user is authenticated
//   if (req.isAuthenticated()) {
//     // If authenticated, send user information
//     res.status(200).json({ user: req.user });
//   } else {
//     // If not authenticated, send an error response
//     res.status(401).json({ error: 'Unauthorized' });
//   }
// });
app.get('/api/dashboard', isAuthenticated, async (req, res) => {
  // res.status(200).json({ user: req.user });
  if (req.isAuthenticated()) {
    res.status(200).json({ isAuthenticated: true, user: req.user });
  } else {
    res.status(401).json({ isAuthenticated: false, error: 'Unauthorized' });
  }
});
// Routes
// app.post("/api/login",
//   passport.authenticate('local', {
//     successRedirect: '/dashboard',
//     failureRedirect: '/login'
//   })
// );
app.post('/api/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Passport authentication error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (!user) {
      console.log('Login failed:', info.message);
      return res.status(401).json({ error: 'Authentication failed', message: info.message });
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error('Error during login:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      console.log('Login successful');
      return res.status(200).json({ success: true, message: 'Login successful' });
    });
  })(req, res, next);
});
app.post('/api/logout', (req, res) => {
  // req.logout();
  req.logout(function(err) {
    if (err) { return next(err); }
    res.status(200).json({ success: true, message: 'Logout successful' });
  });
  
});
app.post("/api/register", async (req, res) => {
  console.log(req.body);
  const { aadhaarName, aadhaarNumber, password, accountAddress } = req.body;

  console.log(aadhaarName, aadhaarNumber, password, accountAddress);
  try {
    // console.log(await dbOperations.isExisting(aadhaarNumber));
    const isExist = await dbOperations.isExisting(aadhaarNumber);
    console.log(isExist);
    if (isExist) {
      return res.status(409).json({ error: 'User already exists.' });
    }
    dbOperations.register(aadhaarNumber, aadhaarName, password, accountAddress)
      .then(result => {
        console.log(result);
        res.status(200).send('registered-success')
      })
  } catch (error) {
    console.error('Error during registration:', error.message);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }


})

app.listen(port, async () => {
  console.log(`Server listening on port ${port}`);
  await dbOperations.createTable();
});


