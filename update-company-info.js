const mysql = require('mysql2/promise');
require('dotenv').config({ path: './.env' });

async function updateCompanyInfo() {
    console.log('🏢 Cập nhật thông tin công ty VIETCONNECT SOLUTIONS...');
    
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        // Cập nhật thông tin công ty chính
        const updates = [
            {
                key: 'companyName',
                value: 'VIETCONNECT SOLUTIONS',
                description: 'Tên công ty'
            },
            {
                key: 'companyAddress', 
                value: 'Tầng 6, Tòa nhà Mê Linh Point, Số 2 đường Ngô Đức Kế, Phường Sài Gòn, TP.HCM, Việt Nam',
                description: 'Địa chỉ công ty'
            },
            {
                key: 'companyPhone',
                value: '0944999618',
                description: 'Số điện thoại'
            },
            {
                key: 'supportEmail',
                value: 'Vietconnectsolutions@gmail.com',
                description: 'Email hỗ trợ'
            },
            {
                key: 'emailFrom',
                value: 'Vietconnectsolutions@gmail.com',
                description: 'Email gửi đi'
            },
            {
                key: 'siteName',
                value: 'VIETCONNECT SOLUTIONS',
                description: 'Tên website'
            },
            {
                key: 'siteDescription',
                value: 'Công ty cổ phần Vietconnect Solutions',
                description: 'Mô tả website'
            }
        ];

        console.log('📝 Đang cập nhật các settings...');
        
        for (const update of updates) {
            await connection.execute(
                'UPDATE settings SET `value` = ? WHERE `key` = ?',
                [update.value, update.key]
            );
            console.log(`✅ ${update.description}: ${update.value}`);
        }

        // Thêm thông tin pháp lý mới
        const newSettings = [
            {
                key: 'businessLicense',
                value: '0319207023',
                description: 'Mã số doanh nghiệp'
            },
            {
                key: 'registrationDate',
                value: '2025-10-09',
                description: 'Ngày đăng ký'
            },
            {
                key: 'legalRepresentative',
                value: 'LÊ TRUNG PHONG',
                description: 'Người đại diện pháp luật'
            },
            {
                key: 'representativePosition',
                value: 'Tổng giám đốc',
                description: 'Chức vụ người đại diện'
            },
            {
                key: 'representativeBirthDate',
                value: '1983-07-27',
                description: 'Ngày sinh người đại diện'
            },
            {
                key: 'representativeId',
                value: '046083005680',
                description: 'Số định danh cá nhân'
            },
            {
                key: 'contactPhone',
                value: '0944999618',
                description: 'Số điện thoại liên hệ'
            },
            {
                key: 'contactEmail',
                value: 'Vietconnectsolutions@gmail.com',
                description: 'Email liên hệ'
            },
            {
                key: 'businessAddress',
                value: 'Tầng 6, Tòa nhà Mê Linh Point, Số 2 đường Ngô Đức Kế, Phường Sài Gòn, TP.HCM, Việt Nam',
                description: 'Địa chỉ kinh doanh'
            }
        ];

        console.log('\n📝 Đang thêm thông tin pháp lý...');
        
        for (const setting of newSettings) {
            await connection.execute(
                'INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)',
                [setting.key, setting.value]
            );
            console.log(`✅ ${setting.description}: ${setting.value}`);
        }

        // Verify changes
        console.log('\n🔍 Kiểm tra kết quả:');
        const [rows] = await connection.execute(
            'SELECT `key`, `value` FROM settings WHERE `key` IN ("companyName", "companyAddress", "companyPhone", "supportEmail", "siteName", "siteDescription") ORDER BY `key`'
        );
        
        rows.forEach(row => {
            console.log(`${row.key}: ${row.value}`);
        });

        console.log('\n✅ Hoàn thành cập nhật thông tin công ty!');
        console.log('📝 Bước tiếp theo: Clear Redis cache và restart backend');

    } catch (error) {
        console.error('❌ Lỗi:', error.message);
    }

    await connection.end();
}

updateCompanyInfo().catch(console.error);
