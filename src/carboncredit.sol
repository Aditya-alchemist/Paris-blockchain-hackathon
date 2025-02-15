// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import "lib/openzeppelin-contracts/contracts/access/Ownable.sol";
//deployed at 0xA2DdB1c2Cbfb6bcc870C1925d8AB8C6e3b24E63a
contract CarbonCreditNFT is ERC721, Ownable {
    uint256 public tokenCounter;
    struct Minter {
        bool isAuthorized;
        uint256 mintedAmount;
    }
    mapping(address => Minter) public minters;
    mapping(uint256 => uint256) public carbonCredits;
    mapping(uint256 => bool) public retiredTokens;
    mapping(uint256 => string) public verificationData;

    event Minted(address indexed minter, uint256 tokenId, uint256 credits);
    event AuthorizedMinter(address indexed account);
    event RevokedMinter(address indexed account);
    event Retired(uint256 indexed tokenId);
    event Verified(uint256 indexed tokenId, string data);
    event Sold(address indexed seller, address indexed buyer, uint256 tokenId);

    constructor() ERC721("CarbonCredit", "CCNFT") Ownable(msg.sender){
        tokenCounter = 1;
    }

    modifier onlyAuthorized() {
        require(minters[msg.sender].isAuthorized || msg.sender == owner(), "Not authorized");
        _;
    }

    function authorizeMinter(address account) external onlyOwner {
        minters[account].isAuthorized = true;
        emit AuthorizedMinter(account);
    }

    function revokeMinter(address account) external onlyOwner {
        minters[account].isAuthorized = false;
        emit RevokedMinter(account);
    }

    function mintCarbonCredit(address to, uint256 credits, string calldata verification) external onlyAuthorized {
        require(credits > 0, "Invalid credit amount");
        uint256 tokenId = tokenCounter;
        _safeMint(to, tokenId);
        carbonCredits[tokenId] = credits;
        verificationData[tokenId] = verification;
        tokenCounter++;
        minters[msg.sender].mintedAmount += credits;
        emit Minted(msg.sender, tokenId, credits);
    }

    function verifyCarbonCredit(uint256 tokenId, string calldata data) external onlyOwner {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        verificationData[tokenId] = data;
        emit Verified(tokenId, data);
    }

    function retireCarbonCredit(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        retiredTokens[tokenId] = true;
        emit Retired(tokenId);
    }

    function tradeCarbonCredit(address to, uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(!retiredTokens[tokenId], "Token is retired");
        _transfer(msg.sender, to, tokenId);
        emit Sold(msg.sender, to, tokenId);
    }

    function getCredits(uint256 tokenId) external view returns (uint256) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        return carbonCredits[tokenId];
    }

    function getVerificationData(uint256 tokenId) external view returns (string memory) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        return verificationData[tokenId];
    }

    function isRetired(uint256 tokenId) external view returns (bool) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        return retiredTokens[tokenId];
    }
}
