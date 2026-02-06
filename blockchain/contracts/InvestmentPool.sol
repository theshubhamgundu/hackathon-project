// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title InvestmentPool
 * @dev Secure micro-investment pool with fraud protection and time-locked withdrawals
 */
contract InvestmentPool is ReentrancyGuard, Ownable, Pausable {
    // Risk categories for investment pools
    enum RiskLevel { LOW, MEDIUM, HIGH }
    
    // Investment pool structure
    struct Pool {
        string name;
        RiskLevel riskLevel;
        uint256 totalInvested;
        uint256 returnRate; // Annual return rate in basis points (100 = 1%)
        bool active;
    }
    
    // User investment tracking
    struct Investment {
        uint256 amount;
        uint256 poolId;
        uint256 timestamp;
        uint256 lastClaimTime;
        bool active;
    }
    
    // State variables
    mapping(uint256 => Pool) public pools;
    mapping(address => mapping(uint256 => Investment)) public userInvestments;
    mapping(address => uint256[]) public userPoolIds;
    mapping(address => bool) public kycApproved;
    
    uint256 public poolCount;
    uint256 public constant MINIMUM_INVESTMENT = 0.001 ether;
    uint256 public constant WITHDRAWAL_LOCK_PERIOD = 7 days;
    uint256 public constant BASIS_POINTS = 10000;
    
    // Events
    event PoolCreated(uint256 indexed poolId, string name, RiskLevel riskLevel, uint256 returnRate);
    event InvestmentMade(address indexed investor, uint256 indexed poolId, uint256 amount);
    event WithdrawalRequested(address indexed investor, uint256 indexed poolId, uint256 amount);
    event ReturnsClaimedEvent(address indexed investor, uint256 indexed poolId, uint256 returns);
    event KYCStatusUpdated(address indexed user, bool approved);
    
    // Modifiers
    modifier onlyKYCApproved() {
        require(kycApproved[msg.sender], "KYC approval required");
        _;
    }
    
    modifier validPool(uint256 _poolId) {
        require(_poolId < poolCount, "Invalid pool ID");
        require(pools[_poolId].active, "Pool not active");
        _;
    }
    
    constructor() Ownable(msg.sender) {
        // Initialize default pools
        _createPool("Stable Yield Pool", Risk Level.LOW, 150); // 1.5% APY
        _createPool("Balanced Growth Pool", RiskLevel.MEDIUM, 600); // 6% APY
        _createPool("Aggressive Growth Pool", RiskLevel.HIGH, 1200); // 12% APY
    }
    
    /**
     * @dev Create a new investment pool (admin only)
     */
    function _createPool(
        string memory _name,
        RiskLevel _riskLevel,
        uint256 _returnRate
    ) private {
        pools[poolCount] = Pool({
            name: _name,
            riskLevel: _riskLevel,
            totalInvested: 0,
            returnRate: _returnRate,
            active: true
        });
        
        emit PoolCreated(poolCount, _name, _riskLevel, _returnRate);
        poolCount++;
    }
    
    /**
     * @dev Invest in a pool
     */
    function invest(uint256 _poolId)
        external
        payable
        nonReentrant
        whenNotPaused
        onlyKYCApproved
        validPool(_poolId)
    {
        require(msg.value >= MINIMUM_INVESTMENT, "Below minimum investment");
        
        Pool storage pool = pools[_poolId];
        Investment storage userInvestment = userInvestments[msg.sender][_poolId];
        
        if (userInvestment.amount == 0) {
            // New investment
            userInvestments[msg.sender][_poolId] = Investment({
                amount: msg.value,
                poolId: _poolId,
                timestamp: block.timestamp,
                lastClaimTime: block.timestamp,
                active: true
            });
            userPoolIds[msg.sender].push(_poolId);
        } else {
            // Additional investment
            userInvestment.amount += msg.value;
        }
        
        pool.totalInvested += msg.value;
        
        emit InvestmentMade(msg.sender, _poolId, msg.value);
    }
    
    /**
     * @dev Calculate returns for a user's investment
     */
    function calculateReturns(address _user, uint256 _poolId)
        public
        view
        returns (uint256)
    {
        Investment storage userInvestment = userInvestments[_user][_poolId];
        if (!userInvestment.active || userInvestment.amount == 0) {
            return 0;
        }
        
        Pool storage pool = pools[_poolId];
        uint256 timeElapsed = block.timestamp - userInvestment.lastClaimTime;
        
        // Calculate returns: (principal * rate * time) / (365 days * 10000 basis points)
        uint256 returns = (userInvestment.amount * pool.returnRate * timeElapsed) / 
                         (365 days * BASIS_POINTS);
        
        return returns;
    }
    
    /**
     * @dev Claim accumulated returns
     */
    function claimReturns(uint256 _poolId)
        external
        nonReentrant
        whenNotPaused
        validPool(_poolId)
    {
        Investment storage userInvestment = userInvestments[msg.sender][_poolId];
        require(userInvestment.active, "No active investment");
        
        uint256 returns = calculateReturns(msg.sender, _poolId);
        require(returns > 0, "No returns to claim");
        
        userInvestment.lastClaimTime = block.timestamp;
        
        (bool success, ) = payable(msg.sender).call{value: returns}("");
        require(success, "Transfer failed");
        
        emit ReturnsClaimedEvent(msg.sender, _poolId, returns);
    }
    
    /**
     * @dev Withdraw investment (subject to time lock)
     */
    function withdraw(uint256 _poolId)
        external
        nonReentrant
        whenNotPaused
        validPool(_poolId)
    {
        Investment storage userInvestment = userInvestments[msg.sender][_poolId];
        require(userInvestment.active, "No active investment");
        require(
            block.timestamp >= userInvestment.timestamp + WITHDRAWAL_LOCK_PERIOD,
            "Withdrawal locked"
        );
        
        // Claim any pending returns first
        uint256 returns = calculateReturns(msg.sender, _poolId);
        uint256 totalAmount = userInvestment.amount + returns;
        
        Pool storage pool = pools[_poolId];
        pool.totalInvested -= userInvestment.amount;
        
        userInvestment.active = false;
        userInvestment.amount = 0;
        
        (bool success, ) = payable(msg.sender).call{value: totalAmount}("");
        require(success, "Transfer failed");
        
        emit WithdrawalRequested(msg.sender, _poolId, totalAmount);
    }
    
    /**
     * @dev Update KYC approval status (admin only)
     */
    function updateKYCStatus(address _user, bool _approved)
        external
        onlyOwner
    {
        kycApproved[_user] = _approved;
        emit KYCStatusUpdated(_user, _approved);
    }
    
    /**
     * @dev Batch update KYC approvals (admin only)
     */
    function batchUpdateKYC(address[] calldata _users, bool[] calldata _approvals)
        external
        onlyOwner
    {
        require(_users.length == _approvals.length, "Length mismatch");
        
        for (uint256 i = 0; i < _users.length; i++) {
            kycApproved[_users[i]] = _approvals[i];
            emit KYCStatusUpdated(_users[i], _approvals[i]);
        }
    }
    
    /**
     * @dev Get user's total investment across all pools
     */
    function getTotalInvestment(address _user)
        external
        view
        returns (uint256 total)
    {
        uint256[] memory poolIds = userPoolIds[_user];
        for (uint256 i = 0; i < poolIds.length; i++) {
            total += userInvestments[_user][poolIds[i]].amount;
        }
    }
    
    /**
     * @dev Get user's portfolio details
     */
    function getPortfolio(address _user)
        external
        view
        returns (
            uint256[] memory poolIds,
            uint256[] memory amounts,
            uint256[] memory returns
        )
    {
        poolIds = userPoolIds[_user];
        amounts = new uint256[](poolIds.length);
        returns = new uint256[](poolIds.length);
        
        for (uint256 i = 0; i < poolIds.length; i++) {
            uint256 poolId = poolIds[i];
            amounts[i] = userInvestments[_user][poolId].amount;
            returns[i] = calculateReturns(_user, poolId);
        }
    }
    
    /**
     * @dev Get pool information
     */
    function getPoolInfo(uint256 _poolId)
        external
        view
        returns (
            string memory name,
            RiskLevel riskLevel,
            uint256 totalInvested,
            uint256 returnRate,
            bool active
        )
    {
        Pool storage pool = pools[_poolId];
        return (
            pool.name,
            pool.riskLevel,
            pool.totalInvested,
            pool.returnRate,
            pool.active
        );
    }
    
    /**
     * @dev Emergency pause (admin only)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause (admin only)
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Get contract balance
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    // Receive function to accept ETH
    receive() external payable {}
}
