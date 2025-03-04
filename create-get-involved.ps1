# Create a script named create-get-involved.ps1 with this content:
$componentPath = "components/get-involved"

# Create the main directories
$directories = @("styles", "sections", "data")
foreach ($dir in $directories) {
    New-Item -ItemType Directory -Path "$componentPath/$dir" -Force
}

# Create style files
$styleFiles = @(
    "CommonStyles.js",
    "DonationStyles.js",
    "VolunteerStyles.js",
    "SponsorStyles.js",
    "EventStyles.js",
    "ImpactStyles.js",
    "FaqStyles.js",
    "ContactStyles.js"
)
foreach ($file in $styleFiles) {
    New-Item -ItemType File -Path "$componentPath/styles/$file" -Force
}

# Create section files
$sectionFiles = @(
    "Hero.js",
    "SupportOptions.js",
    "DonationSection.js",
    "VolunteerSection.js",
    "SponsorSection.js",
    "EventsSection.js",
    "ImpactSection.js",
    "FaqSection.js",
    "ContactForm.js"
)
foreach ($file in $sectionFiles) {
    New-Item -ItemType File -Path "$componentPath/sections/$file" -Force
}

# Create data files
$dataFiles = @(
    "faqData.js",
    "volunteerRoles.js",
    "sponsorTiers.js",
    "eventsData.js",
    "impactStories.js"
)
foreach ($file in $dataFiles) {
    New-Item -ItemType File -Path "$componentPath/data/$file" -Force
}

Write-Host "Get Involved component structure created successfully!" -ForegroundColor Green

# Then run the script with:
# .\create-get-involved.ps1