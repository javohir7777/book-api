const expess = require("express");
require("dotenv").config();

const app = expess();

app.use(expess.json());

// Initial route
app.use("/api", require("./routes"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
