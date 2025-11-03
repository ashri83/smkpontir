<?php
// upload.php - Handle file uploads untuk CMS
header('Content-Type: application/json');

// Config
$max_file_size = 2 * 1024 * 1024; // 2MB
$allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
$upload_dir = 'uploads/';

// Buat folder uploads jika belum ada
if (!file_exists($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

// Buat subfolder berdasarkan jenis
$type = $_POST['type'] ?? 'general';
$subfolder = $upload_dir . $type . '/';

if (!file_exists($subfolder)) {
    mkdir($subfolder, 0755, true);
}

// Check jika ada file yang diupload
if (!isset($_FILES['gambar']) || $_FILES['gambar']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'Tidak ada file yang diupload atau terjadi error']);
    exit;
}

$file = $_FILES['gambar'];

// Validasi file size
if ($file['size'] > $max_file_size) {
    http_response_code(400);
    echo json_encode(['error' => 'File terlalu besar. Maksimal 2MB']);
    exit;
}

// Validasi file type
$file_type = mime_content_type($file['tmp_name']);
if (!in_array($file_type, $allowed_types)) {
    http_response_code(400);
    echo json_encode(['error' => 'Format file tidak didukung. Gunakan JPG, PNG, atau GIF']);
    exit;
}

// Generate unique filename
$file_extension = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = uniqid() . '_' . time() . '.' . $file_extension;
$filepath = $subfolder . $filename;

// Move uploaded file
if (move_uploaded_file($file['tmp_name'], $filepath)) {
    // Return success dengan URL file
    echo json_encode([
        'success' => true,
        'url' => $filepath,
        'filename' => $filename,
        'size' => $file['size'],
        'type' => $file_type
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Gagal menyimpan file']);
}
?>