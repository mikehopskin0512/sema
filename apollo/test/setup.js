import './env';
import app from '../src/app'
import mongoose from 'mongoose';


beforeAll(async() => {

});


afterAll(async() => {
  await Promise.all([
    mongoose.connection.close(),
    app._server.close()
  ])
})
