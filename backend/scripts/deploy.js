import { ethers } from "hardhat";
import fs from 'fs';

async function main() {
    console.log("Deploying contracts...");

    // Deploy MedicalRecords contract
    const MedicalRecords = await ethers.getContractFactory("MedicalRecords");
    const medicalRecords = await MedicalRecords.deploy();
    await medicalRecords.waitForDeployment();
    const medicalRecordsAddress = await medicalRecords.getAddress();

    console.log(`✅ MedicalRecords deployed to: ${medicalRecordsAddress}`);

    // Deploy AccessControl contract
    const AccessControl = await ethers.getContractFactory("AccessControl");
    const accessControl = await AccessControl.deploy();
    await accessControl.waitForDeployment();
    const accessControlAddress = await accessControl.getAddress();

    console.log(`✅ AccessControl deployed to: ${accessControlAddress}`);

    // Save contract addresses
    const addresses = {
        medicalRecords: medicalRecordsAddress,
        accessControl: accessControlAddress,
        network: "hardhat",
        deployedAt: new Date().toISOString()
    };

    fs.writeFileSync(
        './contract-addresses.json',
        JSON.stringify(addresses, null, 2)
    );

    console.log("\n📝 Contract addresses saved to contract-addresses.json");
    console.log("\n🎉 Deployment complete!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
