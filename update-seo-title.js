const mysql = require('mysql2/promise');
require('dotenv').config({ path: './.env' });

async function updateSeoTitle() {
    console.log('🔧 Cập nhật seoTitle...');
    
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        // Cập nhật seoTitle
        await connection.execute(
            'UPDATE settings SET `value` = ? WHERE `key` = "seoTitle"',
            ['VIETCONNECT SOLUTIONS - Công ty cổ phần Vietconnect Solutions']
        );
        
        console.log('✅ Đã cập nhật seoTitle thành công!');
        console.log('📝 Thay đổi:');
        console.log('   - seoTitle: VIETCONNECT SOLUTIONS - Công ty cổ phần Vietconnect Solutions');
        
        // Verify
        const [rows] = await connection.execute(
            'SELECT `key`, `value` FROM settings WHERE `key` = "seoTitle"'
        );
        
        console.log('🔍 Kiểm tra kết quả:');
        rows.forEach(row => {
            console.log(`${row.key}: ${row.value}`);
        });
        
    } catch (error) {
        console.error('❌ Lỗi:', error.message);
    }

    await connection.end();
}

updateSeoTitle().catch(console.error);
