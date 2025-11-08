#!/usr/bin/env node

/**
 * Setup Verification Script
 * Checks if all required components are properly configured
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Treasure Hunt - Setup Verification\n');
console.log('=' .repeat(50));

let allChecksPass = true;

// Check 1: Node.js version
console.log('\n📦 Checking Node.js version...');
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
if (majorVersion >= 18) {
    console.log(`✅ Node.js ${nodeVersion} (OK)`);
} else {
    console.log(`❌ Node.js ${nodeVersion} (Need 18+)`);
    allChecksPass = false;
}

// Check 2: package.json exists
console.log('\n📄 Checking package.json...');
if (fs.existsSync('package.json')) {
    console.log('✅ package.json found');
    const pkg = require('../package.json');
    console.log(`   Name: ${pkg.name}`);
    console.log(`   Version: ${pkg.version}`);
} else {
    console.log('❌ package.json not found');
    allChecksPass = false;
}

// Check 3: node_modules installed
console.log('\n📚 Checking dependencies...');
if (fs.existsSync('node_modules')) {
    console.log('✅ node_modules folder exists');
    
    // Check key dependencies
    const requiredDeps = ['express', 'mongoose', 'jsonwebtoken', 'bcryptjs', 'qrcode'];
    let allDepsInstalled = true;
    
    requiredDeps.forEach(dep => {
        const depPath = path.join('node_modules', dep);
        if (fs.existsSync(depPath)) {
            console.log(`   ✅ ${dep}`);
        } else {
            console.log(`   ❌ ${dep} (missing)`);
            allDepsInstalled = false;
        }
    });
    
    if (!allDepsInstalled) {
        console.log('\n   💡 Run: npm install');
        allChecksPass = false;
    }
} else {
    console.log('❌ node_modules not found');
    console.log('   💡 Run: npm install');
    allChecksPass = false;
}

// Check 4: .env file
console.log('\n⚙️  Checking environment configuration...');
if (fs.existsSync('.env')) {
    console.log('✅ .env file exists');
    
    const envContent = fs.readFileSync('.env', 'utf8');
    const requiredVars = ['MONGODB_URI', 'JWT_SECRET', 'ADMIN_USERNAME', 'ADMIN_PASSWORD'];
    
    requiredVars.forEach(varName => {
        if (envContent.includes(varName)) {
            console.log(`   ✅ ${varName}`);
        } else {
            console.log(`   ❌ ${varName} (missing)`);
            allChecksPass = false;
        }
    });
    
    // Check JWT_SECRET length
    const jwtMatch = envContent.match(/JWT_SECRET=(.+)/);
    if (jwtMatch && jwtMatch[1].length < 32) {
        console.log('   ⚠️  JWT_SECRET should be at least 32 characters');
    }
} else {
    console.log('❌ .env file not found');
    console.log('   💡 Run: cp .env.example .env');
    allChecksPass = false;
}

// Check 5: Required directories
console.log('\n📁 Checking project structure...');
const requiredDirs = ['config', 'models', 'middleware', 'public', 'scripts'];
requiredDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        console.log(`✅ ${dir}/ directory exists`);
    } else {
        console.log(`❌ ${dir}/ directory missing`);
        allChecksPass = false;
    }
});

// Check 6: Required files
console.log('\n📝 Checking required files...');
const requiredFiles = [
    'server.js',
    'config/clues.js',
    'models/User.js',
    'middleware/auth.js',
    'public/index.html',
    'public/css/style.css',
    'public/js/app.js',
    'scripts/generateQR.js'
];

requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} (missing)`);
        allChecksPass = false;
    }
});

// Check 7: QR codes generated
console.log('\n🎯 Checking QR codes...');
if (fs.existsSync('qr-codes')) {
    const qrFiles = fs.readdirSync('qr-codes').filter(f => f.endsWith('.png'));
    if (qrFiles.length >= 12) {
        console.log(`✅ QR codes generated (${qrFiles.length} files)`);
    } else {
        console.log(`⚠️  Only ${qrFiles.length} QR codes found (need 12)`);
        console.log('   💡 Run: npm run generate-qr');
    }
} else {
    console.log('⚠️  qr-codes directory not found');
    console.log('   💡 Run: npm run generate-qr');
}

// Check 8: Port availability (basic check)
console.log('\n🔌 Checking configuration...');
const envContent = fs.existsSync('.env') ? fs.readFileSync('.env', 'utf8') : '';
const portMatch = envContent.match(/PORT=(\d+)/);
const port = portMatch ? portMatch[1] : '3000';
console.log(`✅ Server will run on port ${port}`);

// Check 9: MongoDB URI format
if (envContent.includes('MONGODB_URI')) {
    const mongoMatch = envContent.match(/MONGODB_URI=(.+)/);
    if (mongoMatch) {
        const uri = mongoMatch[1].trim();
        if (uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://')) {
            console.log('✅ MongoDB URI format looks correct');
            
            if (uri.includes('localhost')) {
                console.log('   ℹ️  Using local MongoDB');
                console.log('   💡 Make sure MongoDB is running locally');
            } else if (uri.includes('mongodb.net')) {
                console.log('   ℹ️  Using MongoDB Atlas (cloud)');
            }
        } else {
            console.log('⚠️  MongoDB URI format may be incorrect');
            allChecksPass = false;
        }
    }
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('\n📊 Verification Summary\n');

if (allChecksPass) {
    console.log('✅ All checks passed! Your setup looks good.\n');
    console.log('🚀 Next steps:');
    console.log('   1. Generate QR codes: npm run generate-qr');
    console.log('   2. Start the server: npm start');
    console.log('   3. Open browser: http://localhost:' + port);
    console.log('   4. Login as admin: admin / admin123\n');
} else {
    console.log('❌ Some checks failed. Please fix the issues above.\n');
    console.log('💡 Common fixes:');
    console.log('   - Run: npm install');
    console.log('   - Copy: cp .env.example .env');
    console.log('   - Generate QR: npm run generate-qr\n');
}

console.log('📚 Documentation:');
console.log('   - Quick Start: QUICKSTART.md');
console.log('   - Full Guide: README.md');
console.log('   - Deployment: DEPLOYMENT.md');
console.log('   - Testing: TESTING.md\n');

console.log('=' .repeat(50) + '\n');

process.exit(allChecksPass ? 0 : 1);

