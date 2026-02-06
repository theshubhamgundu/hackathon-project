// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FraudDetection
 * @dev On-chain fraud monitoring and prevention system
 */
contract FraudDetection is Ownable {
    // Fraud detection thresholds
    uint256 public constant MAX_WITHDRAWALS_PER_DAY = 3;
    uint256 public constant LARGE_WITHDRAWAL_THRESHOLD = 1 ether;
    uint256 public constant SUSPICIOUS_PATTERN_THRESHOLD = 5;
    
    // User activity tracking
    struct UserActivity {
        uint256 lastWithdrawalTime;
        uint256 withdrawalCount24h;
        uint256 totalWithdrawals;
        uint256 suspiciousActivityCount;
        bool blacklisted;
        bool flaggedForReview;
    }
    
    // Withdrawal request for multi-sig
    struct WithdrawalRequest {
        address user;
        uint256 amount;
        uint256 timestamp;
        uint256 approvalCount;
        bool executed;
        mapping(address => bool) approvals;
    }
    
    mapping(address => UserActivity) public userActivities;
    mapping(address => bool) public authorizedApprovers;
    mapping(uint256 => WithdrawalRequest) public withdrawalRequests;
    uint256 public requestCount;
    uint256 public requiredApprovals = 2;
    
    // Events
    event SuspiciousActivityDetected(address indexed user, string reason);
    event UserBlacklisted(address indexed user);
    event UserFlaggedForReview(address indexed user);
    event WithdrawalRateLimitExceeded(address indexed user);
    event LargeWithdrawalRequested(uint256 indexed requestId, address user, uint256 amount);
    event WithdrawalApproved(uint256 indexed requestId, address approver);
    event WithdrawalExecuted(uint256 indexed requestId);
    
    constructor() Ownable(msg.sender) {
        authorizedApprovers[msg.sender] = true;
    }
    
    /**
     * @dev Record withdrawal attempt and check for fraud patterns
     */
    function recordWithdrawal(address _user, uint256 _amount) external returns (bool) {
        UserActivity storage activity = userActivities[_user];
        
        // Check if user is blacklisted
        if (activity.blacklisted) {
            emit SuspiciousActivityDetected(_user, "Blacklisted user");
            return false;
        }
        
        // Reset daily counter if 24 hours have passed
        if (block.timestamp >= activity.lastWithdrawalTime + 1 days) {
            activity.withdrawalCount24h = 0;
        }
        
        // Check withdrawal rate limit
        if (activity.withdrawalCount24h >= MAX_WITHDRAWALS_PER_DAY) {
            emit WithdrawalRateLimitExceeded(_user);
            _flagSuspiciousActivity(_user, "Excessive withdrawals");
            return false;
        }
        
        // Update activity
        activity.lastWithdrawalTime = block.timestamp;
        activity.withdrawalCount24h++;
        activity.totalWithdrawals++;
        
        // Check for large withdrawal (requires multi-sig)
        if (_amount >= LARGE_WITHDRAWAL_THRESHOLD) {
            return false; // Will need multi-sig approval
        }
        
        return true;
    }
    
    /**
     * @dev Request multi-signature approval for large withdrawal
     */
    function requestLargeWithdrawal(address _user, uint256 _amount)
        external
        returns (uint256)
    {
        require(_amount >= LARGE_WITHDRAWAL_THRESHOLD, "Not a large withdrawal");
        
        uint256 requestId = requestCount++;
        WithdrawalRequest storage request = withdrawalRequests[requestId];
        request.user = _user;
        request.amount = _amount;
        request.timestamp = block.timestamp;
        request.approvalCount = 0;
        request.executed = false;
        
        emit LargeWithdrawalRequested(requestId, _user, _amount);
        return requestId;
    }
    
    /**
     * @dev Approve a withdrawal request (authorized approvers only)
     */
    function approveWithdrawal(uint256 _requestId)
        external
    {
        require(authorizedApprovers[msg.sender], "Not authorized");
        WithdrawalRequest storage request = withdrawalRequests[_requestId];
        require(!request.executed, "Already executed");
        require(!request.approvals[msg.sender], "Already approved");
        
        request.approvals[msg.sender] = true;
        request.approvalCount++;
        
        emit WithdrawalApproved(_requestId, msg.sender);
    }
    
    /**
     * @dev Check if withdrawal request is approved
     */
    function isWithdrawalApproved(uint256 _requestId)
        external
        view
        returns (bool)
    {
        return withdrawalRequests[_requestId].approvalCount >= requiredApprovals;
    }
    
    /**
     * @dev Execute approved withdrawal
     */
    function executeWithdrawal(uint256 _requestId)
        external
    {
        WithdrawalRequest storage request = withdrawalRequests[_requestId];
        require(!request.executed, "Already executed");
        require(request.approvalCount >= requiredApprovals, "Insufficient approvals");
        
        request.executed = true;
        emit WithdrawalExecuted(_requestId);
    }
    
    /**
     * @dev Flag suspicious activity
     */
    function _flagSuspiciousActivity(address _user, string memory _reason)
        private
    {
        UserActivity storage activity = userActivities[_user];
        activity.suspiciousActivityCount++;
        
        emit SuspiciousActivityDetected(_user, _reason);
        
        // Auto-flag for review if pattern detected
        if (activity.suspiciousActivityCount >= SUSPICIOUS_PATTERN_THRESHOLD) {
            activity.flaggedForReview = true;
            emit UserFlaggedForReview(_user);
        }
    }
    
    /**
     * @dev Blacklist a user (admin only)
     */
    function blacklistUser(address _user) external onlyOwner {
        userActivities[_user].blacklisted = true;
        emit UserBlacklisted(_user);
    }
    
    /**
     * @dev Remove user from blacklist (admin only)
     */
    function removeFromBlacklist(address _user) external onlyOwner {
        userActivities[_user].blacklisted = false;
    }
    
    /**
     * @dev Add authorized approver (admin only)
     */
    function addApprover(address _approver) external onlyOwner {
        authorizedApprovers[_approver] = true;
    }
    
    /**
     * @dev Remove authorized approver (admin only)
     */
    function removeApprover(address _approver) external onlyOwner {
        authorizedApprovers[_approver] = false;
    }
    
    /**
     * @dev Update required approvals (admin only)
     */
    function setRequiredApprovals(uint256 _required) external onlyOwner {
        require(_required > 0, "Must require at least 1 approval");
        requiredApprovals = _required;
    }
    
    /**
     * @dev Get user activity details
     */
    function getUserActivity(address _user)
        external
        view
        returns (
            uint256 lastWithdrawalTime,
            uint256 withdrawalCount24h,
            uint256 totalWithdrawals,
            uint256 suspiciousActivityCount,
            bool blacklisted,
            bool flaggedForReview
        )
    {
        UserActivity storage activity = userActivities[_user];
        return (
            activity.lastWithdrawalTime,
            activity.withdrawalCount24h,
            activity.totalWithdrawals,
            activity.suspiciousActivityCount,
            activity.blacklisted,
            activity.flaggedForReview
        );
    }
    
    /**
     * @dev Calculate user risk score (0-100)
     */
    function calculateRiskScore(address _user)
        external
        view
        returns (uint256)
    {
        UserActivity storage activity = userActivities[_user];
        
        if (activity.blacklisted) {
            return 100;
        }
        
        uint256 score = 0;
        
        // Add points for suspicious activities
        score += activity.suspiciousActivityCount * 15;
        
        // Add points for high withdrawal frequency
        if (activity.withdrawalCount24h >= 2) {
            score += 20;
        }
        
        // Add points if flagged for review
        if (activity.flaggedForReview) {
            score += 30;
        }
        
        return score > 100 ? 100 : score;
    }
}
