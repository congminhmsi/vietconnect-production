const fs = require('fs');
const path = require('path');

async function updateEnvFile() {
    console.log('🔧 Cập nhật file .env...');
    
    const envPath = path.join(__dirname, '.env');
    
    try {
        // Đọc file .env hiện tại
        let envContent = fs.readFileSync(envPath, 'utf8');
        
        // Cập nhật NEXT_PUBLIC_SITE_NAME
        envContent = envContent.replace(
            'NEXT_PUBLIC_SITE_NAME=Bicrypto',
            'NEXT_PUBLIC_SITE_NAME=VIETCONNECT SOLUTIONS'
        );
        
        // Cập nhật NEXT_PUBLIC_SITE_DESCRIPTION
        envContent = envContent.replace(
            'NEXT_PUBLIC_SITE_DESCRIPTION=Bicrypto Cryptocurrency Trading Platform',
            'NEXT_PUBLIC_SITE_DESCRIPTION=Công ty cổ phần Vietconnect Solutions'
        );
        
        // Ghi lại file
        fs.writeFileSync(envPath, envContent, 'utf8');
        
        console.log('✅ Đã cập nhật file .env thành công!');
        console.log('📝 Thay đổi:');
        console.log('   - NEXT_PUBLIC_SITE_NAME: VIETCONNECT SOLUTIONS');
        console.log('   - NEXT_PUBLIC_SITE_DESCRIPTION: Công ty cổ phần Vietconnect Solutions');
        
    } catch (error) {
        console.error('❌ Lỗi khi cập nhật file .env:', error.message);
    }
}

updateEnvFile();