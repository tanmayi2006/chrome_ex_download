
# Initialize variables
$CLI_CEB_DEV = "false"
$CLI_CEB_FIREFOX = "false"

# Process arguments
foreach ($arg in $args) {
    Write-Host "Processing argument: $arg" # Debug output
    if ($arg -match '^CLI_CEB_DEV=(true|false)$') {
        $CLI_CEB_DEV = $matches[1]
        Write-Host "Set CLI_CEB_DEV to $CLI_CEB_DEV" # Debug output
    }
    elseif ($arg -match '^CLI_CEB_FIREFOX=(true|false)$') {
        $CLI_CEB_FIREFOX = $matches[1]
        Write-Host "Set CLI_CEB_FIREFOX to $CLI_CEB_FIREFOX" # Debug output
    }
    else {
        Write-Error "Invalid argument: $arg. Expected CLI_CEB_DEV=true/false or CLI_CEB_FIREFOX=true/false"
        exit 1
    }
}

# Create new .env content
$envContent = @(
    "# THOSE VALUES ARE EDITABLE ONLY VIA CLI",
    "CLI_CEB_DEV=$CLI_CEB_DEV",
    "CLI_CEB_FIREFOX=$CLI_CEB_FIREFOX",
    ""
)

# Preserve existing CEB_* keys
if (Test-Path ".env") {
    $envContent += "# THOSE VALUES ARE EDITABLE"
    $envContent += (Get-Content -Path ".env" | Where-Object { $_ -like "CEB_*" })
}
else {
    $envContent += "# THOSE VALUES ARE EDITABLE"
    $envContent += "CEB_EXAMPLE=example_env"
    $envContent += "CEB_DEV_LOCALE="
    $envContent += "CEB_CI="
}

# Write to .env
$tempFile = [System.IO.Path]::GetTempFileName()
Write-Host "Writing to temp file: $tempFile" # Debug output
$envContent | Out-File -FilePath $tempFile -Encoding utf8
Move-Item -Path $tempFile -Destination ".env" -Force
Write-Host "Updated .env with CLI_CEB_DEV=$CLI_CEB_DEV" # Debug output
