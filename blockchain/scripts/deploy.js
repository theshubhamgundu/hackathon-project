const { ethers } = require("hardhat");

async function main() {
    console.log("Deploying contracts to network...");

    // Get deployer account
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);

    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("Account balance:", ethers.formatEther(balance), "ETH");

    // Deploy InvestmentPool
    console.log("\n Deploying InvestmentPool...");
    const InvestmentPool = await ethers.getContractFactory("InvestmentPool");
    const investmentPool = await InvestmentPool.deploy();
    await investmentPool.waitForDeployment();
    const investmentPoolAddress = await investmentPool.getAddress();
    console.log("✓ InvestmentPool deployed to:", investmentPoolAddress);

    // Deploy FraudDetection
    console.log("\nDeploying FraudDetection...");
    const FraudDetection = await ethers.getContractFactory("FraudDetection");
    const fraudDetection = await FraudDetection.deploy();
    await fraudDetection.waitForDeployment();
    const fraudDetectionAddress = await fraudDetection.getAddress();
    console.log("✓ FraudDetection deployed to:", fraudDetectionAddress);

    // Verify default pools
    console.log("\nVerifying default investment pools...");
    const poolCount = await investmentPool.poolCount();
    console.log(`Total pools created: ${poolCount}`);

    for (let i = 0; i < poolCount; i++) {
        const [name, riskLevel, totalInvested, returnRate, active] =
            await investmentPool.getPoolInfo(i);
        console.log(`\nPool ${i}:`);
        console.log(`- Name: ${name}`);
        console.log(`- Risk Level: ${['LOW', 'MEDIUM', 'HIGH'][riskLevel]}`);
        console.log(`- Return Rate: ${returnRate / 100}% APY`);
        console.log(`- Active: ${active}`);
    }

    // Save deployment info
    const deploymentInfo = {
        network: (await ethers.provider.getNetwork()).name,
        chainId: (await ethers.provider.getNetwork()).chainId,
        deployer: deployer.address,
        contracts: {
            InvestmentPool: investmentPoolAddress,
            FraudDetection: fraudDetectionAddress,
        },
        timestamp: new Date().toISOString(),
    };

    console.log("\n📝 Deployment Summary:");
    console.log(JSON.stringify(deploymentInfo, null, 2));
    console.log("\n✅ Deployment complete!");

    console.log("\n⚠️  IMPORTANT: Save these contract addresses for frontend integration:");
    console.log(`NEXT_PUBLIC_INVESTMENT_POOL_ADDRESS=${investmentPoolAddress}`);
    console.log(`NEXT_PUBLIC_FRAUD_DETECTION_ADDRESS=${fraudDetectionAddress}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
