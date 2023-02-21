import app from './app';
import connectDB from './connectDB'

connectDB();

app.listen(process.env.PORT || '9000');