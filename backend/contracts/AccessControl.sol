// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AccessControl {
    struct Permission {
        address patientAddress;
        address doctorAddress;
        string reportHash;
        uint256 grantedAt;
        uint256 expiresAt;
        bool isActive;
        bool exists;
    }

    struct AccessLog {
        address accessor;
        string reportHash;
        string action;
        uint256 timestamp;
    }

    // Mapping from permission ID to Permission
    mapping(bytes32 => Permission) public permissions;
    
    // Mapping from patient to their granted permissions
    mapping(address => bytes32[]) public patientPermissions;
    
    // Mapping from doctor to their received permissions
    mapping(address => bytes32[]) public doctorPermissions;

    // Access logs
    AccessLog[] public accessLogs;

    // Events
    event AccessGranted(
        bytes32 indexed permissionId,
        address indexed patientAddress,
        address indexed doctorAddress,
        string reportHash,
        uint256 expiresAt
    );

    event AccessRevoked(
        bytes32 indexed permissionId,
        address indexed patientAddress,
        address indexed doctorAddress,
        string reportHash
    );

    event AccessLogged(
        address indexed accessor,
        string reportHash,
        string action,
        uint256 timestamp
    );

    /**
     * @dev Generate permission ID
     */
    function generatePermissionId(
        address _patientAddress,
        address _doctorAddress,
        string memory _reportHash
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_patientAddress, _doctorAddress, _reportHash));
    }

    /**
     * @dev Grant access to a doctor
     * @param _doctorAddress Address of the doctor
     * @param _reportHash Hash of the medical report
     * @param _expiryTime Expiry timestamp (0 for no expiry)
     */
    function grantAccess(
        address _doctorAddress,
        string memory _reportHash,
        uint256 _expiryTime
    ) public {
        require(_doctorAddress != address(0), "Invalid doctor address");
        require(_doctorAddress != msg.sender, "Cannot grant access to yourself");

        bytes32 permissionId = generatePermissionId(msg.sender, _doctorAddress, _reportHash);
        
        // If permission exists, update it
        if (permissions[permissionId].exists) {
            permissions[permissionId].isActive = true;
            permissions[permissionId].grantedAt = block.timestamp;
            permissions[permissionId].expiresAt = _expiryTime;
        } else {
            // Create new permission
            permissions[permissionId] = Permission({
                patientAddress: msg.sender,
                doctorAddress: _doctorAddress,
                reportHash: _reportHash,
                grantedAt: block.timestamp,
                expiresAt: _expiryTime,
                isActive: true,
                exists: true
            });

            patientPermissions[msg.sender].push(permissionId);
            doctorPermissions[_doctorAddress].push(permissionId);
        }

        emit AccessGranted(permissionId, msg.sender, _doctorAddress, _reportHash, _expiryTime);
        
        // Log the grant action
        logAccess(msg.sender, _reportHash, "GRANT_ACCESS");
    }

    /**
     * @dev Revoke access from a doctor
     * @param _doctorAddress Address of the doctor
     * @param _reportHash Hash of the medical report
     */
    function revokeAccess(
        address _doctorAddress,
        string memory _reportHash
    ) public {
        bytes32 permissionId = generatePermissionId(msg.sender, _doctorAddress, _reportHash);
        
        require(permissions[permissionId].exists, "Permission does not exist");
        require(permissions[permissionId].patientAddress == msg.sender, "Not authorized");

        permissions[permissionId].isActive = false;

        emit AccessRevoked(permissionId, msg.sender, _doctorAddress, _reportHash);
        
        // Log the revoke action
        logAccess(msg.sender, _reportHash, "REVOKE_ACCESS");
    }

    /**
     * @dev Check if a doctor has access to a report
     * @param _patientAddress Address of the patient
     * @param _doctorAddress Address of the doctor
     * @param _reportHash Hash of the medical report
     * @return Boolean indicating if access is granted
     */
    function checkAccess(
        address _patientAddress,
        address _doctorAddress,
        string memory _reportHash
    ) public view returns (bool) {
        bytes32 permissionId = generatePermissionId(_patientAddress, _doctorAddress, _reportHash);
        
        if (!permissions[permissionId].exists || !permissions[permissionId].isActive) {
            return false;
        }

        // Check expiry
        if (permissions[permissionId].expiresAt > 0 && 
            block.timestamp > permissions[permissionId].expiresAt) {
            return false;
        }

        return true;
    }

    /**
     * @dev Log access to a report
     * @param _accessor Address of the accessor
     * @param _reportHash Hash of the medical report
     * @param _action Action performed
     */
    function logAccess(
        address _accessor,
        string memory _reportHash,
        string memory _action
    ) public {
        accessLogs.push(AccessLog({
            accessor: _accessor,
            reportHash: _reportHash,
            action: _action,
            timestamp: block.timestamp
        }));

        emit AccessLogged(_accessor, _reportHash, _action, block.timestamp);
    }

    /**
     * @dev Get permission details
     * @param _permissionId ID of the permission
     */
    function getPermission(bytes32 _permissionId) public view returns (
        address patientAddress,
        address doctorAddress,
        string memory reportHash,
        uint256 grantedAt,
        uint256 expiresAt,
        bool isActive
    ) {
        require(permissions[_permissionId].exists, "Permission does not exist");
        Permission memory perm = permissions[_permissionId];
        return (
            perm.patientAddress,
            perm.doctorAddress,
            perm.reportHash,
            perm.grantedAt,
            perm.expiresAt,
            perm.isActive
        );
    }

    /**
     * @dev Get all permissions for a patient
     * @param _patientAddress Address of the patient
     */
    function getPatientPermissions(address _patientAddress) public view returns (bytes32[] memory) {
        return patientPermissions[_patientAddress];
    }

    /**
     * @dev Get all permissions for a doctor
     * @param _doctorAddress Address of the doctor
     */
    function getDoctorPermissions(address _doctorAddress) public view returns (bytes32[] memory) {
        return doctorPermissions[_doctorAddress];
    }

    /**
     * @dev Get total number of access logs
     */
    function getAccessLogsCount() public view returns (uint256) {
        return accessLogs.length;
    }

    /**
     * @dev Get access log by index
     * @param _index Index of the log
     */
    function getAccessLog(uint256 _index) public view returns (
        address accessor,
        string memory reportHash,
        string memory action,
        uint256 timestamp
    ) {
        require(_index < accessLogs.length, "Index out of bounds");
        AccessLog memory log = accessLogs[_index];
        return (log.accessor, log.reportHash, log.action, log.timestamp);
    }
}
