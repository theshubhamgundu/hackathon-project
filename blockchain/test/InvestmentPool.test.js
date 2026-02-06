const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("InvestmentPool", function () {
    let investmentPool;
    let owner;
    let user1;
    let user2;

    const MINIMUM_INVESTMENT = ethers.parseEther("0.001");
    const INVESTMENT_AMOUNT = ethers.parseEther("0.1");

    beforeEach(async function () {
        [owner, user1, user2] = await ethers.getSigners();

        const InvestmentPool = await ethers.getContractFactory("InvestmentPool");
        investmentPool = await InvestmentPool.deploy();
        await investmentPool.waitForDeployment();
    });

    describe("Pool Creation", function () {
        it("Should create default pools on deployment", async function () {
            expect(await investmentPool.poolCount()).to.equal(3);

            const [name, riskLevel, totalInvested, returnRate, active] =
                await investmentPool.getPoolInfo(0);
            expect(name).to.equal("Stable Yield Pool");
            expect(riskLevel).to.equal(0); // LOW
            expect(active).to.be.true;
        });
    });

    describe("KYC Management", function () {
        it("Should allow owner to approve KYC", async function () {
            await investmentPool.updateKYCStatus(user1.address, true);
            expect(await investmentPool.kycApproved(user1.address)).to.be.true;
        });

        it("Should prevent non-KYC approved users from investing", async function () {
            await expect(
                investmentPool.connect(user1).invest(0, { value: INVESTMENT_AMOUNT })
            ).to.be.revertedWith("KYC approval required");
        });
    });

    describe("Investments", function () {
        beforeEach(async function () {
            await investmentPool.updateKYCStatus(user1.address, true);
        });

        it("Should allow KYC approved users to invest", async function () {
            await expect(
                investmentPool.connect(user1).invest(0, { value: INVESTMENT_AMOUNT })
            ).to.emit(investmentPool, "InvestmentMade")
                .withArgs(user1.address, 0, INVESTMENT_AMOUNT);

            const totalInvestment = await investmentPool.getTotalInvestment(user1.address);
            expect(totalInvestment).to.equal(INVESTMENT_AMOUNT);
        });

        it("Should reject investments below minimum", async function () {
            const smallAmount = ethers.parseEther("0.0005");
            await expect(
                investmentPool.connect(user1).invest(0, { value: smallAmount })
            ).to.be.revertedWith("Below minimum investment");
        });

        it("Should track pool total invested", async function () {
            await investmentPool.connect(user1).invest(0, { value: INVESTMENT_AMOUNT });

            const [, , totalInvested] = await investmentPool.getPoolInfo(0);
            expect(totalInvested).to.equal(INVESTMENT_AMOUNT);
        });
    });

    describe("Returns Calculation", function () {
        beforeEach(async function () {
            await investmentPool.updateKYCStatus(user1.address, true);
            await investmentPool.connect(user1).invest(0, { value: INVESTMENT_AMOUNT });
        });

        it("Should calculate returns correctly", async function () {
            // Fast forward 365 days
            await ethers.provider.send("evm_increaseTime", [365 * 24 * 60 * 60]);
            await ethers.provider.send("evm_mine");

            const returns = await investmentPool.calculateReturns(user1.address, 0);
            // Pool 0 has 1.5% APY, so returns should be approximately 1.5% of investment
            const expectedReturns = INVESTMENT_AMOUNT * 150n / 10000n;
            expect(returns).to.be.closeTo(expectedReturns, ethers.parseEther("0.0001"));
        });
    });

    describe("Withdrawals", function () {
        beforeEach(async function () {
            await investmentPool.updateKYCStatus(user1.address, true);
            await investmentPool.connect(user1).invest(0, { value: INVESTMENT_AMOUNT });
        });

        it("Should prevent early withdrawal", async function () {
            await expect(
                investmentPool.connect(user1).withdraw(0)
            ).to.be.revertedWith("Withdrawal locked");
        });

        it("Should allow withdrawal after lock period", async function () {
            // Fast forward 7 days
            await ethers.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]);
            await ethers.provider.send("evm_mine");

            await expect(
                investmentPool.connect(user1).withdraw(0)
            ).to.emit(investmentPool, "WithdrawalRequested");
        });
    });

    describe("Portfolio Management", function () {
        beforeEach(async function () {
            await investmentPool.updateKYCStatus(user1.address, true);
            await investmentPool.connect(user1).invest(0, { value: INVESTMENT_AMOUNT });
            await investmentPool.connect(user1).invest(1, { value: INVESTMENT_AMOUNT });
        });

        it("Should return correct portfolio details", async function () {
            const [poolIds, amounts, returns] = await investmentPool.getPortfolio(user1.address);

            expect(poolIds.length).to.equal(2);
            expect(amounts[0]).to.equal(INVESTMENT_AMOUNT);
            expect(amounts[1]).to.equal(INVESTMENT_AMOUNT);
        });
    });
});
