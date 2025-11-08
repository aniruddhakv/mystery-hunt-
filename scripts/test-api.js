const http = require('http');

// Test configuration
const BASE_URL = 'http://localhost:3000';
let authToken = '';
let testUserId = '';

// Color codes for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[36m'
};

// Helper function to make HTTP requests
function makeRequest(method, path, data = null, token = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, BASE_URL);
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(url, options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const response = {
                        status: res.statusCode,
                        data: body ? JSON.parse(body) : null
                    };
                    resolve(response);
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', reject);

        if (data) {
            req.write(JSON.stringify(data));
        }

        req.end();
    });
}

// Test functions
async function testAdminLogin() {
    console.log(`\n${colors.blue}Test 1: Admin Login${colors.reset}`);
    try {
        const response = await makeRequest('POST', '/api/auth/login', {
            username: 'admin',
            password: 'admin123'
        });

        if (response.status === 200 && response.data.token) {
            authToken = response.data.token;
            console.log(`${colors.green}✅ PASS: Admin login successful${colors.reset}`);
            console.log(`   Token received: ${authToken.substring(0, 20)}...`);
            return true;
        } else {
            console.log(`${colors.red}❌ FAIL: Admin login failed${colors.reset}`);
            console.log(`   Status: ${response.status}`);
            return false;
        }
    } catch (error) {
        console.log(`${colors.red}❌ ERROR: ${error.message}${colors.reset}`);
        return false;
    }
}

async function testInvalidLogin() {
    console.log(`\n${colors.blue}Test 2: Invalid Login${colors.reset}`);
    try {
        const response = await makeRequest('POST', '/api/auth/login', {
            username: 'wronguser',
            password: 'wrongpass'
        });

        if (response.status === 401) {
            console.log(`${colors.green}✅ PASS: Invalid login rejected correctly${colors.reset}`);
            return true;
        } else {
            console.log(`${colors.red}❌ FAIL: Invalid login should return 401${colors.reset}`);
            return false;
        }
    } catch (error) {
        console.log(`${colors.red}❌ ERROR: ${error.message}${colors.reset}`);
        return false;
    }
}

async function testCreateUser() {
    console.log(`\n${colors.blue}Test 3: Create User (Admin)${colors.reset}`);
    try {
        const response = await makeRequest('POST', '/api/admin/users', {
            username: 'testplayer',
            password: 'test123'
        }, authToken);

        if (response.status === 201 && response.data.user) {
            testUserId = response.data.user._id;
            console.log(`${colors.green}✅ PASS: User created successfully${colors.reset}`);
            console.log(`   User ID: ${testUserId}`);
            console.log(`   Username: ${response.data.user.username}`);
            return true;
        } else {
            console.log(`${colors.red}❌ FAIL: User creation failed${colors.reset}`);
            console.log(`   Status: ${response.status}`);
            return false;
        }
    } catch (error) {
        console.log(`${colors.red}❌ ERROR: ${error.message}${colors.reset}`);
        return false;
    }
}

async function testGetAllUsers() {
    console.log(`\n${colors.blue}Test 4: Get All Users (Admin)${colors.reset}`);
    try {
        const response = await makeRequest('GET', '/api/admin/users', null, authToken);

        if (response.status === 200 && Array.isArray(response.data)) {
            console.log(`${colors.green}✅ PASS: Retrieved users list${colors.reset}`);
            console.log(`   Total users: ${response.data.length}`);
            return true;
        } else {
            console.log(`${colors.red}❌ FAIL: Failed to get users${colors.reset}`);
            return false;
        }
    } catch (error) {
        console.log(`${colors.red}❌ ERROR: ${error.message}${colors.reset}`);
        return false;
    }
}

async function testPlayerLogin() {
    console.log(`\n${colors.blue}Test 5: Player Login${colors.reset}`);
    try {
        const response = await makeRequest('POST', '/api/auth/login', {
            username: 'testplayer',
            password: 'test123'
        });

        if (response.status === 200 && response.data.token) {
            console.log(`${colors.green}✅ PASS: Player login successful${colors.reset}`);
            console.log(`   Username: ${response.data.user.username}`);
            console.log(`   Current Level: ${response.data.user.currentLevel}`);
            return response.data.token;
        } else {
            console.log(`${colors.red}❌ FAIL: Player login failed${colors.reset}`);
            return null;
        }
    } catch (error) {
        console.log(`${colors.red}❌ ERROR: ${error.message}${colors.reset}`);
        return null;
    }
}

async function testGetClue(playerToken) {
    console.log(`\n${colors.blue}Test 6: Get Current Clue${colors.reset}`);
    try {
        const response = await makeRequest('GET', '/api/game/clue', null, playerToken);

        if (response.status === 200 && response.data.clue) {
            console.log(`${colors.green}✅ PASS: Retrieved clue${colors.reset}`);
            console.log(`   Level: ${response.data.clue.level}`);
            console.log(`   Location: ${response.data.clue.location}`);
            console.log(`   Clue: ${response.data.clue.clue.substring(0, 50)}...`);
            return true;
        } else {
            console.log(`${colors.red}❌ FAIL: Failed to get clue${colors.reset}`);
            return false;
        }
    } catch (error) {
        console.log(`${colors.red}❌ ERROR: ${error.message}${colors.reset}`);
        return false;
    }
}

