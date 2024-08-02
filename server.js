const app = require('./src/app')

const PORT = process.env.DEV_PORT || 8001

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
})