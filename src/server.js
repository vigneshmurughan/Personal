require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const pageRoutes = require('./routes/pageRoutes');

const app = express();

const PORT = Number(process.env.PORT) || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = NODE_ENV === 'production';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/auth_webapp';
const SESSION_SECRET = process.env.SESSION_SECRET || 'replace-with-a-secure-secret';
const MONGO_RETRY_ATTEMPTS = Number(process.env.MONGO_RETRY_ATTEMPTS) || 10;
const MONGO_RETRY_DELAY_MS = Number(process.env.MONGO_RETRY_DELAY_MS) || 3000;

if (IS_PRODUCTION) {
  app.set('trust proxy', 1);
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: MONGO_URI,
      collectionName: 'sessions'
    }),
    cookie: {
      httpOnly: true,
      secure: IS_PRODUCTION,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60
    }
  })
);

app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/', pageRoutes);
app.use('/auth', authRoutes);

app.use((req, res) => {
  res.status(404).render('message', {
    title: '404',
    message: 'Page not found.',
    type: 'error'
  });
});

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function connectWithRetry() {
  for (let attempt = 1; attempt <= MONGO_RETRY_ATTEMPTS; attempt += 1) {
    try {
      await mongoose.connect(MONGO_URI);
      console.log('Connected to MongoDB');
      return;
    } catch (error) {
      console.error(`Mongo connection attempt ${attempt} failed:`, error.message);
      if (attempt === MONGO_RETRY_ATTEMPTS) {
        throw error;
      }
      await sleep(MONGO_RETRY_DELAY_MS);
    }
  }
}

async function startServer() {
  try {
    await connectWithRetry();
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