async function testScanCorrectQR(playerToken) {
    console.log(`\n${colors.blue}Test 7: Scan Correct QR Code${colors.reset}`);
    try {
        const response = await makeRequest('POST', '/api/game/scan', {
            qrCode: 'TREASURE_HUNT_QR_2'
        }, playerToken);

        if (response.status === 200 && response.data.success) {
            console.log(`${colors.green}✅ PASS: QR code scanned successfully${colors.reset}`);
            console.log(`   Message: ${response.data.message}`);
            console.log(`   New Level: ${response.data.currentLevel}`);
            return true;
        } else {
            console.log(`${colors.red}❌ FAIL: QR scan failed${colors.reset}`);
            return false;
        }
    } catch (error) {
        console.log(`${colors.red}❌ ERROR: ${error.message}${colors.reset}`);
        return false;
    }
}

async function testScanWrongQR(playerToken) {
    console.log(`\n${colors.blue}Test 8: Scan Wrong QR Code${colors.reset}`);
    try {
        const response = await makeRequest('POST', '/api/game/scan', {
            qrCode: 'TREASURE_HUNT_QR_5'
        }, playerToken);

        if (response.status === 400) {
            console.log(`${colors.green}✅ PASS: Wrong QR code rejected${colors.reset}`);
            console.log(`   Message: ${response.data.message}`);
            return true;
        } else {
            console.log(`${colors.red}❌ FAIL: Wrong QR should be rejected${colors.reset}`);
            return false;
        }
    } catch (error) {
        console.log(`${colors.red}❌ ERROR: ${error.message}${colors.reset}`);
        return false;
    }
}

async function testResetUser() {
    console.log(`\n${colors.blue}Test 9: Reset User Progress${colors.reset}`);
    try {
        const response = await makeRequest('POST', `/api/admin/users/${testUserId}/reset`, null, authToken);

        if (response.status === 200) {
            console.log(`${colors.green}✅ PASS: User progress reset${colors.reset}`);
            console.log(`   Message: ${response.data.message}`);
            return true;
        } else {
            console.log(`${colors.red}❌ FAIL: Reset failed${colors.reset}`);
            return false;
        }
    } catch (error) {
        console.log(`${colors.red}❌ ERROR: ${error.message}${colors.reset}`);
        return false;
    }
}

async function testDeleteUser() {
    console.log(`\n${colors.blue}Test 10: Delete User${colors.reset}`);
    try {
        const response = await makeRequest('DELETE', `/api/admin/users/${testUserId}`, null, authToken);

        if (response.status === 200) {
            console.log(`${colors.green}✅ PASS: User deleted${colors.reset}`);
            console.log(`   Message: ${response.data.message}`);
            return true;
        } else {
            console.log(`${colors.red}❌ FAIL: Delete failed${colors.reset}`);
            return false;
        }
    } catch (error) {
        console.log(`${colors.red}❌ ERROR: ${error.message}${colors.reset}`);
        return false;
    }
}

// Main test runner
async function runTests() {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`${colors.yellow}🧪 TREASURE HUNT API TESTS${colors.reset}`);
    console.log(`${'='.repeat(60)}`);
    console.log(`Testing API at: ${BASE_URL}`);

    const results = {
        total: 0,
        passed: 0,
        failed: 0
    };

    // Run tests
    const tests = [
        testAdminLogin,
        testInvalidLogin,
        testCreateUser,
        testGetAllUsers,
        async () => {
            const playerToken = await testPlayerLogin();
            if (playerToken) {
                await testGetClue(playerToken);
                await testScanCorrectQR(playerToken);
                await testScanWrongQR(playerToken);
            }
            return playerToken !== null;
        },
        testResetUser,
        testDeleteUser
    ];

    for (const test of tests) {
        results.total++;
        const passed = await test();
        if (passed) {
            results.passed++;
        } else {
            results.failed++;
        }
        await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between tests
    }

    // Print summary
    console.log(`\n${'='.repeat(60)}`);
    console.log(`${colors.yellow}📊 TEST SUMMARY${colors.reset}`);
    console.log(`${'='.repeat(60)}`);
    console.log(`Total Tests: ${results.total}`);
    console.log(`${colors.green}Passed: ${results.passed}${colors.reset}`);
    console.log(`${colors.red}Failed: ${results.failed}${colors.reset}`);
    console.log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);
    console.log(`${'='.repeat(60)}\n`);

    if (results.failed === 0) {
        console.log(`${colors.green}🎉 ALL TESTS PASSED!${colors.reset}\n`);
        process.exit(0);
    } else {
        console.log(`${colors.red}❌ SOME TESTS FAILED${colors.reset}\n`);
        process.exit(1);
    }
}

// Check if server is running
async function checkServer() {
    console.log(`\n${colors.blue}Checking if server is running...${colors.reset}`);
    try {
        const response = await makeRequest('GET', '/');
        if (response.status === 200) {
            console.log(`${colors.green}✅ Server is running${colors.reset}`);
            return true;
        }
    } catch (error) {
        console.log(`${colors.red}❌ Server is not running${colors.reset}`);
        console.log(`${colors.yellow}Please start the server with: npm start${colors.reset}\n`);
        return false;
    }
}

// Run the tests
(async () => {
    const serverRunning = await checkServer();
    if (serverRunning) {
        await runTests();
    } else {
        process.exit(1);
    }
})();

