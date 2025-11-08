const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const clues = require('../config/clues');

// Create QR codes directory if it doesn't exist
const qrDir = path.join(__dirname, '..', 'qr-codes');
if (!fs.existsSync(qrDir)) {
    fs.mkdirSync(qrDir, { recursive: true });
}

// Generate QR codes for all locations
async function generateQRCodes() {
    console.log('🎯 Generating QR Codes for Treasure Hunt...\n');
    
    for (const clue of clues) {
        try {
            const fileName = `QR_${clue.level}_${clue.location.replace(/\s+/g, '_').replace(/\//g, '_')}.png`;
            const filePath = path.join(qrDir, fileName);
            
            // Generate QR code with the unique code
            await QRCode.toFile(filePath, clue.qrCode, {
                width: 400,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            });
            
            console.log(`✅ Generated: ${fileName}`);
            console.log(`   Code: ${clue.qrCode}`);
            console.log(`   Location: ${clue.location}\n`);
        } catch (error) {
            console.error(`❌ Error generating QR for ${clue.location}:`, error);
        }
    }
    
    console.log('✨ All QR codes generated successfully!');
    console.log(`📁 QR codes saved in: ${qrDir}\n`);
    
    // Generate HTML page with all QR codes for easy printing
    generatePrintablePage();
}

function generatePrintablePage() {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Treasure Hunt QR Codes - Print Sheet</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background: #f5f5f5;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding: 20px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .header h1 {
            color: #333;
            margin-bottom: 10px;
        }
        
        .header p {
            color: #666;
        }
        
        .qr-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .qr-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
            page-break-inside: avoid;
        }
        
        .qr-card h2 {
            color: #6366f1;
            margin-bottom: 10px;
            font-size: 1.5rem;
        }
        
        .qr-card h3 {
            color: #333;
            margin-bottom: 15px;
            font-size: 1.2rem;
        }
        
        .qr-card img {
            width: 100%;
            max-width: 300px;
            height: auto;
            margin: 15px 0;
            border: 2px solid #e5e7eb;
            border-radius: 5px;
        }
        
        .qr-code-text {
            font-family: monospace;
            background: #f3f4f6;
            padding: 10px;
            border-radius: 5px;
            color: #374151;
            font-size: 0.9rem;
            word-break: break-all;
        }
        
        .instructions {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        
        .instructions h2 {
            color: #333;
            margin-bottom: 15px;
        }
        
        .instructions ol {
            margin-left: 20px;
            color: #666;
            line-height: 1.8;
        }
        
        @media print {
            body {
                background: white;
            }
            
            .qr-card {
                box-shadow: none;
                border: 1px solid #ddd;
            }
            
            .no-print {
                display: none;
            }
        }
        
        .print-button {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: #6366f1;
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 50px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
            transition: all 0.3s;
        }
        
        .print-button:hover {
            background: #4f46e5;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🏆 Treasure Hunt QR Codes</h1>
        <p>Print and place these QR codes at their respective locations</p>
    </div>
    
    <div class="instructions no-print">
        <h2>📋 Setup Instructions:</h2>
        <ol>
            <li>Print this page (or save as PDF)</li>
            <li>Cut out each QR code card</li>
            <li>Place each QR code at its designated location</li>
            <li>Make sure QR codes are visible and accessible</li>
            <li>Test scanning each QR code before the game starts</li>
        </ol>
    </div>
    
    <div class="qr-grid">
        ${clues.map(clue => `
            <div class="qr-card">
                <h2>Level ${clue.level}</h2>
                <h3>📍 ${clue.location}</h3>
                <img src="QR_${clue.level}_${clue.location.replace(/\s+/g, '_')}.png" alt="QR Code ${clue.level}">
                <div class="qr-code-text">${clue.qrCode}</div>
            </div>
        `).join('')}
    </div>
    
    <button class="print-button no-print" onclick="window.print()">
        🖨️ Print QR Codes
    </button>
</body>
</html>
    `;
    
    const htmlPath = path.join(qrDir, 'QR_Codes_Print_Sheet.html');
    fs.writeFileSync(htmlPath, htmlContent.trim());
    
    console.log('📄 Printable HTML page generated!');
    console.log(`   Open: ${htmlPath}\n`);
}

// Run the generator
generateQRCodes().catch(console.error);

