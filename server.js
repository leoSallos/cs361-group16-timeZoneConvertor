// server.js — Time Zone Converter Microservice

const fs = require("fs").promises;
const express = require("express");
const app = express();
app.use(express.json());
const port = 8013;

let timezoneData = {};

// ------------------------------------------------------
// Load time zone JSON on startup
// ------------------------------------------------------
async function loadTimezoneData() {
    try {
        const raw = await fs.readFile("./timezones.json", "utf8");
        timezoneData = JSON.parse(raw);
        console.log("Loaded timezones.json\n");
    } catch (err) {
        console.error("ERROR loading timezones.json:", err);
    }
}

// ------------------------------------------------------
// Middleware (CORS)
// ------------------------------------------------------
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
});

// ------------------------------------------------------
// Health Check
// ------------------------------------------------------
app.get("/", (req, res) => {
    console.log("Ping received");
    res.send("Time Zone Microservice is running.");
});

// ------------------------------------------------------
// MAIN ENDPOINT /time
// Returns plain text, not JSON
// ------------------------------------------------------
app.get("/time", (req, res) => {
    const city = req.query.city;
    const offset = req.query.offset;

    if (!city && !offset) {
        return res.status(400).send("Error: Provide ?city=CityName OR ?offset=UTC+X");
    }

    //
    // A) Lookup by City Name
    //
    if (city) {
        const tz = timezoneData[city];

        if (!tz) {
            return res.status(404).send(`Unknown city: ${city}`);
        }

        const now = new Date();
        const localTime = new Date(now.toLocaleString("en-US", { timeZone: tz }));

        return res.send(
            `Current time in ${city} (${tz}): ${localTime.toLocaleString()}`
        );
    }

    //
    // B) Lookup by UTC Offset (supports fractional like +5:30)
    //
    if (offset) {
        const match = offset.match(/([+-]?\d+)(?::(\d+))?/);

        if (!match) {
            return res.status(400).send("Invalid offset format. Example: ?offset=+5:30");
        }

        const hours = parseInt(match[1], 10);
        const minutes = match[2] ? parseInt(match[2], 10) : 0;

        const now = new Date();
        const utcBase = new Date(now.getTime() + now.getTimezoneOffset() * 60000);

        const localTime = new Date(
            utcBase.getTime() + hours * 3600000 + minutes * 60000
        );

        return res.send(
            `Current time at UTC${offset}: ${localTime.toLocaleString()}`
        );
    }
});

// ------------------------------------------------------
// SECONDARY ENDPOINT /offset
// Returns JSON of the offset from UTC in minutes.
// ------------------------------------------------------
app.get("/offset", (req, res) => {
    const city = req.query.city;

    if (!city){
        res.status(404).send("No city query.");
        return;
    }

    if (!tz) {
        return res.status(404).send(`Unknown city: ${city}`);
    }

    const tzDate = new Date(now.toLocaleString("en-US", { timeZone: tz }));

    req.status(200).json({offset: tzDate.getTimezoneOffset()});
});

// ------------------------------------------------------
// START SERVER
// ------------------------------------------------------
app.listen(port, async () => {
    console.log(`Time Zone Converter running on port ${port}\n`);
    await loadTimezoneData();
});
