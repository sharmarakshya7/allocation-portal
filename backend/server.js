const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('===========================================');
    console.log(` Allocation Portal API is running!`);
    console.log(` Port: ${PORT}`);
    console.log(` API: http://localhost:${PORT}/api`);
    console.log(` Health: http://localhost:${PORT}/api/health`);
    console.log('===========================================');
});
