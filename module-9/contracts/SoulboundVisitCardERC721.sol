// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SoulboundVisitCardERC721 is ERC721URIStorage, Ownable {
    mapping(address => bool) public hasVisitCard;

    constructor(address initialOwner) ERC721("StudentVisitCard", "SVC") Ownable() {
        if (initialOwner != msg.sender && initialOwner != address(0)) {
            transferOwnership(initialOwner);
        }
    }

    function mintCard(address student, uint256 tokenId, string memory _tokenURI) external onlyOwner {
        require(!hasVisitCard[student], "Student already has a visit card");
        hasVisitCard[student] = true;
        
        _mint(student, tokenId);
        _setTokenURI(tokenId, _tokenURI);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);

        if (from != address(0) && to != address(0)) {
            revert("Soulbound: Transfer failed");
        }
    }

    function approve(address to, uint256 tokenId) public virtual override(ERC721, IERC721) {
        revert("Soulbound: Approval disabled");
    }

    function setApprovalForAll(address operator, bool approved) public virtual override(ERC721, IERC721) {
        revert("Soulbound: Approval disabled");
    }
}