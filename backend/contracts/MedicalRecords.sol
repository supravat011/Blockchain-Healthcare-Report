// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MedicalRecords {
    struct MedicalReport {
        string fileHash;
        address patientAddress;
        uint256 timestamp;
        bool exists;
    }

    // Mapping from report hash to medical report
    mapping(string => MedicalReport) public reports;
    
    // Mapping from patient address to their report hashes
    mapping(address => string[]) public patientReports;

    // Events
    event ReportRegistered(
        string indexed fileHash,
        address indexed patientAddress,
        uint256 timestamp
    );

    event ReportVerified(
        string indexed fileHash,
        address indexed verifier,
        uint256 timestamp
    );

    /**
     * @dev Register a new medical report
     * @param _fileHash Hash of the medical report file
     */
    function registerReport(string memory _fileHash) public {
        require(!reports[_fileHash].exists, "Report already registered");
        
        reports[_fileHash] = MedicalReport({
            fileHash: _fileHash,
            patientAddress: msg.sender,
            timestamp: block.timestamp,
            exists: true
        });

        patientReports[msg.sender].push(_fileHash);

        emit ReportRegistered(_fileHash, msg.sender, block.timestamp);
    }

    /**
     * @dev Get report owner
     * @param _fileHash Hash of the medical report
     * @return Address of the report owner
     */
    function getReportOwner(string memory _fileHash) public view returns (address) {
        require(reports[_fileHash].exists, "Report does not exist");
        return reports[_fileHash].patientAddress;
    }

    /**
     * @dev Verify if a report exists and belongs to a patient
     * @param _fileHash Hash of the medical report
     * @param _patientAddress Address of the patient
     * @return Boolean indicating if report is valid
     */
    function verifyReport(string memory _fileHash, address _patientAddress) public returns (bool) {
        if (!reports[_fileHash].exists) {
            return false;
        }

        bool isValid = reports[_fileHash].patientAddress == _patientAddress;
        
        if (isValid) {
            emit ReportVerified(_fileHash, msg.sender, block.timestamp);
        }

        return isValid;
    }

    /**
     * @dev Get all reports for a patient
     * @param _patientAddress Address of the patient
     * @return Array of report hashes
     */
    function getPatientReports(address _patientAddress) public view returns (string[] memory) {
        return patientReports[_patientAddress];
    }

    /**
     * @dev Get report details
     * @param _fileHash Hash of the medical report
     * @return fileHash The file hash
     * @return patientAddress The patient address
     * @return timestamp The timestamp
     */
    function getReportDetails(string memory _fileHash) public view returns (
        string memory fileHash,
        address patientAddress,
        uint256 timestamp
    ) {
        require(reports[_fileHash].exists, "Report does not exist");
        MedicalReport memory report = reports[_fileHash];
        return (report.fileHash, report.patientAddress, report.timestamp);
    }
}
