import express from 'express';
import 'babel-polyfill';
import cors from 'cors';
import env from './env';
import usersRoute from './routes/usersRoute';
import adminRoute from './routes/adminRoute';
import tripRoute from './routes/tripRoute';
import busRoute from './routes/busRoute';
import bookingRoute from './routes/bookingRoute';

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api/v1', usersRoute);
app.use('/api/v1', adminRoute);
app.use('/api/v1', tripRoute);
app.use('/api/v1', busRoute);
app.use('/api/v1', bookingRoute);

app.listen(env.NODE_PORT).on('listening', () => {
    console.log(`🚀 are live on ${env.NODE_PORT}`);
});

module.exports = app;
