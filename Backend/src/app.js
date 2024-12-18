import express from 'express';
import cors from 'cors';
import routes from './routes/userRoutes.js';
import contaRoutes from './routes/contaRoutes.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(routes);
app.use(contaRoutes);

export default app;