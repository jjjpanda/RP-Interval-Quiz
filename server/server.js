const app = require('./app.js');

const port = process.env.PORT || 8181;
app.listen(port, () => console.log(`Server launched on port ${port}!`));
