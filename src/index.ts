import { app } from './app';

const PORT = process.env.PORT || 27182;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});