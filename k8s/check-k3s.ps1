# PowerShell script để kiểm tra kết nối K3s từ Windows
# Sử dụng SSH config để kết nối

param(
    [string]$sshHost = "k3f-server"
)

Write-Host "🔍 Checking K3s connectivity..." -ForegroundColor Green

# Kiểm tra SSH connection
Write-Host "Testing SSH connection to $sshHost..." -ForegroundColor Yellow
try {
    $sshTest = ssh -o ConnectTimeout=10 $sshHost "echo 'SSH OK'"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ SSH connection successful" -ForegroundColor Green
    } else {
        Write-Host "❌ SSH connection failed" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ SSH connection error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Kiểm tra kubectl trên remote server
Write-Host "Checking kubectl on remote server..." -ForegroundColor Yellow
$remoteCheck = ssh $sshHost "kubectl version --client --short"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ kubectl available on remote server" -ForegroundColor Green
    Write-Host "Version: $remoteCheck" -ForegroundColor Cyan
} else {
    Write-Host "❌ kubectl not available on remote server" -ForegroundColor Red
    exit 1
}

# Kiểm tra cluster status
Write-Host "Checking K3s cluster status..." -ForegroundColor Yellow
$clusterStatus = ssh $sshHost "kubectl cluster-info"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ K3s cluster is running" -ForegroundColor Green
    Write-Host "Cluster info:" -ForegroundColor Cyan
    Write-Host $clusterStatus
} else {
    Write-Host "❌ K3s cluster not accessible" -ForegroundColor Red
    exit 1
}

# Kiểm tra nodes
Write-Host "Checking cluster nodes..." -ForegroundColor Yellow
$nodes = ssh $sshHost "kubectl get nodes"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Cluster nodes:" -ForegroundColor Green
    Write-Host $nodes
} else {
    Write-Host "❌ Cannot get nodes info" -ForegroundColor Red
}

# Kiểm tra storage classes
Write-Host "Checking storage classes..." -ForegroundColor Yellow
$storage = ssh $sshHost "kubectl get storageclass"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Storage classes:" -ForegroundColor Green
    Write-Host $storage
} else {
    Write-Host "⚠️ No storage classes found (might be OK for local-path)" -ForegroundColor Yellow
}

# Kiểm tra ingress controller
Write-Host "Checking ingress controller..." -ForegroundColor Yellow
$ingress = ssh $sshHost "kubectl get pods -n kube-system | grep ingress"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Ingress controller found:" -ForegroundColor Green
    Write-Host $ingress
} else {
    Write-Host "⚠️ No ingress controller found" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 K3s connectivity check completed!" -ForegroundColor Green
Write-Host "You can now deploy Bicrypto using the manifests in this directory." -ForegroundColor Cyan

