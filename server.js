const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Copy generated images to assets folder
const fs = require('fs');
try {
  const artifactDir = 'C:\\Users\\Danie\\.gemini\\antigravity-ide\\brain\\ca5439be-566b-4e19-b93b-58e229eac19c';
  const hatchbackSource = path.join(artifactDir, 'hatchback_cab_1790964433968.jpg');
  const sedanSource = path.join(artifactDir, 'sedan_cab_1790964458809.jpg');
  const suvSource = path.join(artifactDir, 'suv_cab_1790964487067.jpg');
  
  if (fs.existsSync(hatchbackSource)) {
    fs.copyFileSync(hatchbackSource, path.join(__dirname, 'assets', 'hatchback.jpg'));
  }
  if (fs.existsSync(sedanSource)) {
    fs.copyFileSync(sedanSource, path.join(__dirname, 'assets', 'sedan.jpg'));
  }
  if (fs.existsSync(suvSource)) {
    fs.copyFileSync(suvSource, path.join(__dirname, 'assets', 'suv.jpg'));
  }

  const airportSource = path.join(artifactDir, 'coimbatore_airport_route_1790965883089.jpg');
  const railwaySource = path.join(artifactDir, 'railway_station_route_1790965902925.jpg');
  const outstationSource = path.join(artifactDir, 'outstation_route_1790965958680.jpg');

  if (fs.existsSync(airportSource)) {
    fs.copyFileSync(airportSource, path.join(__dirname, 'assets', 'route_airport.jpg'));
  }
  if (fs.existsSync(railwaySource)) {
    fs.copyFileSync(railwaySource, path.join(__dirname, 'assets', 'route_railway.jpg'));
  }
  const sightseeingSource = path.join(artifactDir, 'service_sightseeing_1790966613826.jpg');
  const groupSource = path.join(artifactDir, 'service_group_1790966632371.jpg');

  if (fs.existsSync(sightseeingSource)) {
    fs.copyFileSync(sightseeingSource, path.join(__dirname, 'assets', 'service_sightseeing.jpg'));
  }
  if (fs.existsSync(outstationSource)) {
    fs.copyFileSync(outstationSource, path.join(__dirname, 'assets', 'route_outstation.jpg'));
    fs.copyFileSync(outstationSource, path.join(__dirname, 'assets', 'tempo_traveller.jpg'));
    const publicAssets = path.join(__dirname, 'public', 'assets');
    if (!fs.existsSync(publicAssets)) fs.mkdirSync(publicAssets, { recursive: true });
    fs.copyFileSync(outstationSource, path.join(publicAssets, 'tempo_traveller.jpg'));
  }
  const logoSourceDir = path.join(__dirname, 'assets', 'logo');
  const publicLogoDir = path.join(__dirname, 'public', 'assets', 'logo');
  if (!fs.existsSync(publicLogoDir)) fs.mkdirSync(publicLogoDir, { recursive: true });
  if (fs.existsSync(logoSourceDir)) {
    fs.readdirSync(logoSourceDir).forEach(file => {
      fs.copyFileSync(path.join(logoSourceDir, file), path.join(publicLogoDir, file));
    });
  }
  const doddabettaSource = path.join(artifactDir, 'pkg_doddabetta_1790968204936.jpg');
  const rosegardenSource = path.join(artifactDir, 'pkg_rosegarden_1790968236910.jpg');
  const dolphinsnoseSource = path.join(artifactDir, 'pkg_dolphinsnose_1790968273061.jpg');
  const pykaraWaterfallSource = path.join(artifactDir, 'pkg_pykara_waterfall_1790968306728.jpg');
  const ninthmileSource = path.join(artifactDir, 'pkg_9thmile_1790968337758.jpg');

  if (fs.existsSync(doddabettaSource)) {
    fs.copyFileSync(doddabettaSource, path.join(__dirname, 'assets', 'pkg_doddabetta.jpg'));
  }
  if (fs.existsSync(rosegardenSource)) {
    fs.copyFileSync(rosegardenSource, path.join(__dirname, 'assets', 'pkg_rosegarden.jpg'));
  }
  if (fs.existsSync(dolphinsnoseSource)) {
    fs.copyFileSync(dolphinsnoseSource, path.join(__dirname, 'assets', 'pkg_dolphinsnose.jpg'));
  }
  if (fs.existsSync(pykaraWaterfallSource)) {
    fs.copyFileSync(pykaraWaterfallSource, path.join(__dirname, 'assets', 'pkg_pykara_waterfall.jpg'));
  }
  if (fs.existsSync(ninthmileSource)) {
    fs.copyFileSync(ninthmileSource, path.join(__dirname, 'assets', 'pkg_9thmile.jpg'));
  }
} catch (err) {
  console.error('Asset copy error:', err.message);
}

// Serve static assets from public folder & root assets folder
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// API Routes
app.use('/api', apiRoutes);

// Explicit Page Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/tour-packages', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tour-packages.html'));
});

app.get('/about-us', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about-us.html'));
});

// Fallback to index.html for SPA/HTML routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`  OOTY MIST HOLIDAYS NODE.JS SERVER RUNNING AT:`);
  console.log(`  http://localhost:${PORT}`);
  console.log(`==================================================`);
});
